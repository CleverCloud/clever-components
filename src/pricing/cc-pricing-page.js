import { css, html, LitElement } from 'lit-element';
import './cc-pricing-header.js';
import './cc-pricing-product.js';
import './cc-pricing-estimation.js';
import { dispatchCustomEvent } from '../lib/events.js';

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
      pricingList: { type: Array },
      currencies: { type: Object },
      _selectedProducts: { type: Object },
      _currency: { type: Object },
      _zone: { type: String },
      _categories: { type: Array },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this._selectedProducts = {};
    this.currencies = {};
    // Set default currency to EURO (€)
    // this._currency = this.currencies?.EUR != null ? this.currencies.EUR.code : 'EUR';
    this._currency = this.currencies?.EUR != null ? this.currencies.EUR : { code: 'EUR', changeRate: '1' };
    this._categories = ['runtime', 'addon'];
    this.pricingList = [];
    // Use Paris as default (might need to change later on)
    this.zone = 'PAR';
  }

  // DOCS: 5. Public methods

  // DOCS: 6. Private methods
  _filterPrice (products) {
    return products.map((p) => {

      const priceList = this.pricingLists.find((pl) => pl.zone_id === this.zone);

      const items = p.items.map((item) => {
        const { price } = priceList.runtime.find((pl) => pl.slug_id === item.price_id) || {};
        return {
          ...item,
          price: {
            daily: (price * 24) * this._currency.changeRate,
            monthly: (price * 730.5) * this._currency.changeRate,
          },
        };
      });
      return { ...p, items };
    });
  }

  /**
   * Documentation of this awesome method.
   * @param {String} foo - Docs for foo.
   * @param {Boolean} bar - Docs for bar.
   */
  _renderProducts (category) {

    // Might change it with an update()
    const productsFiltered = this.products.filter((p) => p.category === category);
    const productsWithPrice = this._filterPrice(productsFiltered);

    return productsWithPrice.map((p) => {
      return html`
        
        <div>
          <cc-pricing-product
              name=${p.name}
              icon=${p.icon}
              description=${p.description}
              currency=${this._currency.code}
              .items=${p.items}
              .features=${p.features}
              .icons=${p.icons}
              @cc-pricing-product:add-product=${this._onAddProduct}
          >
          </cc-pricing-product>
        </div>
      `;
    });
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
    console.log('product from page', product);
    // TODO: Have a dedicated product.item.id
    const id = (product.item.id != null)
      ? product.item.id
      : `${product.name}/${product.item.name}`;

    if (this._selectedProducts[id] == null) {
      this._selectedProducts[id] = { ...product, quantity: 0 };
    }

    this._selectedProducts[id].quantity += 1;

    this._selectedProducts = { ...this._selectedProducts };
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
  }

  _onCurencyChanged ({ detail: currency }) {
    console.log('currency is', currency);
    this._currency = currency;
    dispatchCustomEvent(this, 'change-currency', { code: currency.code, changeRate: currency.changeRate });
  }

  _onZoneChanged ({ detail: zoneName }) {
    console.log('zone_name', zoneName);
    this.zone = zoneName;
    dispatchCustomEvent(this, 'change-zone', { zoneId: zoneName });
  }

  render () {

    return html`
      <div class="header">
        <cc-pricing-header 
            .selectedProducts=${this._selectedProducts}
            .currency=${this._currency}
            .currencies=${this.currencies}
            @cc-pricing-header:change-currency=${this._onCurencyChanged}
            @cc-pricing-header:change-zone=${this._onZoneChanged}
        >
        </cc-pricing-header>
      </div>
      <slot name="resources">
        resources that you need, including all features.
        ...
      </slot>
      <slot @cc-pricing-product:add-product=${this._onAddProduct}></slot>
      <div class="estimation">
        <div class="title">Cost Estimation</div>
        <cc-pricing-estimation
            .selectedProducts=${this._selectedProducts}
            .currency=${this._currency}
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
