import '../atoms/cc-button.js';
import '../atoms/cc-img.js';
import '../atoms/cc-input-number.js';
import '../atoms/cc-toggle.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { PricingConsumptionSimulator } from '../lib/pricing.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';
import { skeletonStyles } from '../styles/skeleton.js';

const arrowsLeftSvg = new URL('../assets/arrows-left.svg', import.meta.url).href;
const arrowsRightSvg = new URL('../assets/arrows-right.svg', import.meta.url).href;
const downSvg = new URL('../assets/down.svg', import.meta.url).href;
const plusSvg = new URL('../assets/plus.svg', import.meta.url).href;
const storageSvg = new URL('../assets/storage.svg', import.meta.url).href;
const sumSvg = new URL('../assets/sum.svg', import.meta.url).href;
const upSvg = new URL('../assets/up.svg', import.meta.url).href;
const userSvg = new URL('../assets/user.svg', import.meta.url).href;

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };
const INFINITY = '∞';
const THIRTY_DAYS_IN_HOURS = 24 * 30;
const ONE_GIGABYTE = 1e9;

const ICONS = {
  storage: storageSvg,
  'inbound-traffic': arrowsRightSvg,
  'outbound-traffic': arrowsLeftSvg,
  'private-users': userSvg,
  'public-users': userSvg,
};

const SKELETON_NAME = '??????????';
const SKELETON_INTERVALS = [
  { minRange: 0, maxRange: 1e8, price: 0 },
  { minRange: 1e8, maxRange: 1e12, price: 0.0001 },
  { minRange: 1e12, maxRange: 1e13, price: 0.00001 },
  { minRange: 1e13, price: 0.000001 },
];

/**
 * A component to simulate pricing for products with consumption based pricings (Cellar, FS Buckets, Pulsar...).
 *
 * ## Details
 *
 * * Interval prices are defined in "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic.
 * * Interval ranges are defined in bytes.
 * * To comply with `<cc-pricing-product>`, the price in the event `cc-pricing-product:add-plan` is in "euros / 1 hour".
 * * When a section has a nullish `intervals`, a skeleton screen UI pattern is displayed for this section (loading hint).
 *
 * ## Progressive pricing system
 *
 * ### Not progressive (default)
 *
 * When a section is `progressive: false` (default):
 *
 * * The interval matching the total quantity is highlighted.
 * * We display a price only on the interval line matching the total quantity.
 * * We apply the price of the interval matching the total quantity to the total quantity.
 *
 * ### Progressive
 *
 * When a section is `progressive: true`:
 *
 * * Intervals are not highlighted.
 * * We display a price for each interval that match part of the total quantity.
 * * We apply the price of each interval to the quantity that fits in each respective interval.
 *
 * ## Secability system
 *
 * * If you need to apply your prices on batches/groups, something like "€2 per 100 users":
 *
 * * you need to set the secability to the size of your batch/group `secability: 100` in the section
 * * the interval prices are still per 1 so you will need to set `price: 0.02` in your intervals
 *
 * ## Type definitions
 *
 * ```js
 * interface Section {
 *   type: SectionType,
 *   progressive?: boolean, // defaults to false
 *   secability?: number, // defaults to 1
 *   intervals?: Interval[],
 * }
 * ```
 *
 * ```js
 *   type SectionType = "storage"|"inbound-traffic"|"outbound-traffic"|"private-users"|"public-users"
 * ```
 *
 * ```js
 * interface Interval {
 *   minRange: number, // byte
 *   maxRange: number, // byte
 *   price: number,    // "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic
 * }
 * ```
 *
 * ```js
 * interface Plan {
 *   productName: string,
 *   name: string,
 *   price: number, // "euros / 1 hour"
 *   features: Feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "max-db-size" | "memory" | "version",
 *   type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string",
 *   value?: number|string, // Only required for a plan feature
 * }
 * ```
 *
 * @cssdisplay block
 *
 * @prop {'add"|"none"} action - Sets the type of action: "add" to display the "add" button for the product and "none" for no actions (defaults to "add').
 * @prop {Boolean} error - Displays an error message.
 * @prop {String} icon - Sets the url of the product icon/logo image.
 * @prop {String} name - Sets the name of the product.
 * @prop {Section[]} sections - Sets the different sections with their `type` and `intervals`.
 *
 * @event {CustomEvent<Plan>} cc-pricing-product:add-plan - Fires the plan whenever the "add" button is clicked.
 *
 * @slot - The description of the product.
 * @slot head - Override the whole head section (with the icon, name and description).
 */
export class CcPricingProductConsumption extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      action: { type: String },
      currency: { type: Object },
      error: { type: Boolean, reflect: true },
      icon: { type: String },
      name: { type: String },
      sections: { type: Array },
      _size: { type: String },
      _state: { type: Object },
    };
  }

  constructor () {
    super();
    this.action = 'add';
    this.currency = CURRENCY_EUR;
    this.error = false;
    this._simulator = new PricingConsumptionSimulator();
    this._state = {};
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getTitle (type) {
    switch (type) {
      case 'storage':
        return i18n('cc-pricing-product-consumption.storage.title');
      case 'inbound-traffic':
        return i18n('cc-pricing-product-consumption.inbound-traffic.title');
      case 'outbound-traffic':
        return i18n('cc-pricing-product-consumption.outbound-traffic.title');
      case 'private-users':
        return i18n('cc-pricing-product-consumption.private-users.title');
      case 'public-users':
        return i18n('cc-pricing-product-consumption.public-users.title');
      case 'total':
        return i18n('cc-pricing-product-consumption.total.title');
    }
  }

  _getLabel (type) {
    switch (type) {
      case 'storage':
        return i18n('cc-pricing-product-consumption.storage.label');
      case 'inbound-traffic':
        return i18n('cc-pricing-product-consumption.inbound-traffic.label');
      case 'outbound-traffic':
        return i18n('cc-pricing-product-consumption.outbound-traffic.label');
      case 'private-users':
        return i18n('cc-pricing-product-consumption.private-users.label');
      case 'public-users':
        return i18n('cc-pricing-product-consumption.public-users.label');
    }
  }

  _getCurrencyValue (amount) {
    return {
      price: amount * this.currency.changeRate,
      code: this.currency.code,
    };
  }

  _getUnits () {
    return [
      {
        label: i18n('cc-pricing-product-consumption.bytes-unit', { bytes: 1e6 }),
        value: '1000000',
      },
      {
        label: i18n('cc-pricing-product-consumption.bytes-unit', { bytes: 1e9 }),
        value: '1000000000',
      },
      {
        label: i18n('cc-pricing-product-consumption.bytes-unit', { bytes: 1e12 }),
        value: '1000000000000',
      },
    ];
  }

  _isTypeBytes (type) {
    return ['storage', 'inbound-traffic', 'outbound-traffic'].includes(type);
  }

  _getMinRange (type, minRange) {
    return this._isTypeBytes(type)
      ? i18n('cc-pricing-product-consumption.bytes', { bytes: minRange })
      : minRange;
  }

  _getMaxRange (type, maxRange) {
    if (maxRange == null) {
      return INFINITY;
    }
    if (this._isTypeBytes(type)) {
      return i18n('cc-pricing-product-consumption.bytes', { bytes: maxRange });
    }
    return maxRange;
  }

  _getIntervalPrice (type, intervalPrice) {

    if (intervalPrice === 0) {
      return i18n('cc-pricing-product-consumption.price-interval.free');
    }

    // type bytes interval prices are specified for 1 byte but we want to display a unit price for 1 gigabyte
    return this._isTypeBytes(type)
      ? i18n('cc-pricing-product-consumption.price-interval.bytes', this._getCurrencyValue(intervalPrice * ONE_GIGABYTE))
      : i18n('cc-pricing-product-consumption.price-interval.users', {
        ...this._getCurrencyValue(intervalPrice),
        userCount: this.sections.find((s) => s.type === type).secability ?? 1,
      });
  }

  _updateSimulatorQuantity (type) {
    const quantity = this._state[type].quantity;
    const factor = this._isTypeBytes(type)
      ? parseInt(this._state[type].unitValue)
      : 1;
    this._simulator.setQuantity(type, quantity * factor);
  }

  _onToggleState (type) {
    this._state[type].isClosed = !this._state[type].isClosed;
    this.requestUpdate();
  }

  _onInputValue (type, quantity) {
    this._state[type].quantity = isNaN(quantity) ? 0 : quantity;
    this._updateSimulatorQuantity(type);
    this.requestUpdate();
  }

  _onToggleUnit (type, unitValue) {
    this._state[type].unitValue = unitValue;
    this._updateSimulatorQuantity(type);
    this.requestUpdate();
  }

  _onAddPlan () {

    const name = (this.sections ?? [])
      .map(({ type }) => {
        const title = this._getTitle(type);
        const quantity = this._isTypeBytes(type)
          ? i18n('cc-pricing-product-consumption.bytes', { bytes: this._simulator.getQuantity(type) })
          : i18n('cc-pricing-product-consumption.number', { number: this._simulator.getQuantity(type) });
        return `${title} ${quantity}`;
      })
      .join(', ');

    const plan = {
      productName: this.name,
      name,
      // As explained above, interval prices are expected to be in "euros / byte / 30 days" or just "euros / byte" for timeless sections like traffic
      // To comply with `<cc-pricing-product>`, the price in this event is in "euros / 1 hour"
      price: this._simulator.getTotalPrice() / THIRTY_DAYS_IN_HOURS,
    };

    dispatchCustomEvent(this, 'cc-pricing-product:add-plan', plan);
  }

  update (changedProperties) {
    if (changedProperties.has('sections') && Array.isArray(this.sections)) {

      this._state = {};
      this.sections.forEach(({ type }) => {
        this._state[type] = {
          // In small mode, sections are closed by default
          isClosed: true,
          // The number input is set to 0 by default
          quantity: 0,
          // The unit toggle is set to the first value by default
          unitValue: this._getUnits()[0].value,
        };
      });

      this._simulator = new PricingConsumptionSimulator(this.sections);
    }
    super.update(changedProperties);
  }

  render () {

    const someNullishIntervals = this.sections
      ?.some(({ intervals }) => intervals == null) ?? true;
    const everyQuantityAtZero = this.sections
      ?.map(({ type }) => this._simulator.getQuantity(type))
      ?.every((quantity) => quantity === 0) ?? true;

    const name = this.name ?? SKELETON_NAME;

    const bodyClasses = {
      'body--big': (this._size > 600),
      'body--small': (this._size <= 600),
    };

    return html`
      <slot name="head">
        <div class="head">
          <div class="head-info">
            <cc-img class="product-logo" src="${ifDefined(this.icon)}" ?skeleton=${this.icon == null}></cc-img>
            <div class="name-wrapper">
              <span class="name ${classMap({ skeleton: (this.name == null) })}">${name}</span>
            </div>
          </div>

          ${!this.error ? html`
            <slot></slot>
          ` : ''}
        </div>
        <hr>
      </slot>

      <div class="body ${classMap(bodyClasses)}">

        ${this.error && (this.sections == null) ? html`
          <cc-error class="error-global">${i18n('cc-pricing-product-consumption.error')}</cc-error>
          <hr>
        ` : ''}

        ${this.sections?.map((section) => html`
          ${this._renderSection(section)}
          <hr>
        `)}

        <div class="section">
          <div class="section-header">
            <cc-img class="section-icon" src=${sumSvg}></cc-img>
            <div class="section-title section-title--total">
              <div class="section-title-text">${this._getTitle('total')}</div>
              <div class="section-title-price">${i18n('cc-pricing-product-consumption.price', this._getCurrencyValue(this._simulator.getTotalPrice()))}</div>
            </div>
          </div>
        </div>

        <hr class="${classMap({ last: this.action === 'none' })}">

        ${(this.action === 'add') ? html`
          <div class="button-bar">
            <cc-button
              image=${plusSvg}
              ?disabled=${(someNullishIntervals || everyQuantityAtZero)}
              @cc-button:click=${this._onAddPlan}
            >${i18n('cc-pricing-product-consumption.add')}
            </cc-button>
          </div>
        ` : ''}

      </div>
    `;
  }

  /**
   * @param {Section} section
   */
  _renderSection (section) {

    const skeleton = (section.intervals == null);
    const intervals = section.intervals ?? SKELETON_INTERVALS;
    const progressive = section.progressive;

    const type = section.type;
    const icon = ICONS[type];
    const { isClosed, quantity, unitValue } = this._state[type];
    const sectionPrice = this._simulator.getSectionPrice(type);
    const maxInterval = this._simulator.getMaxInterval(type);

    return html`
      <div class="section ${classMap({ 'section--closed': isClosed })}">

        <div class="section-header">
          <cc-img class="section-icon" src=${icon}></cc-img>
          <div class="section-title">${this._getTitle(type)}</div>
          <cc-button
            class="section-toggle-btn"
            image=${isClosed ? downSvg : upSvg}
            ?disabled=${skeleton}
            hide-text
            circle
            @cc-button:click=${() => this._onToggleState(type)}
          ></cc-button>
        </div>

        <div class="input-wrapper">
          ${this._renderInput({ type, quantity, unitValue, skeleton })}
        </div>

        ${this._renderIntervals({ type, progressive, intervals, maxInterval, skeleton })}

        ${!this.error ? html`
          <div class="section-title section-title--subtotal">
            <div class="section-title-text">${i18n('cc-pricing-product-consumption.subtotal.title')}</div>
            <div class="section-title-price">
              <span class=${classMap({ skeleton })}>
                ${i18n('cc-pricing-product-consumption.price', this._getCurrencyValue(sectionPrice))}
              </span>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  /**
   * @param {SectionType} type
   * @param {Number} quantity
   * @param {Number} unitValue
   * @param {Boolean} skeleton
   */
  _renderInput ({ type, quantity, unitValue, skeleton }) {

    if (this._isTypeBytes(type)) {
      return html`
        <cc-input-number
          class="input-quantity"
          value=${quantity}
          min="0"
          ?disabled=${skeleton}
          @cc-input-number:input=${(e) => this._onInputValue(type, e.detail)}
        ></cc-input-number>
        <cc-toggle
          class="input-unit"
          value=${unitValue}
          .choices=${this._getUnits()}
          ?disabled=${skeleton}
          @cc-toggle:input=${(e) => this._onToggleUnit(type, e.detail)}
        ></cc-toggle>
      `;
    }
    else {
      return html`
        <cc-input-number
          class="input-quantity"
          value=${quantity}
          min="0"
          ?disabled=${skeleton}
          @cc-input-number:input=${(e) => this._onInputValue(type, e.detail)}
        ></cc-input-number>
      `;
    }
  }

  /**
   * @param {SectionType} type
   * @param {Interval[]} intervals
   * @param {Interval} maxInterval
   * @param {Boolean} skeleton
   */
  _renderIntervals ({ type, progressive, intervals, maxInterval, skeleton }) {

    if (this.error) {
      return html`
        <cc-error>${i18n('cc-pricing-product-consumption.error')}</cc-error>
      `;
    }

    return intervals.map((interval, intervalIndex) => {

      const maxIntervalIndex = intervals.indexOf(maxInterval);
      const foo = progressive && intervalIndex <= maxIntervalIndex;
      const highlighted = (interval === maxInterval || foo);

      const minRange = this._getMinRange(type, interval.minRange);
      const maxRange = this._getMaxRange(type, interval.maxRange);
      const intervalPrice = this._getIntervalPrice(type, interval.price);
      const estimatedPriceValue = this._simulator.getIntervalPrice(type, intervalIndex);
      const estimatedPrice = i18n('cc-pricing-product-consumption.price', this._getCurrencyValue(estimatedPriceValue));

      return html`
        <div class="interval-line ${classMap({ progressive, highlighted })}">
          <div class="interval interval-min">
            <span class="${classMap({ skeleton })}">${minRange}</span>
          </div>
          <div class="interval interval-min-sign">&le;</div>
          <div class="interval interval-label"> ${this._getLabel(type)}</div>
          <div class="interval interval-max-sign">&lt;</div>
          <div class="interval interval-max">
            <span class="${classMap({ skeleton })}">${maxRange}</span>
          </div>
          <div class="interval-price ${classMap({ 'interval-price--free': (interval.price === 0) })}">
            <span class="${classMap({ skeleton })}">${intervalPrice}</span>
          </div>
          <div class="estimated-price">
            <span class="${classMap({ skeleton })}">${estimatedPrice}</span>
          </div>
        </div>
      `;
    });
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

        /*region COMMON*/
        .head {
          border-radius: 0.25em;
          display: grid;
          gap: 1em;
          grid-auto-rows: min-content;
          padding: 1em 1em 0 1em;
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

        hr.last {
          margin-bottom: 0;
        }

        .section-icon {
          grid-column: section-icon / span 1;
          height: 1em;
          margin-right: 1em;
          width: 1em;
        }

        .section-title {
          display: flex;
          font-weight: bold;
          grid-column: title / title--end;
          justify-content: space-between;
        }

        .section-title.section-title--subtotal,
        .section-title.section-title--total {
          grid-column: title / title-total--end;
        }

        .section-title.section-title--subtotal {
          margin-top: 0.5em;
        }

        .section-title.section-title--subtotal .section-title-text {
          font-weight: normal;
        }

        .section-title-price {
          margin-left: 1em;
        }

        .input-wrapper {
          align-items: end;
          display: flex;
          grid-column: input-wrapper / input-wrapper--end;
          margin: 1em 0;
          width: 100%;
        }

        .input-quantity {
          flex: 1 1 0;
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

        cc-error.error-global {
          grid-column: start / end;
        }

        .interval-line {
          --bdrs: 5px;
        }

        .interval,
        .interval-price,
        .estimated-price {
          align-self: stretch;
          margin: 0.1em 0;
          padding-left: 0.25em;
          padding-top: 0.15em;
        }

        .interval,
        .interval-price {
          padding-bottom: 0.15em;
          padding-right: 0.25em;
        }

        .interval-line.highlighted:not(.progressive) .interval {
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
          grid-column: interval-price / interval-price--end;
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
          grid-column: start / end;
          margin-bottom: 1em;
        }

        .skeleton {
          background-color: #bbb;
        }

        /*endregion*/

        /*region BIG*/
        .body--big {
          grid-template-columns:
            1em
            [start section-icon] 2em
            [title input-wrapper interval-min] min-content
            [interval-min-sign] min-content
            [interval-label] min-content
            [interval-max-sign] min-content
            [interval-max] min-content
            [interval-price input-wrapper--end] min-content
            [estimated-price interval-price--end] min-content
            [title--end title-total--end] 1fr
            [end] 1em;
        }

        .body--big .section-title--subtotal {
          display: none;
        }

        .body--big .section-toggle-btn {
          display: none;
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

        /*endregion*/

        /*region SMALL*/
        .body--small {
          grid-template-columns:
            1em
            [start section-icon] 2em
            [title input-wrapper interval-min interval-price] min-content
            [interval-min-sign] min-content
            [interval-label] min-content
            [interval-max-sign] min-content
            [interval-max toggle-btn title--end] min-content
            [input-wrapper--end interval-price--end title-total--end] 1fr
            [end] 1em;
        }

        .body--small .section-toggle-btn {
          grid-column: toggle-btn / end;
          justify-self: end;
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
          margin-bottom: 1em;
        }

        .body--small .estimated-price {
          display: none;
        }

        /*endregion*/
      `,
    ];
  }
}

window.customElements.define('cc-pricing-product-consumption', CcPricingProductConsumption);
