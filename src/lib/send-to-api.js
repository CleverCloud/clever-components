import { addOauthHeader } from '@clevercloud/client/esm/oauth.browser.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';

/**
 *
 * @param {Object} apiConfig
 * @param {String} apiConfig.API_HOST
 * @param {String} apiConfig.API_OAUTH_TOKEN
 * @param {String} apiConfig.API_OAUTH_TOKEN_SECRET
 * @param {String} apiConfig.OAUTH_CONSUMER_KEY
 * @param {String} apiConfig.OAUTH_CONSUMER_SECRET
 * @param {AbortSignal} signal
 * @param {Number?} cacheDelay
 * @return {function(*=): (any | undefined)}
 */
export function sendToApi ({ apiConfig, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { API_HOST, ...tokens } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(API_HOST))
        .then(addOauthHeader(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request);
    });
  };
}
