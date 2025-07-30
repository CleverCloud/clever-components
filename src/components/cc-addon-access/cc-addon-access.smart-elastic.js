import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonDetails } from '@clevercloud/client/esm/api/v2/providers.js';
import './cc-addon-access.js';

/** @type {AddonAccessContentItem[]} */
const SKELETON_DATA = [
  {
    code: 'host',
    value: 'fake-host-very-long-skeleton',
  },
  {
    code: 'user',
    value: 'skeleton-user',
  },
  {
    code: 'password',
    value: 'skeleton-password',
  },
];

/**
 * @typedef {import('./cc-addon-access.js').CcAddonAccess} CcAddonAccess
 * @typedef {import('../cc-addon-access-content/cc-addon-access-content.types.js').AddonAccessContentItem} AddonAccessContentItem
 * @typedef {import('./cc-addon-access.types.js').Tabs} Tabs
 * @typedef {import('./cc-addon-access.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-access.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonAccess>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-access[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api(apiConfig, ownerId, addonId);

    updateComponent('state', {
      type: 'loading',
      tabs: {
        elastic: SKELETON_DATA,
      },
    });

    api
      .getAddonInfo()
      .then((addonDetails) => {
        const tabs = getTabsFromAddonDetails(addonDetails);
        updateComponent('state', {
          type: 'loaded',
          tabs,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

// TODO: maybe retrieve AddonDetails type from Helene's branch
function getTabsFromAddonDetails(addonDetails) {
  const isKibanaEnabled = addonDetails.services.some((service) => service.name === 'kibana' && service.enabled);
  const isApmEnabled = addonDetails.services.some((service) => service.name === 'apm' && service.enabled);

  /** @type {Tabs} */
  const tabs = {
    elastic: [
      { code: 'host', value: addonDetails.config.host },
      { code: 'user', value: addonDetails.config.user },
      { code: 'password', value: addonDetails.config.password },
    ],
  };

  if (isKibanaEnabled) {
    tabs.kibana = [
      { code: 'user', value: addonDetails.config.kibana_user },
      { code: 'password', value: addonDetails.config.kibana_password },
    ];
  }

  if (isApmEnabled) {
    tabs.apm = [
      { code: 'user', value: addonDetails.config.apm_user },
      { code: 'password', value: addonDetails.config.apm_password },
      { code: 'token', value: addonDetails.config.apm_auth_token },
    ];
  }

  return tabs;
}

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
  _getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   *
   * @param {string} providerId
   * @returns {Promise<object>}
   */
  _getAddonDetails(providerId) {
    return getAddonDetails({ providerId, addonId: this._addonId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  async getAddonInfo() {
    const rawAddon = await this._getAddon();
    const addonDetails = await this._getAddonDetails(rawAddon.provider.id);
    return addonDetails;
  }
}

// move this to clever client
/**
 * @param {{ provider: string, realId: string }} params
 */
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
