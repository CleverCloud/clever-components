
import './cc-ct-zone-select-list.js';
import '../cc-smart-container/cc-smart-container.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import {
  iconCleverOracle as iconOracle,
  iconCleverCleverCloud as iconCleverCloud,
  iconCleverOvh as iconOvh,
  iconCleverOvhHds as iconOvhHds,
  iconCleverScaleway as iconScaleway,
  iconCleverOvhHds,
} from '../../assets/cc-clever.icons.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { sendToApi } from '../../lib/send-to-api.js';

/**
 * @typedef {import('../cc-article-card/cc-article-card.types.js').ArticleCard} ArticleCard
 */

defineSmartComponent({
  selector: 'cc-ct-zone-select-list',
  params: {
    apiConfig: { type: Object },
  },
  onContextUpdate ({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { apiConfig } = context;

    fetchZones({ apiConfig, signal })
      .then((zones) => {
        // const zonesWithLogo = zones.map((z) => {
        //   return { ...z, logo: getInfraProviderLogoUrl(z.name) };
        // });
        console.log(zones);
        updateComponent('state', { type: 'loaded', zoneItems: formatZones(zones) });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

/**
 * @param {Object} parameters
 * @param {ApiConfig} parameters.apiConfig
 * @param {AbortSignal} parameters.signal
 * @returns {Promise<Zone[]>}
 */
function fetchZones ({ apiConfig, signal }) {
  return getAllZones().then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
}

function formatZones (zones) {
  return zones.map((zone) => ({
    name: zone.name,
    city: zone.city,
    infra: getLogo(zone.tags.find((t) => t.startsWith('infra:')).split('infra:')[1]),
    countryCode: zone.countryCode,
    tags: zone.tags.includes('green') ? ['green'] : [],
  }));
}

function getLogo (infraName) {
  switch (infraName) {
    case 'clever-cloud':
      return iconCleverCloud;
    case 'ovh':
      return iconOvh;
    case 'ovh-hds':
      return iconCleverOvhHds;
    case 'scaleway':
      return iconScaleway;
    case 'oracle':
      return iconOracle;
    default:
      return null;
  }
}
