import { ERROR_TYPES } from '@clevercloud/client/esm/utils/payment.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

const warningSvg = new URL('../../assets/warning.svg', import.meta.url).href;

/**
 * @typedef {import('./cc-warning-payment.types.d.ts').PaymentMethodError} PaymentMethodError
 * @typedef {import('./cc-warning-payment.types.d.ts').PaymentWarningModeType} PaymentWarningModeType
 */

/**
 * A component to display a warning block with details about payment methods errors.
 *
 * @cssdisplay grid
 */
export class CcWarningPayment extends LitElement {

  static get properties () {
    return {
      errors: { type: Array },
      mode: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {PaymentMethodError[]} Sets the list of payment method errors with type (and optional orga name and billing link). */
    this.errors = [{ type: ERROR_TYPES.NO_PAYMENT_METHOD }];

    /** @type {PaymentWarningModeType} Sets the mode, depending on where the warning is used, the level of details is not the same. */
    this.mode = 'billing';
  }

  render () {
    return html`
      <img class="icon" src="${warningSvg}" alt="">
      <div>
        ${this.mode === 'home' ? html`
          <div>${i18n('cc-payment-warning.home', { orgaCount: this.errors.length })}</div>
          <ul>
            ${this.errors.map((error) => html`
              <li>${this._renderHomeItem(error)}</li>
            `)}
          </ul>
        ` : ''}

        ${(this.mode === 'overview' || this.mode === 'billing') ? this._renderOrgaError(this.errors[0]) : ''}
        ${(this.mode === 'overview') ? i18n('cc-payment-warning.billing-page-link', this.errors[0]) : ''}
      </div>
    `;
  }

  /**
   * @param {PaymentMethodError} error
   */
  _renderHomeItem ({ type, orgaName, orgaBillingLink }) {
    if (type === ERROR_TYPES.NO_PAYMENT_METHOD) {
      return html`
        ${i18n('cc-payment-warning.generic.no-payment-method', { orgaName })}
        ${i18n('cc-payment-warning.billing-page-link', { orgaName, orgaBillingLink })}
      `;
    }
    if (type === ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD) {
      return html`
        ${i18n('cc-payment-warning.generic.no-default-payment-method', { orgaName })}
        ${i18n('cc-payment-warning.billing-page-link', { orgaName, orgaBillingLink })}
      `;
    }
    if (type === ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED) {
      return html`
        ${i18n('cc-payment-warning.generic.default-payment-method-is-expired', { orgaName })}
        ${i18n('cc-payment-warning.billing-page-link', { orgaName, orgaBillingLink })}
      `;
    }
  }

  /**
   * @param {PaymentMethodError} error
   */
  _renderOrgaError ({ type }) {
    if (type === ERROR_TYPES.NO_PAYMENT_METHOD) {
      return i18n('cc-payment-warning.orga.no-payment-method');
    }
    if (type === ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD) {
      return i18n('cc-payment-warning.orga.no-default-payment-method');
    }
    if (type === ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED) {
      return i18n('cc-payment-warning.orga.default-payment-method-is-expired');
    }
  }

  static get styles () {
    return [
      // language=CSS
      linkStyles,
      css`
        :host {
          background-color: var(--cc-color-bg-warning-weaker);
          border: var(--cc-border-warning);
          border-radius: 0.25em;
          display: grid;
          gap: 1em;
          grid-template-columns: min-content 1fr;
          line-height: 1.5;
          padding: 1em;
        }

        .icon {
          height: 1.25em;
        }

        ul {
          margin: 0.5em 0 0 1.5em;
          padding: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-warning-payment', CcWarningPayment);
