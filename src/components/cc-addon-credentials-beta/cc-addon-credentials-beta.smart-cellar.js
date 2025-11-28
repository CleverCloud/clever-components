import { getAllEnvVars as getAddonEnv } from '@clevercloud/client/esm/api/v2/addon.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
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
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.cellar'),
        href: getDocUrl('/addons/cellar'),
      },
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
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', LOADING_STATE);

    api
      .getAllCredentials(ownerId, cellarId)
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

  _getAddonEnv() {
    return getAddonEnv({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} ownerId
   * @param {string} cellarId
   * @return {Promise<CellarCredentials>}
   */
  _getCredentials(ownerId, cellarId) {
    return getCellarCredentials({ ownerId, cellarId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} ownerId
   * @param {string} cellarId
   * @return {Promise<AddonCredential[]>}
   */
  async getAllCredentials(ownerId, cellarId) {
    const credential = await this._getCredentials(ownerId, cellarId);
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
        value: 'fake-skeleton',
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
