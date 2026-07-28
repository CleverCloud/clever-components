import { ListProductRuntimeCommand } from '@clevercloud/client/cc-api-commands/product/list-product-runtime-command.js';
import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { formatRuntimeProduct, getRunnerProduct } from '../../lib/product.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product.js';

/**
 * @import { CcPricingProduct } from './cc-pricing-product.js'
 * @import { PricingProductStateLoaded } from './cc-pricing-product.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 * @import { ProductRuntime } from '@clevercloud/client/cc-api-commands/product/product.types.js'
 */

const ONE_DAY = 1000 * 60 * 60 * 24;

defineSmartComponent({
  selector: 'cc-pricing-product[mode="runtime"]',
  params: {
    apiConfig: { type: Object },
    productId: { type: String },
    zoneId: { type: String, optional: true },
    currency: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcPricingProduct>} args
   */
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
 * @returns {Promise<ProductRuntime>} A promise that resolves to the runtime information.
 * @throws {Error} Throws an error if the product is not found and is not a runner.
 */
function fetchRuntime({ apiConfig, productId, signal }) {
  const ccApiClient = getCcApiClientWithOAuth(apiConfig);
  // This endpoint is anonymous/public: we never pass an `ownerId` here (same as before the migration).
  // @ts-expect-error FIXME: `getRunnerProduct()` may return a `Partial<ProductRuntime>` (or `void`), which doesn't strictly match `ProductRuntime`
  return ccApiClient.send(new ListProductRuntimeCommand(), { signal, cache: { ttl: ONE_DAY } }).then(
    /** @param {Array<ProductRuntime>} allRuntimes */
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
