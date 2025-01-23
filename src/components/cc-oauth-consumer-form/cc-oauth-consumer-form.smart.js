import { create, get, remove, update } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-consumer-form.js';

/**
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-oauth-consumer-form.types.js').oauthConsumer} OauthConsumer
 * @typedef {import('./cc-oauth-consumer-form.types.js').OAuthConsumerFormContextType} OAuthConsumerFormContextType
 * @typedef {import('./cc-oauth-consumer-form.js').CcOauthConsumerForm} CcOauthConsumerForm
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer-form',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    // Only needed for the update and delete
    key: { type: String, optional: true },
    formContext: { type: String },
  },
  /**
   * @param {Object} settings
   * @param {{ apiConfig: ApiConfig, ownerId: string, key: string, formContext: 'create' | 'update' }} settings.context
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   * @param {CcOauthConsumerForm} settings.component
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
  onContextUpdate({ context, signal, updateComponent, onEvent, component }) {
    const { apiConfig, ownerId, key, formContext } = context;
    // IF UPDATE
    if (formContext === 'update') {
      // Récupérer valeurs actuelles dans le context
      updateComponent('oauthConsumerFormState', { type: 'loading' });
      // Récupérer les données de l'API
      getOauthConsumer({
        ownerId,
        key,
        apiConfig,
        signal,
      })
        .then(
          /** @param {OauthConsumer} data */
          (data) => {
            console.log(data);
            updateComponent('oauthConsumerFormState', {
              values: {
                name: data.name,
                description: data.description,
                homePageUrl: data.url,
                image: data.picture,
                appBaseUrl: data.baseUrl,
              },
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
    }
    // IF CREATE
    if (formContext === 'create') {
      updateComponent('oauthConsumerFormState', { type: 'idle-create' });
    }

    // UPDATE
    // Détecter un submit
    onEvent('cc-oauth-consumer-form:update', (data) => {
      // PAsser le composant en updating
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type = 'updating';
      });
      // Envoi des données à l'API
      updateOauthConsumer({ ownerId, key, apiConfig, data })
        // Si succès: notifier
        .then(() => {
          notifySuccess('form updaté');
        })
        // Si erreur: notifier
        .catch((error) => {
          console.error(error);
          notifyError("erreur pendant l'update");
        })
        // Repasser le composant en idle-update
        .finally(() => {
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'idle-update';
          });
        });
    });

    // DELETE
    // Détecter un event suppresion
    onEvent('cc-oauth-consumer-form:delete', (data) => {
      // Passer le composant en deleting
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type = 'deleting';
      });
      // Envoi des données à supprimer à l'API
      deleteOauthConsumer({ ownerId, key, apiConfig })
        // Si sucess notif sucess
        .then(() => {
          notifySuccess('oauth consumer supprimé');
          window.dispatchEvent(new Event('oauth-consumer-delete'));
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'error';
          });
        })
        // Si error notif error
        .catch((error) => {
          notifyError('erreur lors de la suppression');
        });
    });

    // CREATE
    onEvent('cc-oauth-consumer-form:create', (data) => {
      // mettre le composant en creating
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type = 'creating';
      });
      createOauthConsumer({ apiConfig, ownerId, data })
        .then(() => {
          notifySuccess('oauth consumer créé');
          component.resetOauthConsumerForm();
          window.dispatchEvent(new Event('oauth-consumer-create'));
        })
        .catch((error) => {
          console.error(error);
          notifyError("erreur lors de la création d'oauth consumer");
        })
        .finally(() => {
          // remettre le composant en idle-create
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'idle-create';
          });
        });
    });
  },
});

/**
 * @param {Object} options
 * @param {string} options.ownerId
 * @param {string} options.key
 * @param {ApiConfig} options.apiConfig
 * @param {AbortSignal} options.signal
 * @return {Promise<any>}
 */
function getOauthConsumer({ ownerId, key, apiConfig, signal }) {
  return get({ id: ownerId, key }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {Object} options
 * @param {string} options.ownerId
 * @param {string} options.key
 * @param {ApiConfig} options.apiConfig
 * @param {OauthConsumer} options.data
 * @return {Promise<any>}
 */
function updateOauthConsumer({ ownerId, key, apiConfig, data }) {
  const newData = {
    name: data.name,
    description: data.description,
    url: data.homePageUrl,
    picture: data.image,
    baseUrl: data.appBaseUrl,
    rights: {
      access_organisations: false,
      manage_organisations: false,
      manage_organisations_services: false,
      manage_organisations_applications: false,
      manage_organisations_members: false,
      access_organisations_bills: false,
      access_organisations_credit_count: false,
      access_organisations_consumption_statistics: false,
      access_personal_information: false,
      manage_personal_information: false,
      manage_ssh_keys: false,
    },
  };
  return update({ id: ownerId, key }, newData).then(sendToApi({ apiConfig }));
}

/**
 * @param {Object} options
 * @param {string} options.ownerId
 * @param {string} options.key
 * @param {ApiConfig} options.apiConfig
 */
function deleteOauthConsumer({ ownerId, key, apiConfig }) {
  return remove({ id: ownerId, key }).then(sendToApi({ apiConfig }));
}

/**
 * @param {Object} options
 * @param {ApiConfig} options.apiConfig
 * @param {string} options.ownerId
 * @param {OauthConsumer} options.data
 * @return {*}
 */
function createOauthConsumer({ apiConfig, ownerId, data }) {
  const newOauthConsumer = {
    name: data.name,
    url: data.homePageUrl,
    baseUrl: data.appBaseUrl,
    description: data.description,
    picture: data.image,
    rights: {
      access_organisations: false,
      manage_organisations: false,
      manage_organisations_services: false,
      manage_organisations_applications: false,
      manage_organisations_members: false,
      access_organisations_bills: false,
      access_organisations_credit_count: false,
      access_organisations_consumption_statistics: false,
      access_personal_information: false,
      manage_personal_information: false,
      manage_ssh_keys: false,
    },
  };
  console.log(newOauthConsumer);
  return create({ id: ownerId }, newOauthConsumer).then(sendToApi({ apiConfig }));
}
