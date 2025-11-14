// @ts-expect-error FIXME: remove when clever-client exports types
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { request } from '@clevercloud/client/esm/request.fetch.js';
// @ts-expect-error FIXME: remove when clever-client exports types;
import { withCache } from '@clevercloud/client/esm/with-cache.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { withOptions } from '@clevercloud/client/esm/with-options.js';

/**
 * @import { AuthBridgeConfig } from './send-to-api.types.js'
 */

/**
 *
 * @param {object} params
 * @param {AuthBridgeConfig} params.authBridgeConfig
 * @param {AbortSignal} [params.signal]
 * @param {number} [params.cacheDelay]
 * @param {number} [params.timeout]
 * @returns {(requestParams: any) => Promise<any>}
 */
export function sendToAuthBridge({ authBridgeConfig, signal, cacheDelay, timeout }) {
  return (requestParams) => {
    const cacheParams = { ...authBridgeConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {
      const { AUTH_BRIDGE_HOST = 'https://api-bridge.clever-cloud.com', ...tokens } = authBridgeConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(AUTH_BRIDGE_HOST))
        .then(addOauthHeaderPlaintext(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request);
    });
  };
}

/**
 * @param {Omit<AuthBridgeConfig, 'AUTH_BRIDGE_HOST'>} tokens
 * @returns {(requestParams: any) => any}
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
