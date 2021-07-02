import { css, html, LitElement } from 'lit-element';
import './cc-pricing-header.js';
import './cc-pricing-product.js';
import './cc-pricing-estimation.js';
import { dispatchCustomEvent } from '../lib/events.js';

const CURRENCY_EUR = { code: 'EUR', changeRate: '1' };

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-page.js)
 *
 * ## Type definitions
 *
 * ```js
 * interface Product {
 *   title: String,
 *   icon: String,
 *   description: String,
 *   items: Array<Item>,
 *   features: Array<Feature>,
 * }
 * ```
 *
 * @prop {Array<Product>} products - List of the products available
 * @prop {Array<PricingList>} pricingLists - List of the pricing for each zone
 *
 */
export class CcPricingPage extends LitElement {

  static get properties () {
    return {
      products: { type: Array },
      // pricingList: { type: Array },
      currencies: { type: Array },
      zones: { type: Array },
      _selectedProducts: { type: Object },
      currency: { type: String },
      zoneId: { type: String },
      _totalPrice: {type: Number},
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this._selectedProducts = {};
    this.currencies = [];
    // Use Paris as default (might need to change later on)
    this.zoneId = 'PAR';
    this.currency = CURRENCY_EUR;
    this.zones = [];
    this._totalPrice = 0;
  }

  _getTotalPrice () {
    let totalPrice = 0;
    console.log('from header', this._selectedProducts);
    for (const p of Object.values(this._selectedProducts)) {
      if (p != null) {
        totalPrice += p.item.price * 30 * 24 * p.quantity;
      }
    }
    return totalPrice;
  }


  /**
     *
     * @param product
     * @private
     * If we receive a product add event. We will get the product added as a param. Then we'll check if
     * it is already on the selected products list. If not we initiate it with it's qt at 1.
     * If it is already present it means it has been added from the product page and not from the recap so
     * we just add one more to the list
     */
  _onAddProduct ({ detail: product }) {
    // TODO: Have a dedicated product.item.id
    const id = (product.item.id != null)
      ? product.item.id
      : `${product.name}/${product.item.name}`;

    if (this._selectedProducts[id] == null) {
      this._selectedProducts[id] = { ...product, quantity: 0 };
    }

    this._selectedProducts[id].quantity += 1;

    this._selectedProducts = { ...this._selectedProducts };
    this._totalPrice = this._getTotalPrice();
  }

  /**
     *
     * @param product
     * @private
     * When someone add or remove a product from the recap that the user has selected before we check if
     * we update the quantity it is at a quantity of zero then we remove it. Otherwise we just update it's quantity
     * whether it has been an addition or subtraction of the quantity.
     */
  _onQuantityChanged ({ detail: product }) {
    // TODO: Have a dedicated product.item.id
    const id = (product.item.id !== undefined)
      ? product.item.id
      : `${product.name}/${product.item.name}`;

    if (product.quantity <= 0) {
      this._selectedProducts[id] = null;
    }
    else {
      this._selectedProducts[id].quantity = product.quantity;
    }

    this._selectedProducts = { ...this._selectedProducts };
    this._totalPrice = this._getTotalPrice();
  }

  _onCurrencyChanged ({ detail: currency }) {
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  _onZoneChanged ({ detail: zoneId }) {
    dispatchCustomEvent(this, 'change-zone', zoneId);
  }

  render () {
    return html`
      <div class="header">
        <cc-pricing-header
            .totalPrice=${this._totalPrice}
            .zoneId=${this.zoneId}
            .currency=${this.currency}
            .selectedProducts=${this._selectedProducts}
            .currencies=${this.currencies}
            .zones=${this.zones}
            @cc-pricing-header:change-currency=${this._onCurrencyChanged}
            @cc-pricing-header:change-zone=${this._onZoneChanged}
        >
        </cc-pricing-header>
      </div>
      <slot name="resources"> </slot>
      <slot @cc-pricing-product:add-product=${this._onAddProduct}></slot>
      <div class="estimation">
        <div class="title">Cost Estimation</div>
        <cc-pricing-estimation
            .selectedProducts=${this._selectedProducts}
            .currency=${this.currency}
            .totalPrice=${this._totalPrice}
            @cc-pricing-estimation:change-quantity=${this._onQuantityChanged}
        >
        </cc-pricing-estimation>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .addons div {
          margin-bottom: 1.5rem;
        }
        
        .runtimes div {
          margin-bottom: 1.5rem;
        }
        
        .title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          margin-top: 0.5rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-page', CcPricingPage);
