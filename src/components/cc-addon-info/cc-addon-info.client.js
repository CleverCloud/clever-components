// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { generateDevHubHref } from '../../lib/utils.js';

/**
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoaded} AddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('../../operators.types.js').OperatorVersionInfo} OperatorVersionInfo
 * @typedef {import('../../operators.types.js').RawOperator} RawOperator
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

export class CcAddonInfoClient {
  /**
   * @param {Object} config - Configuration object
   * @param {ApiConfig} config.apiConfig - API configuration
   * @param {string} config.ownerId - Owner identifier
   * @param {string} config.addonId - Addon identifier
   * @param {string} config.providerId
   * @param {{ base: string, console: string }} [config.grafanaLink] - Base url to build a grafana link to the app
   * @param {AbortSignal} config.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, addonId, providerId, grafanaLink, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this.providerId = providerId;
    this._grafanaLink = grafanaLink;
    this._realId = null;
    this._signal = signal;
  }

  /** @return {Promise<RawAddon>} */
  _getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} providerId
   * @param {string} realId
   * @returns {Promise<RawOperator>}
   */
  _getOperator(providerId, realId) {
    return getOperator({ providerId, realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /** @returns {Promise<OperatorVersionInfo>} */
  getOperatorVersionInfo() {
    return checkOperatorVersion({ providerId: this.providerId, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {Object} parameters
   * @param {string} parameters.appId
   * @param {AbortSignal} parameters.signal
   * @returns {Promise<string>}
   */
  _getGrafanaAppLink({ appId, signal }) {
    return getGrafanaOrganisation({ id: this._ownerId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal }))
      .then(
        /** @param {{id: string}} grafanaOrg*/
        (grafanaOrg) => {
          const grafanaLink = new URL('/d/runtime/application-runtime', this._grafanaLink.base);
          grafanaLink.searchParams.set('orgId', grafanaOrg.id);
          grafanaLink.searchParams.set('var-SELECT_APP', appId);
          return grafanaLink.toString();
        },
      )
      .catch(
        /** @param {Error & { response?: { status?: number }}} error */
        (error) => {
          if (error.response?.status === 404) {
            return this._grafanaLink.console;
          }
          return error;
        },
      );
  }

  /**
   * @param {string} targetVersion
   * @returns {Promise<RawOperator>}
   **/
  updateOperatorVersion(targetVersion) {
    return updateOperatorVersion({ providerId: this.providerId, realId: this._realId }, { targetVersion }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  /**
   * @return {Promise<{addonInfo: RawAddon, operator: RawOperator, operatorVersionInfo: OperatorVersionInfo, grafanaAppLink: string}>}
   */
  async getAddonInfo() {
    // Fetch addon to get realId,
    const rawAddon = await this._getAddon();
    this._realId = rawAddon.realId;
    this.providerId = /** @type {import('../common.types.js').RawAddonProvider} */ rawAddon.provider.id;
    // Fetch operator with realId,
    const [operator, operatorVersionInfo] = await Promise.all([
      this._getOperator(this.providerId, this._realId),
      this.getOperatorVersionInfo(),
    ]);
    const grafanaAppLink =
      this._grafanaLink != null
        ? await this._getGrafanaAppLink({ appId: operator.resources.entrypoint, signal: this._signal })
        : null;

    return { addonInfo: rawAddon, operator, operatorVersionInfo, grafanaAppLink };
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
function checkOperatorVersion(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}/version/check`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

/**
 * @param {object} params
 * @param {string} params.providerId
 * @param {string} params.realId
 * @param {object} body
 */
export function updateOperatorVersion(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}/version/update`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no queryParams
    body,
  });
}

/**
 * @param {OperatorVersionInfo} operatorVersionInfo
 * @returns {AddonInfoStateLoaded['version']}
 **/
export function formatVersionState(operatorVersionInfo) {
  if (operatorVersionInfo.needUpdate) {
    return {
      stateType: 'update-available',
      installed: operatorVersionInfo.installed,
      available: operatorVersionInfo.available.filter((version) => version !== operatorVersionInfo.installed),
      latest: operatorVersionInfo.latest,
      changelogLink: `${generateDevHubHref('/changelog')}`,
    };
  }

  return {
    stateType: 'up-to-date',
    installed: operatorVersionInfo.installed,
    latest: operatorVersionInfo.latest,
  };
}
