import '../atoms/cc-button.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

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
 *     productName: string,
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
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="/src/assets/circle.svg" style="height: 1.5rem"> | <code>circle.svg</code>
 * | <img src="/src/assets/minus.svg" style="height: 1.5rem"> | <code>minus.svg</code>
 *
 * @prop {Zone} selectedZone - Sets the zone selected for the items.
 * @prop {Array<Zone>} zones - Sets all the zone.
 * @prop {Array<Product>} selectedProducts - Sets the products selected from the user in the page.
 * @prop {String} currency - Sets the current currency code.
 *
 * @event {CustomEvent<ExampleInterface>} cc-pricing-estimation:change-quantity - Fires XXX whenever YYY.
 *
 */
export class CcPricingEstimation extends withResizeObserver(LitElement) {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      selectedProducts: { type: Object },
      currency: { type: Object },
      _size: { type: String },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this.selectedProducts = {};
    this._totalPrice = 0;
    this.breakpoints = {
      width: [600],
    };
    // this.currency = 'EUR';
    this.currency = { code: 'EUR', changeRate: 1 };
  }

  onResize ({ width }) {
    this._size = width;
    console.log(this._size);
  }

  _renderSmallSelProduct () {
    return Object
      .values(this.selectedProducts)
      .map((product) => {
        return (product !== null)
          ? html`
              <div class="plan">
                 <div class="head-separator"></div> 
                  <div class="qt-btn">
                  <div class="add-item">
                      <button class="change-qt-btn" @click=${() => this._onChangeQuantity(product, 'add')}>
                          <img src=${new URL('../assets/circle.svg', import.meta.url).href} />
                      </button>
                  </div>
                  <div class="remove-item">
                      <button class="change-qt-btn" @click=${() => this._onChangeQuantity(product, 'remove')}>
                          <img src=${new URL('../assets/minus.svg', import.meta.url).href} />
                      </button>
                  </div>
                  </div>
                  <div class="plan-name">${product.name}</div>
                  <div class="plan-infos">
                  <div class="feature">
                      <div class="name">${i18n('cc-pricing-estimation.size')}</div>
                      <div>${product.item.name}</div>
                  </div> 
                  <div class="feature">
                      <div class="name">${i18n('cc-pricing-estimation.quantity')}</div>
                      <div class="number-align">${product.quantity}</div>
                  </div>
                  <div class="feature">
                      <div class="name">${i18n('cc-pricing-estimation.price-name-daily')}</div>
                      <div class="number-align">
                          ${i18n('cc-pricing-table.price', {
                              price: (product.item.price.daily * product.quantity) * this.currency.changeRate,
                              code: this.currency.code,
                          })}
                      </div>
                  </div>
                  <div class="feature">
                      <div class="name">${i18n('cc-pricing-estimation.price-name-monthly')}</div>
                      <div class="number-align">
                          ${i18n('cc-pricing-table.price', {
                              price: (product.item.price.monthly * product.quantity) * this.currency.changeRate,
                              code: this.currency.code,
                          })}
                  </div>
                  </div>
              </div> 
               `
          : '';
      });
  }

  _renderBigSelProducts () {
    return Object.values(this.selectedProducts).map((product) => {
      return (product !== null)
        ? html`
        <tr>
            <td>
                <button class="change-qt-btn" @click=${() => this._onChangeQuantity(product, 'add')}>
                    <img src=${new URL('../assets/circle.svg', import.meta.url).href} />
                </button>
                <button class="change-qt-btn" @click=${() => this._onChangeQuantity(product, 'remove')}>
                    <img src=${new URL('../assets/minus.svg', import.meta.url).href} />
                </button>

            </td>
            <td>${product.name}</td>
            <td>${product.item.name}</td>
            <td>${product.quantity}</td>
            <td class="price-item">${i18n('cc-pricing-table.price', {
                 price: (product.item.price.daily * product.quantity) * this.currency.changeRate,
                 code: this.currency.code,
             })}
            </td>
            <td class="price-item">${i18n('cc-pricing-table.price', {
                 price: (product.item.price.monthly * product.quantity) * this.currency.changeRate,
                 code: this.currency.code,
             })}
            </td>
        </tr>`
        : '';
    });
  }

  // TODO: put this in a separate lib
  _getTotalPrice () {
    let totalPrice = 0;
    for (const p of Object.values(this.selectedProducts)) {
      if (p != null) {
        totalPrice += (p.item.price.monthly * p.quantity) * this.currency.changeRate;
      }
    }
    return totalPrice;
  }

  _onChangeQuantity (product, action) {
    if (action === 'remove') {
      dispatchCustomEvent(this, 'change-quantity', { ...product, quantity: product.quantity - 1 });
    }
    else if (action === 'add') {
      dispatchCustomEvent(this, 'change-quantity', { ...product, quantity: product.quantity + 1 });
    }
  }

  _renderSmallEstimation () {
    return (Object.values(this.selectedProducts).length !== 0)
      ? html`
            <div class="container">
                ${this._renderSmallSelProduct()}
            </div>
            `
      : '';
  }

  _renderBigEstimation () {
    return html`
         <table>
            <tr>
                <th></th>
                <th>${i18n('cc-pricing-estimation.product')}</th>
                <th>${i18n('cc-pricing-estimation.size')}</th>
                <th>${i18n('cc-pricing-estimation.quantity')}</th>
                <th>${i18n('cc-pricing-estimation.price-name-daily')}</th>
                <th>${i18n('cc-pricing-estimation.price-name-monthly')}</th>
            </tr>
                ${this._renderBigSelProducts()}
         </table> 
      `;
  }

  render () {
    return html`
            ${(this._size > 600)
                    ? this._renderBigEstimation()
                    : this._renderSmallEstimation()
            }

            <div class="recap">
                <div class="monthly-est">${i18n('cc-pricing-estimation.monthly-est')}:</div>
                <div class="cost-price">
                    ${i18n('cc-pricing-estimation.price', { price: this._getTotalPrice(), code: this.currency.code })}
                </div>
                <div class="recap-buttons">
                    <button class="contact-sales">${i18n('cc-pricing-estimation.sales')}</button>
                    <button class="sign-up">${i18n('cc-pricing-estimation.sign-up')}</button>
                </div>
            </div>
        `;
  }

  // DOCS: 11. LitElement's styles descriptor

  static get styles () {
    return [
      // language=CSS
      css`
                :host {
                    display: block;
                }

                /* Table properties for big screen size */

                table {
                    border-collapse: collapse;
                    border-spacing: 0;
                    box-shadow: 0 0 0.5rem #aaa;
                    width: 100%;
                }

                th {
                    height: 4rem;
                }

                th {
                    background-color: #f6f6fb;
                    text-shadow: 1px 1px 1px #fff;
                }

                tr:nth-child(n+3) {
                    border-top: 0.1rem solid #e5e5e5;
                }

                td {
                    padding: 1rem;
                }

                /* Properties for small screen size */

                .container {
                    box-shadow: 0 0 0.5rem #aaa;
                }
                
                .plan {
                    display: grid;
                    grid-gap: 0.25rem;
                    grid-template-areas:
                            "h-separator h-separator h-separator"
                            "add-btn plan-name x"
                             "txt txt txt";
                    padding: 0.25rem;
                }


                .head-separator {
                    grid-area: h-separator;
                }
                
                .plan:not(:first-child) .head-separator {
                    border-bottom: 0.10rem solid #e5e5e5;
                }                
                .qt-btn {
                    align-self: start;
                    display:flex;
                    grid-area: add-btn;
                    justify-self: start;
                }

                .remove-item {
                    align-self: start;
                    grid-area: remove-btn;
                    justify-self: start; 
                }
               
                .plan .plan-infos {
                    display: flex;
                    flex-wrap: wrap;
                    grid-area: txt;
                    padding: 0.5rem;
                }

                .plan-name {
                    align-self: center;
                    font-style: italic;
                    font-weight: bold;
                    grid-area: plan-name;
                }

                .plan .plan-name {
                    justify-self: start;
                }

                .feature {
                    display: flex;
                    justify-content: space-between;
                }

                /*.feature:not(:first-child) {*/
                /*    border-top: 1px solid #e5e5e5;*/
                /*}*/

                .plan .feature {
                    border: none;
                    display: contents;
                }

                .name {
                    font-weight: bold;
                }

                .plan .name {
                    flex-wrap: wrap;
                    font-weight: normal;
                }

                .plan .name::after {
                    content: ':';
                    padding-right: 0.25rem;
                }

                .plan .feature:not(:last-child) .value::after {
                    content: ',';
                    padding-right: 0.5rem;
                }

                .plan-add {
                    margin-bottom: 0.25rem;
                    padding: 0.25rem;
                }

                /* Global properties */

                .number-align {
                    text-align: right;
                }

                .add-item-btn {
                    background: transparent;
                    border: none;
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
