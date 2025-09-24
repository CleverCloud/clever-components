import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredential[]} */
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
      status: 'disabled',
    },
  },
];

/**
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoaded} AddonCredentialsBetaStateLoaded
 * @typedef {import('./cc-addon-credentials-beta.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-credentials-beta.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgEnabled} AddonCredentialNgEnabled
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgDisabled} AddonCredentialNgDisabled
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonCredentialsBeta>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="keycloak"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    /** @param {AddonCredentialNg|((param: AddonCredentialNg) => AddonCredential)} newNgInfoOrCallback */
    function updateNg(newNgInfoOrCallback) {
      updateComponent(
        'state',
        /** @param {AddonCredentialsBetaStateLoaded} state */
        (state) => {
          state.tabs.default = [...state.tabs.default].map((addonInfo) => {
            if (addonInfo.code === 'ng') {
              if (typeof newNgInfoOrCallback === 'function') {
                return newNgInfoOrCallback(addonInfo);
              } else {
                return newNgInfoOrCallback;
              }
            }
            return addonInfo;
          });
        },
      );
    }

    updateComponent('state', {
      type: 'loading',
      tabs: {
        default: SKELETON_DATA,
      },
    });
    updateComponent('docLink', {
      text: i18n('cc-addon-credentials-beta.doc-link.keycloak'),
      href: generateDocsHref('/doc/addons/keycloak/'),
    });

    api
      .getAddonWithOperator()
      .then((operator) => {
        updateComponent('state', {
          type: 'loaded',
          tabs: {
            default: [
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
                value: formatNgData(operator.features.networkGroup),
              },
            ],
          },
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-ng-enable', () => {
      updateNg({
        code: 'ng',
        value: {
          status: 'enabling',
        },
      });

      api
        .createNg()
        .then((updatedOperator) => {
          updateNg({
            code: 'ng',
            value: {
              status: 'enabled',
              id: updatedOperator.features.networkGroup.id,
            },
          });

          notifySuccess(i18n('cc-addon-credentials-beta.ng.enabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg({
            code: 'ng',
            value: {
              status: 'disabled',
            },
          });
          notifyError(i18n('cc-addon-credentials-beta.ng.enabling.error'));
        });
    });

    onEvent('cc-ng-disable', () => {
      updateNg((addonInfo) => ({
        code: 'ng',
        value: {
          id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
          status: 'disabling',
        },
      }));

      api
        .deleteNg()
        .then(() => {
          updateNg({
            code: 'ng',
            value: {
              status: 'disabled',
            },
          });
          notifySuccess(i18n('cc-addon-credentials-beta.ng.disabling.success'));
        })
        .catch((error) => {
          console.error(error);
          updateNg((addonInfo) => ({
            code: 'ng',
            value: {
              id: /** @type {AddonCredentialNgEnabled} */ (addonInfo.value).id,
              status: 'enabled',
            },
          }));
          notifyError(i18n('cc-addon-credentials-beta.ng.disabling.error'));
        });
    });
  },
});

/**
 *
 * @param {{ id: string } | null} data
 * @returns {AddonCredentialNgEnabled | AddonCredentialNgDisabled}
 */
function formatNgData(data) {
  if (data == null) {
    return { status: 'disabled' };
  }

  return {
    status: 'enabled',
    id: data.id,
  };
}

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._provideId = null;
    this._realId = null;
    this._signal = signal;
  }

  /** @return {Promise<RawAddon>} */
  _getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {string} realId
   * @returns {Promise<KeycloakOperatorInfo>}
   */
  _getOperator(realId) {
    return getOperator({ providerId: 'keycloak', realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /** @returns {Promise<KeycloakOperatorInfo>} */
  async getAddonWithOperator() {
    const rawAddon = await this._getAddon();
    const operator = await this._getOperator(rawAddon.realId);
    this._realId = rawAddon.realId;
    this._provideId = /** @type {import('../common.types.js').RawAddonProvider} */ (rawAddon.provider).id;

    return operator;
  }

  createNg() {
    return createNg({ providerId: this._provideId, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  deleteNg() {
    return deleteNg({ providerId: this._provideId, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function getOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function createNg({ providerId, realId }) {
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-${providerId}/addons/${realId}/networkgroup`,
    headers: { Access: 'application/json' },
  });
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function deleteNg({ providerId, realId }) {
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/addon-${providerId}/addons/${realId}/networkgroup`,
    headers: { Access: 'application/json' },
  });
}
