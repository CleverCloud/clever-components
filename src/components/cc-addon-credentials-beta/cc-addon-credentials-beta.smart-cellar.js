import { getAllEnvVars as getAddonEnv } from '@clevercloud/client/esm/api/v2/addon.js';
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
    default: {
      content: [
        {
          code: 'host',
          value: 'fake-skeleton',
        },
        {
          code: 'key-id',
          value: 'fake-skeleton',
        },
        {
          code: 'key-secret',
          value: 'fake-skeleton',
        },
        {
          code: 'download-file',
          value: 'fake-skeleton',
        },
      ],
    },
  },
};
const PROVIDER_ID = 'cellar-addon';

/**
 * @import { CcAddonCredentialsBeta } from './cc-addon-credentials-beta.js'
 * @import { CellarCredentials, AddonCredentialsBetaStateLoaded, AddonCredentialsBetaStateLoading } from './cc-addon-credentials-beta.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    cellarId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentialsBeta>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId, cellarId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal }, cellarId);

    updateComponent('state', LOADING_STATE);

    api
      .getAllCredentials()
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
   * @param {string} cellarId - Cellar identifier
   */
  constructor({ apiConfig, ownerId, addonId, signal }, cellarId) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
    this._cellarId = cellarId;
  }

  _getAddonEnv() {
    return getAddonEnv({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @return {Promise<CellarCredentials>}
   */
  _getCredentials() {
    return getCellarCredentials({ ownerId: this._ownerId, cellarId: this._cellarId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @return {Promise<string>}
   */
  _getPresignedUrl() {
    return getCellarPresignedUrl({ ownerId: this._ownerId, cellarId: this._cellarId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }))
      .then(({ url }) => url);
  }

  /**
   * @return {Promise<AddonCredential[]>}
   */
  async getAllCredentials() {
    const credential = await this._getCredentials();
    const presignedUrl = await this._getPresignedUrl();
    return [
      {
        code: 'host',
        value: credential.host,
      },
      {
        code: 'key-id',
        value: credential.keyId,
      },
      {
        code: 'key-secret',
        value: credential.keySecret,
      },
      {
        code: 'download-file',
        value: presignedUrl,
      },
    ];
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, cellarId: string }} params */
function getCellarCredentials(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/cellar/organisations/${params.ownerId}/cellar/${params.cellarId}/credentials`,
    // no queryParams
    // no body
  });
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, cellarId: string }} params */
function getCellarPresignedUrl(params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/cellar/organisations/${params.ownerId}/cellar/${params.cellarId}/credentials/presigned-url`,
    // no queryParams
    // no body
  });
}
