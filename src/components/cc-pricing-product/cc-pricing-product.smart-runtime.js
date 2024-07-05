import { getAvailableInstances } from '@clevercloud/client/esm/api/v2/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatRuntimeProduct, getRunnerProduct } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product.js';

defineSmartComponent({
  selector: 'cc-pricing-product[mode="runtime"]',
  params: {
    productId: { type: String },
    zoneId: { type: String },
  },
  onContextUpdate({ context, updateComponent, signal }) {
    const { productId, zoneId } = context;

    // Reset the component before loading
    updateComponent('state', { state: 'loading' });

    fetchRuntimeProduct({ productId, zoneId, signal })
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

function fetchRuntimeProduct({ productId, zoneId, signal }) {
  return Promise.all([fetchRuntime({ productId, signal }), fetchPriceSystem({ zoneId, signal })]).then(
    ([runtime, priceSystem]) => formatRuntimeProduct(runtime, priceSystem),
  );
}

function fetchRuntime({ productId, signal }) {
  return getAvailableInstances()
    .then(sendToApi({ cacheDelay: ONE_DAY, signal }))
    .then((allRuntimes) => {
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
    });
}
