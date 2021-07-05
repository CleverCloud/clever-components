import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import { preventOutline } from 'leaflet/src/dom/DomUtil.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-estimation.js)
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
 * ```js
 * interface Product {
 *     name: string,
 *     item: Item
 * }
 * ```
 *
 * ```js
 * interface Item {
 *   name: string,
 *   pricing: number,
 *   features: feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: string,
 *   value: string|number|boolean,
 * }
 * ``
 *
 * ```js
 * interface Currency {
 *   code: string,
 *   changeRate: string,
 * }
 * ``
 *
 * @prop {Array<Product>} selectedProducts - Sets the products selected from the user in the page.
 * @prop {Currency} currency - Sets the current currency code.
 *
 * @event {CustomEvent<Product>} cc-pricing-estimation:change-quantity - Fires the product with a modified quantity whenever the add or minus button is clicked on a product.
 *
 */
export class CcPricingEstimation extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      selectedProducts: { type: Array },
      currency: { type: Object },
      totalPrice: { type: Number },
      _size: { type: String },
    };
  }

  constructor () {
    super();
    this.selectedProducts = [];
    this.totalPrice = 0;
    this.breakpoints = {
      width: [600],
    };
    this.currency = CURRENCY_EUR;
  }

  onResize ({ width }) {
    this._size = width;
    console.log(this._size);
  }

  _getChoices () {
    return [
      {
        label: i18n('cc-pricing-estimation.classic-mode'),
        value: 'classic',
      },
      {
        label: i18n('cc-pricing-estimation.input-mode'),
        value: 'input',
      },
    ];
  }

  _renderSmallSelProduct () {

    const products = Object.values(this.selectedProducts);
    const foundEmpty = products.filter((p) => p == null);

    if (products.length === 0 || foundEmpty.length === products.length) {
      return html`
        <cc-error mode="info">${i18n('cc-pricing-estimation.empty-basket')}</cc-error>
      `;

    }

    return products.map((product) => {
      if (product == null) {
        return null;
      }

      const pricePerDay = product.item.price * 24;
      const totalPricePerDay = pricePerDay * product.quantity * this.currency.changeRate;

      const pricePerMonth = pricePerDay * 30;
      const totalPricePerMonth = pricePerMonth * product.quantity * this.currency.changeRate;

      return html`
        <div class="plan">

          <div class="plan-name">${product.name}</div>

          <div class="qt-btn">
            <cc-input-number
              class="input-number"
              min="0"
              value=${product.quantity}
              @cc-input-number:input=${(e) => this._onChangeQuantity(product, e)}
              controls>
            </cc-input-number>
          </div>

          <div class="feature-list">
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.size')}</div>
              <div class="feature-value">${product.item.name}</div>
            </div>
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.price-name-daily')}</div>
              <div class="feature-value">${i18n('cc-pricing-table.price', {
                price: totalPricePerDay,
                code: this.currency.code,
              })}
              </div>
            </div>
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.price-name-monthly')}</div>
              <div class="feature-value">${i18n('cc-pricing-estimation.price', {
                price: totalPricePerMonth,
                code: this.currency.code,
              })}
              </div>
            </div>
          </div>`;
    });
  }

  _renderBigSelProducts (products) {
    return products.map((product) => {
      if (product == null) {
        return null;
      }

      const pricePerDay = product.item.price * 24;
      const totalPricePerDay = pricePerDay * product.quantity * this.currency.changeRate;

      const pricePerMonth = pricePerDay * 30;
      const totalPricePerMonth = pricePerMonth * product.quantity * this.currency.changeRate;

      return html`
        <tr>
          <td>${product.name}</td>
          <td>${product.item.name}</td>
          <td class="quantity-wrapper">
            <cc-input-number
              class="input-number"
              min="0"
              value=${product.quantity}
              @cc-input-number:input=${(e) => this._onChangeQuantity(product, e)}
              controls>
            </cc-input-number>
          </td>
          <td class="price-item">${i18n('cc-pricing-estimation.price', {
            price: totalPricePerDay,
            code: this.currency.code,
          })}
          </td>
          <td class="price-item">${i18n('cc-pricing-estimation.price', {
            price: totalPricePerMonth,
            code: this.currency.code,
          })}
          </td>
        </tr>`;
    });
  }

  _onChangeQuantity (product, e) {
    if (isNaN(e.target.value)) {
      product.quantity = 0;
      dispatchCustomEvent(this, 'change-quantity', { ...product, quantity: 0 });
    }
    else {
      product.quantity = e.target.value;
      dispatchCustomEvent(this, 'change-quantity', { ...product, quantity: e.target.value });
    }
  }

  _renderSmallEstimation () {
    return html`
      <div class="container">
        ${this._renderSmallSelProduct()}
      </div>`;
  }

  _renderBigEstimation () {
    const products = Object.values(this.selectedProducts);
    const foundEmpty = products.filter((p) => p == null);

    return html`
      <div class="estimation-table">
        <table>
          <tr>
            <th>${i18n('cc-pricing-estimation.product')}</th>
            <th>${i18n('cc-pricing-estimation.size')}</th>
            <th class="quantity-th">${i18n('cc-pricing-estimation.quantity')}</th>
            <th class="number-align">${i18n('cc-pricing-estimation.price-name-daily')}</th>
            <th class="number-align">${i18n('cc-pricing-estimation.price-name-monthly')}</th>
          </tr>
          ${products.length > 0 || foundEmpty.length !== products.length
            ? this._renderBigSelProducts(products)
            : ''}
          ${products.length === 0 || foundEmpty.length === products.length ? html`
              <tr>
                <td colspan="5">
                  <cc-error mode="info">${i18n('cc-pricing-estimation.empty-basket')}</cc-error>
                </td>
              </tr>`
            : ''}
        </table>
      </div>
    `;
  }

  render () {
    return html`
      ${(this._size > 600)
        ? this._renderBigEstimation()
        : this._renderSmallEstimation()
      }

      <div class="recap">
        <div class="monthly-est">${i18n('cc-pricing-estimation.monthly-est')}</div>
        <div class="cost-price">
          ${i18n('cc-pricing-estimation.price', {
            price: this.totalPrice * this.currency.changeRate, code: this.currency.code,
          })}
        </div>
        <div class="recap-buttons">
          <button href="https://www.clever-cloud.com/en/contact-sales" class="contact-sales">${i18n('cc-pricing-estimation.sales')}</button>
          <button href="https://api.clever-cloud.com/v2/sessions/signup" class="sign-up">${i18n('cc-pricing-estimation.sign-up')}</button>
        </div>
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

        .error {
          text-align: center;
        }

        /* Table properties for big screen size */

        table {
          border-collapse: collapse;
          border-radius: 0.5rem;
          box-shadow: var(--shadow);
          width: 100%;
        }

        th {
          background-color: #f6f6fb;
          border-radius: 0.5rem;
          height: 4rem;
          padding: 1rem 0.5rem;
          text-align: left;

        }

        tr:nth-child(n+3) {
          border-top: 0.1rem solid #e5e5e5;
        }

        td {
          padding: 1rem;
          width: min-content;
        }

        .mode-toggle {
          margin-bottom: 1rem;
        }

        .quantity-th {
          text-align: center;
        }

        /* Properties for small screen size */

        .qt-btn {
            justify-self: end;
        }

        .plan {
          align-items: center;
          border-top: 1px solid #e5e5e5;
          display: grid;
          grid-template-columns:  [main-start] 1fr 1fr [main-end] min-content;
          margin: 0;
          padding: 1em;
        }


        .plan .add-item-btn .remove-item-btn {
          margin-right: 1em;
        }

        .plan-name {
          font-size: 1.2em;
          font-weight: bold;
        }

        .feature-list {
          grid-column: main-start / main-end;
            margin: 1em 1em 0 0;
        }

        .feature-list:not(:last-child) {
          margin-top: 1em;
        }

        .plan .feature-list {
          display: flex;
          flex-wrap: wrap;
        }

        .feature {
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          justify-content: space-between;
          padding: 0.75em 0;
        }

        .feature-list:last-child .feature:last-child {
          border: none;
        }

        .plan .feature {
          border: none;
          line-height: 1.5;
          padding: 0;
          white-space: nowrap;
        }

        .plan .feature:not(:last-child)::after {
          content: ',';
          padding-right: 0.5em;
        }

        .feature-name {
          font-style: italic;
          font-weight: bold;
        }

        .plan .feature-name::after {
          content: ' :';
          padding-right: 0.25em;
        }


        .container {
          border-radius: 0.25rem;
          box-shadow: var(--shadow);
        }

        /* Global properties */

        .number-align {
          text-align: right;
        }

        .add-item-btn {
          background: transparent;
          border: none;
        }

        td {
          width: min-content;
        }

        /*.quantity-wrapper {*/
        /*  width: min-content;*/
        /*}*/

        .quantity-text {
          align-self: center;
        }

        .input-number {
          --cc-input-number-align: center;
            width: 50%;
            display: block;
            margin: auto;
            text-align: center;
        }
        

        /* Recap */

        .recap {
          background-color: #3a3771;
          border-radius: 0.2rem;
          color: white;
          display: grid;
          gap: 1rem;
          grid-template-areas: 
                "txt price"
                "btn btn";
          margin-top: 1rem;
          padding: 1rem 0 1rem 1rem;
        }

        :host([w-gte-600]) .recap {
          grid-template-areas: 
                "txt btn"
                "price btn";
        }

        :host([w-gte-600]) .recap-buttons {
          justify-self: right;
        }

        .monthly-est {
          align-self: center;
          grid-area: txt;
          justify-self: center;

        }

        .cost-price {
          align-self: center;
          font-size: 2rem;
          grid-area: price;
          justify-self: center;
        }

        .recap-buttons {
          align-self: center;
          display: flex;
          gap: 1.5rem;
          grid-area: btn;
          justify-self: center;
          margin-right: 1.5rem;
        }

        .contact-sales {
          border-color: transparent;
          border-radius: 0.25rem;
          color: #3a3871;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem;
        }

        .contact-sales:hover {
          background-color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
        }

        .sign-up {
          background-color: transparent;
          border-color: #cccccc;
          border-radius: 0.25rem;
          border-style: solid;
          color: #ffffff;
          padding: 0.75rem;
        }

        .sign-up:hover {
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .price-item {
          text-align: right;
        }


        .change-qt-btn {
          background: transparent;
          border: none;
        }

        .change-qt-btn img {
          filter: brightness(100%);
          height: 32px;
          width: 32px;
        }

        .change-qt-btn img:hover {
          cursor: pointer;
          filter: brightness(50%);
          transition: all 0.75s ease;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-estimation', CcPricingEstimation);
