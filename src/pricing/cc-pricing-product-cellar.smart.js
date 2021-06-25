import './cc-pricing-product-cellar.js';
import '../smart/cc-smart-container.js';
import { fetchCurrency, fetchPriceSystem } from '../lib/api-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { formatAddonCellar } from '../lib/product.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-pricing-product-cellar',
  params: {
    currencyCode: { type: String },
    zoneId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const product_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      product_lp.error$.subscribe(console.error),
      product_lp.error$.subscribe(() => (component.error = true)),
      product_lp.value$.subscribe((product) => {
        component.intervals = product.intervals;
        component.currency = product.currency;
      }),

      context$.subscribe(({ zoneId, currencyCode }) => {
        product_lp.push((signal) => fetchProduct({ signal, zoneId, currencyCode }));
      }),

    ]);

    // Trigger API call on empty context.
    // We may improve this later.
    product_lp.push((signal) => fetchProduct({ signal }));

  },
});

async function fetchProduct ({ signal, zoneId = 'PAR', currencyCode = 'EUR' }) {
  const [priceSystem, currency] = await Promise.all([
    fetchPriceSystem({ signal, zoneId }),
    fetchCurrency({ signal, currencyCode }),
  ]);
  return formatAddonCellar(priceSystem, currency);
}
