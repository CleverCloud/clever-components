import { css, html, LitElement } from 'lit-element';
import './cc-pricing-header.js';
import './cc-pricing-product.js';
import './cc-pricing-estimation.js';
import { dispatchCustomEvent } from '../lib/events.js';

/** @type {Currency} */
const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };

/**
 * @typedef {import('./types.js').Currency} Currency
 * @typedef {import('../types.js').Zone} Zone
 */

/**
 * A component to display a pricing simulator with a list of `<cc-pricing-product>` in the default slot.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Currency>} cc-pricing-page:change-currency - Fires the `currency` whenever the currency selection changes.
 * @event {CustomEvent<string>} cc-pricing-page:change-zone - Fires the `zoneId` (zone name) whenever the zone selection changes.
 *
 * @slot - The main part of the simulator, this is where you list <cc-pricing-product*> components.
 * @slot estimation-header - Content between the main slot containing products and the bottom estimation block.
 * @slot resources - Content between the top header block and the main slot containing products.
 *
 * @csspart header - Targets the inner `<cc-pricing-header>`.
 * @csspart estimation-selected-plans - Targets the inner `<cc-pricing-estimation>` part `selected-plans`.
 * @csspart estimation-recap - Targets the inner `<cc-pricing-estimation>` part `recap`.
 * @cssprop {Color} --cc-pricing-estimation-recap-bg-color - Sets the value of the recap (part of the inner `cc-pricing-estimation` component) background color (#000000 by default).
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

    /** @type {Currency[]|null} Sets the list of currencies available for selection. */
    this.currencies = null;

    /** @type {Currency} Sets the current selected currency. */
    this.currency = CURRENCY_EUR;

    /** @type {string|null} Sets the current selected zone by its ID/name. */
    this.zoneId = null;

    /** @type {Zone[]|null} Sets the list of zones available for selection. */
    this.zones = null;

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
