// @ts-expect-error FIXME: remove when clever-client exports types
import { getAvailableInstances } from '@clevercloud/client/esm/api/v2/product.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatRuntimeProduct, getRunnerProduct } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product.js';

/**
 * @typedef {import('./cc-pricing-product.js').CcPricingProduct} CcPricingProduct
 * @typedef {import('./cc-pricing-product.types.js').PricingProductStateLoaded} PricingProductStateLoaded
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../common.types.js').Zone} Zone
 * @typedef {import('../common.types.js').Instance} Instance
 */

defineSmartComponent({
  selector: 'cc-pricing-product[mode="runtime"]',
  params: {
    apiConfig: { type: Object },
    productId: { type: String },
    zoneId: { type: String, optional: true },
    currency: { type: String, optional: true },
  },
  /**
   * @param {Object} settings
   * @param {CcPricingProduct} settings.component
   * @param {{apiConfig: ApiConfig, productId: string, zoneId?: string, currency?: string }} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {Function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, productId, zoneId = 'par', currency = 'EUR' } = context;

    // Reset the component before loading
    updateComponent('state', { type: 'loading' });

    fetchRuntimeProduct({ apiConfig, productId, zoneId, currency, signal })
      .then((productDetails) => {
        updateComponent('state', {
          type: 'loaded',
          name: productDetails.name,
          productFeatures: productDetails.productFeatures,
          plans: productDetails.plans,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * Fetches runtime product information by combining runtime and price system data.
 * @async
 * @param {Object} options - The options for fetching the runtime product.
 * @param {ApiConfig} options.apiConfig - The API configuration.
 * @param {string} options.productId - The ID of the product.
 * @param {string} options.zoneId - The ID of the zone.
 * @param {string} options.currency - The currency for pricing.
 * @param {AbortSignal} options.signal - The abort signal.
 * @returns {Promise<Omit<PricingProductStateLoaded, 'type'>>} A promise that resolves to the formatted runtime product.
 */
function fetchRuntimeProduct({ apiConfig, productId, zoneId, currency, signal }) {
  return Promise.all([
    fetchRuntime({ apiConfig, productId, signal }),
    fetchPriceSystem({ apiConfig, zoneId, currency, signal }),
  ]).then(([runtime, priceSystem]) => formatRuntimeProduct(runtime, priceSystem));
}

/**
 * Fetches runtime information for a specific product.
 * @async
 * @param {Object} options - The options for fetching the runtime.
 * @param {ApiConfig} options.apiConfig - The API configuration.
 * @param {string} options.productId - The ID of the product.
 * @param {AbortSignal} options.signal - The abort signal.
 * @returns {Promise<Instance>} A promise that resolves to the runtime information.
 * @throws {Error} Throws an error if the product is not found and is not a runner.
 */
function fetchRuntime({ apiConfig, productId, signal }) {
  return getAvailableInstances()
    .then(sendToApi({ apiConfig, cacheDelay: ONE_DAY, signal }))
    .then(
      /** @param {Array<Instance>} allRuntimes */
      (allRuntimes) => {
        const runtime = allRuntimes.find((f) => f.variant.slug === productId);
        if (runtime == null) {
          // For now, we have special cases for runners.
          // If the API does not return the product, we provided some hard coded ones.
          // This is only the list of plans with features, the prices come from the API.
          const runnerProduct = getRunnerProduct(productId);
          if (runnerProduct != null) {
            return runnerProduct;
          }
          throw new Error(`Unknown variant slug: ${productId}`);
        }
        return runtime;
      },
    );
}
