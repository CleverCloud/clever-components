// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getZone } from '@clevercloud/client/esm/api/v4/product.js';
import { fakeString } from '../../lib/fake-strings.js';
import { notify, notifyError } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-header.js';

const DOCS_URL = generateDocsHref(`/addons/keycloak`);

/**
 * @typedef {import('./cc-addon-header.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-header.types.js').RawOperator} RawOperator
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonHeader>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode=keycloak]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
    productStatus: { type: String, optional: true },
  },

  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, onEvent, signal }) {
    const { apiConfig, ownerId, addonId, productStatus } = context;
    const api = new Api(apiConfig, ownerId, addonId, signal);
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
      .then(({ rawAddon, operator, zone }) => {
        const javaAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', javaAppId);

        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: rawAddon.name,
          id: rawAddon.realId,
          zone,
          logsUrl,
          openLinks: [
            {
              name: 'KEYCLOAK',
              url: operator.accessUrl,
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
            message: i18n('cc-addon-header.restart.success.message', { logsUrl, docsUrl: DOCS_URL }),
            title: i18n('cc-addon-header.restart.success.title'),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-addon-header.restart.error'));
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
            message: i18n('cc-addon-header.rebuild.success.message', { logsUrl, docsUrl: DOCS_URL }),
            title: i18n('cc-addon-header.rebuild.success.title'),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-addon-header.rebuild.error'));
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
   * @param {AbortSignal} signal
   */
  constructor(apiConfig, ownerId, addonId, signal) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._realId = null;
    this._signal = signal;
  }

  /** @return {Promise<RawAddon>} */
  getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {string} realId
   * @return {Promise<RawOperator>}
   */
  getOperator(realId) {
    return this._getOperator({ provider: 'keycloak', realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {string} zoneName
   * @return {Promise<ZoneStateLoaded>}
   */
  getZone(zoneName) {
    return getZone({ zoneName }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /** @returns {Promise<{ rawAddon: RawAddon, operator: RawOperator, zone: ZoneStateLoaded }>} */
  async getAddonWithOperatorAndZone() {
    const rawAddon = await this.getAddon();
    this._realId = rawAddon.realId;
    const [operator, zone] = await Promise.all([this.getOperator(rawAddon.realId), this.getZone(rawAddon.region)]);

    return { rawAddon, operator, zone };
  }

  /** @return {Promise<void>} */
  async restartAddon() {
    return rebootOperator({ provider: 'keycloak', realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  /** @return {Promise<void>} */
  async rebuildAndRestartAddon() {
    return rebuildOperator({ provider: 'keycloak', realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
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

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ provider: string, realId: string }} params */
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

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ provider: string, realId: string }} params */
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
