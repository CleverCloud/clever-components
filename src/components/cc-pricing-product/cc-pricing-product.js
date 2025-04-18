import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixAddLine as iconAdd } from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcPricingPlanAddEvent } from '../cc-pricing-page/cc-pricing-page.events.js';

// 800 seems like a good arbitrary value for the content we need to display.
const BREAKPOINT = 800;
/** @type {Record<FormattedFeature['code'], () => string>} */
const FEATURES_I18N = {
  'connection-limit': () => i18n('cc-pricing-product.feature.connection-limit'),
  cpu: () => i18n('cc-pricing-product.feature.cpu'),
  databases: () => i18n('cc-pricing-product.feature.databases'),
  dedicated: () => i18n('cc-pricing-product.feature.dedicated'),
  'disk-size': () => i18n('cc-pricing-product.feature.disk-size'),
  gpu: () => i18n('cc-pricing-product.feature.gpu'),
  'has-logs': () => i18n('cc-pricing-product.feature.has-logs'),
  'has-metrics': () => i18n('cc-pricing-product.feature.has-metrics'),
  'is-migratable': () => i18n('cc-pricing-product.feature.is-migratable'),
  'max-db-size': () => i18n('cc-pricing-product.feature.max-db-size'),
  memory: () => i18n('cc-pricing-product.feature.memory'),
  version: () => i18n('cc-pricing-product.feature.version'),
};
const AVAILABLE_FEATURES = Object.keys(FEATURES_I18N);
const NUMBER_FEATURE_TYPES = ['bytes', 'number', 'number-cpu-runtime'];

// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const CURRENCY_EUR = 'EUR';

/** @type {Temporality[]} */
const DEFAULT_TEMPORALITY_LIST = [{ type: '30-days', digits: 2 }];

/**
 * @typedef {import('../common.types.js').ActionType} ActionType
 * @typedef {import('./cc-pricing-product.types.js').PricingProductState} PricingProductState
 * @typedef {import('../common.types.js').Temporality} Temporality
 * @typedef {import('../common.types.js').Plan} Plan
 * @typedef {import('../common.types.js').FormattedFeature} FormattedFeature
 */

/**
 * A component to display product information: product plans, their features, their price (based on the given temporality and currency).
 *
 * ## Details
 *
 * Features are characterics with values.
 * For instance the number of CPUs, the amount of RAM, etc.
 *
 * Plans are a set of features for a given product.
 * For instance, the XS plan of the NodeJS product consists of 1 CPU and 1 GB of RAM.
 *
 * Temporalities are time windows used to compute the price.
 * For instance, the price over 30 days or the price per second.
 *
 * * The plans are sorted by price.
 * * If a plan has a feature that is not listed in `features`, it will be ignored.
 * * If a feature has a `code` that is not supported, it will be ignored.
 *
 * **Note:** This component relies on the `resizeObserver` mixin to change its layout with `800px` as a width breakpoint.
 *
 * @cssdisplay block
 *
 * @cssprop {Color} --cc-pricing-hovered-color - Sets the text color used on hover (defaults: `purple`).
 */
export class CcPricingProduct extends LitElement {
  static get properties() {
    return {
      action: { type: String },
      currency: { type: String },
      state: { type: Object },
      temporalities: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {ActionType} Sets the type of action: "add" to display add buttons for each plan and "none" for no actions (defaults to "add"). */
    this.action = 'add';

    /** @type {string} Sets the currency used to display the prices (defaults to `EUR`). */
    this.currency = CURRENCY_EUR;

    /** @type {PricingProductState} Sets the state of the pricing product component. */
    this.state = { type: 'loading' };

    /**
     * @type {Temporality[]} Sets the time window(s) you want to display the prices in (defaults to 30 days with 2 fraction digits).
     * You may display one or several time windows at once.
     */
    this.temporalities = DEFAULT_TEMPORALITY_LIST;

    /** @type {ResizeController} */
    this._resizeController = new ResizeController(this);
  }

  /**
   * Returns the translated string corresponding to a feature code.
   *
   * @param {FormattedFeature} feature - the feature to translate
   * @return {string|void} the translated feature name if a translation exists or nothing if the translation does not exist
   */
  _getFeatureName(feature) {
    if (feature == null) {
      return '';
    }

    if (feature.code in FEATURES_I18N) {
      return FEATURES_I18N[feature.code]();
    }

    if (feature.name != null) {
      return feature.name;
    }
  }

  /**
   * Returns the formatted value corresponding to a feature
   *
   * @param {FormattedFeature} feature - the feature to get the formatted value from
   * @return {string|Node|void} the formatted value for the given feature or the feature value itself if it does not require any formatting
   */
  _getFeatureValue(feature) {
    if (feature == null) {
      return '';
    }

    switch (feature.type) {
      case 'boolean':
        return i18n('cc-pricing-product.type.boolean', { boolean: feature.value === 'true' });
      case 'boolean-shared':
        return i18n('cc-pricing-product.type.boolean-shared', { shared: feature.value === 'shared' });
      case 'bytes':
        return feature.code === 'memory' && feature.value === '0'
          ? i18n('cc-pricing-product.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-product.type.bytes', { bytes: Number(feature.value) });
      case 'number':
        return feature.code === 'cpu' && feature.value === '0'
          ? i18n('cc-pricing-product.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-product.type.number', { number: Number(feature.value) });
      case 'number-cpu-runtime':
        return i18n('cc-pricing-product.type.number-cpu-runtime', {
          /**
           * Narrowing the type would make the code less readable for no gain, improving the type to separate
           * `number-cpu-runtime` from other types makes the code a lot more complex for almost no type safety gain
           */
          // @ts-ignore
          cpu: feature.value.cpu,
          // @ts-ignore
          shared: feature.value.shared,
        });
      case 'string':
        return feature.value.toString();
    }
  }

  /**
   * Returns the price computed based on the given temporality
   *
   * @param {Temporality['type']} type - the temporality type
   * @param {number} hourlyPrice - the hourly price to compute
   * @return {number} the computed price based on the given temporality
   */
  _getPrice(type, hourlyPrice) {
    switch (type) {
      case 'second':
        return hourlyPrice / 60 / 60;
      case 'minute':
        return hourlyPrice / 60;
      case 'hour':
        return hourlyPrice;
      case '1000-minutes':
        return (hourlyPrice / 60) * 1000;
      case 'day':
        return hourlyPrice * 24;
      case '30-days':
        return hourlyPrice * 24 * 30;
    }
  }

  /**
   * Returns the translated price label corresponding to a temporality
   *
   * @param {Temporality['type']} type - the temporality type
   * @return {string|Node} the translated label corresponding to the given temporality
   */
  _getPriceLabel(type) {
    switch (type) {
      case 'second':
        return i18n('cc-pricing-product.price-name.second');
      case 'minute':
        return i18n('cc-pricing-product.price-name.minute');
      case 'hour':
        return i18n('cc-pricing-product.price-name.hour');
      case '1000-minutes':
        return i18n('cc-pricing-product.price-name.1000-minutes');
      case 'day':
        return i18n('cc-pricing-product.price-name.day');
      case '30-days':
        return i18n('cc-pricing-product.price-name.30-days');
    }
  }

  /**
   * Gets the computed price based on a given temporality.
   * Returns the localized and formatted price based on the language and the given number of digits.
   *
   * @param {Temporality['type']} type - the temporality type
   * @param {number} hourlyPrice - the price to base the calculations on
   * @param {number} digits - the number of digits to be used for price rounding
   * @returns {string|void}
   */
  _getPriceValue(type, hourlyPrice, digits) {
    const price = this._getPrice(type, hourlyPrice);
    if (price != null) {
      return i18n('cc-pricing-product.price', { price, currency: this.currency, digits });
    }
  }

  /**
   * Adds the product name to the given plan.
   * Dispatches a `cc-pricing-plan-add` event with the plan as its payload.
   *
   * @param {string} productName - the name of the product to which the plan is attached
   * @param {Plan} plan - the plan to be added to the estimation
   */
  _onAddPlan(productName, plan) {
    this.dispatchEvent(new CcPricingPlanAddEvent({ productName, ...plan }));
  }

  render() {
    return html`
      ${this.state.type === 'error'
        ? html` <cc-notice intent="warning" message=${i18n('cc-pricing-product.error')}></cc-notice> `
        : ''}
      ${this.state.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
      ${this.state.type === 'loaded'
        ? this._renderProductPlans(this.state.name, this.state.plans, this.state.productFeatures)
        : ''}
    `;
  }

  /**
   * @param {string} productName - the name of the product
   * @param {Plan[]} productPlans - the list of plans attached to this product
   * @param {Array<FormattedFeature>} productFeatures - the list of features to display
   */
  _renderProductPlans(productName, productPlans, productFeatures) {
    // this component is not rerendering very often so we consider we can afford to sort plans and filter the features here.
    const sortedPlans = [...productPlans].sort((a, b) => a.price - b.price);
    const filteredProductFeatures = productFeatures.filter(
      (feature) => AVAILABLE_FEATURES.includes(feature.code) || feature.name != null,
    );

    // We don't really have a good way to detect when the component should switch between big and small mode.
    // Also, when this component is used several times in the page, it's better if all instances switch at the same breakpoint.
    return this._resizeController.width > BREAKPOINT
      ? this._renderBigPlans(productName, sortedPlans, filteredProductFeatures)
      : this._renderSmallPlans(productName, sortedPlans, filteredProductFeatures);
  }

  /**
   * @param {string} productName
   * @param {Plan[]} sortedPlans
   * @param {Array<FormattedFeature>} productFeatures
   */
  _renderBigPlans(productName, sortedPlans, productFeatures) {
    const temporality = this.temporalities ?? DEFAULT_TEMPORALITY_LIST;

    return html`
      <table>
        <caption class="visually-hidden">
          ${productName}
        </caption>
        <thead>
          <tr>
            <th>${i18n('cc-pricing-product.plan')}</th>
            ${productFeatures.map(
              (feature) => html`
                <th class=${classMap({ 'number-align': NUMBER_FEATURE_TYPES.includes(feature.type) })}>
                  ${this._getFeatureName(feature)}
                </th>
              `,
            )}
            ${temporality.map(({ type }) => html` <th class="number-align">${this._getPriceLabel(type)}</th> `)}
            ${this.action === 'add' ? html` <th class="btn-col"></th> ` : ''}
          </tr>
        </thead>
        <tbody>
          ${sortedPlans.map(
            (plan) => html`
              <tr>
                <td>${plan.name}</td>
                ${this._renderBigPlanFeatures(plan.features, productFeatures)}
                ${temporality.map(
                  ({ type, digits }) => html`
                    <td class="number-align">${this._getPriceValue(type, plan.price, digits)}</td>
                  `,
                )}
                ${this.action === 'add'
                  ? html`
                      <td class="btn-col">
                        <button
                          class="btn"
                          @click="${() => this._onAddPlan(productName, plan)}"
                          title="${i18n('cc-pricing-product.add-button', { productName, size: plan.name })}"
                        >
                          <cc-icon
                            .icon=${iconAdd}
                            a11y-name=${i18n('cc-pricing-product.add-button', { productName, size: plan.name })}
                          ></cc-icon>
                        </button>
                      </td>
                    `
                  : ''}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  /**
   * @param {Array<FormattedFeature>} planFeatures
   * @param {Array<FormattedFeature>} productFeatures
   */
  _renderBigPlanFeatures(planFeatures, productFeatures) {
    return productFeatures.map((feature) => {
      const currentPlanFeature = planFeatures.find((f) => feature.code === f.code);
      return html`
        <td class=${classMap({ 'number-align': NUMBER_FEATURE_TYPES.includes(feature.type) })}>
          ${this._getFeatureValue(currentPlanFeature)}
        </td>
      `;
    });
  }

  /**
   * @param {string} productName
   * @param {Plan[]} sortedPlans
   * @param {Array<FormattedFeature>} productFeatures
   */
  _renderSmallPlans(productName, sortedPlans, productFeatures) {
    const temporality = this.temporalities ?? DEFAULT_TEMPORALITY_LIST;

    return html`
      <div>
        <div class="visually-hidden">${productName}</div>
        ${sortedPlans.map(
          (plan) => html`
            <div class="plan">
              <div class="plan-name">
                <span>${plan.name}</span>
                ${this.action === 'add'
                  ? html`
                      <button
                        class="btn"
                        @click="${() => this._onAddPlan(productName, plan)}"
                        title="${i18n('cc-pricing-product.add-button', { productName, size: plan.name })}"
                      >
                        <cc-icon
                          .icon=${iconAdd}
                          a11y-name=${i18n('cc-pricing-product.add-button', { productName, size: plan.name })}
                        ></cc-icon>
                      </button>
                    `
                  : ''}
              </div>

              <dl class="feature-list">
                ${this._renderSmallPlanFeatures(plan.features, productFeatures)}
                ${temporality.map(
                  ({ type, digits }) => html`
                    <div class="price-small">
                      <dt class="feature-name">${this._getPriceLabel(type)}</dt>
                      <dd class="feature-value">${this._getPriceValue(type, plan.price, digits)}</dd>
                    </div>
                  `,
                )}
              </dl>
            </div>
          `,
        )}
      </div>
    `;
  }

  /**
   * @param {Array<FormattedFeature>} planFeatures
   * @param {Array<FormattedFeature>} productFeatures
   */
  _renderSmallPlanFeatures(planFeatures, productFeatures) {
    return productFeatures.map((feature) => {
      const currentPlanFeature = planFeatures.find((f) => feature.code === f.code);
      return html`
        <div>
          <dt class="feature-name">${this._getFeatureName(currentPlanFeature)}</dt>
          <dd class="feature-value">${this._getFeatureValue(currentPlanFeature)}</dd>
        </div>
      `;
    });
  }

  static get styles() {
    return [
      // language=CSS
      accessibilityStyles,
      css`
        :host {
          display: block;
        }

        button:focus {
          outline: var(--cc-focus-outline, #000);
          outline-offset: var(--cc-focus-outline-offset);
        }

        cc-loader {
          min-height: 20em;
        }

        cc-notice {
          max-width: max-content;
        }

        /* region pricing table */
        /* region COMMON */

        .number-align {
          text-align: right;
        }

        /* this selector applies to content coming from the translation files */

        em[title] {
          cursor: help;
          font-style: normal;
          position: relative;
        }

        /* this selector applies to content coming from the translation files. */

        em[title] code {
          color: var(--cc-color-text-primary-highlight, blue);
          font-family: monospace;
          font-weight: bold;
        }

        .btn {
          background-color: var(--cc-color-bg-default, #fff);
          border: solid 1px var(--cc-color-border-neutral-strong, #eee);
          color: var(--cc-color-text-weak, #333);
          cursor: pointer;
          display: grid;
          font-size: 1.2em;
          height: 1.5em;
          line-height: 1.2em;
          place-content: center;
          width: 1.5em;
        }

        .btn:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color);

          border-color: var(--cc-color-border-hovered);
        }

        /* endregion */

        /* region BIG */

        table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
        }

        /* Fix to prevent position absolute from breaking border collapse between thead and tbody */

        caption.visually-hidden {
          position: static;
        }

        tr {
          border-block: solid 1px var(--cc-color-border-neutral-weak, #eee);
        }

        th {
          color: var(--cc-color-text-weak, #333);
          font-weight: bold;
          padding: 2em 0.5em;
          text-align: left;
        }

        th.btn-col,
        td.btn-col {
          width: 2em;
        }

        td {
          color: var(--cc-color-text-default, #000);
          font-weight: 500;
          padding: 1.5em 0.5em;
          white-space: nowrap;
        }

        td.btn-col {
          padding: 0.25em 1em;
        }

        tr:hover td {
          background-color: var(--cc-color-bg-neutral-hovered, #f5f5f5);
        }

        .price-col {
          padding: 0;
        }

        table em[title] code {
          box-sizing: border-box;
          left: 100%;
          padding: 0 0.15em;
          position: absolute;
        }

        /* endregion */

        /* region SMALL */

        .plan {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #ddd);
          margin: 0;
          padding: 1em;
        }

        .plan-name {
          display: flex;
          font-size: 1.2em;
          font-weight: bold;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        .feature-list {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }

        dl,
        dd,
        dt {
          margin: 0;
          padding: 0;
        }

        dd {
          color: var(--cc-color-text-default, #000);
          font-weight: 500;
        }

        dt {
          color: var(--cc-color-text-weak);
          font-weight: 600;
        }
        /*  endregion */
      `,
    ];
  }
}

window.customElements.define('cc-pricing-product', CcPricingProduct);
