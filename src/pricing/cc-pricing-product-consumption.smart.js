import './cc-pricing-product-consumption.js';
import '../smart/cc-smart-container.js';
import { fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatAddonCellar, formatAddonFsbucket, formatAddonPulsar } from '../lib/product.js';
import { defineComponent } from '../lib/smart-manager.js';

const PRODUCTS = {
  cellar: {
    name: 'Cellar',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/cellar.svg',
    sections: [
      { type: 'storage' },
      { type: 'outbound-traffic' },
    ],
  },
  fsbucket: {
    name: 'FS Bucket',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/fsbucket.svg',
    sections: [
      { type: 'storage' },
    ],
  },
  pulsar: {
    name: 'Pulsar',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/pulsar.svg',
    sections: [
      { type: 'storage' },
      { type: 'inbound-traffic' },
      { type: 'outbound-traffic' },
    ],
  },
};

defineComponent({
  selector: 'cc-pricing-product-consumption',
  params: {
    currency: { type: Object },
    productId: { type: String },
    zoneId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const product_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      product_lp.error$.subscribe(console.error),
      product_lp.error$.subscribe(() => (component.error = true)),
      product_lp.value$.subscribe((product) => {
        component.sections = product.sections;
      }),

      context$.subscribe(({ productId, zoneId, currency }) => {

        if (currency != null) {
          component.currency = currency;
        }

        const product = PRODUCTS[productId];
        if (product != null) {
          Object.entries(product).forEach(([key, value]) => {
            component[key] = value;
          });
          product_lp.push((signal) => fetchProduct({ signal, productId, zoneId }));
        }
      }),

    ]);
  },
});

async function fetchProduct ({ signal, productId, zoneId = 'PAR' }) {
  const priceSystem = await fetchPriceSystem({ signal, zoneId });
  if (productId === 'cellar') {
    return formatAddonCellar(priceSystem);
  }
  if (productId === 'fsbucket') {
    return formatAddonFsbucket(priceSystem);
  }
  if (productId === 'pulsar') {
    return formatAddonPulsar(priceSystem);
  }
  throw new Error(`Cannot find product "${productId}"`);
}
