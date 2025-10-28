import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'addon-pulsar';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.d.ts').PulsarProviderInfo} PulsarProviderInfo
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="pulsar"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} _
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;

    const api = new Api({ apiConfig, ownerId, addonId, signal });

    /**
     * @type {AddonInfoStateLoading}
     */
    const LOADING_STATE = {
      type: 'loading',
      version: {
        stateType: 'up-to-date',
        installed: '0.0.0',
        latest: '0.0.0',
      },
      creationDate: '2025-08-06 15:03:00',
    };

    updateComponent('state', { type: 'loading', ...LOADING_STATE });
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.pulsar'),
      href: generateDocsHref('/addons/pulsar'),
    });

    api
      .getPulsarAddonInfo()
      .then(({ rawAddon, clusterVersion }) => {
        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: clusterVersion,
            latest: clusterVersion,
          },
          creationDate: rawAddon.creationDate,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api extends CcAddonInfoClient {
  /**
   * @param {Object} config - Configuration object
   * @param {ApiConfig} config.apiConfig - API configuration
   * @param {string} config.ownerId - Owner identifier
   * @param {string} config.addonId - Addon identifier
   * @param {AbortSignal} config.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /**
   * @param {string} realId
   * @return {Promise<PulsarProviderInfo>}
   */
  _getAddonProvider(realId) {
    return getAddonProvider({ providerId: PROVIDER_ID, addonId: realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} clusterId
   * @return {Promise<{ version: string }>}
   */
  _getCluster(clusterId) {
    return getCluster({ providerId: PROVIDER_ID, clusterId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @returns {Promise<{ rawAddon: RawAddon, clusterVersion: string }>}
   */
  async getPulsarAddonInfo() {
    const rawAddon = await this._getAddon();
    const realId = rawAddon.realId;
    const addonProvider = await this._getAddonProvider(realId);
    const cluster = await this._getCluster(addonProvider.cluster_id);
    const clusterVersion = cluster.version;
    return { rawAddon, clusterVersion };
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/**
 * @param {Object} params
 * @param {String} params.providerId
 * @param {String} params.addonId
 */
export function getAddonProvider(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${params.providerId}/addons/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

// FIXME: remove and use the clever-client call from the new clever-client
/**
 * @param {Object} params
 * @param {String} params.providerId
 * @param {String} params.clusterId
 */
export function getCluster(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${params.providerId}/clusters/${params.clusterId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}
