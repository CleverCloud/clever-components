import { css, html, LitElement } from 'lit';

/** @type {Currency} */
// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const DEFAULT_CURRENCY = { code: 'EUR', changeRate: 1 };
/** @type {Temporality} */
// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const DEFAULT_TEMPORALITY = { type: '30-days', digits: 2 };

/**
 * @typedef {import('../cc-pricing-estimation/cc-pricing-estimation.js').CcPricingEstimation} CcPricingEstimation
 * @typedef {import('../cc-pricing-header/cc-pricing-header.js').CcPricingHeader} CcPricingHeader
 * @typedef {import('../cc-pricing-product/cc-pricing-product.js').CcPricingProduct} CcPricingProduct
 * @typedef {import('../common.types.js').Currency} Currency
 * @typedef {import('./cc-pricing-page.types.js').SelectedPlans} SelectedPlans
 * @typedef {import('../common.types.js').Temporality} Temporality
 */

/**
 * A component used to make slotted pricing components communicate together.
 *
 * **Note:**
 *
 * This component only contains a slot and it has no specific styling.
 * The goal of this component is to receive pricing components (using the default slot) and allow them to communicate together.
 *
 * To do so, the component relies on a mutation observer that detects slotted pricing components and keeps refs of the corresponding DOM elements.
 * It listens to pricing related events and updates the relevant pricing DOM elements depending on the event.
 *
 * @cssdisplay block
 *
 * @slot - Use this slot to insert your pricing components and their related content (headings, descriptions, etc.)
 */
export class CcPricingPage extends LitElement {
  static get properties() {
    return {
      selectedCurrency: { type: Object, attribute: 'selected-currency' },
      selectedPlans: { type: Object, attribute: 'selected-plans' },
      selectedTemporality: { type: Object, attribute: 'selected-temporality' },
      selectedZoneId: { type: String, attribute: 'selected-zone-id' },
      _headerElement: { type: Object, state: true },
      _productElements: { type: Array, state: true },
      _estimationElement: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {Currency} Sets the current selected currency. */
    this.selectedCurrency = DEFAULT_CURRENCY;

    /** @type {SelectedPlans} Sets the current selected plans. */
    this.selectedPlans = {};

    /** @type {Temporality} Sets the current selected temporality. */
    this.selectedTemporality = DEFAULT_TEMPORALITY;

    /** @type {string} Sets the current selected zone by referencing its ID/name. */
    this.selectedZoneId = 'par';

    /** @type {CcPricingHeader|null} */
    this._headerElement = null;

    /** @type {CcPricingProduct[]|null} */
    this._productElements = null;

    /** @type {CcPricingEstimation[]|null} */
    this._estimationElement = null;
  }

  _getPlanId(plan) {
    return plan.id ?? `${plan.productName}/${plan.name}`;
  }

  /**
   * Query pricing components from light DOM and store in their corresponding state props.
   */
  _updateElementReferences() {
    this._headerElement = this.querySelector('cc-pricing-header');
    this._productElements = Array.from(this.querySelectorAll('cc-pricing-product, cc-pricing-product-consumption'));
    this._estimationElement = this.querySelector('cc-pricing-estimation');
  }

  _onAddPlan({ detail: plan }) {
    const planId = this._getPlanId(plan);
    if (this.selectedPlans[planId] == null) {
      this.selectedPlans[planId] = { ...plan, quantity: 0 };
    }
    this.selectedPlans[planId].quantity += 1;
    this.requestUpdate();
  }

  _onChangeCurrency({ detail: currency }) {
    this.selectedCurrency = currency;
  }

  _onChangeTemporality({ detail: temporality }) {
    this.selectedTemporality = temporality;
  }

  _onChangeQuantity({ detail: plan }) {
    const planId = this._getPlanId(plan);
    this.selectedPlans[planId].quantity = plan.quantity;
    this.requestUpdate();
  }

  _onDeletePlan({ detail: plan }) {
    const planId = this._getPlanId(plan);
    delete this.selectedPlans[planId];
    this.requestUpdate();
  }

  /**
   * When the component is connected to the DOM:
   *
   * - we update the list of slotted pricing components,
   * - we set up a MutationObserver that will keep the list of slotted pricing components updated.
   */
  connectedCallback() {
    super.connectedCallback();
    this._updateElementReferences();
    this._observer = new MutationObserver(() => this._updateElementReferences());
    this._observer.observe(this, {
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

  /**
   * Everytime any of the props change, we pass the current prop values to all the slotted pricing components.
   * In other words, we keep the slotted pricing components synced with the pricing page state.
   *
   * Note that the pricing page component itself updates the `selectedPlans` prop when the quantity of plans changes.
   * This triggers the willUpdate lifecycle hook right below.
   * It updates the pricing estimation `selectedPlans` prop as a result.
   */
  willUpdate() {
    this._productElements?.forEach((productElement) => {
      productElement.currency = this.selectedCurrency;
      productElement.temporalities = [this.selectedTemporality];
    });

    if (this._headerElement != null) {
      this._headerElement.selectedCurrency = this.selectedCurrency ?? DEFAULT_CURRENCY;
      this._headerElement.selectedTemporality = this.selectedTemporality ?? DEFAULT_TEMPORALITY;
    }

    if (this._estimationElement != null) {
      this._estimationElement.selectedCurrency = this.selectedCurrency ?? DEFAULT_CURRENCY;
      this._estimationElement.selectedTemporality = this.selectedTemporality ?? DEFAULT_TEMPORALITY;
      this._estimationElement.selectedPlans = Object.values(this.selectedPlans);
    }
  }

  render() {
    return html`
      <slot
        @cc-pricing-header:change-currency=${this._onChangeCurrency}
        @cc-pricing-header:change-temporality=${this._onChangeTemporality}
        @cc-pricing-product:add-plan=${this._onAddPlan}
        @cc-pricing-estimation:change-quantity=${this._onChangeQuantity}
        @cc-pricing-estimation:delete-plan=${this._onDeletePlan}
        @cc-pricing-estimation:change-temporality=${this._onChangeTemporality}
        @cc-pricing-estimation:change-currency=${this._onChangeCurrency}
      ></slot>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-page', CcPricingPage);
