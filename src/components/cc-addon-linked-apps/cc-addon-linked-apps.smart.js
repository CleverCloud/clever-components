// @ts-expect-error FIXME: remove when clever-client exports types
import { getLinkedApplications } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-linked-apps.js';

/**
 * @typedef {import('./cc-addon-linked-apps.js').CcAddonLinkedApps} CcAddonLinkedApps
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsStateLoaded} AddonLinkedAppsStateLoaded
 * @typedef {import('./cc-addon-linked-apps.types.js').LinkedApplication} LinkedApplication
 * @typedef {import('../common.types.js').Zone} Zone
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.d.ts').OnContextUpdateArgs<CcAddonLinkedApps>} OnContextUpdateArgs
 * @typedef {{ variant: { logo: string, name: string }}} Instance
 * @typedef {{ name: string, instance: Instance, id: string, zone: string }} RawApp
 */

defineSmartComponent({
  selector: 'cc-addon-linked-apps',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { apiConfig, ownerId, addonId } = context;

    fetchApplications({ apiConfig, ownerId, addonId, signal })
      .then((linkedApplications) => {
        updateComponent('state', { type: 'loaded', linkedApplications });
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
 * @param {string} parameters.ownerId
 * @param {string} parameters.addonId
 * @returns {Promise<LinkedApplication[]>}
 */
function fetchApplications({ apiConfig, signal, ownerId, addonId }) {
  return Promise.all([
    fetchZones({ apiConfig, signal }),
    fetchLinkedApplications({ apiConfig, signal, ownerId, addonId }),
  ]).then(([zones, applications]) => {
    return applications.map((app) => {
      const { name, instance } = app;
      const variantName = instance.variant?.name;
      const variantLogoUrl = instance.variant?.logo;
      const link = getApplicationLink(ownerId, app.id);
      const zone = zones.find((z) => z.name === app.zone);
      return {
        name,
        link,
        variantName,
        variantLogoUrl,
        zone,
      };
    });
  });
}

/**
 * @param {Object} parameters
 * @param {ApiConfig} parameters.apiConfig
 * @param {AbortSignal} parameters.signal
 * @returns {Promise<Zone[]>}
 */
function fetchZones({ apiConfig, signal }) {
  return getAllZones().then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
}

/**
 * @param {Object} parameters
 * @param {ApiConfig} parameters.apiConfig
 * @param {AbortSignal} parameters.signal
 * @param {string} parameters.ownerId
 * @param {string} parameters.addonId
 * @returns {Promise<RawApp[]>}
 */
function fetchLinkedApplications({ apiConfig, signal, ownerId, addonId }) {
  return getLinkedApplications({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {string} ownerId
 * @param {string} appId
 * @returns {string}
 */
function getApplicationLink(ownerId, appId) {
  return ownerId.startsWith('orga_')
    ? `/organisations/${ownerId}/applications/${appId}`
    : `/users/me/applications/${appId}`;
}
