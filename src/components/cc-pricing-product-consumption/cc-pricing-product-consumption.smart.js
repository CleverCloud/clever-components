import { fetchPriceSystem } from '../../lib/api-helpers.js';
import { formatAddonCellar, formatAddonFsbucket, formatAddonHeptapod, formatAddonPulsar } from '../../lib/product.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-product-consumption.js';

/**
 * @import { CcPricingProductConsumption } from './cc-pricing-product-consumption.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-pricing-product-consumption',
  params: {
    apiConfig: { type: Object },
    productId: { type: String },
    zoneId: { type: String, optional: true },
    currency: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcPricingProductConsumption>} args
   */
  onContextUpdate({ updateComponent, context, signal }) {
    const { apiConfig, productId, zoneId = 'par', currency = 'EUR' } = context;

    // Reset the component before loading
    updateComponent('state', { type: 'loading' });

    fetchProduct({ apiConfig, productId, zoneId, currency, signal })
      .then((product) => {
        updateComponent('state', {
          type: 'loaded',
          name: product.name,
          sections: product.sections,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {object} params
 * @param {ApiConfig} [params.apiConfig]
 * @param {string} params.productId
 * @param {string} params.zoneId
 * @param {string} params.currency
 * @param {AbortSignal} params.signal
 */
function fetchProduct({ apiConfig, productId, zoneId, currency, signal }) {
  return fetchPriceSystem({ apiConfig, zoneId, currency, signal }).then((priceSystem) => {
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
