import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';

/**
 * @import { PostgresqlConnections, PostgresqlCredentials, PostgresqlDashboard, PostgresqlReadOnlyUsers } from './cc-postgresql-admin.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 */

const PROVIDER_ID = 'postgresql-addon';

/**
 * Client for the PostgreSQL add-on provider API.
 *
 * Every call goes through the Clever Cloud API, which authenticates the user and
 * forwards the request to the add-on provider.
 */
export class CcPostgresqlClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.addonId
   * @param {AbortSignal} [params.signal]
   */
  constructor({ apiConfig, addonId, signal }) {
    this._apiConfig = apiConfig;
    this._addonId = addonId;
    this._signal = signal;
  }

  /**
   * The dashboard is fetched by several components of the same page, the cache delay
   * makes sure the add-on provider is only called once.
   *
   * @returns {Promise<PostgresqlDashboard>}
   */
  getDashboard() {
    return get(this._addonId, 'dashboard').then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /** @returns {Promise<PostgresqlConnections>} */
  getConnections() {
    return get(this._addonId, 'connections').then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /** @returns {Promise<void>} */
  killConnections() {
    return remove(this._addonId, 'connections').then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<PostgresqlCredentials>} */
  resetPassword() {
    return post(this._addonId, 'password').then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<void>} */
  resetDatabase() {
    return post(this._addonId, 'reset').then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {string} extension
   * @returns {Promise<void>}
   */
  activateExtension(extension) {
    return post(this._addonId, 'extensions', { extension }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<PostgresqlReadOnlyUsers>} */
  addReadOnlyUser() {
    return post(this._addonId, 'read-only-users').then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<void>} */
  promoteReplica() {
    return post(this._addonId, 'promote').then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<void>} */
  rebootInstances() {
    return post(this._addonId, 'reboot').then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /** @returns {Promise<PostgresqlCredentials>} */
  generateDirectHost() {
    return post(this._addonId, 'direct-host').then(sendToApi({ apiConfig: this._apiConfig }));
  }
}

// FIXME: remove and use the clever-client calls from the new clever-client
/**
 * @param {string} addonId
 * @param {string} path
 */
function get(addonId, path) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${PROVIDER_ID}/addons/${addonId}/${path}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

// FIXME: remove and use the clever-client calls from the new clever-client
/**
 * @param {string} addonId
 * @param {string} path
 * @param {object} [body]
 */
function post(addonId, path, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/${PROVIDER_ID}/addons/${addonId}/${path}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    body,
  });
}

// FIXME: remove and use the clever-client calls from the new clever-client
/**
 * @param {string} addonId
 * @param {string} path
 */
function remove(addonId, path) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v4/addon-providers/${PROVIDER_ID}/addons/${addonId}/${path}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}
