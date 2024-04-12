import { addOauthHeader } from '@clevercloud/client/esm/oauth.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { execWarpscript } from '@clevercloud/client/esm/request-warp10.fetch.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { dispatchCustomEvent } from './events.js';

/**
 * @typedef {Object} ApiConfig
 * @property {String} API_HOST
 * @property {String} API_OAUTH_TOKEN
 * @property {String} API_OAUTH_TOKEN_SECRET
 * @property {String} OAUTH_CONSUMER_KEY
 * @property {String} OAUTH_CONSUMER_SECRET
 */

/**
 * @typedef {Object} WarpConfig
 * @property {String} WARP_10_HOST
 */

/**
 *
 * @param {Object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} [params.signal]
 * @param {Number} [params.cacheDelay]
 * @param {Number} [params.timeout]
 * @return {(requestParams: Object) => (any | undefined)}
 */
export function sendToApi ({ apiConfig, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { API_HOST = 'https://api.clever-cloud.com', ...tokens } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(API_HOST))
        .then(addOauthHeader(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request)
        .catch((error) => {
          dispatchCustomEvent(window, 'cc-api:error', error);
          throw error;
        });
    });
  };
}

/**
 * @param {Object} params
 * @param {WarpConfig} params.warpConfig
 * @param {AbortSignal} [params.signal]
 * @param {Number} [params.cacheDelay]
 * @param {Number} [params.timeout]
 * @return {(requestParams: Object) => (any | undefined)}
 */
export function sendToWarp ({ warpConfig, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...warpConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { WARP_10_HOST } = warpConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(WARP_10_HOST))
        .then(withOptions({ signal, timeout }))
        .then(execWarpscript);
    });
  };
}
