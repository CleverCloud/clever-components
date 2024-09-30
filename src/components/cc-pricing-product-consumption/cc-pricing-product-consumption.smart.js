import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { formatAddonCellar, formatAddonFsbucket, formatAddonHeptapod, formatAddonPulsar } from '../../lib/product.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product-consumption.js';

/**
 * @typedef {import('./cc-pricing-product-consumption.js').CcPricingProductConsumption} CcPricingProductConsumption
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-pricing-product-consumption',
  params: {
    productId: { type: String },
    zoneId: { type: String },
  },
  /**
   * @param {Object} settings
   * @param {CcPricingProductConsumption} settings.component
   * @param {{ apiConfig: ApiConfig, productId: string, zoneId: string }} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is typed with generics
  onContextUpdate({ updateComponent, context, signal }) {
    const { productId, zoneId } = context;

    // Reset the component before loading
    updateComponent('product', { state: 'loading' });

    fetchProduct({ productId, zoneId, signal })
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

/**
 * @param {object} params
 * @param {string} params.productId
 * @param {string} params.zoneId
 * @param {AbortSignal} params.signal
 */
function fetchProduct({ productId, zoneId, signal }) {
  return fetchPriceSystem({ zoneId, signal }).then((priceSystem) => {
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
