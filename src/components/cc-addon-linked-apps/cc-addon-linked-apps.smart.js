// @ts-expect-error FIXME: remove when clever-client exports types
import { getLinkedApplications } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-linked-apps.js';

/**
 * @typedef {import('../common.types.js').Zone} Zone
 * @typedef {import('./cc-addon-linked-apps.types.js').LinkedApplication} LinkedApplication
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsStateLoaded} AddonLinkedAppsStateLoaded
 * @typedef {{ variant: { logo: string, name: string }}} Instance
 * @typedef {{ name: string, instance: Instance, id: string, zone: string }} RawApp
 * @typedef {import('./cc-addon-linked-apps.js').CcAddonLinkedApps} CcAddonLinkedApps
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-addon-linked-apps',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   *
   * @param {Object} settings
   * @param {CcAddonLinkedApps} settings.component
   * @param {{apiConfig: ApiConfig, ownerId: string, addonId: string }} settings.context
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is typed with generics
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
