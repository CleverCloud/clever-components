// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-pricing-header.js';

/**
 * @typedef {import('./cc-pricing-header.js').CcPricingHeader} CcPricingHeader
 * @typedef {import('./cc-pricing-header.types.js').PricingHeaderStateLoaded} PricingHeaderStateLoaded
 * @typedef {import('../common.types.js').Zone} Zone
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart-component.types.js').OnContextUpdateArgs<CcPricingHeader>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-pricing-header',
  params: {
    apiConfig: { type: Object },
    zoneId: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, zoneId = 'par' } = context;

    /**
     * This smart component targets `cc-pricing-header` but when `zoneId` changes, we want to trigger
     * a new fetch from all pricing product smart.
     * To do so, this smart component modifies the global `<cc-smart-container>` context wrapping all pricing components.
     * Since all pricing product smart share this context and watch for `currency` changes, it triggers new fetches.
     *
     * For more info, refer to the `Smart` docs about the `cc-pricing-header` component in the `Notes` section.
     */
    onEvent(
      'cc-pricing-header:change-zone',
      /** @param {string} zoneId */
      (zoneId) => {
        container.context = { ...container.context, zoneId };
      },
    );

    /**
     * This smart component targets `cc-pricing-header` but when `currency` changes, we want to trigger
     * a new fetch from all pricing product smart.
     * To do so, this smart component modifies the global `<cc-smart-container>` context wrapping all pricing components.
     * Since all pricing product smart share this context and watch for `currency` changes, it triggers new fetches.
     *
     * For more info, refer to the `Smart` docs about the `cc-pricing-header` component in the `Notes` section.
     */
    onEvent(
      'cc-pricing-header:change-currency',
      /** @param {string} currency */
      (currency) => {
        container.context = { ...container.context, currency };
      },
    );

    /**
     * Zones data is not dynamic and not context dependant.
     * We only need to fetch these once and we don't want to fetch
     * these everytime zoneId changes.
     *
     * The only thing we want to do when zoneId changes is to make sure
     * we update `cc-pricing-header` accordingly.
     */
    if (component.state.type === 'loading') {
      fetchAllZones({ apiConfig, signal })
        .then((zones) => {
          updateComponent('state', { type: 'loaded', zones });
          updateComponent('selectedZoneId', zoneId);
        })
        .catch((error) => {
          updateComponent('state', { type: 'error' });
          console.error(error);
        });
    } else {
      updateComponent('selectedZoneId', zoneId);
    }
  },
});

/**
 * @param {Object} parameters
 * @param {ApiConfig} [parameters.apiConfig]
 * @param {AbortSignal} parameters.signal
 * @returns {Promise<Zone[]>}
 */
function fetchAllZones({ apiConfig, signal }) {
  return getAllZones()
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }))
    .then(
      /**
       * @param {Zone[]} zones
       * @returns {Zone[]}
       **/
      (zones) => zones.filter((zone) => zone.tags.includes('for:applications')).map((zone) => cleanZoneTags(zone)),
    );
}

/**
 * Removes tags starting by "for:" because we only keep zones with the "for:applications"
 *
 * @param {Zone} zone - the zone to clean
 * @return {Zone} the zone without "for:" tags
 */
function cleanZoneTags(zone) {
  const tags = zone.tags.filter((t) => !t.startsWith('for:'));
  return { ...zone, tags };
}
