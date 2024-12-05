import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatEstimationPrices } from '../../lib/product.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-estimation.js';

/**
 * @typedef {import('./cc-pricing-estimation.js').CcPricingEstimation} CcPricingEstimation
 * @typedef {import('./cc-pricing-estimation.types.js').PricingEstimationStateLoaded} PricingEstimationStateLoaded
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-pricing-estimation',
  params: {
    apiConfig: { type: Object },
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
  onContextUpdate({ container, context, onEvent, updateComponent, signal }) {
    const { apiConfig, zoneId = 'par', currency = 'EUR' } = context;

    /**
     * This smart component targets `cc-pricing-estimation` but when `currency` changes, we want to trigger
     * a new fetch from all pricing product smart.
     * To do so, this smart component modifies the global `<cc-smart-container>` context wrapping all pricing components.
     * Since all pricing product smart share this context and watch for `currency` changes, it triggers new fetches.
     *
     * For more info, refer to the `Smart` docs about the `cc-pricing-estimation` component in the `Notes` section.
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
 * @param {ApiConfig} [options.apiConfig] - The API configuration.
 * @param {string} options.zoneId - The zone ID.
 * @param {string} options.currency - The currency.
 * @param {AbortSignal} options.signal - The abort signal.
 * @returns {Promise<Omit<PricingEstimationStateLoaded, 'type'>>} A promise that resolves to an array of formatted product prices.
 */
function fetchPrices({ apiConfig, zoneId, currency, signal }) {
  return fetchPriceSystem({ apiConfig, zoneId, currency, signal }).then((priceSystem) => {
    return formatEstimationPrices(priceSystem);
  });
}
