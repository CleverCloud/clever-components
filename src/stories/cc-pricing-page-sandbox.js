import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../components/cc-pricing-estimation/cc-pricing-estimation.js';
import '../components/cc-pricing-header/cc-pricing-header.js';
import '../components/cc-pricing-page/cc-pricing-page.js';
import '../components/cc-pricing-product-consumption/cc-pricing-product-consumption.js';
import { dataLoadedWithFakeProduct as fakeProductStory } from '../components/cc-pricing-product/cc-pricing-product.stories.js';
import { ResizeController } from '../controllers/resize-controller.js';
import {
  formatAddonCellar,
  formatAddonFsbucket,
  formatAddonHeptapod,
  formatAddonPulsar,
  formatEstimationPrices,
} from '../lib/product.js';
import { getFullProductAddon } from './fixtures/addon-plans.js';
import { rawPriceSystemDollars, rawPriceSystemEuro } from './fixtures/price-system.js';
import { getFullProductRuntime } from './fixtures/runtime-plans.js';
import { ZONES } from './fixtures/zones.js';
import { createStoryItem } from './lib/make-story.js';

const BREAKPOINT = 1100;
/** @type {Array<FormattedFeature['code']>}  **/
const FEATURES_TO_DISPLAY = [
  'connection-limit',
  'cpu',
  'disk-size',
  'has-logs',
  'has-metrics',
  'max-db-size',
  'databases',
];

/**
 * @typedef {import('../components/cc-pricing-page/cc-pricing-page.js').CcPricingPage} CcPricingPage
 * @typedef {import('../components/cc-pricing-header/cc-pricing-header.js').CcPricingHeader} CcPricingHeader
 * @typedef {import('../components/common.types.js').Temporality} Temporality
 * @typedef {import('../components/cc-pricing-estimation/cc-pricing-estimation.js').CcPricingEstimation} CcPricingEstimation
 * @typedef {import('../components/cc-pricing-estimation/cc-pricing-estimation.types.js').PricingEstimationState} PricingEstimationState
 * @typedef {import('../components/cc-pricing-product/cc-pricing-product.types.js').PricingProductState} PricingProductState
 * @typedef {import('../components/cc-pricing-product-consumption/cc-pricing-product-consumption.types.js').PricingProductConsumptionStateLoaded} PricingProductConsumptionStateLoaded
 * @typedef {import('../components/cc-pricing-product-consumption/cc-pricing-product-consumption.types.js').PricingProductConsumptionState} PricingProductConsumptionState
 * @typedef {import('../components/common.types.js').PriceSystem} PriceSystem
 * @typedef {import('../components/cc-pricing-estimation/cc-pricing-estimation.types.js').PricingEstimationStateLoaded} PricingEstimationStateLoaded
 * @typedef {import('../components/common.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('lit/directives/ref.js').Ref<CcPricingEstimation>} RefCcPricingEstimation
 * @typedef {Parameters<typeof getFullProductRuntime>[0]} RuntimeProductId
 * @typedef {Parameters<typeof getFullProductAddon>[0]} AddonProductId
 * @typedef {'cellar' | 'fsbucket' | 'pulsar' | 'heptapod'} ConsumptionProductId
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcPricingPageSandbox>} CcPricingPageSandboxPropertyValues
 */

export class CcPricingPageSandbox extends LitElement {
  static get properties() {
    return {
      selectedCurrency: { type: String, attribute: 'selected-currency' },
      selectedTemporality: { type: Object, attribute: 'selected-temporality' },
      stateType: { type: String, attribute: 'state-type' },
      _estimationPrices: { type: Object, state: true },
    };
  }

  static get CURRENCIES() {
    return /** @type {const} */ ({
      EUR: 'EUR',
      USD: 'USD',
    });
  }

  static get PRICE_SYSTEMS() {
    return /** @type {const} */ ({
      EUR: rawPriceSystemEuro,
      USD: rawPriceSystemDollars,
    });
  }

  static get TEMPORALITIES() {
    return /** @type {const} */ ({
      second: {
        type: 'second',
        digits: 7,
      },
      minute: {
        type: 'minute',
        digits: 5,
      },
      hour: {
        type: 'hour',
        digits: 3,
      },
      day: {
        type: 'day',
        digits: 2,
      },
      thirtyDays: {
        type: '30-days',
        digits: 2,
      },
    });
  }

  constructor() {
    super();

    /** @type {'loaded'|'loading'|'error'} Sets the state type of all the inner pricing components */
    this.stateType = 'loaded';

    /** @type {'EUR'|'USD'} Sets the selected currency */
    this.selectedCurrency = CcPricingPageSandbox.CURRENCIES.EUR;

    /** @type {Temporality} Sets the selected temporality */
    this.selectedTemporality = CcPricingPageSandbox.TEMPORALITIES.thirtyDays;

    /** @type {Array<typeof CcPricingPageSandbox.CURRENCIES[keyof typeof CcPricingPageSandbox.CURRENCIES]>} */
    this._currencies = Object.values(CcPricingPageSandbox.CURRENCIES);

    /** @type {Array<typeof CcPricingPageSandbox.TEMPORALITIES[keyof typeof CcPricingPageSandbox.TEMPORALITIES]>} */
    this._temporalities = Object.values(CcPricingPageSandbox.TEMPORALITIES);

    /** @type {PriceSystem} */
    this._priceSystem = CcPricingPageSandbox.PRICE_SYSTEMS[this.selectedCurrency];

    /** @type {RefCcPricingEstimation} */
    this._pricingEstimationRef = createRef();

    this._resizeController = new ResizeController(this, { widthBreakpoints: [BREAKPOINT] });
  }

  /**
   * @param {ConsumptionProductId} consumptionProductId
   * @returns {PricingProductConsumptionStateLoaded}
   */
  _getProductConsumptionStateLoaded(consumptionProductId) {
    switch (consumptionProductId) {
      case 'cellar':
        return {
          type: 'loaded',
          name: 'Cellar',
          ...formatAddonCellar(this._priceSystem),
        };
      case 'fsbucket':
        return {
          type: 'loaded',
          name: 'FS Bucket',
          ...formatAddonFsbucket(this._priceSystem),
        };
      case 'pulsar':
        return {
          type: 'loaded',
          name: 'Pulsar',
          ...formatAddonPulsar(this._priceSystem),
        };
      case 'heptapod':
        return {
          type: 'loaded',
          name: 'Heptapod',
          ...formatAddonHeptapod(this._priceSystem),
        };
    }
  }

  /** @param {CustomEvent<typeof this._currencies[number]>} event */
  _onCurrencyChange({ detail: currency }) {
    this.selectedCurrency = currency;
  }

  /** @param {CcPricingPageSandboxPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('selectedCurrency')) {
      this._priceSystem = CcPricingPageSandbox.PRICE_SYSTEMS[this.selectedCurrency];
    }
  }

  render() {
    return html`
      <cc-pricing-page .selectedCurrency=${this.selectedCurrency} .selectedTemporality=${this.selectedTemporality}>
        <div class="header">${this._renderPriceHeader(this.stateType)}</div>
        <div class="main-content">
          ${this._renderPricingEstimation(this.stateType)}
          <div class="product-list">
            <h2>Compute & Runtime</h2>
            <div class="product">
              <h3>Node</h3>
              ${this._renderRuntimePricingProduct(this.stateType, 'node')}
            </div>
            <h2>Add-ons</h2>
            <div class="product">
              <h3>Redis</h3>
              ${this._renderAddonPricingProduct(this.stateType, 'redis-addon')}
            </div>
            <div class="product">
              <h3>Mongodb</h3>
              ${this._renderAddonPricingProduct(this.stateType, 'mongodb-addon')}
            </div>
            <h2>Object Storage</h2>
            <div class="product">
              <h3>Cellar</h3>
              ${this._renderConsumptionPricingProduct(this.stateType, 'cellar')}
            </div>
            <div class="product">
              <h3>FS Bucket</h3>
              ${this._renderConsumptionPricingProduct(this.stateType, 'fsbucket')}
            </div>
            <div class="product">
              <h3>Pulsar</h3>
              ${this._renderConsumptionPricingProduct(this.stateType, 'pulsar')}
            </div>
            <div class="product">
              <h3>Heptapod</h3>
              ${this._renderConsumptionPricingProduct(this.stateType, 'heptapod')}
            </div>
            <div class="product">
              <h3>Fake product</h3>
              ${this.stateType === 'loading' ? createStoryItem(fakeProductStory, { state: { type: 'loading' } }) : ''}
              ${this.stateType === 'error' ? createStoryItem(fakeProductStory, { state: { type: 'error' } }) : ''}
              ${this.stateType === 'loaded' ? createStoryItem(fakeProductStory) : ''}
            </div>
          </div>
        </div>
      </cc-pricing-page>
    `;
  }

  /**
   * @param {PricingEstimationState['type']} stateType
   * @returns {TemplateResult}
   */
  _renderPriceHeader(stateType) {
    const state =
      stateType === 'loaded'
        ? {
            type: 'loaded',
            zones: ZONES,
          }
        : { type: stateType };

    return html`
      <cc-pricing-header
        .state=${state}
        .currencies=${this._currencies}
        .temporalities=${this._temporalities}
        selected-zone-id="par"
        @cc-pricing-header:change-currency=${this._onCurrencyChange}
      ></cc-pricing-header>
    `;
  }

  /**
   * @param {PricingEstimationState['type']} stateType
   * @returns {TemplateResult}
   */
  _renderPricingEstimation(stateType) {
    /** @type {PricingEstimationState} */
    const state =
      stateType === 'loaded'
        ? {
            type: 'loaded',
            ...formatEstimationPrices(this._priceSystem),
          }
        : { type: stateType };
    const isToggleEnabled = this._resizeController.width < BREAKPOINT;

    return html`
      <cc-pricing-estimation
        ${ref(this._pricingEstimationRef)}
        .state=${state}
        .currencies=${this._currencies}
        .temporalities=${this._temporalities}
        ?is-toggle-enabled=${isToggleEnabled}
        @cc-pricing-estimation:change-currency=${this._onCurrencyChange}
      ></cc-pricing-estimation>
    `;
  }

  /**
   * @param {PricingProductState['type']} stateType
   * @param {RuntimeProductId} runtimeProductId
   * @returns {TemplateResult}
   */
  _renderRuntimePricingProduct(stateType, runtimeProductId) {
    /** @type {PricingProductState} */
    const state =
      stateType === 'loaded'
        ? {
            type: 'loaded',
            ...getFullProductRuntime(runtimeProductId, this._priceSystem),
          }
        : { type: stateType };

    return html` <cc-pricing-product .state=${state}></cc-pricing-product> `;
  }

  /**
   * @param {PricingProductState['type']} stateType
   * @param {Exclude<AddonProductId, 'cellar-addon' | 'fsbucket'>} addonProductId
   * @returns {TemplateResult}
   */
  _renderAddonPricingProduct(stateType, addonProductId) {
    /** @type {PricingProductState} */
    const state =
      stateType === 'loaded'
        ? {
            type: 'loaded',
            ...getFullProductAddon(addonProductId, FEATURES_TO_DISPLAY, this._priceSystem),
          }
        : { type: stateType };

    return html` <cc-pricing-product .state=${state}></cc-pricing-product> `;
  }

  /**
   * @param {PricingProductConsumptionState['type']} stateType
   * @param {ConsumptionProductId} consumptionProductId
   */
  _renderConsumptionPricingProduct(stateType, consumptionProductId) {
    /** @type {PricingProductConsumptionState} */
    const state =
      stateType === 'loaded' ? this._getProductConsumptionStateLoaded(consumptionProductId) : { type: stateType };

    return html` <cc-pricing-product-consumption .state=${state}></cc-pricing-product-consumption>`;
  }

  static get styles() {
    return [
      css`
        .header {
          margin-inline: auto;
        }

        .main-content {
          display: flex;
          gap: 1em;
          margin-block: 2em;
        }

        cc-pricing-estimation {
          --shadow-color: 45deg 3% 46%;

          background-color: #fff;
          box-shadow:
            0.3px 0.5px 0.7px hsl(var(--shadow-color) / 36%),
            0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 36%),
            2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 36%),
            5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 36%);
          flex: 0 1 25em;
          height: max-content;
          margin-block: 2em;
          max-height: 80vh;
          overflow: auto;
          position: sticky;
          scrollbar-gutter: stable;
          top: 0;
          z-index: 10;
        }

        .product-list {
          flex: 1 1 auto;
          order: -1;
        }

        :host([w-lt-1100]) .main-content {
          flex-direction: column;
        }

        :host([w-lt-1100]) .product-list {
          padding-inline: 1em;
        }

        :host([w-lt-1100]) cc-pricing-estimation {
          bottom: 0;
          box-shadow:
            0 -0.3px 0.3px hsl(var(--shadow-color) / 11%),
            0 -1px 1.1px -0.8px hsl(var(--shadow-color) / 11%),
            0 -2.4px 2.7px -1.7px hsl(var(--shadow-color) / 11%),
            -0.1px -5.9px 6.6px -2.5px hsl(var(--shadow-color) / 11%);
          flex: 0 0 auto;
          order: 2;
          overflow: auto;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-page-sandbox', CcPricingPageSandbox);
