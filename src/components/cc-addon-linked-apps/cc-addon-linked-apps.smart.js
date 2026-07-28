import { ListLinkCommand } from '@clevercloud/client/cc-api-commands/link/list-link-command.js';
import { ListZoneCommand } from '@clevercloud/client/cc-api-commands/zone/list-zone-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-linked-apps.js';

const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * @import { CcAddonLinkedApps } from './cc-addon-linked-apps.js'
 * @import { LinkedApplication } from './cc-addon-linked-apps.types.js'
 * @import { Zone } from '@clevercloud/client/cc-api-commands/zone/zone.types.js'
 * @import { Link } from '@clevercloud/client/cc-api-commands/link/link.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-linked-apps',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonLinkedApps>} args
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
    fetchZones({ apiConfig, signal, ownerId }),
    fetchLinkedApplications({ apiConfig, signal, ownerId, addonId }),
  ]).then(([zones, links]) => {
    return links
      .filter((link) => link.type === 'link-to-application')
      .map((link) => {
        const { name, instance, id, zone: zoneName } = link.application;
        const variantName = instance.variant?.name;
        const variantLogoUrl = instance.variant?.logo;
        const appLink = getApplicationLink(ownerId, id);
        const zone = zones.find((z) => z.name === zoneName);
        return {
          name,
          link: appLink,
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
 * @param {string} parameters.ownerId
 * @param {AbortSignal} parameters.signal
 * @returns {Promise<Zone[]>}
 */
function fetchZones({ apiConfig, signal, ownerId }) {
  return getCcApiClientWithOAuth(apiConfig).send(new ListZoneCommand({ ownerId }), {
    signal,
    cache: { ttl: ONE_DAY },
  });
}

/**
 * @param {Object} parameters
 * @param {ApiConfig} parameters.apiConfig
 * @param {AbortSignal} parameters.signal
 * @param {string} parameters.ownerId
 * @param {string} parameters.addonId
 * @returns {Promise<Link[]>}
 */
function fetchLinkedApplications({ apiConfig, signal, ownerId, addonId }) {
  return getCcApiClientWithOAuth(apiConfig).send(new ListLinkCommand({ ownerId, addonId }), { signal });
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
