// @ts-expect-error FIXME: remove when clever-client exports types
import { get, remove, update } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-consumer-form.js';

/**
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('./cc-oauth-consumer-form.js').CcOauthConsumerForm} CcOauthConsumerForm
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcOauthConsumerForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer-form[smart-mode=update]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, onEvent }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('oauthConsumerFormState', { type: 'loading' });

    api
      .getOauthConsumer()
      .then(
        /** @param {OauthConsumer} data */
        (data) => {
          updateComponent('oauthConsumerFormState', {
            name: data.name,
            description: data.description,
            homePageUrl: data.url,
            image: data.picture,
            appBaseUrl: data.baseUrl,
            rights: Object.entries(data.rights).map(([name, isEnabled]) => {
              return { name, isEnabled };
            }),
            type: 'idle-update',
          });
        },
      )
      .catch((error) => {
        console.error(error);
        updateComponent('oauthConsumerFormState', {
          type: 'error',
        });
      });

    onEvent('cc-oauth-consumer-form:update', (data) => {
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type = 'updating';
      });
      api
        .updateOauthConsumer(data)
        .then(() => {
          notifySuccess('form updaté');
        })
        .catch((error) => {
          console.error(error);
          notifyError("erreur pendant l'update");
        })
        .finally(() => {
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'idle-update';
          });
        });
    });

    onEvent('cc-oauth-consumer-form:delete', (data) => {
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type = 'deleting';
      });
      api
        .deleteOauthConsumer()
        .then(() => {
          notifySuccess('oauth consumer supprimé');
          window.dispatchEvent(new Event('oauth-consumer-delete'));
        })
        .catch((error) => {
          console.error(error);
          notifyError('erreur lors de la suppression');
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'idle-update';
          });
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

  /**
   * @param {OauthConsumer} data
   * @return {Promise<any>}
   */
  updateOauthConsumer(data) {
    const updatedOauthConsumer = {
      name: data.name,
      description: data.description,
      url: data.homePageUrl,
      picture: data.image,
      baseUrl: data.appBaseUrl,
      rights: data.rights,
    };
    return update({ id: this._ownerId, key: this._key }, updatedOauthConsumer).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  /**
   * @return {Promise<any>}
   */
  deleteOauthConsumer() {
    return remove({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
