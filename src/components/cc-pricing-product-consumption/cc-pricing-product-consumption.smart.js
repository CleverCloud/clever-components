import './cc-pricing-product-consumption.js';
import '../cc-smart-container/cc-smart-container.js';
import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatAddonCellar, formatAddonFsbucket, formatAddonHeptapod, formatAddonPulsar } from '../../lib/product.js';

defineSmartComponent({
  selector: 'cc-pricing-product-consumption',
  params: {
    apiConfig: { type: Object },
    productId: { type: String },
    zoneId: { type: String },
  },
  onContextUpdate ({ updateComponent, context, signal }) {
    const { apiConfig, productId, zoneId } = context;

    // Reset the component before loading
    updateComponent('product', { state: 'loading' });

    fetchProduct({ apiConfig, productId, zoneId, signal })
      .then((product) => {
        updateComponent('product', {
          name: product.name,
          state: 'loaded',
          sections: product.sections,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('product', { state: 'error' });
      });
  },
});

function fetchProduct ({ apiConfig, productId, zoneId, signal }) {
  return fetchPriceSystem({ apiConfig, zoneId, signal })
    .then((priceSystem) => {
      if (productId === 'cellar') {
        return {
          name: 'Cellar',
          ...formatAddonCellar(priceSystem),
        };
      }
      if (productId === 'fsbucket') {
        return {
          name: 'FS Bucket',
          ...formatAddonFsbucket(priceSystem),
        };
      }
      if (productId === 'pulsar') {
        return {
          name: 'Pulsar',
          ...formatAddonPulsar(priceSystem),
        };
      }
      if (productId === 'heptapod') {
        return {
          name: 'Heptapod',
          ...formatAddonHeptapod(priceSystem),
        };
      }
      throw new Error(`Cannot find product "${productId}"`);
    });

}
