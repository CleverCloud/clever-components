import { get } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-consumer.js';

/**
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-oauth-consumer.types.js').OauthConsumerStateLoaded} OauthConsumerStateLoaded
 * @typedef {import('./cc-oauth-consumer.js').CcOauthConsumer} CcOauthConsumer
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcOauthConsumer>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },

  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('state', { type: 'loading' });

    api
      .getOauthConsumer()

      .then(
        /** @param {OauthConsumerStateLoaded} data */
        (data) => {
          updateComponent('state', {
            type: 'loaded',
            name: data.name,
            homePageUrl: data.url,
            appBaseUrl: data.baseUrl,
            description: data.description,
            image: data.picture,
            rights: Object.entries(data.rights).map(([name, isEnabled, section]) => {
              return { name, isEnabled, section };
            }),
            key: data.key,
            secret: data.secret,
          });
        },
      )
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {String} ownerId
   * @param {String} key
   */
  constructor(apiConfig, ownerId, key) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._key = key;
  }

  /**
   * @return {Promise<any>}
   */
  getOauthConsumer() {
    return get({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
