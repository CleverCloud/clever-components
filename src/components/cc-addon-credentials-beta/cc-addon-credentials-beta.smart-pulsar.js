// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsBetaClient } from './cc-addon-credentials-beta.client.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredentialsBetaStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    default: {
      content: [
        {
          code: 'url',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
        {
          code: 'tenant',
          value: 'fake-skeleton',
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.pulsar'),
        href: generateDocsHref('/addons/pulsar/'),
      },
    },
  },
};
const PROVIDER_ID = 'addon-pulsar';

/**
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoaded} AddonCredentialsBetaStateLoaded
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoading} AddonCredentialsBetaStateLoading
 * @typedef {import('./cc-addon-credentials-beta.types.js').PulsarProviderInfo} PulsarProviderInfo
 * @typedef {import('./cc-addon-credentials-beta.types.js').PulsarClusterInfo} PulsarClusterInfo
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgEnabled} AddonCredentialNgEnabled
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgDisabled} AddonCredentialNgDisabled
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonCredentialsBeta>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="pulsar"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', LOADING_STATE);

    api
      .getCredentials()
      .then((credentials) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs.default.content = credentials;
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
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials() {
    const rawAddon = await this._getAddon();
    const realId = rawAddon.realId;
    const addonProvider = /** @type {PulsarProviderInfo} */ (await this._getAddonProvider(realId));
    const addonCluster = await this._getCluster(addonProvider.cluster_id);
    return [
      {
        code: 'url',
        value: addonCluster.url,
      },
      {
        code: 'token',
        value: addonProvider.token,
      },
      {
        code: 'tenant',
        value: addonProvider.tenant,
      },
    ];
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
