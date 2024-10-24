import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatEstimationPrices } from '../../lib/product.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-estimation.js';

/**
 * @typedef {import('./cc-pricing-estimation.js').CcPricingEstimation} CcPricingEstimation
 * @typedef {import('./cc-pricing-estimation.types.js').PricingEstimationStateLoaded} PricingEstimationStateLoaded
 * @typedef {import('./cc-pricing-estimation.types.js').FormattedRuntimePrice} FormattedRuntimePrice
 * @typedef {import('../common.types.js').PricingSection} PricingSection
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-pricing-estimation',
  params: {
    apiConfig: { type: Object, optional: true },
    zoneId: { type: String, optional: true },
    currency: { type: String, optional: true },
  },
  /**
   * @param {Object} settings
   * @param {CcPricingEstimation} settings.component
   * @param {{apiConfig: ApiConfig, zoneId?: string, currency?: string }} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, zoneId = 'par', currency = 'EUR' } = context;

    /**
     * This `cc-smart-container` is placed around the whole `cc-pricing-page` component.
     * Within the `cc-pricing-page`, every `cc-pricing-product` component is placed inside a distinct `cc-smart-container`.
     *
     * This smart component targets `cc-pricing-header` but when `zoneId` changes, we want to trigger
     * a new fetch from all pricing product smart.
     * To do so, this smart component modifies its own context.
     * Since all pricing product smart share this context and watch for `zoneId` changes, it triggers new fetches.
     */
    onEvent(
      'cc-pricing-estimation:change-zone',
      /** @param {string} zoneId */
      (zoneId) => {
        container.context = { ...container.context, zoneId };
      },
    );

    /**
     * This `cc-smart-container` is placed around the whole `cc-pricing-page` component.
     * Within the `cc-pricing-page`, every `cc-pricing-product` component is placed inside a distinct `cc-smart-container`.
     *
     * This smart component targets `cc-pricing-estimation` but when `currency` changes, we want to trigger
     * a new fetch from all pricing product smart.
     * To do so, this smart component modifies its own context.
     * Since all pricing product smart share this context and watch for `currency` changes, it triggers new fetches.
     */
    onEvent(
      'cc-pricing-estimation:change-currency',
      /** @param {string} currency */
      (currency) => {
        container.context = { ...container.context, currency };
      },
    );

    updateComponent('state', { type: 'loading' });

    fetchPrices({ apiConfig, zoneId, currency, signal })
      .then(({ runtimePrices, countablePrices }) => {
        updateComponent('state', { type: 'loaded', runtimePrices, countablePrices });
      })
      .catch(() => {
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * Fetches prices from the price system and formats the data.
 *
 * @param {Object} options - The options for fetching prices.
 * @param {ApiConfig} options.apiConfig - The API configuration.
 * @param {string} options.zoneId - The zone ID.
 * @param {string} options.currency - The currency.
 * @param {AbortSignal} options.signal - The abort signal.
 * @returns {Promise<Omit<PricingEstimationStateLoaded, 'type'>>} A promise that resolves to an array of formatted product prices.
 */
function fetchPrices({ apiConfig, zoneId, currency, signal }) {
  /* eslint-disable camelcase */
  return fetchPriceSystem({ apiConfig, zoneId, currency, signal }).then((priceSystem) => {
    return formatEstimationPrices(priceSystem);
  });
}
