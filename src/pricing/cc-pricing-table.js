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

/** @type {Temporality[]} */
const DEFAULT_TEMPORALITY = [
  { type: 'day', digits: 2 },
  { type: '30-days', digits: 2 },
];

/**
 * @typedef {import('./types.js').ActionType} ActionType
 * @typedef {import('./types.js').Currency} Currency
 * @typedef {import('./types.js').Feature} Feature
 * @typedef {import('./types.js').Plan} Plan
 * @typedef {import('./types.js').Temporality} Temporality
 */

/**
 * A component to display product plans and their features.
 *
 * ## Details
 *
 * * The plans are sorted by price.
 * * If a plan has a feature that is not listed in `features`, it will be ignored.
 * * If a feature has a `code` that is not supported, it will be ignored.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Plan>} cc-pricing-table:add-plan - Fires the plan whenever a "plus" button is clicked.
 */
export class CcPricingTable extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      action: { type: String, reflect: true },
      currency: { type: Object },
      features: { type: Array },
      plans: { type: Array },
      temporality: { type: Array },
      _features: {
        type: Array,
        attribute: false,
      },
      _plans: {
        type: Array,
        attribute: false,
      },
      _size: {
        type: String,
        attribute: false,
      },
    };
  }

  constructor () {
    super();

    /** @type {ActionType} Sets the type of action: "add" to display add buttons for each plan and "none" for no actions (defaults to "add"). */
    this.action = 'add';

    /** @type {Currency} Sets the currency used to display the prices (defaults to euros). */
    this.currency = CURRENCY_EUR;

    /** @type {Feature[]|null} Sets the list of features (used for the feature sort order). */
    this.features = null;

    /** @type {Plan[]|null} Sets the list of plans. */
    this.plans = null;

    /** @type {Temporality[]} Sets the ordered list of time windows you want to display the prices in (defaults to day and 30 days with 2 fraction digits). */
    this.temporality = DEFAULT_TEMPORALITY;

    /** @type {Feature[]|null} */
    this._features = [];

    /** @type {Plan[]|null} */
    this._plans = [];

    /** @type {number|null} */
    this._size = null;
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

  _getPriceLabel (type) {
    if (type === 'second') {
      return i18n('cc-pricing-table.price-name.second');
    }
    if (type === 'minute') {
      return i18n('cc-pricing-table.price-name.minute');
    }
    if (type === 'hour') {
      return i18n('cc-pricing-table.price-name.hour');
    }
    if (type === '1000-minutes') {
      return i18n('cc-pricing-table.price-name.1000-minutes');
    }
    if (type === 'day') {
      return i18n('cc-pricing-table.price-name.day');
    }
    if (type === '30-days') {
      return i18n('cc-pricing-table.price-name.30-days');
    }
  }

  _getPrice (type, hourlyPrice) {
    if (type === 'second') {
      return hourlyPrice / 60 / 60 * this.currency.changeRate;
    }
    if (type === 'minute') {
      return hourlyPrice / 60 * this.currency.changeRate;
    }
    if (type === 'hour') {
      return hourlyPrice * this.currency.changeRate;
    }
    if (type === '1000-minutes') {
      return hourlyPrice / 60 * 1000 * this.currency.changeRate;
    }
    if (type === 'day') {
      return hourlyPrice * 24 * this.currency.changeRate;
    }
    if (type === '30-days') {
      return hourlyPrice * 24 * 30 * this.currency.changeRate;
    }
  }

  _getPriceValue (type, hourlyPrice, digits) {
    const price = this._getPrice(type, hourlyPrice);
    if (price != null) {
      return i18n('cc-pricing-table.price', { price, code: this.currency.code, digits });
    }
  }

  _onAddPlan (plan) {
    dispatchCustomEvent(this, 'add-plan', plan);
  }

  _onToggleState (newPlan) {
    this._plans = this._plans.map((plan) => {
      return (plan === newPlan)
        ? { ...plan, state: (plan.state === 'closed') ? 'opened' : 'closed' }
        : plan;
    });
  }

  update (changedProperties) {

    if (changedProperties.has('plans') && Array.isArray(this.plans)) {
      this._plans = this.plans
        .map((plan) => ({ ...plan, state: 'closed' }))
        .sort((a, b) => a.price - b.price);
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
      ? this._renderBigPlans()
      : this._renderSmallPlans();
  }

  _renderSmallPlans () {
    const temporality = this.temporality ?? DEFAULT_TEMPORALITY;
    return html`
      <div class="container">
        ${this._plans.map((plan) => html`
          <div class="plan" data-state=${plan.state}>

            ${this.action === 'add' ? html`
              <cc-button
                class="add-plan-btn"
                image=${plusSvg}
                hide-text
                circle
                @cc-button:click=${() => this._onAddPlan(plan)}
              >${i18n('cc-pricing-table.add-button')}
              </cc-button>
            ` : ''}

            <div class="plan-name">${plan.name}</div>

            <cc-button
              image=${plan.state === 'closed' ? downSvg : upSvg}
              hide-text
              circle
              @cc-button:click=${() => this._onToggleState(plan)}
            ></cc-button>

            <div class="feature-list">
              ${this._renderSmallPlanFeatures(plan.features)}
            </div>

            <div class="feature-list">
              ${temporality.map(({ type, digits }) => html`
                <div class="feature">
                  <div class="feature-name">${this._getPriceLabel(type)}</div>
                  <div class="feature-value">${this._getPriceValue(type, plan.price, digits)}</div>
                </div>
              `)}
            </div>

          </div>
        `)}
      </div>
    `;
  }

  _renderSmallPlanFeatures (planFeatures) {
    return this._features.map((feature) => {
      const currentFeature = planFeatures.find((f) => feature.code === f.code);
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

  _renderBigPlans () {
    const temporality = this.temporality ?? DEFAULT_TEMPORALITY;
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
          ${temporality.map(({ type }) => html`
            <th class="number-align">${this._getPriceLabel(type)}</th>
          `)}
        </tr>
        ${this._plans.map((plan) => html`
          <tr>
            ${this.action === 'add' ? html`
              <td class="btn-col">
                <cc-button image=${plusSvg} hide-text circle @cc-button:click=${() => this._onAddPlan(plan)}></cc-button>
              </td>
            ` : ''}
            <td>${plan.name}</td>
            ${this._renderBigPlanFeatures(plan.features)}
            ${temporality.map(({ type, digits }) => html`
              <td class="number-align">${this._getPriceValue(type, plan.price, digits)}</td>
            `)}
          </tr>
        `)}
      </table>
    `;
  }

  _renderBigPlanFeatures (planFeatures) {
    return this._features.map((feature) => {
      const currentFeature = planFeatures.find((f) => feature.code === f.code);
      return html`
        <td class=${classMap({ 'number-align': NUMBER_FEATURE_TYPES.includes(feature.type) })}>${this._getFeatureValue(currentFeature)}</td>
      `;
    });
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          background-color: var(--cc-color-bg-default);
          display: block;
        }

        /*region COMMON*/
        .number-align {
          text-align: right;
        }

        em[title] {
          cursor: help;
          font-style: normal;
          position: relative;
        }

        em[title] code {
          color: var(--cc-color-text-primary-highlight, blue);
          font-family: monospace;
          font-weight: bold;
        }

        /*endregion*/

        /*region BIG*/
        table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
        }

        tr:nth-child(n+3) {
          border-top: 1px solid #e5e5e5;
        }

        th {
          background-color: var(--cc-color-bg-neutral, #f6f6fb);
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
          background-color: var(--cc-color-bg-neutral-hovered, #f5f5f5);
        }

        table em[title] code {
          box-sizing: border-box;
          left: 100%;
          padding: 0 0.15em;
          position: absolute;
        }

        /*endregion*/

        /*region SMALL*/
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

        .plan .add-plan-btn {
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

        /*endregion*/
      `,
    ];
  }
}

window.customElements.define('cc-pricing-table', CcPricingTable);
