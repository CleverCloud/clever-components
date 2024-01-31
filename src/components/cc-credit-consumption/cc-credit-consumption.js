import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixDashboard_2Line as iconConsumption,
  iconRemixHandCoinLine as iconCredits,
  iconRemixHomeOfficeLine as iconOrg,
  iconRemixInformationLine as iconInfo,
} from '../../assets/cc-remix.icons.js';
import { ConsumptionCalculator } from '../../lib/consumption-calculator.js';
import { ConsumptionFaker } from '../../lib/consumption-faker.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-block/cc-block.js';
import '../cc-daily-consumption/cc-daily-consumption.js';
import '../cc-free-credits/cc-free-credits.js';
import '../cc-header-orga/cc-header-orga.js';
import '../cc-icon/cc-icon.js';
import '../cc-notice/cc-notice.js';
import '../cc-prepaid-credits/cc-prepaid-credits.js';

const TODAY = new Date(Date.now());
const FAKE_CONSUMPTION = new ConsumptionFaker(TODAY, 1000);

/** @type {SkeletonData} */
const SKELETON_DATA = {
  state: 'loading',
  orgaInfo: {
    state: 'loading',
    name: null,
    avatar: null,
    cleverEnterprise: false,
    emergencyNumber: null,
    invoicedOrganization: null,
    priceFactor: 1,
    discount: 0,
  },
  consumption: {
    period: {
      start: FAKE_CONSUMPTION.firstDayOfTheMonth,
      end: FAKE_CONSUMPTION.lastDayOfTheMonth,
    },
    currency: 'EUR',
    consumptions: FAKE_CONSUMPTION.consumptions,
    prepaidCredits: {
      enabled: true,
      total: 500,
    },
    coupons: [],
  },
};

/**
 * @typedef {import('./cc-credit-consumption.types.js').CreditConsumptionState} CreditConsumptionState
 */

/**
 * A component showing information about consumption and credits.
 * It shows:
 *  - the current consumption,
 *  - remaining credits (free + prepaid), total available at the beginning of the period,
 *  - a chart with daily consumption data,
 *  - details about free credits (amount remaining, total at the beginning of the period, and coupons),
 *  - details about prepaid credits (amount remaining and total at the beginning of the period).
 *
 * @cssdisplay block
 */
export class CcCreditConsumption extends LitElement {
  static get properties () {
    return {
      digits: { type: Number },
      creditConsumption: { type: Object, attribute: 'credit-consumption' },
      _dailyDisplayMode: { type: Boolean, state: true },
      _showDiscountedPrices: { type: Number, state: true },
    };
  }

  constructor () {
    super();

    /** @type {number} Sets the number of digits to display for all figures within the screen. */
    this.digits = 2;

    /** @type {CreditConsumptionState} Sets the state of the component and the data about credit consumption. */
    this.creditConsumption = { state: 'loading' };

    /** @type {boolean} Controls whether to compute prices without discount or with discount. */
    this._showDiscountedPrices = true;
  }

  /**
   * @param {number} totalConsumption - the consumption total (might be the consumption minus free credits that have already been consumed if we're dealing with prepaid credits)
   * @param {number} totalCredits - the available credits amount
   *
   * @returns {{remainingCredits: number, consumedCreditsPercent: number}} data required to draw gauge graph
   */
  _getComputedCreditDetailsData (totalConsumption, totalCredits) {
    const remainingCredits = Math.max(0, totalCredits - totalConsumption);
    const consumedCredits = totalCredits - remainingCredits;
    const consumedCreditsPercent = this._getPercentValue(consumedCredits, totalCredits);

    return {
      remainingCredits,
      consumedCreditsPercent,
    };
  }

  /**
   * @param {number} partialValue - the partial value
   * @param {number} totalValue - the total value
   * @return {number} the percent
   */
  _getPercentValue (partialValue, totalValue) {
    return (totalValue === 0) ? 0 : Math.ceil((partialValue * 100) / totalValue);
  }

  _onDiscountChange () {
    this._showDiscountedPrices = !this._showDiscountedPrices;
  }

  render () {

    if (this.creditConsumption.state === 'error') {
      return html`
        <cc-notice intent="warning" message="${i18n('cc-credit-consumption.error.loading')}"></cc-notice>
      `;
    }

    if (this.creditConsumption.state === 'loading') {
      return this._renderContent(SKELETON_DATA);
    }

    if (this.creditConsumption.state === 'loaded') {
      return this._renderContent(this.creditConsumption);
    }
  }

  /**
   * @typedef {import('./cc-credit-consumption.types.js').SkeletonData} SkeletonData
   * @typedef {import('./cc-credit-consumption.types.js').CreditConsumptionStateLoaded} CreditConsumptionStateLoaded
   * @param {CreditConsumptionStateLoaded|SkeletonData} creditConsumption - Credit Consumption data
   */
  _renderContent ({ state, orgaInfo, consumption }) {
    const skeleton = state === 'loading';
    const consumptionCalculator = new ConsumptionCalculator({
      discount: this._showDiscountedPrices ? orgaInfo.discount : 0,
      priceFactor: orgaInfo.priceFactor,
      consumptions: consumption.consumptions,
      coupons: consumption.coupons,
      prepaidCredits: consumption.prepaidCredits,
    });
    // TODO: should the API take care of that? If no consumption data, we cannot rely on the last consumption date
    const lastConsumptionData = consumptionCalculator.computedConsumptions.slice(-1)[0];
    const lastConsumptionDate = lastConsumptionData?.date ?? new Date(
      consumption.period.start.getFullYear(),
      consumption.period.start.getMonth(),
      consumption.period.start.getDate() - 1,
    );

    const isFreeCreditEnabled = orgaInfo.invoicedOrganization == null;
    const isPrepaidCreditEnabled = consumption.prepaidCredits.enabled && orgaInfo.invoicedOrganization == null;
    const hasDiscount = orgaInfo.discount != null && orgaInfo.discount > 0;

    return html`
      <div class="wrapper">

        <cc-notice intent="info" heading="${i18n('cc-credit-consumption.disclaimer.heading')}">
          <div slot="message">${i18n('cc-credit-consumption.disclaimer.content')}</div>
        </cc-notice>

        <cc-header-orga .orga=${orgaInfo}>
          <div slot="footer">
            <p class=${classMap({ skeleton })}>
              ${i18n('cc-credit-consumption.period.active', {
                startDate: consumption.period.start,
                endDate: consumption.period.end,
              })}
            </p>
            ${hasDiscount ? html`
              <label>
                <input type="checkbox" checked @change=${this._onDiscountChange}>
                <span>${i18n('cc-credit-consumption.header.discount', orgaInfo.discount)}</span>
              </label>
            ` : ''}
          </div>
        </cc-header-orga>

        ${this._renderOverview({
          skeleton,
          consumptionCalculator,
          orgaInfo,
          currency: consumption.currency,
          isPrepaidCreditEnabled,
        })}

        <cc-daily-consumption
          .dailyConsumption=${consumptionCalculator.computedConsumptions}
          digits=${this.digits}
          currency=${consumption.currency}
          .startDate=${consumption.period.start}
          .endDate=${consumption.period.end}
          ?skeleton=${skeleton}
        ></cc-daily-consumption>

        ${isFreeCreditEnabled ? html`
          <cc-free-credits
            total-credits=${consumptionCalculator.totalFreeCredits}
            remaining-credits=${consumptionCalculator.remainingFreeCredits}
            .coupons=${consumption.coupons}
            currency=${consumption.currency}
            digits=${this.digits}
            ?skeleton=${skeleton}
          ></cc-free-credits>
        ` : ''}

        ${isPrepaidCreditEnabled ? html`
          <cc-prepaid-credits
            total-credits=${consumptionCalculator.totalPrepaidCredits}
            remaining-credits=${consumptionCalculator.remainingPrepaidCredits}
            currency=${consumption.currency}
            digits=${this.digits}
            ?skeleton=${skeleton}
          ></cc-prepaid-credits>
        ` : ''}
        <p class="updated-date ${classMap({ skeleton })}">${i18n('cc-credit-consumption.update-date', lastConsumptionDate)}</p>
      </div>
    `;
  }

  /**
   * @typedef {import('./cc-credit-consumption.types.js').OrgaInfo} OrgaInfo
   * @typedef {import('./cc-credit-consumption.types.js').Currency} Currency
   * @param {Object} params
   * @param {boolean} params.skeleton
   * @param {ConsumptionCalculator} params.consumptionCalculator
   * @param {OrgaInfo} params.orgaInfo
   * @param {Currency} params.currency
   * @param {boolean} params.isPrepaidCreditEnabled
   */
  _renderOverview ({ skeleton, consumptionCalculator, orgaInfo, currency, isPrepaidCreditEnabled }) {
    const isSubOrg = orgaInfo.invoicedOrganization != null;

    return html`
      <div class="overview">
        <cc-block>
          <div class="consumption" slot="title">
            <div class="consumption__heading">
              <cc-icon class=${classMap({ skeleton })} .icon=${iconConsumption}></cc-icon>
              <span class=${classMap({ skeleton })} >${i18n('cc-credit-consumption.overview.consumption.title')}</span>
            </div>
            ${!isSubOrg ? html`
              <a class="cc-link docs-link ${classMap({ skeleton })}" href="#TODO" target="_blank" rel="noopener noreferrer">
                <cc-icon .icon=${iconInfo}></cc-icon>
                <span>${i18n('cc-credit-consumption.overview.docs')}</span>
              </a>
            ` : ''}
          </div>
          <div>
            <div>
              <p class="big-figure big-figure--consumption ${classMap({ skeleton })}">
                ${i18n('cc-credit-consumption.price', {
                  price: consumptionCalculator.computedConsumption,
                  currency: currency,
                  digits: this.digits,
                })}
              </p>
              <span class="consumption-legend ${classMap({ skeleton })}">${i18n('cc-credit-consumption.overview.consumption.legend')}</span>
            </div>
            <div class="figure-description ${classMap({ skeleton })}">
              ${i18n('cc-credit-consumption.overview.consumption.desc')}
            </div>
          </div>
        </cc-block>
        
        ${isSubOrg ? html`
          <cc-block>
            <div slot="title">
              <cc-icon .icon=${iconOrg}></cc-icon> 
              <span>${i18n('cc-credit-consumption.overview.suborg.title')}</span>
            </div>
            <div class="figure-description">
              ${i18n('cc-credit-consumption.overview.suborg.desc', { ...orgaInfo.invoicedOrganization })}
            </div>
          </cc-block>
        ` : ''}
        
        ${!isSubOrg ? html`
          <cc-block>
            <div slot="title">
              <cc-icon class=${classMap({ skeleton })} .icon=${iconCredits}></cc-icon> 
              <span class=${classMap({ skeleton })}>${i18n('cc-credit-consumption.overview.credits.title')}</span>
            </div>
            
            <div>
              <div class="credit-figures">
                <div class="credit-figure">
                  <span class="big-figure big-figure--credits ${classMap({ skeleton })}">
                    ${i18n('cc-credit-consumption.price', {
                      price: consumptionCalculator.remainingCredits,
                      currency: currency,
                      digits: this.digits,
                    })}
                  </span>
                  <span class="remaining-legend ${classMap({ skeleton })}">${i18n('cc-credit-consumption.overview.credits.legend.remaining')}</span>
                </div>
                <span class="big-figure big-figure--light ${classMap({ skeleton })}">/</span>
                <span class="credit-figure">
                  <span class="big-figure big-figure--light ${classMap({ skeleton })}">
                    ${i18n('cc-credit-consumption.price', {
                      price: consumptionCalculator.totalCredits,
                      currency: currency,
                      digits: this.digits,
                    })}
                  </span>
                  <span class="remaining-legend ${classMap({ skeleton })}">${i18n('cc-credit-consumption.overview.credits.legend.total')}</span>
                </span>
              </div>
              <div class="figure-description ${classMap({ skeleton })}">
                ${isPrepaidCreditEnabled
                  ? i18n('cc-credit-consumption.overview.credits-with-prepaid.desc')
                  : i18n('cc-credit-consumption.overview.free-credits-only.desc')
                }
              </div>
            </div>
          </cc-block>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      accessibilityStyles,
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }
          
        .header {
          display: flex;
          flex-wrap: wrap;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 2em;
        }

        .orga-name {
          font-size: 1.2em;
        }

        p {
          margin: 0;
        }

        [slot='title'] {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5em;
        }

        [slot='title'].consumption {
          justify-content: space-between;
        }

        .consumption__heading {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .docs-link {
          font-size: 0.8em;
          font-weight: normal;
          text-decoration: none;
        }

        .docs-link span {
          text-decoration: underline;
        }

        cc-header-orga div[slot='footer'] {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 1em;
          padding-block: 1em;
        }

        cc-header-orga div[slot='footer'] label {
          display: flex;
          align-items: center;
          gap: 0.3em;
        }

        .consumption-legend {
          display: block;
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
        }

        .figure-description {
          display: flex;
          flex-direction: column;
          margin-top: 2em;
          gap: 0.5em;
        }

        .figure-description,
        .daily-description,
        .prepaid-description {
          line-height: 1.4;
        }

        .credit-figures {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .credit-figure {
          display: flex;
          flex-direction: column;
        }

        .remaining-legend {
          display: block;
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          font-weight: normal;
        }

        .updated-date {
          margin: 0;
          margin-top: -1em;
          color: var(--cc-color-text-weak);
          font-style: italic;
          text-align: end;
        }

        cc-credit-chart {
          width: 17em;
        }

        .main-heading {
          font-size: 1.4em;
          font-weight: bold;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .overview {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5em;
        }

        .big-figure {
          color: var(--cc-color-text-weak);
          font-size: 2.1em;
          font-weight: bold;
        }

        .big-figure--consumption {
          color: var(--cc-color-text-primary-highlight);
        }

        .big-figure--credits {
          color: var(--cc-color-text-success);
        }

        .overview cc-block {
          flex: 1 1 23em;
          align-content: flex-start;
          align-items: flex-start;
        }

        .block-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 3em;
        }

        .daily-consumption-chart {
          position: relative;
          width: 100%;
          min-height: 200px;
        }

        .chart-wrapper {
          position: absolute;
          width: 100%;
          min-width: 0;
          height: 100%;
          margin: auto;
        }
              
        .discount-control {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        label {
          font-weight: normal;
        }

        input[type='checkbox'] {
          width: 1.2em;
          height: 1.2em;
          margin: 0;
        }
            
        .gauge-chart {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        cc-notice p {
          margin-block: 0;
        }

        .period {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1em;
        }

        .info {
          color: var(--cc-color-text-weak, #000);
          font-size: 0.9em;
          font-weight: normal;
        }

        .period p {
          margin: 0;
        }

        .date {
          font-weight: bold;
        }

        .credit-details-chart {
          display: flex;
          justify-content: center;
        }

        .big-figure--light {
          font-weight: normal;
        }

        .skeleton,
        .skeleton * {
          display: inline-block;
          background-color: #bbb !important;
          color: transparent !important;
        }
      `,
    ];
  }
}

window.customElements.define('cc-credit-consumption', CcCreditConsumption);
