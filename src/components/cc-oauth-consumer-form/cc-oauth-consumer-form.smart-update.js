// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getOauthConsumer, getSecret, remove, update } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { camelCase } from '../../lib/change-case.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-consumer-form.js';

/**
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateIdleUpdate} OauthConsumerFormStateIdleUpdate
 *
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

    updateComponent('state', { type: 'loading' });

    Promise.all([api.getOauthConsumer(), api.getSecret()])
      .then(([data, secretData]) => {
        const rights = {
          almighty: false,
          accessOrganisations: false,
          accessOrganisationsBills: false,
          accessOrganisationsConsumptionStatistics: false,
          accessOrganisationsCreditCount: false,
          accessPersonalInformation: false,
          manageOrganisations: false,
          manageOrganisationsApplications: false,
          manageOrganisationsMembers: false,
          manageOrganisationsServices: false,
          managePersonalInformation: false,
          manageSshKeys: false,
          ...Object.fromEntries(
            Object.entries(data.rights).map(([name, isEnabled]) => {
              const camelCaseName = camelCase(name);
              return [camelCaseName, isEnabled];
            }),
          ),
        };
        updateComponent('state', {
          type: 'idle-update',
          name: data.name,
          url: data.url,
          baseUrl: data.baseUrl,
          description: data.description,
          picture: data.picture,
          rights,
          key: data.key,
          secret: secretData.secret,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });

    /* onEvent('cc-oauth-consumer-form:update', (data) => {
      updateComponent('state', (state) => {
        state.type = 'updating';
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
          updateComponent('state', (state) => {
            state.type = 'idle-update';
          });
        });
    }); */

    /* onEvent('cc-oauth-consumer-form:delete', () => {
      updateComponent('state', (state) => {
        state.type = 'deleting';
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
          updateComponent('state', (state) => {
            state.type = 'idle-update';
          });
        });
    }); */
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
   * @return {Promise<OauthConsumerFormStateIdleUpdate>}
   */
  getOauthConsumer() {
    return getOauthConsumer({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @return {Promise<{secret: string}>}
   */
  getSecret() {
    return getSecret({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {OauthConsumer} data
   * @return {Promise<any>}
   */
  updateOauthConsumer(data) {
    const updatedOauthConsumer = {
      name: data.name,
      url: data.url,
      baseUrl: data.baseUrl,
      description: data.description,
      picture: data.picture,
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
