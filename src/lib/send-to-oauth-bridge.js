// @ts-expect-error FIXME: remove when clever-client exports types
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { request } from '@clevercloud/client/esm/request.fetch.js';
// @ts-expect-error FIXME: remove when clever-client exports types;
import { withCache } from '@clevercloud/client/esm/with-cache.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { dispatchCustomEvent } from './events.js';

/**
 * @typedef {import('./send-to-api.types.js').ApiConfig} ApiConfig
 */

/**
 *
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} [params.signal]
 * @param {number} [params.cacheDelay]
 * @param {number} [params.timeout]
 * @returns {(requestParams: RequestInit) => Promise<any>}
 */
export function sendToOauthBridge({ apiConfig, signal, cacheDelay, timeout }) {
  return (requestParams) => {
    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {
      const { API_HOST, ...tokens } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl('https://api-bridge.clever-cloud.com'))
        .then(addOauthHeaderPlaintext(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request)
        .catch(
          /** @param {Error} error */
          (error) => {
            dispatchCustomEvent(window, 'cc-api:error', error);
            throw error;
          },
        );
    });
  };
}

/**
 * @param {Omit<ApiConfig, 'API_HOST'>} tokens
 * @returns {(requestParams: RequestInit) => RequestInit}
 */
export function addOauthHeaderPlaintext(tokens) {
  return function (requestParams) {
    const authorizationHeader =
      'OAuth ' +
      [
        `oauth_consumer_key="${tokens.OAUTH_CONSUMER_KEY}"`,
        `oauth_token="${tokens.API_OAUTH_TOKEN}"`,
        // %26 is URL escaped character "&"
        `oauth_signature="${tokens.OAUTH_CONSUMER_SECRET}%26${tokens.API_OAUTH_TOKEN_SECRET}"`,
        // oauth_nonce is not mandatory
        // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
        // oauth_timestamp is not mandatory
        // oauth_version is not mandatory, it defaults to 1.0
      ].join(', ');

    return {
      ...requestParams,
      headers: {
        authorization: authorizationHeader,
        ...requestParams.headers,
      },
    };
  };
}
