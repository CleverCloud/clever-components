import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import './cc-addon-access-unique.js';

/** @type {AddonAccessInfo[]} */
const SKELETON_DATA = [
  {
    code: 'user',
    value: 'fake-skeleton',
  },
  {
    code: 'password',
    value: 'fake-skeleton',
  },
  {
    code: 'ng',
    value: {
      isEnabled: false,
    },
  },
];

/**
 * @typedef {import('./cc-addon-access-unique.js').CcAddonAccessUnique} CcAddonAccessUnique
 * @typedef {import('../cc-addon-access-info/cc-addon-access-info.types.js').AddonAccessInfo} AddonAccessInfo
 * @typedef {import('./cc-addon-access-unique.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-access-unique.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonAccessUnique>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-access-unique[smart-mode="keycloak"]',
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
      .getAddonWithOperator()
      .then((operator) => {
        updateComponent('state', {
          type: 'loaded',
          content: [
            {
              code: 'user',
              value: operator.envVars.CC_KEYCLOAK_ADMIN,
            },
            {
              code: 'password',
              value: operator.envVars.CC_KEYCLOAK_ADMIN_DEFAULT_PASSWORD,
            },
            {
              code: 'ng',
              value: {
                isEnabled: false,
              },
            },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-ng-enable', () => {
      // TODO Waiting
    });

    onEvent('cc-ng-disable', () => {
      // TODO Waiting
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
  _getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {string} realId
   * @returns {Promise<KeycloakOperatorInfo>}
   */
  _getOperator(realId) {
    return getOperator({ provider: 'keycloak', realId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  // TODO: NG State!
  /** @returns {Promise<KeycloakOperatorInfo>} */
  async getAddonWithOperator() {
    const rawAddon = await this._getAddon();
    const operator = await this._getOperator(rawAddon.realId);

    return operator;
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
