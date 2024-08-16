import { LitElement, html, css } from 'lit';
import {
  iconRemixContractUpDownLine as iconDetailsVisible,
  iconRemixExpandUpDownLine as iconDetailsHidden,
} from '../../src/assets/cc-remix.icons.js';
import './ct-summary-encryption.js';
import './ct-summary-plan.js';
import './ct-summary-product-name.js';
import './ct-summary-scalability.js';
import './ct-summary-version.js';
import './ct-summary-zone.js';

const WORDING = {
  CREATE: 'create instance',
  CANCEL: 'cancel',
};

const SPECIAL_ADDONS = ['addon-matomo', 'addon-pulsar', 'cellar-addon', 'config-provider', 'fs-bucket'];

export class CtSummary extends LitElement {
  static get properties () {
    return {
      form: { type: Object },
      price: { type: Number },
      product: { type: Object },
      _detailsVisible: { type: Boolean },
    };
  };

  constructor () {
    super();

    this.form = {};
    this.price = {};
    this.product = {};
    this._detailsVisible = false;
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('form')) {
      this.price = this._computePrice();
    }
  }

  _computePrice () {
    function priceToString(nb, unit = '€') {
      return (Math.round(100 * nb) / 100).toFixed(2) + unit;
    }

    if (this.product.type === 'addon') {
      return this.form.plan != null ? priceToString(this.form.plan.price) : null;
    }

    if (this.form.scalability == null) {
      return null;
    }

    const MULTIPLIER = 24 * 30;
    const { isEnabled, flavors, instances } = this.form.scalability;
    const price = {
      isEnabled,
      min: priceToString(flavors.min.price * instances.min.value * MULTIPLIER),
    };
    if (isEnabled) {
      price.max = priceToString(flavors.max.price * instances.max.value * MULTIPLIER);
    }
    return price;
  }

  _toggleDetails () {
    this._detailsVisible = !this._detailsVisible;
  }

  render () {
    return html`
      <div class="header">
        <div class="header--logo">
          <cc-img src="${this.product.logoUrl}"></cc-img>
        </div>
        <div class="header--name">
          ${this.product.name}
          ${
            this.product.beta
            ? html`<cc-badge intent="warning" weight="strong">beta</cc-badge>`
            : ``
          }
        </div>
        <button class="header--details-toggle-btn" @click="${this._toggleDetails}">
        ${
          this._detailsVisible
          ? html`<cc-icon size="lg" .icon="${iconDetailsVisible}"></cc-icon>`
          : html`<cc-icon size="lg" .icon="${iconDetailsHidden}"></cc-icon>`
        }
        </button>
      </div>
      <div class="body">
        <ct-summary-product-name
          name="${this.form.instanceName}"
          .tags="${this.form.tags}"
          ?details-visible="${this._detailsVisible}"
        ></ct-summary-product-name>
        ${
          this.product.type === 'app'
            ? html`<ct-summary-scalability .scalability="${this.form.scalability}" ?details-visible="${this._detailsVisible}"></ct-summary-scalability>`
            : ``
        }
        ${
          this.product.type === 'addon' && !SPECIAL_ADDONS.includes(this.product.id)
            ? html`<ct-summary-plan .plan="${this.form.plan}" ?details-visible="${this._detailsVisible}"></ct-summary-plan>`
            : ``
        }
        <ct-summary-zone .zone="${this.form.zone}" ?details-visible="${this._detailsVisible}"></ct-summary-zone>
        ${
          this.product.type === 'addon' && this.form.version != null
          ? html`<ct-summary-version version="${this.form.version}"></ct-summary-version>`
          : ``
        }
        ${
          this.product.type === 'addon' && this.form.encryption === true
          ? html`<ct-summary-encryption ?details-visible="${this._detailsVisible}" ?kibana="${this.form.kibana}" ?apm="${this.form.apm}"></ct-summary-encryption>`
          : ``
        }
      </div>
      ${
        this.product.type === 'app' && this.price != null && !this.price.isEnabled
          ? html`<div class="price-container">
              <div class="price-container--main">${this.price.min}</div>
              <div class="price-container--baseline">Amount your application will consume for 30 days.</div>
            </div>`
          : ``
      }
      ${
        this.product.type === 'app' && this.price != null && this.price.isEnabled
          ? html`<div class="price-container">
              <div class="price-container--main">${this.price.min}&nbsp;<span class="price-range--arrow">&#10148;</span>&nbsp;${this.price.max}</div>
              <div class="price-container--baseline">Amounts between which your application will consume for 30 days.</div>
            </div>`
          : ``
      }
      ${
        this.product.type === 'addon' && this.price != null
          ? html`<div class="price-container">
              <div class="price-container--main">${this.price}</div>
              <div class="price-container--baseline">Estimated price for 30 days.</div>
            </div>`
          : ``
      }
      <div class="footer">
        <cc-button class="btn-submit" primary>${WORDING.CREATE}</cc-button>
        <cc-button class="btn-cancel">${WORDING.CANCEL}</cc-button>
      </div>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
          border-radius: var(--cc-border-radius-default);
          overflow: hidden;
        }

        .btn-submit,
        .btn-cancel {
          --cc-button-text-transform: capitalize;
          --cc-button-font-weight: 500;
        }

        .header,
        .body,
        .footer {
          padding: 1em;
        }

        .body,
        .price-container {
          border-left: 2px solid var(--cc-color-border-primary-weak);
          border-right: 2px solid var(--cc-color-border-primary-weak);
        }
        .footer {
          border-bottom: 2px solid var(--cc-color-border-primary-weak);
          border-left: 2px solid var(--cc-color-border-primary-weak);
          border-right: 2px solid var(--cc-color-border-primary-weak);
        }

        .header {
          display: flex;
          align-items: center;
          column-gap: 1em;
          color: var(--cc-color-text-inverted);
          background-color: var(--cc-color-bg-primary);
        }

        .header--logo {
          display: inline-flex;
          flex: 0 0 auto;
          border: 1px solid var(--cc-color-bg-primary-weak);
          border-radius: var(--cc-border-radius-default);
          overflow: hidden;
        }
        .header--name {
          display: inline-flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 0.25em;
          flex: 1 1 auto;
          font-size: 2em;
          font-weight: 500;
          line-height: 1.125;
        }
        .header--details-toggle-btn {
          flex: 0 0 auto;
          padding: 0.5em;
          margin: 0;
          color: unset;
          background-color: initial;
          border: none;
          border-radius: 2px;
          cursor: pointer;
        }
        .header--details-toggle-btn:focus-visible {
          outline: var(--cc-focus-outline);
          outline-color: var(--cc-color-border-neutral-weak);
          outline-offset: 2px;
        }

        .header--logo cc-img {
          width: 3em;
          height: 3em;
        }

        .header--name cc-badge {
          flex: 0 0 auto;
          font-size: initial;
        }

        .price-container {
          padding: 0.5em 1.25em 1.5em 1.25em;
        }
        .price-container--main {
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.5em;
          font-weight: bold;
        }
        .price-container--baseline {
          font-size: 0.825em;
          line-height: 1.25;
          color: var(--cc-color-text-weaker);
          font-weight: 500;
        }
        
        .price-range--arrow {
          padding-inline: 0.125em;
          font-size: 0.75em;
        }
        
        .body {
          display: flex;
          flex-direction: column;
          row-gap: 1em;
        }
        
        .footer {
          display: flex;
          column-gap: 0.5em;
          background: var(--cc-color-bg-neutral);
        }

        .footer cc-button {
          flex: 0 0 auto;
          font-size: 1.125em;
        }
      `,
    ];
  }
}

customElements.define('ct-summary', CtSummary);
