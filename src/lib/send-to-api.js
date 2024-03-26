import { addOauthHeader } from '@clevercloud/client/esm/oauth.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { execWarpscript } from '@clevercloud/client/esm/request-warp10.fetch.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { dispatchCustomEvent } from './events.js';

/**
 * @typedef {import('./send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./send-to-api.types.js').Warp10ApiConfig} Warp10ApiConfig
 */

/**
 * @param {Object} settings
 * @param {ApiConfig} settings.apiConfig
 * @param {AbortSignal} [settings.signal]
 * @param {Number} [settings.cacheDelay]
 * @param {Number} [settings.timeout]
 * @return {(requestParams: Object) => Promise<any>}
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
 * @param {Object} settings
 * @param {Warp10ApiConfig} settings.apiConfig
 * @param {AbortSignal} [settings.signal]
 * @param {Number} [settings.cacheDelay]
 * @param {Number} [settings.timeout]
 * @return {(requestParams: Object) => Promise<any>}
 */
export function sendToWarp ({ apiConfig, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { WARP_10_HOST } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(WARP_10_HOST))
        .then(withOptions({ signal, timeout }))
        .then(execWarpscript);
    });
  };
}
