import '../cc-button/cc-button.js';
import '../cc-block/cc-block.js';
import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

/**
 * @typedef {import('./cc-billing-info-form.types.js').Option} Option
 */

/**
 * A component that displays a form to toggle flags on customer's Billing Info.
 *
 * Meant to be used by Clever Cloud administrators.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Object>} cc-billing-info-form:submit - Fires when the form is submitted.
 *
 * @slot description - The description of the add-on and available options.
 */
export class CcBillingInfoForm extends LitElement {

  static get properties () {
    return {
      title: { type: String },
      state: { type: String, reflect: true },
      billinginfo: { type: Object, reject: true },
    };
  }

  _disabled () {
    return this.state.toLowerCase() === 'disabled';
  }

  _readOnly () {
    return this.state.toLowerCase() === 'readonly';
  }

  constructor () {
    super();

    /** @type {string} Title of the whole options form. */
    this.title = null;
  }

  _onSubmit () {
    // If some options were not changed, fill them here
    this.options.forEach((option) => {
      if (this._optionsStates[option.name] == null) {
        this._optionsStates[option.name] = option.enabled || false;
      }
    });

    dispatchCustomEvent(this, 'submit', this._optionsStates);
  }

  _onOptionToggle ({ detail }, optionName) {
    this._optionsStates[optionName] = detail;
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">${this.title}</div>
        <cc-block>
          <div slot="title">Trusted</div>
          <cc-toggle
            class="trusted"
            choices='[{"label":"Nope","value":"false"},{"label":"Trusted","value":"true"}]'
            value="${this.billinginfo.trusted}"
           ></cc-toggle>
        </cc-block>

        <cc-block>
          <div slot="title">Start date</div> <!-- TODO: translation -->
          <cc-input-text class="start-date">
          <!-- TODO: enforce date format -->
          <!-- TODO: date picker? -->
          </cc-input-text>
        </cc-block>
        <cc-block>
          <div slot="title">End date</div>
          <cc-input-text class="end-date">
          <!-- TODO: enforce date format -->
          <!-- TODO: date picker? -->
          </cc-input-text>
        </cc-block>
        <cc-block>
          <div slot="title">Discount percentage</div>
          <cc-input-number class="discount"
            min="0"
            max="100"
            step="10"
            value=${this.billinginfo.discount_pct}
            controls
          ></cc-input-number>
        </cc-block>
        <cc-block>
          <div slot="title">Price factor</div>
          <cc-input-number class="price-factor"
            min="1"
            max="10"
            step="0.1"
            value=${this.billinginfo.price_factor}
            controls
          ></cc-input-number>
        </cc-block>
        <cc-block>
          <div slot="title">Month frequency</div>
          <cc-input-number class="month-frequency"
            min="1"
            max="48"
            step="1"
            value=${this.billinginfo.month_frequency}
            controls
          ></cc-input-number>
        </cc-block>
        <cc-block>
          <div slot="title">Currency</div>
          <cc-toggle class="currency"
            choices='[{"label":"€","value":"EUR"}]'
            value="${this.billinginfo.currency}"
          ></cc-toggle>
        </cc-block>
        <cc-block>
          <div slot="title"># of allowed pending invoices</div>
          <cc-input-number class="allowed-pending-invoices"
            min="1"
            max="48"
            step="1"
            value=${this.billinginfo.allowed_pending_invoices}
            controls
          ></cc-input-number>
        </cc-block>
        <cc-block>
          <div slot="title">Owner Name</div>
          <cc-input-text class="owner-name" value=${this.billinginfo.allowed_pending_invoices}></cc-input-text>
        </cc-block>
        <cc-block>
          <div slot="title">Toggle Upfront</div>
          <cc-toggle class="upfront-credit-mode"></cc-toggle>
        </cc-block>
        <cc-block>
          <div slot="title">Toggle Invoicing</div>
          <cc-toggle class="invoicing-mode"></cc-toggle>
          <div slot="description">Explain what it does and why it should not exist.</div>
        </cc-block>
        <cc-block>
          <div slot="title">Toggle daily consumption</div>
          <cc-toggle class="daily-consumption-mode"></cc-toggle>
        </cc-block>
        <cc-block>
          <div slot="title">Remind mode</div>
          <cc-toggle class="remind-invoices"></cc-toggle>
        </cc-block>

        <div class="button-bar">
          <cc-button primary @cc-button:click=${this._onSubmit}>
            ${i18n('cc-billing-info-form.confirm')}
          </cc-button>
        </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .button-bar {
          display: grid;
          justify-content: flex-end;
        }

        [name="description"] {
          line-height: 1.5;
        }

        cc-toggle.trusted[value=true] {
          --cc-toggle-color: #5cb85c;
        }

        cc-toggle.trusted[value=false] {
          --cc-toggle-color: #cb243c;
        }


      `,
    ];
  }
}

window.customElements.define('cc-billing-info-form', CcAddonOptionForm);
