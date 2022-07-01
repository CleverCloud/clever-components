import './cc-pricing-product.js';
import '../smart/cc-smart-container.js';
import { getAllAddonProviders } from '@clevercloud/client/esm/api/v2/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatAddonProduct } from '../lib/product.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-pricing-product[mode="addon"]',
  params: {
    productId: { type: String },
    zoneId: { type: String },
    currency: { type: Object },
    addonFeatures: { type: Array },
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

      context$.subscribe(({ productId, zoneId, currency, addonFeatures }) => {

        component.error = false;
        component.name = null;
        component.icon = null;
        component.description = null;
        component.plans = null;
        component.features = null;

        if (currency != null) {
          component.currency = currency;
        }

        product_lp.push((signal) => fetchAddonProduct({ signal, productId, zoneId, addonFeatures }));
      }),

    ]);

  },
});

async function fetchAddonProduct ({ signal, productId, zoneId = 'PAR', addonFeatures }) {

  const [addonProvider, priceSystem] = await Promise.all([
    fetchAddonProvider({ signal, productId }),
    fetchPriceSystem({ signal, zoneId }),
  ]);

  return formatAddonProduct(addonProvider, priceSystem, addonFeatures);
}

function fetchAddonProvider ({ signal, productId }) {
  return getAllAddonProviders()
    .then(sendToApi({ signal, cacheDelay: ONE_DAY }))
    .then((allAddonProviders) => {
      const addonProvider = allAddonProviders.find((ap) => ap.id === productId);
      if (addonProvider == null) {
        throw new Error(`Unknown add-on provider ID: ${productId}`);
      }
      return addonProvider;
    });
}
