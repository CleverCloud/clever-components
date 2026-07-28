import { GetOauthConsumerCommand } from '@clevercloud/client/cc-api-commands/oauth-consumer/get-oauth-consumer-command.js';
import { GetOauthConsumerSecretCommand } from '@clevercloud/client/cc-api-commands/oauth-consumer/get-oauth-consumer-secret-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { DISABLED_RIGHTS } from '../../lib/oauth-consumer.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-consumer-info.js';

/**
 * @import { CcOauthConsumerInfo } from './cc-oauth-consumer-info.js'
 * @import { RawOauthConsumer } from './cc-oauth-consumer-info.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer-info',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },

  /**
   * @param {OnContextUpdateArgs<CcOauthConsumerInfo>} args
   */
  onContextUpdate({ context, updateComponent }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('state', { type: 'loading' });

    api.getOauthConsumerWithSecret().then(({ rawOauthConsumer, secret, errors }) => {
      if (rawOauthConsumer != null) {
        const rights = {
          ...DISABLED_RIGHTS,
          ...Object.fromEntries(Object.entries(rawOauthConsumer.rights).filter(([, isEnabled]) => isEnabled != null)),
        };
        updateComponent('state', {
          type: 'loaded',
          name: rawOauthConsumer.name,
          url: rawOauthConsumer.url,
          baseUrl: rawOauthConsumer.baseUrl,
          description: rawOauthConsumer.description,
          picture: rawOauthConsumer.picture,
          rights,
          key: rawOauthConsumer.key,
          secret,
        });
      } else if (rawOauthConsumer == null) {
        errors.forEach((error) => {
          console.error(error);
        });
        updateComponent('state', {
          type: 'error',
        });
      }
    });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} ownerId
   * @param {string} key
   */
  constructor(apiConfig, ownerId, key) {
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._ownerId = ownerId;
    this._key = key;
  }

  /**
   * @return {Promise<RawOauthConsumer>}
   */
  getOauthConsumer() {
    return this._ccApiClient.send(
      new GetOauthConsumerCommand({ ownerId: this._ownerId, oauthConsumerKey: this._key, withSecret: false }),
    );
  }

  /**
   * @return {Promise<{secret: string}|null>}
   */
  getSecret() {
    return this._ccApiClient.send(
      new GetOauthConsumerSecretCommand({ ownerId: this._ownerId, oauthConsumerKey: this._key }),
    );
  }

  /**
   * @returns {Promise<{ rawOauthConsumer: RawOauthConsumer|null, secret: string|null, errors: any[] }>} A promise that resolves when getOauthConsumer and getSecret are resolved
   */
  getOauthConsumerWithSecret() {
    return Promise.allSettled([this.getOauthConsumer(), this.getSecret()]).then(
      /** @param {[PromiseSettledResult<RawOauthConsumer>, PromiseSettledResult<{secret: string}|null>]} results */
      (results) => {
        const [getOauthConsumerResult, getSecretResult] = results;
        const rawOauthConsumer = getOauthConsumerResult.status === 'fulfilled' ? getOauthConsumerResult.value : null;
        const secret = getSecretResult.status === 'fulfilled' ? (getSecretResult.value?.secret ?? null) : null;
        const errors = results.filter((result) => result.status === 'rejected');
        return { rawOauthConsumer, secret, errors };
      },
    );
  }
}
