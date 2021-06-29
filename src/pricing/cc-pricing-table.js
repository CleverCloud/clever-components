import '../atoms/cc-button.js';
import '../atoms/cc-img.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

const downSvg = new URL('../assets/down.svg', import.meta.url).href;
const plusSvg = new URL('../assets/plus.svg', import.meta.url).href;
const upSvg = new URL('../assets/up.svg', import.meta.url).href;

const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };

const FEATURES_I18N = {
  'connection-limit': () => i18n('cc-pricing-table.feature.connection-limit'),
  cpu: () => i18n('cc-pricing-table.feature.cpu'),
  databases: () => i18n('cc-pricing-table.feature.databases'),
  'disk-size': () => i18n('cc-pricing-table.feature.disk-size'),
  gpu: () => i18n('cc-pricing-table.feature.gpu'),
  'has-logs': () => i18n('cc-pricing-table.feature.has-logs'),
  'has-metrics': () => i18n('cc-pricing-table.feature.has-metrics'),
  'max-db-size': () => i18n('cc-pricing-table.feature.max-db-size'),
  memory: () => i18n('cc-pricing-table.feature.memory'),
  version: () => i18n('cc-pricing-table.feature.version'),
};
const AVAILABLE_FEATURES = Object.keys(FEATURES_I18N);
const NUMBER_FEATURE_TYPES = ['bytes', 'number', 'number-cpu-runtime'];

/**
 * A component to display product informations: items (plans) and features.
 *
 * ## Details
 *
 * * The items are sorted by price.
 * * If an item has a feature that is not listed in features, it will be ignored.
 * * If a feature has a code that is not supported, it will be ignored.
 *
 * ## Type definitions
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
 * interface Feature {
 *   code: "connection-limit" | "cpu" | "databases" | "disk-size" | "gpu" | "has-logs" | "has-metrics" | "max-db-size" | "memory" | "version",
 *   type: "boolean" | "shared" | "bytes" | "number" | "runtime" | "string",
 *   value?: number|string, // Only required for an item feature
 * }
 * ```
 *
 * ```js
 * interface Currency {
 *   code: string,
 *   changeRate: number, // based on euros
 * }
 * ```
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="../assets/down.svg" style="height: 1.5rem; vertical-align: middle"> | <code>down.svg</code>
 * | <img src="../assets/plus.svg" style="height: 1.5rem; vertical-align: middle"> | <code>plus.svg</code>
 * | <img src="../assets/up.svg" style="height: 1.5rem; vertical-align: middle"> | <code>up.svg</code>
 *
 * @cssdisplay block
 *
 * @prop {"add"|"none"} action - Sets the type of action: "add" to display add buttons for each item and "none" for no actions (defaults to "add").
 * @prop { Currency } currency - Sets the currency used to display the prices (defaults to euros).
 * @prop { Array<Feature> } features - Sets the list of features (used for the feature sort order).
 * @prop { Array<Item> } items - Sets the list of items.
 *
 * @event {CustomEvent<Item>} cc-pricing-table:add-item - Fires the item whenever the "plus" button of an item is clicked.
 */
export class CcPricingTable extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      action: { type: String, reflect: true },
      currency: { type: Object },
      features: { type: Array },
      items: { type: Array },
      _features: { type: Array },
      _items: { type: Array },
      _size: { type: String },
    };
  }

  constructor () {
    super();
    this.action = 'add';
    this._items = [];
    this._features = [];
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getFeatureName (feature) {
    if (feature != null && FEATURES_I18N[feature.code] != null) {
      return FEATURES_I18N[feature.code]();
    }
  }

  _getFeatureValue (feature) {
    if (feature == null) {
      return '';
    }
    switch (feature.type) {
      case 'boolean':
        return i18n('cc-pricing-table.type.boolean', { boolean: feature.value === 'true' });
      case 'boolean-shared':
        return i18n('cc-pricing-table.type.boolean-shared', { boolean: feature.value === 'shared' });
      case 'bytes':
        return (feature.code === 'memory' && feature.value === '0')
          ? i18n('cc-pricing-table.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-table.type.bytes', { bytes: Number(feature.value) });
      case 'number':
        return (feature.code === 'cpu' && feature.value === '0')
          ? i18n('cc-pricing-table.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-table.type.number', { number: Number(feature.value) });
      case 'number-cpu-runtime':
        return i18n('cc-pricing-table.type.number-cpu-runtime', {
          cpu: feature.value.cpu,
          shared: feature.value.shared,
        });
      case 'string':
        return feature.value;
    }
  }

  _getDailyPrice (hourlyPrice) {
    const currency = this.currency || CURRENCY_EUR;
    const price = hourlyPrice * 24 * currency.changeRate;
    return i18n('cc-pricing-table.price', { price, code: currency.code });
  }

  // "monthly" being 30 days
  _getMonthlyPrice (hourlyPrice) {
    const currency = this.currency || CURRENCY_EUR;
    const price = hourlyPrice * 24 * 30 * currency.changeRate;
    return i18n('cc-pricing-table.price', { price, code: currency.code });
  }

  _renderSmallItems () {
    return html`
      <div class="container">
        ${this._items.map((item) => html`
          <div class="plan" data-state=${item.state}>

            ${this.action === 'add' ? html`
              <cc-button
                class="add-item-btn"
                image=${plusSvg}
                hide-text
                circle
                @cc-button:click=${() => this._onAddItem(item)}
              >${i18n('cc-pricing-table.add-button')}
              </cc-button>
            ` : ''}

            <div class="plan-name">${item.name}</div>

            <cc-button
              image=${item.state === 'closed' ? downSvg : upSvg}
              hide-text
              circle
              @cc-button:click=${() => this._onToggleState(item)}
            ></cc-button>

            <div class="feature-list">
              ${this._renderSmallItemFeatures(item.features)}
            </div>

            <div class="feature-list">
              <div class="feature">
                <div class="feature-name">${i18n('cc-pricing-table.price-name-daily')}</div>
                <div class="feature-value">${this._getDailyPrice(item.price)}</div>
              </div>
              <div class="feature">
                <div class="feature-name">${i18n('cc-pricing-table.price-name-monthly')}</div>
                <div class="feature-value">${this._getMonthlyPrice(item.price)}</div>
              </div>
            </div>

          </div>
        `)}
      </div>
    `;
  }

  _renderSmallItemFeatures (itemFeatures) {
    return this._features.map((feature) => {
      const currentFeature = itemFeatures.find((itemFeature) => feature.code === itemFeature.code);
      if (currentFeature == null) {
        return '';
      }
      return html`
        <div class="feature">
          <div class="feature-name">${this._getFeatureName(currentFeature)}</div>
          <div class="feature-value">${this._getFeatureValue(currentFeature)}</div>
        </div>
      `;
    });
  }

  _renderBigItems () {
    return html`
      <table>
        <tr>
          ${this.action === 'add' ? html`
            <th class="btn-col"></th>
          ` : ''}
          <th>${i18n('cc-pricing-table.plan')}</th>
          ${this._features.map((feature) => html`
            <th class=${classMap({ 'number-align': NUMBER_FEATURE_TYPES.includes(feature.type) })}>${this._getFeatureName(feature)}</th>
          `)}
          <th class="number-align">${i18n('cc-pricing-table.price-name-daily')}</th>
          <th class="number-align">${i18n('cc-pricing-table.price-name-monthly')}</th>
        </tr>
        ${this._items.map((item) => html`
          <tr>
            ${this.action === 'add' ? html`
              <td class="btn-col">
                <cc-button image=${plusSvg} hide-text circle @cc-button:click=${() => this._onAddItem(item)}></cc-button>
              </td>
            ` : ''}
            <td>${item.name}</td>
            ${this._renderBigItemFeatures(item.features)}
            <td class="number-align">${this._getDailyPrice(item.price)}</td>
            <td class="number-align">${this._getMonthlyPrice(item.price)}</td>
          </tr>
        `)}
      </table>
    `;
  }

  _renderBigItemFeatures (itemFeatures) {
    return this._features.map((feature) => {
      const currentFeature = itemFeatures.find((itemFeature) => feature.code === itemFeature.code);
      return html`
        <td class=${classMap({ 'number-align': NUMBER_FEATURE_TYPES.includes(feature.type) })}>${this._getFeatureValue(currentFeature)}</td>
      `;
    });
  }

  _onAddItem (item) {
    dispatchCustomEvent(this, 'add-item', item);
  }

  _onToggleState (newItem) {
    this._items = this._items.map((item) => {
      return (item === newItem)
        ? { ...item, state: (item.state === 'closed') ? 'opened' : 'closed' }
        : item;
    });
  }

  update (changedProperties) {

    if (changedProperties.has('items') && Array.isArray(this.items)) {
      this._items = this.items
        .map((item) => ({ ...item, state: 'closed' }))
        .sort((i1, i2) => i1.price - i2.price);
    }

    if (changedProperties.has('features') && Array.isArray(this.features)) {
      this._features = this.features
        .filter((feature) => AVAILABLE_FEATURES.includes(feature.code));
    }
    super.update(changedProperties);
  }

  render () {
    // We don't really have a good way to detect when the component should switch between bit and small mode.
    // Also, when this component is used several times in the page, it's better if all instances switch at the same breakpoint.
    // 950 seems like a good arbitrary value for the content we need to display.
    return (this._size > 950)
      ? this._renderBigItems()
      : this._renderSmallItems();
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          background-color: #fff;
          display: block;
        }

        .number-align {
          text-align: right;
        }

        em[title] {
          cursor: help;
          font-style: normal;
          position: relative;
        }

        em[title] code {
          color: blue;
          font-family: monospace;
          font-weight: bold;
        }

        /* BIG SIZE */

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

        th.btn-col {
          width: 2em;
        }

        td {
          padding: 0.5em 0.5em;
          white-space: nowrap;
        }

        td.btn-col {
          padding: 0.25em 0.5em;
        }

        tr:hover td {
          background-color: #f5f5f5;
        }

        table em[title] code {
          box-sizing: border-box;
          left: 100%;
          padding: 0 0.15em;
          position: absolute;
        }

        /* SMALL SIZE */

        .plan {
          align-items: center;
          border-top: 1px solid #e5e5e5;
          display: grid;
          grid-template-columns: min-content [main-start] 1fr [main-end] min-content;
          margin: 0;
          padding: 1em;
        }

        :host([action="none"]) .plan {
          grid-template-columns: [main-start] 1fr [main-end] min-content;
        }

        .plan .add-item-btn {
          margin-right: 1em;
        }

        .plan-name {
          font-size: 1.2em;
          font-weight: bold;
        }

        .feature-list {
          grid-column: main-start / main-end;
        }

        .feature-list:not(:last-child) {
          margin-top: 1em;
        }

        .plan[data-state="closed"] .feature-list {
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

        .plan[data-state="closed"] .feature {
          border: none;
          line-height: 1.5;
          padding: 0;
          white-space: nowrap;
        }

        .plan[data-state="closed"] .feature:not(:last-child)::after {
          content: ',';
          padding-right: 0.5em;
        }

        .feature-name {
          font-style: italic;
          font-weight: bold;
        }

        .plan[data-state="closed"] .feature-name::after {
          content: ' :';
          padding-right: 0.25em;
        }

        .plan[data-state="opened"] .feature-value {
          margin-right: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-table', CcPricingTable);
