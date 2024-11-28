import { get } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';

/**
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('./cc-oauth-consumer-form.types.js').NewOauthConsumer} NewOauthConsumer
 */
defineSmartComponent({
  selector: `cc-oauth-consumer-form`,
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },

  /**
   * @param {Object} settings
   * @param {{ apiConfig: ApiConfig, ownerId: string, key: string }} settings.context
   * @param {function} settings.updateComponent
   * @param {AbortSignal} settings.signal
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   */
  // @ts-expect-error FIXME: remove once `onContextUpdate` is type with generics
  onContextUpdate({ context, updateComponent, signal, onEvent }) {
    // récupérer le context
    const { apiConfig, ownerId, key } = context;
    // mettre le composant en skeleton
    updateComponent('oauthConsumerFormState', { type: 'loading' });
    // récupérer les données de l'API
    // mettre le composant en idle-update
    getOauthConsumer({ apiConfig, ownerId, key, signal })
      .then((data) => {
        updateComponent('oauthConsumerFormState', {
          type: 'idle-update',
          values: {
            name: data.name,
            homePageUrl: data.url,
            appBaseUrl: data.baseUrl,
            description: data.description,
            image: data.picture,
            options: data.rights,
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
    // getter event submit
    onEvent('cc-oauth-consumer-form:update', (data) => {
      // mettre le composant en waiting
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type === 'updating';
      });
      updateOauthConsumer({ apiConfig, ownerId, key, data })
        .then(() => {
          notifySuccess('form updaté');
        })
        .catch((error) => {
          console.error(error);
          notifyError("erreur pendant l'update");
        })
        .finally(() => {
          // remettre le composant en idle-update
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'idle-update';
          });
        });
    });
  },
});

/**
 * @param options
 * @param {ApiConfig} options.apiConfig
 * @param {string} options.ownerId
 * @param {string} options.key
 * @param {AbortSignal} option.signal
 * @return {Promise<any>}
 */
function getOauthConsumer({ apiConfig, ownerId, key, signal }) {
  return get({ id: ownerId, key }).then(
    sendToApi({
      apiConfig,
      signal,
    }),
  );
}

/**
 * @param options
 * @param {ApiConfig} options.apiConfig
 * @param {string} options.ownerId
 * @param {string} options.key
 * @param {NewOauthConsumer} options.data
 * @return {*}
 */
function updateOauthConsumer({ apiConfig, ownerId, key, data }) {
  const newData = {
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
  return update({ id: ownerId, key }, newData).then(sendToApi({ apiConfig }));
}
