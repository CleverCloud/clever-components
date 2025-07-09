// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getZone } from '@clevercloud/client/esm/api/v4/product.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-header-addon-beta.js';

/**
 * @typedef {import('./cc-header-addon-beta.js').CcHeaderAddonBeta} CcHeaderAddonBeta
 * @typedef {import('./cc-header-addon-beta.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-header-addon-beta.types.js').RawOperator} RawOperator
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcHeaderAddonBeta>} OnContextUpdateArgs
 * @typedef {import('../common.types.js').Zone} Zone
 */

defineSmartComponent({
  selector: 'cc-header-addon-beta[smart-mode=keycloak]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
    productStatus: { type: String, optional: true },
  },

  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, onEvent }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const api = new Api(apiConfig, ownerId, addonId);
    let logsUrl = '';

    updateComponent('state', {
      type: 'loading',
      logsUrl: fakeString(15),
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
      actions: {
        restart: true,
        rebuildAndRestart: true,
      },
      productStatus: fakeString(4),
    });

    api
      .getAddonWithOperatorAndZone()
      .then((result) => {
        const { rawAddon, operator, zone } = result;
        const javaAppId = operator.resources.entrypoint;
        const url = operator.accessUrl;
        logsUrl = context.logsUrlPattern.replace(':id', javaAppId);

        updateComponent('state', {
          type: 'loaded',
          providerName: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone,
          logsUrl,
          openLinks: [
            {
              name: 'KEYCLOAK',
              url,
            },
          ],
          actions: {
            restart: true,
            rebuildAndRestart: true,
          },
          productStatus,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });

    onEvent('cc-addon-restart', () => {
      updateComponent('state', (state) => {
        state.type = 'restarting';
      });

      api
        .restartAddon()
        .then(() => {
          notify({
            intent: 'success',
            message: i18n('cc-header-addon-beta.restart.success', { logsUrl }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-header-addon-beta.restart.error'));
        })
        .finally(() => {
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
        });
    });

    onEvent('cc-addon-rebuild', () => {
      updateComponent('state', (state) => {
        state.type = 'rebuilding';
      });

      api
        .rebuildAndRestartAddon()
        .then(() => {
          notify({
            intent: 'success',
            message: i18n('cc-header-addon-beta.rebuild.success', { logsUrl }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-header-addon-beta.rebuild.error'));
        })
        .finally(() => {
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
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

  /** @return {Promise<RawAddon>} */
  getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {string} realId
   * @return {Promise<RawOperator>}
   */
  getOperator(realId) {
    return this._getOperator({ provider: 'keycloak', realId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {string} zoneName
   * @return {Promise<Zone>}
   */
  getZone(zoneName) {
    return getZone({ zoneName }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<{ rawAddon: RawAddon, operator: RawOperator, zone: Zone }>} */
  async getAddonWithOperatorAndZone() {
    const rawAddon = await this.getAddon();
    const [operator, zone] = await Promise.all([this.getOperator(rawAddon.realId), this.getZone(rawAddon.region)]);

    return { rawAddon, operator, zone };
  }

  /**
   * @param {string} realId
   * @returns {Promise<void>}
   */
  async rebootOperator(realId) {
    return rebootOperator({ provider: 'keycloak', realId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @return {Promise<void>} */
  async restartAddon() {
    const rawAddon = await this.getAddon();
    return this.rebootOperator(rawAddon.realId);
  }

  /** @param {string} realId */
  async rebuildOperator(realId) {
    return rebuildOperator({ provider: 'keycloak', realId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @return {Promise<void>} */
  async rebuildAndRestartAddon() {
    const rawAddon = await this.getAddon();
    return this.rebuildOperator(rawAddon.realId);
  }

  /**
   * @param {{ provider: string, realId: string }} params
   * @returns {Promise<Object>}
   */
  _getOperator(params) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}`,
      headers: { Accept: 'application/json' },
      // no queryParams
      // no body
    });
  }
}

/**
 * @param {{ provider: string, realId: string }} params
 * @returns {Promise<Object>}
 */
export function rebootOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}/reboot`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

// rebuildOperator (=rebuild and restart)
/**
 * @param {{ provider: string, realId: string }} params
 * @returns {Promise<Object>}
 */
export function rebuildOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}/rebuild`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}
