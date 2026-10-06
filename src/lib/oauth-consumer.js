import { OAUTH_CONSUMER_RIGHTS } from '@clevercloud/client/cc-api-commands/oauth-consumer/oauth-consumer-rights.js';

/**
 * @import { OauthConsumerRights } from '@clevercloud/client/cc-api-commands/oauth-consumer/oauth-consumer.types.js'
 */

/**
 * Every right an OAuth consumer can hold, turned off. Spread it under a consumer's actual rights so
 * the ones the API leaves out are still represented.
 */
export const DISABLED_RIGHTS = /** @type {Record<OauthConsumerRights, boolean>} */ (
  Object.fromEntries(OAUTH_CONSUMER_RIGHTS.map((right) => [right, false]))
);
