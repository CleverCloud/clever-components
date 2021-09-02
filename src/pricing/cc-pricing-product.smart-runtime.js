import './cc-pricing-product.js';
import '../smart/cc-smart-container.js';
import { getAvailableInstances } from '@clevercloud/client/esm/api/v2/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatRuntimeProduct } from '../lib/product.js';
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
        throw new Error(`Unknown variant slug: ${productId}`);
      }
      return runtime;
    });
}
