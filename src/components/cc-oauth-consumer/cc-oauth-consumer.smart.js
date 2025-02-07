import { get } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';

/**
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-oauth-consumer.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('./cc-oauth-consumer.js').CcOauthConsumer} CcOauthConsumer
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer.js',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },

  /**
   * @param {Object} settings
   * @param {{ apiConfig: ApiConfig, ownerId: string, key: string }} settings.context
   * @param {function} settings.updateComponent
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
  onContextUpdate({ context, updateComponent }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('oauthConsumerState', { type: 'loading' });

    api
      .getOauthConsumer()
      .then(
        /** @param {OauthConsumer} data */
        (data) => {
          updateComponent('oauthConsumerState', {
            name: data.name,
            description: data.description,
            homePageUrl: data.url,
            image: data.picture,
            appBaseUrl: data.baseUrl,
            rights: Object.entries(data.rights).map(([name, isEnabled]) => {
              return { name, isEnabled };
            }),
          });
        },
      )
      .catch((error) => {
        console.error(error);
        updateComponent('oauthConsumerState', {
          type: 'error',
        });
      });
  },
});

class Api {
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
