import './cc-pricing-product-consumption.js';
import '../smart/cc-smart-container.js';
import { fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatAddonCellar, formatAddonFsbucket, formatAddonHeptapod, formatAddonPulsar } from '../lib/product.js';
import { defineComponent } from '../lib/smart-manager.js';

const PRODUCTS = {
  cellar: {
    name: 'Cellar',
    icon: 'https://assets.clever-cloud.com/logos/cellar.svg',
    sections: [
      { type: 'storage' },
      { type: 'outbound-traffic' },
    ],
  },
  fsbucket: {
    name: 'FS Bucket',
    icon: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
    sections: [
      { type: 'storage' },
    ],
  },
  pulsar: {
    name: 'Pulsar',
    icon: 'https://assets.clever-cloud.com/logos/pulsar.svg',
    sections: [
      { type: 'storage' },
      { type: 'inbound-traffic' },
      { type: 'outbound-traffic' },
    ],
  },
  heptapod: {
    name: 'Heptapod',
    icon: 'https://assets.clever-cloud.com/logos/heptapod.svg',
    sections: [
      { type: 'storage' },
      { type: 'private-users' },
      { type: 'public-users' },
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
      product_lp.value$.subscribe((product) => (component.sections = product.sections)),

      context$.subscribe(({ productId, zoneId, currency }) => {

        // TODO, we may need to refine this reset
        component.sections = null;

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
  if (productId === 'heptapod') {
    return formatAddonHeptapod(priceSystem);
  }
  throw new Error(`Cannot find product "${productId}"`);
}
