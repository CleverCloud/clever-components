import '../atoms/cc-button.js';
import '../molecules/cc-error.js';
import '../atoms/cc-img.js';
import '../atoms/cc-input-number.js';
import '../atoms/cc-toggle.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { skeletonStyles } from '../styles/skeleton.js';

const arrowsSvg = new URL('../assets/arrows.svg', import.meta.url).href;
const storageSvg = new URL('../assets/storage.svg', import.meta.url).href;
const sumSvg = new URL('../assets/sum.svg', import.meta.url).href;
const downSvg = new URL('../assets/down.svg', import.meta.url).href;
const plusSvg = new URL('../assets/plus.svg', import.meta.url).href;
const upSvg = new URL('../assets/up.svg', import.meta.url).href;

const CELLAR_NAME = 'Cellar';
const CELLAR_ICON = 'https://static-assets.cellar.services.clever-cloud.com/logos/cellar.svg';

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };
const INFINITY = '∞';
const ONE_GIGABYTE = 1e9;
const THIRTY_DAYS_IN_HOURS = 24 * 30;

const SKELETON_STORAGE_INTERVALS = [
  { minRange: 0, maxRange: 1e8, price: 0 },
  { minRange: 1e8, maxRange: 1e12, price: 0.0001 },
  { minRange: 1e12, maxRange: 1e13, price: 0.00001 },
  { minRange: 1e13, price: 0.000001 },
];
const SKELETON_TRAFFIC_INTERVALS = [
  { minRange: 0, maxRange: 1e13, price: 0.0001 },
  { minRange: 1e13, price: 0.00001 },
];

/**
 * A component to display information and do a pricing simulation of the Cellar product.
 *
 * ## Type definitions
 *
 * ```js
 * interface CellarIntervals {
 *   storage: Interval[],
 *   traffic: Interval[],
 * }
 * ```
 *
 * ```js
 * interface Interval {
 *   maxRange: number,
 *   minRange: number,
 *   price: number, // For storage: €/GB/Hour, For outbound traffic : €/GB
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "max-db-size" | "memory" | "version",
 *   type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string",
 *   value?: number|string, // Only required for an item feature
 * }
 * ```
 *
 * ```js
 * interface Item {
 *   name: string,
 *   price: number, // price in euros for 1 hour
 *   features: Feature[],
 * }
 * ```
 *
 * ```js
 * interface Product {
 *   name: string,
 *   item: Item,
 * }
 * ```
 *
 * @cssdisplay block
 *
 * @prop {"add"|"none"} action - Sets the type of action: "add" to display the "add" button for the product and "none" for no actions (defaults to "add").
 * @prop {Boolean} error - Displays an error message.
 * @prop {CellarIntervals} intervals - Sets the storage and traffic information needed to render the intervals.
 *
 * @event {CustomEvent<Product>} cc-pricing-product:add-product - Fires the product whenever the "add" button is clicked.
 *
 * @slot - The description of the cellar product.
 * @slot head - Override the whole head section (with the icon, name and description).
 */
export class CcPricingProductCellar extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      action: { type: String },
      currency: { type: Object },
      error: { type: Boolean, reflect: true },
      intervals: { type: Object },
      _size: { type: String },
      _storageInterval: { type: Number },
      _storagePrice: { type: Number },
      _storageSectionClosed: { type: Boolean },
      _storageUnitValue: { type: Number },
      _totalPrice: { type: Number },
      _trafficInterval: { type: Number },
      _trafficPrice: { type: Number },
      _trafficSectionClosed: { type: Boolean },
      _trafficUnitValue: { type: Number },
    };
  }

  constructor () {
    super();
    this.action = 'add';
    this.currency = CURRENCY_EUR;
    this.error = false;
    this._storagePrice = 0;
    this._storageQuantity = 0;
    this._storageSectionClosed = true;
    this._storageUnitValue = '1000000';
    this._totalPrice = 0;
    this._trafficPrice = 0;
    this._trafficQuantity = 0;
    this._trafficSectionClosed = true;
    this._trafficUnitValue = '1000000';
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getUnits () {
    return [
      {
        label: i18n('cc-pricing-product-cellar.bytes-unit', { bytes: 1e6 }),
        value: '1000000',
      },
      {
        label: i18n('cc-pricing-product-cellar.bytes-unit', { bytes: 1e9 }),
        value: '1000000000',
      },
      {
        label: i18n('cc-pricing-product-cellar.bytes-unit', { bytes: 1e12 }),
        value: '1000000000000',
      },
    ];
  }

  _getTotal () {
    return this._storagePrice + this._trafficPrice;
  }

  _updatePrice (priceCategory) {
    if (priceCategory === 'storage') {
      const storageValueBytes = this._storageQuantity * parseInt(this._storageUnitValue);
      const storageValueGigabytes = (storageValueBytes / ONE_GIGABYTE);
      this._storageInterval = this.intervals.storage.find((interval) => {
        return storageValueBytes >= interval.minRange && storageValueBytes < (interval?.maxRange ?? Infinity);
      });
      this._storagePrice = this._storageInterval.price * THIRTY_DAYS_IN_HOURS * storageValueGigabytes;
    }
    else {
      const trafficValueBytes = this._trafficQuantity * parseInt(this._trafficUnitValue);
      const trafficValueGigabytes = (trafficValueBytes / ONE_GIGABYTE);
      this._trafficInterval = this.intervals.traffic.find((interval) => {
        return trafficValueBytes >= interval.minRange && trafficValueBytes < (interval?.maxRange ?? Infinity);
      });
      this._trafficPrice = this._trafficInterval.price * trafficValueGigabytes;
    }
    this._totalPrice = this._getTotal();
  }

  _onAddItem () {
    const storageBytes = this._storageQuantity * parseInt(this._storageUnitValue);
    const trafficBytes = this._trafficQuantity * parseInt(this._trafficUnitValue);
    const name = this.name;
    const item = {
      name: i18n('cc-pricing-product-cellar.product-item-name', { storageBytes, trafficBytes }),
      price: this._getTotal() / THIRTY_DAYS_IN_HOURS,
    };
    dispatchCustomEvent(this, 'cc-pricing-product:add-product', { name, item });
  }

  _onInputValue (section, quantity) {
    if (section === 'storage') {
      this._storageQuantity = (isNaN(quantity) || quantity <= 0) ? 0 : quantity;
    }
    else {
      this._trafficQuantity = (isNaN(quantity) || quantity <= 0) ? 0 : quantity;
    }
    this._updatePrice(section);
  }

  _onToggleUnit (section, unit) {
    if (section === 'storage') {
      this._storageUnitValue = unit;
    }
    else {
      this._trafficUnitValue = unit;
    }
    this._updatePrice(section);
  }

  _onToggleState (section) {
    if (section === 'storage') {
      this._storageSectionClosed = !this._storageSectionClosed;
    }
    else {
      this._trafficSectionClosed = !this._trafficSectionClosed;
    }
  }

  /**
   * @param {"storage"|"traffic"} section
   * @param {string} label
   * @param {number} price
   * @param {Interval[]} intervals
   * @param {Interval} currentInterval
   * @param {boolean} skeleton
   */
  _renderIntervals ({ section, label, estimatedPrice, intervals, currentInterval, skeleton }) {

    if (this.error) {
      return html`
        <cc-error>${i18n('cc-pricing-product-cellar.error')}</cc-error>
      `;
    }

    const intervalsWithState = intervals.map((interval) => {
      // Storage prices are in €/GB/Hour while outbound traffic prices are simply in €/GB
      const price = (section === 'storage')
        ? interval.price * THIRTY_DAYS_IN_HOURS
        : interval.price;
      return {
        interval: { ...interval, price },
        highlighted: interval === currentInterval,
      };
    });

    return intervalsWithState.map(({ interval, highlighted }) => html`
      <div class="interval-line ${classMap({ highlighted })}">

        <div class="interval interval-min">
          <span class="${classMap({ skeleton })}">
            ${i18n('cc-pricing-product-cellar.bytes', { bytes: interval.minRange })}
          </span>
        </div>
        <div class="interval interval-min-sign">&le;</div>
        <div class="interval interval-label"> ${label}</div>
        <div class="interval interval-max-sign">&lt;</div>
        <div class="interval interval-max">
          <span class="${classMap({ skeleton })}">
            ${(interval.maxRange != null) ? i18n('cc-pricing-product-cellar.bytes', { bytes: interval.maxRange }) : INFINITY}
          </span>
        </div>

        <div class="interval-price ${classMap({ 'interval-price--free': (interval.price === 0) })}">
          <span class="${classMap({ skeleton })}">
            ${(interval.price === 0)
              ? i18n('cc-pricing-product-cellar.price-interval.free')
              : i18n('cc-pricing-product-cellar.price-interval', {
                price: interval.price * this.currency.changeRate,
                code: this.currency.code,
              })
            }
          </span>
        </div>

        <div class="estimated-price">
          <span class="${classMap({ skeleton })}">
            ${i18n('cc-pricing-product-cellar.price', {
              price: estimatedPrice * this.currency.changeRate,
              code: this.currency.code,
            })}
          </span>
        </div>

      </div>
    `);
  }

  /**
   * @param {"storage"|"traffic"} section
   * @param {string} title
   * @param {string} label
   * @param {string} icon
   * @param {boolean} isSectionClosed
   * @param {number} unitValue
   * @param {number} quantity
   * @param {number} estimatedPrice
   * @param {Inteval[]} intervals
   * @param {Inteval} currentInterval
   * @param {boolean} skeleton
   */
  _renderSection ({
    section,
    title,
    label,
    icon,
    isSectionClosed,
    unitValue,
    quantity,
    estimatedPrice,
    intervals,
    currentInterval,
    skeleton,
  }) {
    return html`
      <div class="section ${classMap({ 'section--closed': isSectionClosed })}">

        <div class="section-header">
          <cc-img class="section-icon" src=${icon}></cc-img>
          <div class="section-title">${title}</div>
          <cc-button
            class="section-toggle-btn"
            image=${isSectionClosed ? downSvg : upSvg}
            ?disabled=${skeleton}
            hide-text
            circle
            @cc-button:click=${() => this._onToggleState(section)}
          ></cc-button>
        </div>

        <div class="input-wrapper">
          <cc-input-number
            class="input-quantity"
            value=${quantity}
            min="0"
            ?disabled=${skeleton}
            @cc-input-number:input=${(e) => this._onInputValue(section, e.detail)}
          ></cc-input-number>
          <cc-toggle
            class="input-unit"
            value=${unitValue}
            .choices=${this._getUnits()}
            ?disabled=${skeleton}
            @cc-toggle:input=${(e) => this._onToggleUnit(section, e.detail)}
          ></cc-toggle>
        </div>

        ${this._renderIntervals({ section, label, estimatedPrice, intervals, currentInterval, skeleton })}

        ${!this.error ? html`
          <div class="estimated-price estimated-price--subtotal">
            <span class=${classMap({ skeleton })}>
              ${i18n('cc-pricing-product-cellar.price', { price: estimatedPrice, code: this.currency.code })}
            </span>
          </div>
        ` : ''}

      </div>
    `;
  }

  update (changedProperties) {
    if (changedProperties.has('intervals')) {
      this._updatePrice('storage');
      this._updatePrice('traffic');
    }
    super.update(changedProperties);
  }

  render () {

    const skeleton = (this.intervals == null);

    const bodyClasses = {
      'body--big': (this._size > 600),
      'body--small': (this._size <= 600),
    };

    return html`
      <slot name="head">
        <div class="head">
          <div class="head-info">
            <cc-img class="product-logo" src="${CELLAR_ICON}"></cc-img>
            <div class="name-wrapper">
              <span class="name">${CELLAR_NAME}</span>
            </div>
          </div>

          ${!this.error ? html`
            <slot></slot>
          ` : ''}
        </div>
      </slot>

      <div class="body ${classMap(bodyClasses)}">

        <hr>

        ${this._renderSection({
          section: 'storage',
          title: i18n('cc-pricing-product-cellar.storage.title'),
          label: i18n('cc-pricing-product-cellar.storage.label'),
          icon: storageSvg,
          isSectionClosed: this._storageSectionClosed,
          quantity: this._storageQuantity,
          unitValue: this._storageUnitValue,
          estimatedPrice: this._storagePrice,
          intervals: skeleton ? SKELETON_STORAGE_INTERVALS : this.intervals.storage,
          currentInterval: this._storageInterval,
          skeleton,
        })}

        <hr>

        ${this._renderSection({
          section: 'traffic',
          title: i18n('cc-pricing-product-cellar.traffic.title'),
          label: i18n('cc-pricing-product-cellar.traffic.label'),
          icon: arrowsSvg,
          isSectionClosed: this._trafficSectionClosed,
          quantity: this._trafficQuantity,
          unitValue: this._trafficUnitValue,
          estimatedPrice: this._trafficPrice,
          intervals: skeleton ? SKELETON_TRAFFIC_INTERVALS : this.intervals.traffic,
          currentInterval: this._trafficInterval,
          skeleton,
        })}

        <hr>

        <div class="section">
          <div class="section-header section-header--total">
            <cc-img class="section-icon" src=${sumSvg}></cc-img>
            <div class="section-title">${i18n('cc-pricing-product-cellar.total.title')}</div>
            <div class="estimated-price estimated-price--total">
              <span class=${classMap({ skeleton })}>
                ${i18n('cc-pricing-product-cellar.price', {
                  price: this._totalPrice * this.currency.changeRate, code: this.currency.code,
                })}
              </span>
            </div>
          </div>
        </div>

        <hr>

        ${(this.action === 'add') ? html`
          <div class="button-bar">
            <cc-button
              image=${plusSvg}
              ?disabled=${(this._storageQuantity <= 0 && this._trafficQuantity <= 0) || skeleton || this.error}
              @cc-button:click=${this._onAddItem}
            >${i18n('cc-pricing-product-cellar.add')}
            </cc-button>
          </div>
        ` : ''}

      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          background-color: #fff;
          display: block;
        }

        :host([error]) {
          --cc-skeleton-state: paused;
        }

        .head {
          border-radius: 0.25em;
          display: grid;
          gap: 1em;
          grid-auto-rows: min-content;
        }

        /* We cannot use cc-flex-gap because of a double slot */
        .head-info {
          display: flex;
          flex-wrap: wrap;
          /* reset gap for browsers that support gap for flexbox */
          gap: 0;
          margin: -0.5em;
        }

        .product-logo,
        slot[name="icon"]::slotted(*),
        .name-wrapper {
          margin: 0.5em;
        }

        .product-logo,
        slot[name=icon]::slotted(*) {
          --cc-img-fit: contain;
          border-radius: 0.25em;
          display: block;
          height: 3em;
          width: 3em;
        }

        .name-wrapper {
          align-self: center;
          font-weight: bold;
        }

        .name {
          font-size: 1.5em;
        }

        /* Slotted description */
        .description {
          line-height: 1.5;
        }

        .body {
          align-items: center;
          display: grid;
          overflow: visible;
          white-space: nowrap;
        }

        /* these elements could be removed but they help the readability of the whole template in source code and browser devtools */
        .section,
        .section-header,
        .interval-line {
          display: contents;
        }

        hr {
          border-color: #e5e5e5;
          border-style: solid;
          border-width: 1px 0 0 0;
          grid-column: 1 / -1;
          margin: 1em 0;
          width: 100%;
        }

        .section-icon {
          grid-column: section-icon / span 1;
          height: 1em;
          margin-right: 1em;
          width: 1em;
        }

        .section-title {
          font-weight: bold;
          grid-column: interval-min / -2;
        }

        .input-wrapper {
          align-items: end;
          display: flex;
          margin: 1em 0;
          width: 100%;
        }

        .input-quantity {
          min-width: 10ch;
        }

        .input-unit {
          --cc-text-transform: none;
          margin-left: 0.5em;
        }

        cc-error {
          grid-column: interval-min / end;
          line-height: 1.5;
          white-space: normal;
        }

        .interval-line {
          --bdrs: 5px;
        }

        .interval,
        .interval-price,
        .estimated-price {
          align-self: stretch;
          margin: 0.1em 0;
          padding: 0.15em 0.25em;
        }

        .interval-line.highlighted .interval {
          background-color: rgba(50, 50, 255, 0.15);
        }

        .interval-min,
        .interval-max,
        .interval-price {
          text-align: right;
        }

        .interval-min {
          border-radius: var(--bdrs) 0 0 var(--bdrs);
          grid-column: interval-min / span 1;
        }

        .interval-label {
          text-align: center;
        }

        .interval-price {
          color: #333;
          font-style: italic;
        }

        .interval-max {
          border-radius: 0 var(--bdrs) var(--bdrs) 0;
        }

        .estimated-price {
          font-weight: bold;
          text-align: right;
        }

        .interval-line:not(.highlighted) .estimated-price {
          visibility: hidden;
        }

        .button-bar {
          grid-column: 1 / -1;
        }

        .skeleton {
          background-color: #bbb;
        }

        /* BIG */

        .body--big {
          grid-template-columns:
            [section-icon] min-content
            [interval-min] min-content
            [interval-min-sign] min-content
            [interval-label] min-content
            [interval-max-sign] min-content
            [interval-max] min-content
            [interval-price] min-content
            [estimated-price] min-content
            [end];
        }

        .body--big .section-toggle-btn {
          display: none;
        }

        .body--big .input-wrapper {
          grid-column: interval-min / interval-price;
        }

        .body--big .interval-label {
          text-align: center;
        }

        .body--big .interval-price {
          margin-left: 2em;
        }

        .body--big .estimated-price {
          grid-column: estimated-price / span 1;

          margin-left: 2em;
        }

        .body--big .estimated-price--subtotal {
          display: none;
        }

        /* SMALL */

        .body--small {
          grid-template-columns:
            [section-icon] min-content
            [interval-min] min-content
            [interval-min-sign] min-content
            [interval-label] min-content
            [interval-max-sign] min-content
            [interval-max] min-content
            [toggle-btn] 1fr
            [end];
        }

        .body--small .section-toggle-btn {
          justify-self: end;
        }

        .body--small .input-wrapper {
          grid-column: interval-min / toggle-btn;
        }

        .body--small .section--closed .input-wrapper {
          margin-bottom: 0.5em;
        }

        .body--small .section--closed .interval,
        .body--small .section--closed .interval-price {
          height: 0;
          margin-bottom: 0;
          margin-top: 0;
          padding-bottom: 0;
          padding-top: 0;
          visibility: hidden;
        }

        .body--small .interval-price {
          grid-column: interval-min / toggle-btn;
          margin-bottom: 1em;
        }

        .body--small .interval-line .estimated-price {
          display: none;
        }

        .body--small .estimated-price--subtotal {
          grid-column: section-icon / toggle-btn;
          margin-top: 0.5em;
        }

        .body--small .section-header--total {
          align-items: center;
          display: flex;
          grid-column: section-icon / toggle-btn;
        }

        .body--small .estimated-price--total {
          flex: 1 1 0;
          margin: 0 0 0 1em;
          padding-bottom: 0;
          padding-top: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-product-cellar', CcPricingProductCellar);
