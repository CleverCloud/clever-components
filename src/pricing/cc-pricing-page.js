import { css, html, LitElement } from 'lit-element';
import './cc-pricing-header.js';
import './cc-pricing-product.js';
import './cc-pricing-estimation.js';
import { dispatchCustomEvent } from '../lib/events.js';

const CURRENCY_EUR = { code: 'EUR', changeRate: '1' };

/**
 * A component to display a pricing simulator with a list of `<cc-pricing-product>` in the default slot.
 *
 * ## Type definitions
 *
 * ```js
 * interface Currency {
 *   name: string,
 *   code: string,
 *   displayValue: string,
 * }
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
 * @cssdisplay block
 *
 * @prop {Currency[]} currencies - Sets the list of currencies available for selection.
 * @prop {Currency} currency - Sets the current selected currency.
 * @prop {String} zoneId - Sets the current selected zone by its ID/name.
 * @prop {Zone[]} zones - Sets the list of zones available for selection.
 *
 * @event {CustomEvent<Currency>} cc-pricing-page:change-currency - Fires the `currency` whenever the currency selection changes.
 * @event {CustomEvent<String>} cc-pricing-page:change-zone - Fires the `zoneId` (zone name) whenever the zone selection changes.
 *
 * @slot - The main part of the simulator, this is where you list <cc-pricing-product*> components.
 * @slot estimation-header - TODO
 * @slot resources - TODO
 *
 * @csspart header - Targets the inner `<cc-pricing-header>`.
 * @csspart estimation-selected-products - Targets the inner `<cc-pricing-estimation>` part `selected-products`.
 * @csspart estimation-recap - Targets the inner `<cc-pricing-estimation>` part `recap`.
 */
export class CcPricingPage extends LitElement {

  static get properties () {
    return {
      currencies: { type: Array },
      currency: { type: Object },
      zoneId: { type: Object },
      zones: { type: Array },
      _selectedProducts: { type: Object },
    };
  }

  constructor () {
    super();
    this.currency = CURRENCY_EUR;
    this._selectedProducts = {};
  }

  _getTotalPrice () {
    return Object.values(this._selectedProducts)
      .map(({ item, quantity }) => item.price * 24 * 30 * quantity)
      .reduce((a, b) => a + b, 0);
  }

  _onAddProduct ({ detail: product }) {
    // TODO: Have a dedicated product.item.productId
    const productId = product.item.id ?? `${product.name}/${product.item.name}`;
    if (this._selectedProducts[productId] == null) {
      this._selectedProducts[productId] = { ...product, quantity: 0 };
    }
    this._selectedProducts[productId].quantity += 1;
    this.requestUpdate();
  }

  _onQuantityChanged ({ detail: product }) {
    // TODO: Have a dedicated product.item.id
    const productId = product.item.id ?? `${product.name}/${product.item.name}`;
    this._selectedProducts[productId].quantity = product.quantity;
    this.requestUpdate();
  }

  _onDeleteProduct ({ detail: product }) {
    // TODO: Have a dedicated product.item.id
    const productId = product.item.id ?? `${product.name}/${product.item.name}`;
    delete this._selectedProducts[productId];
    this.requestUpdate();
  }

  _onCurrencyChanged ({ detail: currency }) {
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  _onZoneChanged ({ detail: zoneId }) {
    dispatchCustomEvent(this, 'change-zone', zoneId);
  }

  render () {

    const selectedProducts = Object.values(this._selectedProducts);
    const totalPrice = this._getTotalPrice();

    return html`

      <cc-pricing-header
        part="header"
        .currency=${this.currency}
        .currencies=${this.currencies}
        .totalPrice=${totalPrice}
        .zoneId=${this.zoneId}
        .zones=${this.zones}
        @cc-pricing-header:change-currency=${this._onCurrencyChanged}
        @cc-pricing-header:change-zone=${this._onZoneChanged}
      ></cc-pricing-header>

      <slot name="resources"></slot>

      <!-- default slot where <cc-pricing-product*> go -->
      <slot @cc-pricing-product:add-product=${this._onAddProduct}></slot>

      <slot name="estimation-header"></slot>
      
      <cc-pricing-estimation
        exportparts="selected-products: estimation-selected-products, recap: estimation-recap"
        .currency=${this.currency}
        .selectedProducts=${selectedProducts}
        .totalPrice=${totalPrice}
        @cc-pricing-estimation:change-quantity=${this._onQuantityChanged}
        @cc-pricing-estimation:delete-product=${this._onDeleteProduct}
      ></cc-pricing-estimation>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: contents;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-page', CcPricingPage);
