import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product.js';
import { getAllAddonProviders } from '@clevercloud/client/esm/api/v2/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatAddonProduct } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';

defineSmartComponent({
  selector: 'cc-pricing-product[mode="addon"]',
  params: {
    apiConfig: { type: Object },
    addonFeatures: { type: Array },
    productId: { type: String },
    zoneId: { type: String },
  },
  onContextUpdate ({ context, updateComponent, signal }) {
    const { apiConfig, productId, zoneId, addonFeatures } = context;

    // Reset the component before loading
    updateComponent('state', { state: 'loading' });

    fetchAddonProduct({ apiConfig, zoneId, productId, addonFeatures, signal })
      .then((productDetails) => {
        updateComponent('product', {
          state: 'loaded',
          name: productDetails.name,
          productFeatures: productDetails.productFeatures,
          plans: productDetails.plans,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('product', { state: 'error' });
      });
  },
});

function fetchAddonProduct ({ apiConfig, productId, zoneId, addonFeatures, signal }) {
  return Promise.all([
    fetchAddonProvider({ apiConfig, productId, signal }),
    fetchPriceSystem({ apiConfig, zoneId, signal }),
  ]).then(([addonProvider, priceSystem]) => formatAddonProduct(addonProvider, priceSystem, addonFeatures));
}

function fetchAddonProvider ({ apiConfig, signal, productId }) {
  return getAllAddonProviders()
    .then(sendToApi({ apiConfig, cacheDelay: ONE_DAY, signal }))
    .then((allAddonProviders) => {
      const addonProvider = allAddonProviders.find((ap) => ap.id === productId);
      if (addonProvider == null) {
        throw new Error(`Unknown add-on provider ID: ${productId}`);
      }
      return addonProvider;
    });
}
