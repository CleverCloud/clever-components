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
          code: 'port',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.materia-kv'),
        href: getDocUrl('/addons/materia-kv'),
      },
    },
  },
};
const PROVIDER_ID = 'kv';

/**
 * @import { CcAddonCredentialsBeta } from './cc-addon-credentials-beta.js'
 * @import { AddonCredentialsBetaStateLoaded, MateriaKvInfo, AddonCredentialsBetaStateLoading } from './cc-addon-credentials-beta.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="materia-kv"]',
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
   * @return {Promise<MateriaKvInfo>}
   */
  async getMateriaKvInfo() {
    const rawAddon = await this._getAddon();
    return getMateriaKvInfo({ ownerId: this._ownerId, materiaKvId: rawAddon.realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials() {
    const materiaKvInfo = await this.getMateriaKvInfo();
    return [
      {
        code: 'host',
        value: materiaKvInfo.host,
      },
      {
        code: 'port',
        value: String(materiaKvInfo.port),
      },
      {
        code: 'token',
        value: materiaKvInfo.token,
      },
    ];
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, materiaKvId: string }} params */
function getMateriaKvInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/materia/organisations/${params.ownerId}/materia/databases/${params.materiaKvId}`,
    // no queryParams
    // no body
  });
}
