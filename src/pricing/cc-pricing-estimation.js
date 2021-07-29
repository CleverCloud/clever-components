import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import '../atoms/cc-input-number.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { ccLink } from '../templates/cc-link.js';

const deleteSvg = new URL('../assets/delete.svg', import.meta.url).href;

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };
const CONTACT_URL = 'https://www.clever-cloud.com/en/contact-sales';
const SIGN_UP_URL = 'https://api.clever-cloud.com/v2/sessions/signup';

/**
 * A component to display a list of selected products with the ability to change their quantity or remove them from the list.
 *
 * ## Type definitions
 *
 * ```js
 * interface Currency {
 *   code: string,
 *   changeRate: string,
 * }
 * ```
 *
 * ```js
 * interface Product {
 *   name: string,
 *   item: Item,
 *   quantity: number,
 * }
 * ```
 *
 * ```js
 * interface Item {
 *   name: string,
 *   pricing: number,
 *   features: Feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: string,
 *   value: string|number|boolean,
 * }
 * ```
 *
 * @cssdisplay block
 *
 * @prop {Currency} currency - Sets the current currency.
 * @prop {Product[]} selectedProducts - Sets the list of selected products with their quantity.
 * @prop {Number} totalPrice - Sets the total estimated price for all selected products.
 *
 * @event {CustomEvent<Product>} cc-pricing-estimation:change-quantity - Fires the product with a modified quantity whenever the quantity on the input changes.
 * @event {CustomEvent<Product>} cc-pricing-estimation:delete-product - Fires the product with a quantity of 0 when the delete button of a product is clicked.
 *
 * @csspart selected-products - Targets the inner selected products (table in big mode, list in small mode).
 * @csspart recap - Targets the inner recap blue box.
 */
export class CcPricingEstimation extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      currency: { type: Object },
      selectedProducts: { type: Array, attribute: 'selected-products' },
      totalPrice: { type: Number, attribute: 'total-price' },
      _size: { type: String },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [600],
    };
    this.currency = CURRENCY_EUR;
    this.selectedProducts = [];
    this.totalPrice = 0;
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getTotalPrices (product) {

    const itemPriceDaily = product.item.price * 24;
    const totalPricePerDay = itemPriceDaily * product.quantity * this.currency.changeRate;
    const totalPriceDailyWithCode = { price: totalPricePerDay, code: this.currency.code };

    const priceMonthly = itemPriceDaily * 30;
    const totalPriceMonthly = priceMonthly * product.quantity * this.currency.changeRate;
    const totalPriceMonthlyWithCode = { price: totalPriceMonthly, code: this.currency.code };

    return { totalPriceDailyWithCode, totalPriceMonthlyWithCode };
  }

  _onChangeQuantity (product, quantity) {
    dispatchCustomEvent(this, 'change-quantity', { ...product, quantity });
  }

  _onDeleteProduct (product) {
    dispatchCustomEvent(this, 'delete-product', product);
  }

  render () {
    // We don't really have a good way to detect when the component should switch between bit and small mode.
    // Also, when this component is used several times in the page, it's better if all instances switch at the same breakpoint.
    // 950 seems like a good arbitrary value for the content we need to display.
    return html`

      ${(this._size > 950)
        ? this._renderBigEstimation()
        : this._renderSmallEstimation()
      }

      <div class="recap" part="recap">
        <div class="recap-text">${i18n('cc-pricing-estimation.monthly-est')}</div>
        <div class="recap-total">
          ${i18n('cc-pricing-estimation.price', {
            price: this.totalPrice * this.currency.changeRate, code: this.currency.code,
          })}
        </div>
        <div class="recap-contact">
          ${ccLink(CONTACT_URL, i18n('cc-pricing-estimation.sales'))}
        </div>
        <div class="recap-signup">
          ${ccLink(SIGN_UP_URL, i18n('cc-pricing-estimation.sign-up'))}
        </div>
      </div>
    `;
  }

  _renderBigEstimation () {
    return html`
      <div part="selected-products">
        <table>
          <tr>
            <th class="btn-col"></th>
            <th>${i18n('cc-pricing-estimation.product')}</th>
            <th>${i18n('cc-pricing-estimation.size')}</th>
            <th>${i18n('cc-pricing-estimation.quantity')}</th>
            <th class="number-align">${i18n('cc-pricing-estimation.price-name-daily')}</th>
            <th class="number-align">${i18n('cc-pricing-estimation.price-name-monthly')}</th>
          </tr>
          ${this._renderBigSelectedProducts()}
        </table>
      </div>
    `;
  }

  _renderBigSelectedProducts () {

    if (this.selectedProducts.length === 0) {
      return html`
        <tr>
          <td colspan="6" class="empty-text">
            ${i18n('cc-pricing-estimation.empty-list')}
          </td>
        </tr>
      `;
    }

    return this.selectedProducts.map((product) => {

      const { totalPriceDailyWithCode, totalPriceMonthlyWithCode } = this._getTotalPrices(product);

      return html`
        <tr>
          <td class="btn-col">
            <cc-button
              danger
              outlined
              image=${deleteSvg}
              hide-text
              circle
              @cc-button:click=${() => this._onDeleteProduct(product)}
            >
              ${i18n('cc-pricing-estimation.delete')}
            </cc-button>
          </td>
          <td>${product.name}</td>
          <td>${product.item.name}</td>
          <td>
            <cc-input-number
              class="input-number"
              value=${product.quantity}
              min="0"
              controls
              @cc-input-number:input=${(e) => this._onChangeQuantity(product, e.detail)}
            ></cc-input-number>
          </td>
          <td class="number-align">${i18n('cc-pricing-estimation.price', totalPriceDailyWithCode)}</td>
          <td class="number-align">${i18n('cc-pricing-estimation.price', totalPriceMonthlyWithCode)}</td>
        </tr>
      `;
    });
  }

  _renderSmallEstimation () {
    return html`
      <div class="container" part="selected-products">
        ${this._renderSmallSelProduct()}
      </div>
    `;
  }

  _renderSmallSelProduct () {

    if (this.selectedProducts.length === 0) {
      return html`
        <div class="empty-text">
          ${i18n('cc-pricing-estimation.empty-list')}
        </div>
      `;
    }

    return this.selectedProducts.map((product) => {

      const { totalPriceDailyWithCode, totalPriceMonthlyWithCode } = this._getTotalPrices(product);

      return html`
        <div class="plan">

          <cc-button
            class="delete-btn"
            danger
            outlined
            image=${deleteSvg}
            hide-text
            circle
            @cc-button:click=${() => this._onDeleteProduct(product)}
          >
            ${i18n('cc-pricing-estimation.delete')}
          </cc-button>

          <div class="plan-name">${product.name}</div>

          <cc-input-number
            class="input-number"
            value=${product.quantity}
            min="0"
            controls
            @cc-input-number:input=${(e) => this._onChangeQuantity(product, e.detail)}
          ></cc-input-number>

          <div class="feature-list">
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.size')}</div>
              <div class="feature-value">${product.item.name}</div>
            </div>
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.price-name-daily')}</div>
              <div class="feature-value">${i18n('cc-pricing-table.price', totalPriceDailyWithCode)}
              </div>
            </div>
            <div class="feature">
              <div class="feature-name">${i18n('cc-pricing-estimation.price-name-monthly')}</div>
              <div class="feature-value">${i18n('cc-pricing-estimation.price', totalPriceMonthlyWithCode)}</div>
            </div>
          </div>
        </div>
      `;
    });
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        /*#region COMMON*/

        .input-number {
          --cc-input-number-align: center;
          /* This is enough to display up to 999 */
          width: 13ch;
        }

        .empty-text {
          font-style: italic;
          padding: 1em 0;
          text-align: center;
        }

        .recap {
          align-items: center;
          background-color: #3a3771;
          border-radius: 0.2em;
          color: #fff;
          display: grid;
          gap: 1em;
          justify-items: center;
          padding: 2em;
          white-space: nowrap;
        }

        .recap-text {
          grid-area: text;
        }

        .recap-total {
          font-weight: bold;
          grid-area: total;
        }

        .recap-contact {
          grid-area: contact;
        }

        .recap-signup {
          grid-area: signup;
        }

        .cc-link {
          border-radius: 0.2em;
          cursor: pointer;
          display: inline-block;
          font-weight: bold;
          text-decoration: none;
        }

        .cc-link:focus {
          box-shadow: 0 0 0 .2em #cbdcf6;
          outline: 0;
        }

        .cc-link::-moz-focus-inner {
          border: 0;
        }

        .recap-contact .cc-link {
          background-color: #fff;
          color: #3a3871;
        }

        .recap-contact .cc-link:hover {
          background-color: rgba(255, 255, 255, 0.9);
        }

        .recap-signup .cc-link {
          background-color: transparent;
          border: 1px solid #ccc;
          color: #fff;
        }

        .recap-signup .cc-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /*#endregion*/

        /*#region BIG*/

        .number-align {
          text-align: right;
        }

        table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
        }

        tr:nth-child(n+3) {
          border-top: 1px solid #e5e5e5;
        }

        th {
          background-color: #f6f6fb;
          padding: 1em 0.5em;
          text-align: left;
        }

        td {
          padding: 0.5em 0.5em;
          white-space: nowrap;
        }

        tr:hover td {
          background-color: #f5f5f5;
        }

        td.btn-col {
          padding: 0.25em 0.5em;
        }

        :host([w-gte-600]) .recap {
          grid-template-areas:
            "text contact signup"
            "total contact signup";
          grid-template-columns: 1fr min-content min-content;
        }

        :host([w-gte-600]) .recap-text,
        :host([w-gte-600]) .recap-total {
          justify-self: start;
        }

        :host([w-gte-600]) .recap-total {
          font-size: 2em;
        }

        :host([w-gte-600]) .cc-link {
          padding: 0.75em 1em;
        }

        /*#endregion*/

        /*#region SMALL*/

        .plan {
          align-items: center;
          border-top: 1px solid #e5e5e5;
          display: grid;
          gap: 0 1em;
          grid-template-columns: min-content [main-start] 1fr min-content [main-end];
          margin: 0;
          padding: 1em;
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

        :host([w-lt-600]) .recap {
          grid-template-areas:
            "text total"
            "contact signup";
          grid-template-columns: min-content min-content;
          justify-content: center;
        }

        :host([w-lt-600]) .recap-total {
          font-size: 1.5em;
        }

        :host([w-lt-600]) .cc-link {
          padding: 0.75em 1em;
        }

        /*#endregion*/
      `,
    ];
  }
}

window.customElements.define('cc-pricing-estimation', CcPricingEstimation);
