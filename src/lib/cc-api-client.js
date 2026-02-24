import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { CcApiErrorEvent } from './send-to-api.events.js';

/** @import { ApiConfig, ApiTokenConfig } from './send-to-api.types.js' */

/** @type {Map<string, CcApiClient>} */
const clientCache = new Map();

/**
 * Generate a deterministic string key from a config object.
 * Returns an empty string for `null` or `undefined`.
 *
 * @param {object | null} [config]
 * @returns {string}
 */
function configToKey(config) {
  if (config == null) {
    return '';
  }
  return JSON.stringify(config, Object.keys(config).sort());
}

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
 * Clients are cached based on config content, so all components
 * with the same config values will share the same client instance.
 *
 * - When called with a full apiConfig (including OAuth tokens), returns an authenticated client.
 * - When called with only `API_HOST` (no OAuth tokens), returns an unauthenticated client for that host.
 * - When called with `null` or `undefined`, returns an unauthenticated client using the default API host.
 *
 * @param {import('./send-to-api.types.js').ApiConfig | null} [apiConfig]
 * @returns {CcApiClient}
 */
export function getCcApiClientWithOAuth(apiConfig) {
  const cacheKey = configToKey(apiConfig);

  if (!clientCache.has(cacheKey)) {
    clientCache.set(
      cacheKey,
      createClient({
        authMethod: getOAuthMethod(apiConfig),
        baseUrl: apiConfig?.API_HOST,
        defaultRequestConfig: { cors: true },
      }),
    );
  }

  return clientCache.get(cacheKey);
}

/**
 * Get or create a CcApiClient instance for the given API token config.
 * Clients are cached based on config content, so all components
 * with the same config values will share the same client instance.
 *
 * @param {ApiTokenConfig} apiTokenConfig
 * @returns {CcApiClient}
 */
export function getCcApiClientWithToken(apiTokenConfig) {
  const cacheKey = configToKey(apiTokenConfig);

  if (!clientCache.has(cacheKey)) {
    clientCache.set(
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

  return clientCache.get(cacheKey);
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
