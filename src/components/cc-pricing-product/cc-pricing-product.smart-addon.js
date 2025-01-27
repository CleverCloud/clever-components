// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllAddonProviders } from '@clevercloud/client/esm/api/v2/product.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { formatAddonProduct } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product.js';

/**
 * @typedef {import('./cc-pricing-product.js').CcPricingProduct} CcPricingProduct
 * @typedef {import('./cc-pricing-product.types.js').PricingProductStateLoaded} PricingProductStateLoaded
 * @typedef {import('../common.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('../common.types.js').RawAddonProvider} RawAddonProvider
 * @typedef {import('../common.types.js').Zone} Zone
 * @typedef {import('../common.types.js').Instance} Instance
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.d.ts').OnContextUpdateArgs<CcPricingProduct>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-pricing-product[mode="addon"]',
  params: {
    apiConfig: { type: Object },
    addonFeatures: { type: Array, optional: true },
    productId: { type: String },
    zoneId: { type: String, optional: true },
    currency: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, productId, zoneId = 'par', addonFeatures, currency = 'EUR' } = context;

    // Reset the component before loading
    updateComponent('state', { type: 'loading' });

    fetchAddonProduct({ apiConfig, zoneId, productId, addonFeatures, currency, signal })
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
 * Fetches addon product information by combining addon provider and price system data.
 *
 * @param {Object} options - The options for fetching addon product.
 * @param {ApiConfig} options.apiConfig - The API configuration.
 * @param {string} options.productId - The ID of the product.
 * @param {string} options.zoneId - The ID of the zone.
 * @param {Array<FormattedFeature['code']>} options.addonFeatures - The features of the addon.
 * @param {string} options.currency - The currency for pricing.
 * @param {AbortSignal} options.signal - The abort signal for the fetch operation.
 * @returns {Promise<Omit<PricingProductStateLoaded, 'type'>>} A promise that resolves to the formatted addon product.
 */
function fetchAddonProduct({ apiConfig, productId, zoneId, addonFeatures, currency, signal }) {
  return Promise.all([
    fetchAddonProvider({ apiConfig, productId, signal }),
    fetchPriceSystem({ apiConfig, zoneId, currency, signal }),
  ]).then(([addonProvider, priceSystem]) => formatAddonProduct(addonProvider, priceSystem, addonFeatures));
}

/**
 * Fetches an addon provider based on the given product ID.
 *
 * @param {Object} options - The options for fetching the addon provider.
 * @param {ApiConfig} options.apiConfig - The API configuration.
 * @param {AbortSignal} options.signal - The abort signal for the fetch operation.
 * @param {string} options.productId - The ID of the product to fetch the addon provider for.
 * @returns {Promise<RawAddonProvider>} A promise that resolves to the addon provider object.
 * @throws {Error} Throws an error if the addon provider is not found.
 */
function fetchAddonProvider({ apiConfig, signal, productId }) {
  return getAllAddonProviders()
    .then(sendToApi({ apiConfig, cacheDelay: ONE_DAY, signal }))
    .then(
      /** @param {Array<RawAddonProvider>} allAddonProviders */
      (allAddonProviders) => {
        const addonProvider = allAddonProviders.find((ap) => ap.id === productId);
        if (addonProvider == null) {
          throw new Error(`Unknown add-on provider ID: ${productId}`);
        }
        return addonProvider;
      },
    );
}
