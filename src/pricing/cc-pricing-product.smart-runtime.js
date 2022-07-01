import './cc-pricing-product.js';
import '../smart/cc-smart-container.js';
import { getAvailableInstances } from '@clevercloud/client/esm/api/v2/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatRuntimeProduct, getRunnerProduct } from '../lib/product.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-pricing-product[mode="runtime"]',
  params: {
    productId: { type: String },
    zoneId: { type: String },
    currency: { type: Object },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const product_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      product_lp.error$.subscribe(console.error),
      product_lp.error$.subscribe(() => (component.error = true)),
      product_lp.value$.subscribe((product) => {
        component.name = product.name;
        component.icon = product.icon;
        component.description = product.description;
        component.plans = product.plans;
        component.features = product.features;
      }),

      context$.subscribe(({ productId, zoneId, currency }) => {

        component.error = false;
        component.name = null;
        component.icon = null;
        component.description = null;
        component.plans = null;
        component.features = null;

        if (currency != null) {
          component.currency = currency;
        }

        product_lp.push((signal) => fetchRuntimeProduct({ signal, productId, zoneId }));
      }),

    ]);

  },
});

async function fetchRuntimeProduct ({ signal, productId, zoneId = 'PAR' }) {

  const [runtime, priceSystem] = await Promise.all([
    fetchRuntime({ signal, productId }),
    fetchPriceSystem({ signal, zoneId }),
  ]);

  return formatRuntimeProduct(runtime, priceSystem);
}

function fetchRuntime ({ signal, productId }) {
  return getAvailableInstances()
    .then(sendToApi({ signal, cacheDelay: ONE_DAY }))
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
