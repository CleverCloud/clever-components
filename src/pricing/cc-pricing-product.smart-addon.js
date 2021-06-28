import './cc-pricing-product.js';
import '../smart/cc-smart-container.js';
import { getAllAddonProviders } from '@clevercloud/client/esm/api/v2/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { fetchCurrency, fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatAddonProduct } from '../lib/product.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-pricing-product[mode="addon"]',
  params: {
    productId: { type: String },
    zoneId: { type: String },
    currencyCode: { type: String },
    addonFeatures: { type: Array },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const product_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      product_lp.error$.subscribe(console.error),
      product_lp.error$.subscribe(() => (component.error = true)),
      product_lp.value$.subscribe((product) => {
        console.log('product changed', product);
        component.name = product.name;
        component.icon = product.icon;
        component.description = product.description;
        component.items = product.items;
        component.features = product.features;
        component.currency = product.currency;
      }),

      context$.subscribe(({ productId, zoneId, currencyCode, addonFeatures }) => {
        product_lp.push((signal) => fetchAddonProduct({ signal, productId, zoneId, currencyCode, addonFeatures }));
      }),

    ]);

  },
});

async function fetchAddonProduct ({ signal, productId, zoneId = 'PAR', currencyCode = 'EUR', addonFeatures }) {

  const [addonProvider, priceSystem, currency] = await Promise.all([
    fetchAddonProvider({ signal, productId }),
    fetchPriceSystem({ signal, zoneId }),
    fetchCurrency({ signal, currencyCode }),
  ]);

  return formatAddonProduct(addonProvider, priceSystem, addonFeatures, currency);
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
