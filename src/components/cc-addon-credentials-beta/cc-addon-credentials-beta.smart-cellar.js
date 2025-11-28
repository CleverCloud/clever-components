// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars as getAddonEnv } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
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
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoaded} AddonCredentialsBetaStateLoaded
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoading} AddonCredentialsBetaStateLoading
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonCredentialsBeta>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="cellar"]',
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

  _getAddonEnv() {
    return getAddonEnv({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials() {
    const addonEnv = await this._getAddonEnv();
    console.log(addonEnv);
    return [
      {
        code: 'host',
        value: addonEnv.find((env) => env.name === 'CELLAR_ADDON_HOST')?.value,
      },
      {
        code: 'key-id',
        value: addonEnv.find((env) => env.name === 'CELLAR_ADDON_KEY_ID')?.value,
      },
      {
        code: 'key-secret',
        value: addonEnv.find((env) => env.name === 'CELLAR_ADDON_KEY_SECRET')?.value,
      },
      {
        code: 'download-file',
        value: 'fake-skeleton',
      },
    ];
  }
}
