import { CcApiClient } from '@clevercloud/client/cc-api-client.js';

/** @type {WeakMap<import('./send-to-api.types.js').ApiConfig, CcApiClient>} */
const clientCache = new WeakMap();

/**
 * Get or create a CcApiClient instance for the given apiConfig.
 * Clients are cached per apiConfig reference, so all components
 * sharing the same apiConfig will share the same client instance.
 *
 * @param {import('./send-to-api.types.js').ApiConfig} apiConfig
 * @returns {CcApiClient}
 */
export function getCcApiClient(apiConfig) {
  if (!clientCache.has(apiConfig)) {
    clientCache.set(
      apiConfig,
      new CcApiClient({
        authMethod: {
          type: 'oauth-v1',
          oauthTokens: {
            consumerKey: apiConfig.OAUTH_CONSUMER_KEY,
            consumerSecret: apiConfig.OAUTH_CONSUMER_SECRET,
            token: apiConfig.API_OAUTH_TOKEN,
            secret: apiConfig.API_OAUTH_TOKEN_SECRET,
          },
        },
        baseUrl: apiConfig.API_HOST,
        defaultRequestConfig: { cors: true },
      }),
    );
  }
  return clientCache.get(apiConfig);
}
