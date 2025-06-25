// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getJenkinsAddon } from '@clevercloud/client/esm/api/v4/addon-providers.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-header-addon-beta.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getZone } from '@clevercloud/client/esm/api/v4/product.js';

/**
 * @typedef {import('./cc-header-addon-beta.js').CcHeaderAddonBeta} CcHeaderAddonBeta
 * @typedef {import('./cc-header-addon-beta.types.js').RawAddon} RawAddon
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcHeaderAddonBeta>} OnContextUpdateArgs
 * @typedef {import('../common.types.js').Zone} Zone
 */

defineSmartComponent({
  selector: 'cc-header-addon-beta[smart-mode=jenkins]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    // "/organisations/orga_3547a882-d464-4c34-8168-add4b3e0c135/addons/:id/logs"
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

    api
      .getAddon()
      .then((rawAddon) => {
        return Promise.all([api.getZone(rawAddon.region), api.getUrl(addonId)]).then(([zone, jenkinsUrl]) => {
          updateComponent('state', {
            type: 'loaded',
            providerName: rawAddon.provider.name,
            providerLogoUrl: rawAddon.provider.logoUrl,
            name: rawAddon.name,
            id: rawAddon.realId,
            zone,
            logsUrl: context.logsUrlPattern.replace(':id', addonId),
            openLinks: [
              {
                name: rawAddon.provider.name,
                url: jenkinsUrl,
              },
            ],
            actions: { restart: true, rebuildAndRestart: true },
          });
        });
      })
      .catch((error) => {
        console.error('Error fetching Jenkins info:', error);
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

  /**
   * @param {string} zoneName
   * @return {Promise<Zone>}
   */
  getZone(zoneName) {
    return getZone({ zoneName }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {string} addonId
   * @return {Promise<string>}
   */
  getUrl(addonId) {
    return getJenkinsAddon({ providerId: 'jenkins', addonId })
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then((jenkinsAddon) => {
        return `https://${jenkinsAddon.host}`;
      });
  }
}
