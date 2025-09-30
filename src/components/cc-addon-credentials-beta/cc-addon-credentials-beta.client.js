// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';

/**
 * @typedef {import('./cc-addon-credentials-beta.types.js').RawAddon} RawAddon
 * @typedef {import('../common.types.js').RawAddonProvider} RawAddonProvider
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

export class CcAddonCredentialsBetaClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {string} params.providerId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, providerId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._providerId = providerId;
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
   * @param {string} realId
   * @returns {Promise<Object>}
   */
  _getOperator(realId) {
    return getOperator({ providerId: this._providerId, realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /** @returns {Promise<Object>} */
  async getAddonWithOperator() {
    const rawAddon = await this._getAddon();
    const operator = await this._getOperator(rawAddon.realId);
    this._realId = rawAddon.realId;
    this._providerId = /** @type {RawAddonProvider} */ (rawAddon.provider).id;

    return operator;
  }

  createNg() {
    return createNg({ providerId: this._providerId, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  deleteNg() {
    return deleteNg({ providerId: this._providerId, realId: this._realId }).then(
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
