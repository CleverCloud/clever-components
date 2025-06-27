// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-header-addon-beta.js';

/**
 * @typedef {import('./cc-header-addon-beta.js').CcHeaderAddonBeta} CcHeaderAddonBeta
 * @typedef {import('./cc-header-addon-beta.types.js').RawAddon} RawAddon
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcHeaderAddonBeta>} OnContextUpdateArgs
 *
 */

defineSmartComponent({
  selector: 'cc-header-addon-beta[smart-mode=keycloak]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    // "/organisations/orga_3547a882-d464-4c34-8168-add4b3e0c135/applications/:id/logs"
    logsUrlPattern: { type: String },
  },

  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent }) {
    const { apiConfig, ownerId, addonId } = context;
    const api = new Api(apiConfig, ownerId, addonId);

    updateComponent('state', {
      type: 'loading',
    });

    // API spécifique pour récupérer l'ID de l'app Java
    // resources.entrypoint
    const javaAppId = 'app_tmp';

    api
      .getAddon()
      .then((rawAddon) => {
        updateComponent('state', {
          type: 'loaded',
          providerName: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone: rawAddon.region,
          logsUrl: context.logsUrlPattern.replace('/:id/', javaAppId),
          openLinks: [
            {
              name: rawAddon.provider.name,
              // API spécifique pour récupérer l'URL du keycloak
              // accessUrl
              url: '/',
            },
          ],
          actions: { restart: true, rebuildAndRestart: true },
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} ownerId
   * @param {string} addonId
   */
  constructor(apiConfig, ownerId, addonId) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
  }

  /**
   * @return {Promise<RawAddon>}
   */
  getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  getOperator(realId) {
    return getOperator({ provider: 'keycloak', realId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}

// move this to clever client
export function getOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}
