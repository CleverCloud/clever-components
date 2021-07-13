import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import '@shoelace-style/shoelace';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { shoelaceStyles } from '../styles/shoelace.js';
import { CcZone } from '../zones/cc-zone.js';
import { skeletonStyles } from '../styles/skeleton.js';

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };

/**
 * A component doing X and Y (one liner description of your component).
 *
 * ## Type definitions
 *
 * ```js
 * interface Zone {
 *   name: string,          // Unique code/identifier for the zone
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   countryCode: string,   // ISO 3166-1 alpha-2 code of the country (2 letters): "FR", "CA", "US"...
 *   city: string,          // Name of the city in english: "Paris", "Montreal", "New York City"...
 *   country: string,       // Name of the country in english: "France", "Canada", "United States"...
 *   displayName?: string,  // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
 *   tags: string[],        // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
 * }
 * ```
 *
 *  @cssdisplay block
 *
 * @prop {Zone} selectedZone - the hosting zone selected for the items
 * @prop {Array<Zone>} zones - Sets  all the zone for the select
 * @prop {Array<Item>} items  - Sets all the products selected to calculate the price
 * @prop {String} pricingCurrency - Sets the current pricing currency
 *
 * @event {CustomEvent<ExampleInterface>} cc-pricing-header:change-currency - Fires XXX whenever YYY.
 * @event {CustomEvent<ExampleInterface>} cc-pricing-header:change-zone - Fires XXX whenever YYY.
 *
 *
 */
export class CcPricingHeader extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      currency: { type: Object },
      currencies: { type: Array },
      totalPrice: { type: Number, attribute: 'total-price' },
      zoneId: { type: String, attribute: 'zone-id' },
      zones: { type: Array },
      _size: { type: String },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [600],
    };
    this.currencies = [];
    this.currency = {};
    this.totalPrice = 0;
    this.zoneId = 'PAR';
    this.zones = [];
    this._size = 0;
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getCurrencySymbol (currency) {
    return new Intl.NumberFormat('fr', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    }).formatToParts(0).find((p) => p.type === 'currency').value;
  }

  _getformattedCurrencies (currencies) {
    return currencies.map((currency) => {
      const displayValue = `${this._getCurrencySymbol(currency.code)} ${currency.code}`;
      return { ...currency, displayValue };
    });
  }

  _onCurrencyChange (e) {
    const currency = this.currencies.find((c) => c.code === e.target.value);
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  _onZoneInput (e) {
    const zoneName = e.target.value;
    dispatchCustomEvent(this, 'change-zone', zoneName);
  }

  render () {
    return html`
      <div class="header">
        <div class="currency-text">
          ${i18n('cc-pricing-header.currency-text')}
        </div>
        <div class="currency-select">
          <sl-select @sl-change=${this._onCurrencyChange} value=${this.currency.code} class="select">
            ${this.currencies.length === 0 ? html`
              <sl-menu-item class="skeleton">
                <div slot="prefix" class="skeleton-item">€ EUR</div>
              </sl-menu-item>
            ` : ''}
            ${this.currencies.length > 0
              ? this._getformattedCurrencies(this.currencies).map((c) => html`
                <sl-menu-item value=${c.code}>
                    ${c.displayValue}
                </sl-menu-item>
              `)
              : ''}
          </sl-select>
        </div>
        <div class="zone-text">
          ${i18n('cc-pricing-header.selected-zone')}
        </div>
        <div class="zones">
          <sl-select @sl-change=${this._onZoneInput} value=${this.zoneId} class="select">
            ${this.zones.length === 0 ? html`
              <sl-menu-item>
                <cc-zone slot="prefix" mode="medium"></cc-zone>
              </sl-menu-item>
              <sl-menu-item>
                <cc-zone slot="prefix" mode="medium"></cc-zone>
              </sl-menu-item>
              <sl-menu-item>
                <cc-zone slot="prefix" mode="medium"></cc-zone>
              </sl-menu-item>
            ` : ''}
            ${this.zones.length > 0 ? this.zones.map((zone) => html`
                <sl-menu-item  class="zone-item" value=${zone.name}>
                  ${CcZone.getText(zone)}
                  <cc-zone
                    slot="prefix"
                    class="zone-item"
                    mode="medium"
                    .zone=${zone}>
                  </cc-zone>
                </sl-menu-item>
              `)
              : ''}
          </sl-select>
        </div>
        <div class="est-cost-text">
          ${i18n('cc-pricing-header.est-cost')}
        </div>
        <div class="total-price">
          ${Object.values(this.currency).length === 0 ? html`
            <div class="skeleton">00000 €</div>
          ` : ''}
          ${Object.values(this.currency).length > 0 ? html`
            ${i18n('cc-pricing-header.price', {
              price: this.totalPrice * this.currency.changeRate, code: this.currency.code,
            })}
          ` : ''}

        </div>
      </div>
      </div>
    `;
  }

  static get styles () {
    return [
      shoelaceStyles,
      skeletonStyles,
      // language=CSS
      css`
          :host {
              display: block;
              margin-bottom: 1.5em;
              padding: 1em;
          }

          .skeleton {
              background-color: #bbb;
          }

          .skeleton-item {
              visibility: hidden;
          }
          
          .select-currency {
              align-items: center;
              display: flex;
              flex-direction: column;
              gap: 0.25em;
          }

          .header {
              display: flex;
              flex-direction: column;
              gap: 0.75em;
          }

          :host([w-gte-600]) .header {
              display: grid;
              gap: 0.5rem;
              grid-template: 
                    "currency-text zone-text estimation-text"
                    "currency-select zones estimation";
              grid-template-columns: min-content 1fr;
          }

          .est-cost-text {
              align-self: end;
              grid-area: estimation-text;
              justify-self: end;
          }

          .currency-text {
              grid-area: currency-text;
          }

          .currency-select {
              grid-area: currency-select;
          }


          .select-content {
              width: min-content;
          }

          .select-item {
              background-color: #ffffff;
          }

          .zone-item {
              margin: 0.5em 0 0.5em 0.5em;
          }

          sl-menu-item.zone-item::part(base):focus {
              --cc-zone-subtitle-color: #fff;
              --cc-zone-tag-bgcolor: transparent;
              --cc-zone-tag-border-color: #fff;
          }

          sl-menu-item.zone-item::part(label) {
              display: none;
          }

          sl-menu-item.zone-itemw::part(prefix) {
              display: block;
              flex: 1 1 0;
          }

          .zones {
              grid-area: zones;
          }

          .zone-text {
              grid-area: zone-text;
          }

          .total-price {
              align-self: end;
              font-size: 1.5em;
              font-weight: bold;
              grid-area: estimation;
              justify-self: end;

          }

          :host([w-gte-600]) .total-price {
              align-self: center;

          }

          .select {
              --focus-ring: 0 0 0 .2em rgba(50, 115, 220, .25);
          }

      `,
    ];
  }
}

window.customElements.define('cc-pricing-header', CcPricingHeader);
