// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getZone } from '@clevercloud/client/esm/api/v4/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';

/**
 * @typedef {import('./cc-addon-header.types.js').RawAddon} RawAddon
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 * @typedef {import('../../operators.types.js').RawOperator} RawOperator
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

export class CcAddonHeaderClient {
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
    this._provider = providerId;
    this._realId = null;
    this._signal = signal;
  }

  /** @return {Promise<RawAddon>} */
  getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} realId
   * @return {Promise<RawOperator>}
   */
  getOperator(realId) {
    return getOperator({ provider: this._provider, realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} zoneName
   * @return {Promise<ZoneStateLoaded>}
   */
  getZone(zoneName) {
    return getZone({ zoneName }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /** @returns {Promise<{ rawAddon: RawAddon, operator: RawOperator, zone: ZoneStateLoaded }>} */
  async getAddonWithOperatorAndZone() {
    const rawAddon = await this.getAddon();
    this._realId = rawAddon.realId;
    const [operator, zone] = await Promise.all([this.getOperator(rawAddon.realId), this.getZone(rawAddon.region)]);

    return { rawAddon, operator, zone };
  }

  /** @returns {Promise<{ rawAddon: RawAddon, zone: ZoneStateLoaded }>} */
  async getAddonWithZone() {
    const rawAddon = await this.getAddon();
    const zone = await this.getZone(rawAddon.region);

    return { rawAddon, zone };
  }

  /** @return {Promise<void>} */
  async restartAddon() {
    return rebootOperator({ provider: this._provider, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  /** @return {Promise<void>} */
  async rebuildAndRestartAddon() {
    return rebuildOperator({ provider: this._provider, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }
}

/**
 * @param {{ provider: string, realId: string }} params
 * @returns {Promise<Object>}
 */
function getOperator(params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ provider: string, realId: string }} params */
function rebootOperator(params) {
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
function rebuildOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-${params.provider}/addons/${params.realId}/rebuild`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}
