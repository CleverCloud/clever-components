import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsBetaClient } from './cc-addon-credentials-beta.client.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredentialsBetaStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    api: {
      content: [
        {
          code: 'httpUrl',
          value: 'fake-skeleton',
        },
        {
          code: 'tenant-namespace',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
    },
    cli: {
      content: [
        {
          code: 'url',
          value: 'fake-skeleton',
        },
        {
          code: 'tenant-namespace',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
    },
  },
};
const PROVIDER_ID = 'addon-pulsar';

/**
 * @import { CcAddonCredentialsBeta } from './cc-addon-credentials-beta.js'
 * @import { AddonCredentialsBetaStateLoaded, AddonCredentialsBetaStateLoading, PulsarProviderInfo, PulsarClusterInfo } from './cc-addon-credentials-beta.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="pulsar"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentialsBeta>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', LOADING_STATE);

    api
      .getAllCredentials()
      .then(({ api, cli }) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            const updatedTabs = {
              api: {
                ...state.tabs.api,
                content: api,
              },
              cli: {
                ...state.tabs.cli,
                content: cli,
              },
            };

            state.tabs = updatedTabs;
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api extends CcAddonCredentialsBetaClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /**
   *
   * @param {string} realId
   * @returns {Promise<PulsarProviderInfo>}
   */
  _getAddonProvider(realId) {
    return getAddonProvider({ providerId: this._providerId, addonId: realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} clusterId
   * @return {Promise<PulsarClusterInfo>}
   */
  _getCluster(clusterId) {
    return getCluster({ providerId: PROVIDER_ID, clusterId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {'api' | 'cli'} tabType
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials(tabType) {
    const rawAddon = await this._getAddon();
    const realId = rawAddon.realId;
    const addonProvider = /** @type {PulsarProviderInfo} */ (await this._getAddonProvider(realId));
    const addonCluster = await this._getCluster(addonProvider.cluster_id);
    let url;
    if (addonCluster.pulsar_tls_port != null) {
      url = `pulsar+ssl://${addonCluster.url}:${addonCluster.pulsar_tls_port}`;
    } else if (addonCluster.pulsar_port != null) {
      url = `pulsar+ssl://${addonCluster.url}:${addonCluster.pulsar_port}`;
    } else {
      throw new Error('Missing TLS port and default port');
    }
    switch (tabType) {
      case 'api':
        return [
          {
            code: 'httpUrl',
            value: `https://${addonCluster.url}:${addonCluster.web_tls_port}`,
          },
          {
            code: 'tenant-namespace',
            value: `${addonProvider.tenant}/${rawAddon.realId}`,
          },
          {
            code: 'token',
            value: addonProvider.token,
          },
        ];
      case 'cli':
        return [
          {
            code: 'url',
            value: url,
          },
          {
            code: 'tenant-namespace',
            value: `${addonProvider.tenant}/${rawAddon.realId}`,
          },
          {
            code: 'token',
            value: addonProvider.token,
          },
        ];
    }
  }

  /**
   * @return {Promise<{api: AddonCredential[], cli: AddonCredential[]}>}
   */
  async getAllCredentials() {
    const [apiCredentials, cliCredentials] = await Promise.all([
      this.getCredentials('api'),
      this.getCredentials('cli'),
    ]);

    return {
      api: apiCredentials,
      cli: cliCredentials,
    };
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
