// @ts-expect-error FIXME: remove when clever-client exports types
import { ERROR_TYPES } from '@clevercloud/client/esm/utils/payment.js';
import { css, html, LitElement } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';

/**
 * @import { PaymentMethodError, PaymentWarningModeType } from './cc-warning-payment.types.js'
 */

/**
 * A component to display a warning block with details about payment methods errors.
 *
 * @cssdisplay block
 */
export class CcWarningPayment extends LitElement {
  static get properties() {
    return {
      errors: { type: Array },
      mode: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {PaymentMethodError[]} Sets the list of payment method errors with type (and optional orga name and billing link). */
    this.errors = [{ type: ERROR_TYPES.NO_PAYMENT_METHOD }];

    /** @type {PaymentWarningModeType} Sets the mode, depending on where the warning is used, the level of details is not the same. */
    this.mode = 'billing';
  }

  /**
   * @param {PaymentMethodError} error
   * @returns {{title: string, errorMessage: string}}
   */
  _getOrgaError({ type }) {
    switch (type) {
      case ERROR_TYPES.NO_PAYMENT_METHOD:
        return {
          title: i18n('cc-payment-warning.orga.no-payment-method.title'),
          errorMessage: i18n('cc-payment-warning.orga.no-payment-method'),
        };
      case ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD:
        return {
          title: i18n('cc-payment-warning.orga.no-default-payment-method.title'),
          errorMessage: i18n('cc-payment-warning.orga.no-default-payment-method'),
        };
      case ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED:
        return {
          title: i18n('cc-payment-warning.orga.default-payment-method-is-expired.title'),
          errorMessage: i18n('cc-payment-warning.orga.default-payment-method-is-expired'),
        };
      default:
        return { title: null, errorMessage: null };
    }
  }

  /**
   * @param {PaymentMethodError} error
   * @returns {Node|void}
   */
  _getHomeError({ type, orgaName }) {
    switch (type) {
      case ERROR_TYPES.NO_PAYMENT_METHOD:
        return i18n('cc-payment-warning.generic.no-payment-method', { orgaName });
      case ERROR_TYPES.NO_DEFAULT_PAYMENT_METHOD:
        return i18n('cc-payment-warning.generic.no-default-payment-method', { orgaName });
      case ERROR_TYPES.DEFAULT_PAYMENT_METHOD_IS_EXPIRED:
        return i18n('cc-payment-warning.generic.default-payment-method-is-expired', { orgaName });
    }
  }

  render() {
    switch (this.mode) {
      case 'home':
        return this._renderHomeWarning(this.errors);
      case 'billing':
      case 'overview':
        return this._renderOrgaWarning(this.errors[0]);
    }
  }

  /** @param {PaymentMethodError} error */
  _renderOrgaWarning({ type, orgaName, orgaBillingLink }) {
    const { title, errorMessage } = this._getOrgaError({ type });
    const link =
      this.mode === 'overview' ? i18n('cc-payment-warning.billing-page-link', { orgaName, orgaBillingLink }) : '';

    return html`
      <cc-notice .heading="${title}" intent="warning">
        <div slot="message">${errorMessage} ${link}</div>
      </cc-notice>
    `;
  }

  /** @param {PaymentMethodError[]} errors */
  _renderHomeWarning(errors) {
    return html`
      <cc-notice .heading="${i18n('cc-payment-warning.home.title')}" intent="warning">
        <div slot="message" class="error-container">
          <span>${i18n('cc-payment-warning.home', { orgaCount: this.errors.length })}</span>
          <ul>
            ${errors.map(
              (error) => html`
                <li>
                  ${this._getHomeError(error)}
                  ${i18n('cc-payment-warning.billing-page-link', {
                    orgaName: error.orgaName,
                    orgaBillingLink: error.orgaBillingLink,
                  })}
                </li>
              `,
            )}
          </ul>
        </div>
      </cc-notice>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        ul {
          margin: 0.5em 0 0 1.5em;
          padding: 0;
        }

        li {
          margin-top: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-warning-payment', CcWarningPayment);
