import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { CcApiErrorEvent } from './send-to-api.events.js';

/** @import { ApiConfig, ApiTokenConfig } from './send-to-api.types.js' */

/** @type {WeakMap<ApiConfig | object, CcApiClient>} */
const oauthClientCache = new WeakMap();

/** @type {WeakMap<ApiTokenConfig, CcApiClient>} */
const tokenClientCache = new WeakMap();

/** Stable key for caching the client when no apiConfig is provided. */
const NO_OAUTH_CONFIG = {};

/**
 * Build an OAuth v1 auth method from the given apiConfig.
 * Returns `undefined` if any of the required OAuth credentials are missing,
 * which results in an unauthenticated client.
 *
 * @param {ApiConfig} [apiConfig]
 * @returns {{ type: 'oauth-v1', oauthTokens: { consumerKey: string, consumerSecret: string, token: string, secret: string } } | undefined}
 */
function getOAuthMethod(apiConfig) {
  if (
    apiConfig?.OAUTH_CONSUMER_KEY == null ||
    apiConfig?.OAUTH_CONSUMER_SECRET == null ||
    apiConfig?.API_OAUTH_TOKEN == null ||
    apiConfig?.API_OAUTH_TOKEN_SECRET == null
  ) {
    return undefined;
  }

  return {
    type: 'oauth-v1',
    oauthTokens: {
      consumerKey: apiConfig.OAUTH_CONSUMER_KEY,
      consumerSecret: apiConfig.OAUTH_CONSUMER_SECRET,
      token: apiConfig.API_OAUTH_TOKEN,
      secret: apiConfig.API_OAUTH_TOKEN_SECRET,
    },
  };
}

/**
 * Get or create a CcApiClient instance for the given apiConfig.
 * Clients are cached per apiConfig reference, so all components
 * sharing the same apiConfig will share the same client instance.
 *
 * - When called with a full apiConfig (including OAuth tokens), returns an authenticated client.
 * - When called with only `API_HOST` (no OAuth tokens), returns an unauthenticated client for that host.
 * - When called with `null` or `undefined`, returns an unauthenticated client using the default API host.
 *
 * @param {import('./send-to-api.types.js').ApiConfig | null} [apiConfig]
 * @returns {CcApiClient}
 */
export function getCcApiClientWithOAuth(apiConfig) {
  const cacheKey = apiConfig ?? NO_OAUTH_CONFIG;

  if (!oauthClientCache.has(cacheKey)) {
    oauthClientCache.set(
      cacheKey,
      createClient({
        authMethod: getOAuthMethod(apiConfig),
        baseUrl: apiConfig?.API_HOST,
        defaultRequestConfig: { cors: true },
      }),
    );
  }

  return oauthClientCache.get(cacheKey);
}

/**
 * Get or create a CcApiClient instance for the given API token config.
 * Clients are cached per apiTokenConfig reference, so all components
 * sharing the same apiTokenConfig will share the same client instance.
 *
 * @param {ApiTokenConfig} apiTokenConfig
 * @returns {CcApiClient}
 */
export function getCcApiClientWithToken(apiTokenConfig) {
  const cacheKey = apiTokenConfig;

  if (!tokenClientCache.has(cacheKey)) {
    tokenClientCache.set(
      cacheKey,
      createClient({
        authMethod: {
          type: 'api-token',
          apiToken: apiTokenConfig.API_TOKEN,
        },
        baseUrl: apiTokenConfig.API_HOST,
        defaultRequestConfig: { cors: true },
      }),
    );
  }

  return tokenClientCache.get(cacheKey);
}

/**
 * Create a CcApiClient with an onError hook that dispatches CcApiErrorEvent.
 *
 * @param {object} config - CcApiClient configuration
 * @returns {CcApiClient}
 */
function createClient(config) {
  return new CcApiClient({
    ...config,
    hooks: {
      onError: (error) => {
        window.dispatchEvent(new CcApiErrorEvent(error));
      },
    },
  });
}
