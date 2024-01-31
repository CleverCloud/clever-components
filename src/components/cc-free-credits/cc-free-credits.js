import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixCoupon_2Line as iconCoupon,
  iconRemixGiftLine as iconFree,
} from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-credit-chart/cc-credit-chart.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';

const BREAKPOINT = 600;

/**
 * @typedef {import('./cc-free-credits.types.js').CouponFormState} CouponFormState
 * @typedef {import('./cc-free-credits.types.js').Coupon} Coupon
 * @typedef {import('../common.types.js').ConsumptionCurrency} Currency
 */

/**
 * A component showing highlighting the remaining free credits and the list of active coupons.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<string>} cc-free-credits:submit - Fires the coupon `value` whenever the form is submitted.
 */
export class CcFreeCredits extends LitElement {
  static get properties () {
    return {
      couponFormState: { type: Object },
      coupons: { type: Array },
      currency: { type: String },
      digits: { type: Number },
      remainingCredits: { type: Number, attribute: 'remaining-credits' },
      skeleton: { type: Boolean },
      totalCredits: { type: Number, attribute: 'total-credits' },
    };
  }

  /**
   * @typedef {import('./cc-free-credits.types.js').CouponFormStateIdle} CouponFormStateIdle
   * @type {CouponFormStateIdle} - Initial state of the coupon form.
   */
  static get INIT_COUPON_FORM_STATE () {
    return {
      state: 'idle',
      coupon: {
        value: '',
      },
    };
  }

  constructor () {
    super();

    /** @type {CouponFormState} Sets the coupon form state. */
    this.couponFormState = CcFreeCredits.INIT_COUPON_FORM_STATE;

    /** @type {Coupon[]|null} Sets the list of coupons. It is also used to compute the total of free credits */
    this.coupons = null;

    /** @type {Currency} Sets the displayed currency */
    this.currency = 'EUR';

    /** @type {number} Sets the number of digits displayed for every figure */
    this.digits = 2;

    /** @type {boolean} Sets the component in skeleton mode */
    this.skeleton = false;

    /** @type {number|null} Sets the total of free credits available. */
    this.totalCredits = null;

    /** @type {number|null} Sets the remaining free credits available. */
    this.remainingCredits = null;

    /** @type {ResizeController} */
    this._resizeController = new ResizeController(this);
  }

  /**
   * Gets the translation corresponding to a given "reason"
   *
   * @param  {'conference'|'account-creation'|string} reason
   * @return {string} the translation of the untouched reason if no translation was found
   */
  _getCouponTranslation (reason) {
    switch (reason) {
      case 'conference':
        return i18n('cc-free-credits.reason.conference');
      case 'account-creation':
        return i18n('cc-free-credits.reason.account-creation');
      default:
        return reason;
    }
  }

  /**
   * Syncs the input value with the form state everytime user types something
   *
   * @param  {{ detail: string }} options.detail: value the current value of the input
   */
  _onCouponInput ({ detail: value }) {
    this.couponFormState = {
      ...this.couponFormState,
      coupon: {
        ...this.couponFormState.coupon,
        value,
      },
    };
  }

  /**
   * Checks within the form state if the coupon has a `value` (after trimming this `value`).
   * If `value` is empty, sets an error to warn the user.
   * Else, dispatches the submit event with the coupon value as payload.
   */
  _onCouponSubmit () {
    const trimmedCouponValue = this.couponFormState.coupon.value.trim();
    if (trimmedCouponValue.length === 0) {
      this.couponFormState = {
        ...this.couponFormState,
        state: 'idle',
        coupon: {
          ...this.couponFormState.coupon,
          error: 'empty',
        },
      };
    }
    else {
      dispatchCustomEvent(this, 'submit', {
        coupon: trimmedCouponValue,
      });
    }
  }

  render () {
    const skeleton = this.skeleton;
    const currentWidth = this._resizeController.width ?? this.getBoundingClientRect().width;

    return html`
      <cc-block>
        <div slot="title">
          <cc-icon class=${classMap({ skeleton })} .icon=${iconFree}></cc-icon>
          <span class=${classMap({ skeleton })}>${i18n('cc-free-credits.title')}</span>
        </div>

        <div class="block-content">
          <div class="gauge-chart">
            <cc-credit-chart
              total=${this.totalCredits}
              remaining=${this.remainingCredits}
              currency=${this.currency}
              ?skeleton=${skeleton}
              digits=${this.digits}
            ></cc-credit-chart>
          </div>

          <div class="block-content__desc"> 
            ${
              currentWidth > BREAKPOINT
                ? this._renderCouponTable(this.coupons ?? [])
                : this._renderCouponList(this.coupons ?? [])
            }
            <form>
              <cc-input-text
                label="${i18n('cc-free-credits.input.label')}"
                value="${this.couponFormState.coupon.value}"
                required
                ?disabled=${this.couponFormState.state === 'submitting'}
                @cc-input-text:requestimplicitsubmit="${this._onCouponSubmit}"
                @cc-input-text:input="${this._onCouponInput}"
                ?skeleton=${skeleton}
              >
                ${this.couponFormState.state === 'idle' && this.couponFormState.coupon.error === 'empty' ? html`
                  <p slot="error">${i18n('cc-free-credits.error.empty')}</p>
                ` : ''}
              </cc-input-text>
              <cc-button
                primary
                outlined
                @cc-button:click=${this._onCouponSubmit}
                ?waiting=${this.couponFormState.state === 'submitting'}
                ?disabled=${skeleton}
              >${i18n('cc-free-credits.add')}</cc-button>
            </form>
          </div>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {Coupon[]} coupons
   */
  _renderCouponTable (coupons) {
    const hasCoupons = Array.isArray(coupons) && coupons?.length > 0;

    return html`
      <table class="free-credit-table">
        <caption class="visually-hidden">${i18n('cc-free-credits.table.caption')}</caption>
        <thead>
          <tr class=${classMap({ skeleton: this.skeleton })}>
            <!-- TODO ask if activation or creation -->
            <th scope="col">${i18n('cc-free-credits.table.activation-date')}</th>
            <th scope="col">${i18n('cc-free-credits.table.expiration-date')}</th>
            <th scope="col" class="number">${i18n('cc-free-credits.table.amount')}</th>
            <th scope="col">${i18n('cc-free-credits.table.origin')}</th>
          </tr>
        </thead>
        <tbody>
          ${coupons?.map((coupon) => html`
            <tr>
              <td>${i18n('cc-free-credits.long-date', coupon.activation)}</td>
              <td>${i18n('cc-free-credits.long-date', coupon.expiration)}</td>
              <td class="number">${i18n('cc-free-credits.price', { currency: this.currency, price: coupon.amount, digits: this.digits })}</td>
              <td>${this._getCouponTranslation(coupon.reason)}</td>
            </tr>
          `)}
          ${!hasCoupons ? html`
            <tr><td class="cell-content-center" colspan="4"><span class=${classMap({ skeleton: this.skeleton })}>${i18n('cc-free-credits.empty')}</span></td></tr>
          ` : ''}
        </tbody>
      </table>
    `;
  }

  /**
   * @param {Coupon[]} coupons
   */
  _renderCouponList (coupons) {
    const hasCoupons = Array.isArray(coupons) && coupons?.length > 0;

    return hasCoupons
      ? coupons?.map((coupon) => html`
          <div class="coupon-details">
            <cc-icon .icon=${iconCoupon}></cc-icon>
            <dl>
              <div>
                <dt>${i18n('cc-free-credits.list.activation-date')}</dt>
                <dd>${i18n('cc-free-credits.long-date', coupon.activation)}</dd>
              </div>
              <div>
                <dt>${i18n('cc-free-credits.list.expiration-date')}</dt>
                <dd>${i18n('cc-free-credits.long-date', coupon.expiration)}</dd>
              </div>
              <div>
                <dt>${i18n('cc-free-credits.list.amount')}</dt>
                <dd>${i18n('cc-free-credits.price', { currency: this.currency, price: coupon.amount, digits: this.digits })}</dd>
              </div>
              <div>
                <dt>${i18n('cc-free-credits.list.origin')}</dt>
                <dd>${this._getCouponTranslation(coupon.reason)}</dd>
              </div>
            </dl>
          </div>
        `)
      : html`
        <p class=${classMap({ skeleton: this.skeleton })}>${i18n('cc-free-credits.empty')}</p>
      `;
  }

  static get styles () {
    return [
      accessibilityStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        div[slot='title'] {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .block-content {
          display: flex;
          flex-wrap: wrap;
          align-items: start;
          justify-content: center;
          gap: 3em;
        }

        cc-credit-chart {
          width: 17em;
        }

        .block-content__desc {
          display: flex;
          flex: 1 1 34em;
          flex-direction: column;
          gap: 1.5em;
        }

        form {
          display: flex;
          flex-wrap: wrap;
          align-items: start;
          gap: 0.5em;
          padding-inline: 1em;
        }

        cc-input-text {
          flex: 100 1 15em;
        }

        /* TODO: responsive issue */
        
        cc-button {
          flex: 1 1 auto;
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        table {
          overflow: hidden;
          width: 100%;
          border-collapse: collapse;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        th[scope='row'] {
          width: 13em;
        }
            
        th,
        td {
          padding: 1em;
          text-align: left;
        }

        th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
        }

        td {
          background-color: var(--cc-color-bg-neutral);
          color: var(--cc-color-text-normal);
        }

        tr:not(:last-child) td {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #eee);
        }

        /* applied on th and td */

        .number {
          text-align: right;
        }

        .cell-content-center {
          font-style: italic;
          text-align: center;
        }

        tr:hover td {
          background-color: var(--cc-color-bg-neutral-hovered, #f9f9f9);
        }

        .coupon-details {
          display: flex;
          width: 100%;
          padding-bottom: 1.5em;
          gap: 0.5em;
        }

        .coupon-details:not(:last-of-type) {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak);
        }

        dl {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          margin: 0;
          gap: 1em;
        }

        dt,
        dd {
          display: inline-block;
          padding: 0;
          margin: 0;
        }

        dd {
          font-weight: bold;
        }

        dl div {
          display: flex;
          flex-direction: column;
        }

        .skeleton,
        .skeleton * {
          background-color: #bbb !important;
          color: transparent !important;
        }
      `,
    ];
  }
}

window.customElements.define('cc-free-credits', CcFreeCredits);
