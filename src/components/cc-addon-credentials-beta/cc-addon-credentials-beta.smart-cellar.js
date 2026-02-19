import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
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
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentialsBeta>} args
   */
  async onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

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

    onEvent('cc-addon-credentials-renew-secret', async () => {
      updateComponent('state', (state) => {
        state.type = 'waiting';
      });

      try {
        await api.renewSecret();
      } catch (error) {
        console.error(error);
        notifyError(i18n('cc-addon-credentials.renew-secret.error'));
        updateComponent('state', (state) => {
          state.type = 'loaded';
        });
        return;
      }

      try {
        const credentials = await api.getAllCredentials();
        notifySuccess(i18n('cc-addon-credentials.renew-secret.success'));
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs.default.content = credentials;
          },
        );
      } catch (error) {
        console.error(error);
        notifySuccess(i18n('cc-addon-credentials.renew-secret.success'));
        notifyError(i18n('cc-addon-credentials.get-credentials.error'));
        updateComponent('state', (state) => {
          state.type = 'loaded';
        });
      }
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
   * @return {Promise<CellarCredentials>}
   */
  async _getCredentials() {
    const rawAddon = await this._getAddon();
    return getCellarCredentials({ ownerId: this._ownerId, cellarId: rawAddon.realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @return {Promise<string>}
   */
  async _getPresignedUrl() {
    const rawAddon = await this._getAddon();
    return getCellarPresignedUrl({ ownerId: this._ownerId, cellarId: rawAddon.realId })
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

  /**
   * @return {Promise<string>}
   */
  async renewSecret() {
    const { realId } = await this._getAddon();
    return renewSecret({ ownerId: this._ownerId, cellarId: realId }).then(sendToApi({ apiConfig: this._apiConfig }));
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

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, cellarId: string }} params */
function renewSecret(params) {
  return Promise.resolve({
    method: 'post',
    url: `/v4/cellar/organisations/${params.ownerId}/cellar/${params.cellarId}/credentials/renew`,
    headers: { Access: 'application/json' },
  });
}
