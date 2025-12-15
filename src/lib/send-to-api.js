import { addOauthHeader } from '@clevercloud/client/esm/oauth.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { execWarpscript } from '@clevercloud/client/esm/request-warp10.fetch.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { CcApiErrorEvent } from './send-to-api.events.js';

// FIXME: We're using `@typedef` instead of `@import` here due to a false positive from TS
// See: https://github.com/microsoft/TypeScript/issues/60908/
/**
 * @typedef {import('./send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./send-to-api.types.js').Warp10ApiConfig} Warp10ApiConfig
 */

/**
 * @param {Object} settings
 * @param {ApiConfig} [settings.apiConfig]
 * @param {AbortSignal} [settings.signal]
 * @param {number} [settings.cacheDelay]
 * @param {number} [settings.timeout]
 * @return {(requestParams: Object) => Promise<any>}
 */
export function sendToApi({ apiConfig, signal, cacheDelay, timeout }) {
  return (requestParams) => {
    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {
      const { API_HOST = 'https://api.clever-cloud.com', ...tokens } = apiConfig ?? {};
      return (
        Promise.resolve(requestParams)
          // @ts-expect-error FIXME: will become irrelevant when we switch to the new client and fixing it seems to lead to many fixes in places everywhere sendToApi is used
          .then(prefixUrl(API_HOST))
          // @ts-expect-error FIXME: will become irrelevant when we switch to the new client and fixing it seems to lead to many fixes in places everywhere sendToApi is used
          .then(addOauthHeader(tokens))
          .then(withOptions({ signal, timeout }))
          .then(request)
          .catch((error) => {
            window.dispatchEvent(new CcApiErrorEvent(error));
            throw error;
          })
      );
    });
  };
}

/**
 * @param {Object} settings
 * @param {Warp10ApiConfig} settings.apiConfig
 * @param {AbortSignal} [settings.signal]
 * @param {number} [settings.cacheDelay]
 * @param {number} [settings.timeout]
 * @return {(requestParams: Object) => Promise<any>}
 */
export function sendToWarp({ apiConfig, signal, cacheDelay, timeout }) {
  return (requestParams) => {
    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {
      const { WARP_10_HOST } = apiConfig;
      return (
        Promise.resolve(requestParams)
          // @ts-expect-error FIXME: will become irrelevant when we switch to the new client and fixing it seems to lead to many fixes in places everywhere sendToApi is used
          .then(prefixUrl(WARP_10_HOST))
          .then(withOptions({ signal, timeout }))
          // @ts-expect-error FIXME: will become irrelevant when we switch to the new client and fixing it seems to lead to many fixes in places everywhere sendToApi is used
          .then(execWarpscript)
      );
    });
  };
}
