import { css, html, LitElement } from 'lit';
import '../components/cc-input-text/cc-input-text.js';
import '../components/cc-input-number/cc-input-number.js';
import '../components/cc-toggle/cc-toggle.js';
import '../components/cc-credit-consumption/cc-credit-consumption.js';
import { ConsumptionFaker } from '../lib/consumption-faker.js';

/**
 * @typedef {import('../components/cc-input-number/cc-input-number.js').CcInputNumber} CcInputNumber
 * @typedef {import('../components/cc-toggle/cc-toggle.js').CcToggle} CcToggle
 * @typedef {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').Coupon} Coupon
 * @typedef {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').Currency} Currency
 */

const TODAY = new Date(Date.now());
const DEFAULT_CONSUMPTION_DATA = new ConsumptionFaker(new Date(TODAY.getFullYear(), TODAY.getMonth(), 15), 30);
/** @type {import('../components/cc-credit-consumption/cc-credit-consumption.types').CreditConsumptionStateLoaded} */
const INITIAL_CREDIT_CONSUMPTION_STATE = {
  state: 'loaded',
  orgaInfo: {
    state: 'loaded',
    name: 'Your organization name',
    avatar: 'http://placekitten.com/200/200',
    priceFactor: 1,
    discount: 0,
  },
  consumption: {
    period: {
      start: DEFAULT_CONSUMPTION_DATA.firstDayOfTheMonth,
      end: DEFAULT_CONSUMPTION_DATA.lastDayOfTheMonth,
    },
    currency: 'EUR',
    prepaidCredits: {
      enabled: true,
      total: 50,
    },
    consumptions: DEFAULT_CONSUMPTION_DATA.consumptions,
    coupons: [
      {
        amount: 20,
        reason: 'account-creation',
        activation: new Date(DEFAULT_CONSUMPTION_DATA.year, DEFAULT_CONSUMPTION_DATA.month - 2, 12),
        expiration: new Date(DEFAULT_CONSUMPTION_DATA.year + 1, DEFAULT_CONSUMPTION_DATA.month - 1, 0),
      },
      {
        amount: 5,
        reason: 'conference',
        activation: new Date(DEFAULT_CONSUMPTION_DATA.year, DEFAULT_CONSUMPTION_DATA.month - 1, 23),
        expiration: new Date(DEFAULT_CONSUMPTION_DATA.year, DEFAULT_CONSUMPTION_DATA.month + 4, 0),
      },
    ],
  },
};

export class CcCreditConsumptionSandbox extends LitElement {
  static get properties () {
    return {
      _creditConsumptionState: { type: Object, state: true },
      _digits: { type: Number, state: true },
    };
  }

  constructor () {
    super();

    /** @type {import('../components/cc-credit-consumption/cc-credit-consumption.types').CreditConsumptionStateLoaded} */
    this._creditConsumptionState = INITIAL_CREDIT_CONSUMPTION_STATE;

    /** @type {number} the number of digits to display */
    this._digits = 2;
  }

  /**
   * @param {string} elementName
   * @returns {number|string|undefined|null|Currency}
   */
  _getElementValueByName (elementName) {
    /** @type {CcInputNumber|CcToggle|null|undefined} */
    const element = this.shadowRoot?.querySelector(`[name=${elementName}]`);

    return element?.value;
  }

  /**
   * @param {number} freeCreditsAmount
   * @param {number} numberOfCoupons
   * @returns {Coupon[]} coupons
   * */
  _generateCoupons (freeCreditsAmount, numberOfCoupons) {
    const coupons = [];

    for (let i = 0; i < numberOfCoupons; i++) {
      coupons.push({
        amount: freeCreditsAmount / numberOfCoupons,
        activation: new Date(TODAY.getFullYear(), TODAY.getMonth() - 2, 12),
        expiration: new Date(TODAY.getMonth() + 1, TODAY.getMonth() - 1, 0),
        reason: 'fake reason',
      });
    }

    return coupons;
  }

  _onSubmit () {
    const data = {
      consumptionAmount: this._getElementValueByName('consumption'),
      prepaidCreditsAmount: this._getElementValueByName('prepaid-credits'),
      freeCreditsAmount: this._getElementValueByName('free-credits'),
      isSubOrg: this._getElementValueByName('suborg') === 'yes',
      isPremium: this._getElementValueByName('premium') === 'yes',
      currentDayAsNumber: this._getElementValueByName('currentDay'),
      discountAmount: this._getElementValueByName('discount'),
      numberOfCoupons: this._getElementValueByName('number-coupons'),
      // TODO: not a great solution to say the least
      /** @type {Currency} */
      currency: this._getElementValueByName('currency')?.toString() === 'EUR' ? 'EUR' : 'USD',
      digits: this._getElementValueByName('digits'),
      isPrepaidDisabled: this._getElementValueByName('prepaid-disabled') === 'yes',
    };
    const currentDayAsDate = new Date(TODAY.getFullYear(), TODAY.getMonth(), Number(data.currentDayAsNumber ?? TODAY.getDate()));
    const { consumptions } = new ConsumptionFaker(currentDayAsDate, Number(data.consumptionAmount));

    this._digits = Number(data.digits);

    this._creditConsumptionState = {
      ...this._creditConsumptionState,
      orgaInfo: {
        ...this._creditConsumptionState.orgaInfo,
        cleverEnterprise: data.isPremium,
        emergencyNumber: data.isPremium ? '+33 00000000' : undefined,
        invoicedOrganization: data.isSubOrg
          ? { id: 'organization-id', name: 'Your organization name' }
          : undefined,
        discount: Number(data.discountAmount),
      },
      consumption: {
        ...this._creditConsumptionState.consumption,
        currency: data.currency,
        consumptions,
        prepaidCredits: {
          enabled: !data.isPrepaidDisabled,
          total: Number(data.prepaidCreditsAmount),
        },
        coupons: this._generateCoupons(Number(data.freeCreditsAmount), Number(data.numberOfCoupons)),
      },
    };
  }

  render () {
    return html`
      <details>
        <summary>Controls</summary>
        <form class="form">
          ${this._renderAmountsFieldset()}
          ${this._renderOrgaFieldset()}
          ${this._renderDisplayFieldset()}
          <div class="buttons">
            <cc-button primary @cc-button:click=${this._onSubmit}>Update the component</cc-button>
          </div>
        </form>
      </details>
      <cc-credit-consumption
        .creditConsumption=${this._creditConsumptionState}
        digits=${this._digits}
      >
      </cc-credit-consumption>
    `;

  }

  _renderAmountsFieldset () {
    return html`
    <fieldset>
        <legend>Amounts</legend>
        <cc-input-number 
          label="Consumption"
          name="consumption"
          min="0"
          value="30"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number>
        <cc-input-number 
          label="Discount %" 
          name="discount" 
          min="0" 
          value="0"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number>
        <cc-input-number 
          label="Prepaid credits" 
          name="prepaid-credits"
          min="0"
          value="50"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number>
        <cc-input-number 
          label="Free credits" 
          name="free-credits" 
          min="0" 
          value="25"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number><cc-input-number 
          label="Number of coupons" 
          name="number-coupons" 
          min="0" 
          value="2"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number>
      </fieldset>
    `;
  }

  _renderOrgaFieldset () {
    return html`
      <fieldset>
        <legend>Organization info</legend>
        <cc-toggle legend="Is sub organization" name="suborg" value="no" .choices=${[{ label: 'yes', value: 'yes' }, { label: 'no', value: 'no' }]}></cc-toggle>
        <cc-toggle legend="Is premium organization" name="premium" value="no" .choices=${[{ label: 'yes', value: 'yes' }, { label: 'no', value: 'no' }]}></cc-toggle>
        <cc-toggle legend="Is prepaid disabled" name="prepaid-disabled" value="no" .choices=${[{ label: 'yes', value: 'yes' }, { label: 'no', value: 'no' }]}></cc-toggle>
      </fieldset>
    `;
  }

  _renderDisplayFieldset () {
    return html`
      <fieldset>
        <legend>Display</legend>
        <cc-input-number 
          label="Current day (as number)" 
          name="current-day" 
          min="1" 
          max="${DEFAULT_CONSUMPTION_DATA.lastDayOfTheMonth}"
          value="2"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number>
        <cc-input-number 
          label="Number of digits" 
          name="digits" 
          min="0" 
          value="2"
          @request-implicit-submit=${this._onSubmit}
        ></cc-input-number>
        <cc-toggle 
          legend="Currency"
          name="currency"
          value="EUR"
          .choices=${[{ label: 'EUR', value: 'EUR' }, { label: 'USD', value: 'USD' }]}></cc-toggle>
      </fieldset>
    `;
  }

  static get styles () {
    return [
      css`
        details {
          padding: 1em;
          border-bottom: 1px solid var(--cc-color-border-neutral-weak);
          margin-bottom: 1em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default);
        }

        .form {
          display: flex;
          flex-direction: column;
          margin-top: 1em;
          gap: 2em;
        }

        .form fieldset {
          display: flex;
          flex-wrap: wrap;
          border: solid 1px var(--cc-color-border-neutral-weak);
          gap: 1em;
        }

        .form div {
          width: 100%;
          text-align: end;
        }

        .buttons {
          display: flex;
          justify-content: end;
          gap: 1em;
        }

        summary {
          cursor: pointer;
        }

        summary:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `,
    ];
  }
}

window.customElements.define('cc-credit-consumption-sandbox', CcCreditConsumptionSandbox);
