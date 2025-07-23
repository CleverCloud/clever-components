import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonDetails } from '@clevercloud/client/esm/api/v2/providers.js';
import './cc-addon-access-unique.js';

/** @type {AddonAccessInfo[]} */
const SKELETON_DATA = [
  {
    code: 'host',
    value: 'fake-host-very-long-skeleton',
  },
  {
    code: 'user',
    value: 'skeleto-user',
  },
  {
    code: 'password',
    value: 'skeleton-password',
  },
];

/**
 * @typedef {import('./cc-addon-access-unique.js').CcAddonAccessUnique} CcAddonAccessUnique
 * @typedef {import('../cc-addon-access-info/cc-addon-access-info.types.js').AddonAccessInfo} AddonAccessInfo
 * @typedef {import('./cc-addon-access-unique.types.js').TabbedContent} TabbedContent
 * @typedef {import('./cc-addon-access-unique.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-access-unique.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonAccessUnique>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-access-unique[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, onEvent, updateComponent }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api(apiConfig, ownerId, addonId);

    updateComponent('state', {
      type: 'loading',
      content: SKELETON_DATA,
    });

    api
      .getAddonInfo()
      .then((addonDetails) => {
        const { isKibanaEnabled, isApmEnabled, tabs } = getTabsFromAddonDetails(addonDetails);
        if (!isKibanaEnabled && !isApmEnabled) {
          updateComponent('state', {
            type: 'loaded',
            content: tabs.elastic,
          });
        } else {
          updateComponent('state', {
            type: 'loaded-with-tabs',
            tabs,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

function getTabsFromAddonDetails(addonDetails) {
  const isKibanaEnabled = addonDetails.services.some((service) => service.name === 'kibana' && service.enabled);
  const isApmEnabled = addonDetails.services.some((service) => service.name === 'apm' && service.enabled);

  /** @type {TabbedContent} */
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

  return { isKibanaEnabled, isApmEnabled, tabs };
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
