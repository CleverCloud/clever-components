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
 * }
 * ```
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
 * @slot estimation-header - Content between the main slot containing products and the bottom estimation block.
 * @slot resources - Content between the top header block and the main slot containing products.
 *
 * @csspart header - Targets the inner `<cc-pricing-header>`.
 * @csspart estimation-selected-plans - Targets the inner `<cc-pricing-estimation>` part `selected-plans`.
 * @csspart estimation-recap - Targets the inner `<cc-pricing-estimation>` part `recap`.
 */
export class CcPricingPage extends LitElement {

  static get properties () {
    return {
      currencies: { type: Array },
      currency: { type: Object },
      zoneId: { type: Object },
      zones: { type: Array },
      _selectedPlans: { type: Object },
    };
  }

  constructor () {
    super();
    this.currency = CURRENCY_EUR;
    this._selectedPlans = {};
  }

  _getTotalPrice () {
    return Object.values(this._selectedPlans)
      .map(({ price, quantity }) => price * 24 * 30 * quantity)
      .reduce((a, b) => a + b, 0);
  }

  _getPlanId (plan) {
    return plan.id ?? `${plan.productName}/${plan.name}`;
  }

  _onAddPlan ({ detail: plan }) {
    const planId = this._getPlanId(plan);
    if (this._selectedPlans[planId] == null) {
      this._selectedPlans[planId] = { ...plan, quantity: 0 };
    }
    this._selectedPlans[planId].quantity += 1;
    this.requestUpdate();
  }

  _onChangeQuantity ({ detail: plan }) {
    const planId = this._getPlanId(plan);
    this._selectedPlans[planId].quantity = plan.quantity;
    this.requestUpdate();
  }

  _onDeletePlan ({ detail: plan }) {
    const planId = this._getPlanId(plan);
    delete this._selectedPlans[planId];
    this.requestUpdate();
  }

  _onChangeCurrency ({ detail: currency }) {
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  _onChangeZone ({ detail: zoneId }) {
    dispatchCustomEvent(this, 'change-zone', zoneId);
  }

  render () {

    const selectedPlans = Object.values(this._selectedPlans);
    const totalPrice = this._getTotalPrice();

    return html`

      <cc-pricing-header
        part="header"
        .currency=${this.currency}
        .currencies=${this.currencies}
        .totalPrice=${totalPrice}
        .zoneId=${this.zoneId}
        .zones=${this.zones}
        @cc-pricing-header:change-currency=${this._onChangeCurrency}
        @cc-pricing-header:change-zone=${this._onChangeZone}
      ></cc-pricing-header>

      <slot name="resources"></slot>

      <!-- default slot where <cc-pricing-product*> go -->
      <slot @cc-pricing-product:add-plan=${this._onAddPlan}></slot>

      <slot name="estimation-header"></slot>
      
      <cc-pricing-estimation
        exportparts="selected-plans: estimation-selected-plans, recap: estimation-recap"
        .currency=${this.currency}
        .selectedPlans=${selectedPlans}
        .totalPrice=${totalPrice}
        @cc-pricing-estimation:change-quantity=${this._onChangeQuantity}
        @cc-pricing-estimation:delete-plan=${this._onDeletePlan}
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
