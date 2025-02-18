// @ts-expect-error FIXME: remove when clever-client exports types
import { create } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
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
  selector: 'cc-oauth-consumer-form[smart-mode=create]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, onEvent }) {
    const { apiConfig, ownerId } = context;
    const api = new Api(apiConfig, ownerId);

    updateComponent('oauthConsumerFormState', { type: 'idle-create' });

    onEvent('cc-oauth-consumer-form:create', (data) => {
      updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
        oauthConsumerFormState.type = 'creating';
      });
      api
        .createOauthConsumer(data)
        .then(() => {
          notifySuccess('oauth consumer créé');
          window.dispatchEvent(new Event('oauth-consumer-create'));
        })
        .catch((error) => {
          console.error(error);
          notifyError("erreur lors de la création d'oauth consumer");
          updateComponent('oauthConsumerFormState', (oauthConsumerFormState) => {
            oauthConsumerFormState.type = 'idle-create';
          });
        });
    });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {String} ownerId
   */
  constructor(apiConfig, ownerId) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
  }

  /**
   * @param {OauthConsumer} data
   * @return {*}
   */
  createOauthConsumer(data) {
    const newOauthConsumer = {
      name: data.name,
      url: data.homePageUrl,
      baseUrl: data.appBaseUrl,
      description: data.description,
      picture: data.image,
      rights: {
        access_organisations: data.rights.access_organisations,
        manage_organisations: data.rights.manage_organisations,
        manage_organisations_services: data.rights.manage_organisations_services,
        manage_organisations_applications: data.rights.manage_organisations_applications,
        manage_organisations_members: data.rights.manage_organisations_members,
        access_organisations_bills: data.rights.access_organisations_bills,
        access_organisations_credit_count: data.rights.access_organisations_credit_count,
        access_organisations_consumption_statistics: data.rights.access_organisations_consumption_statistics,
        access_personal_information: data.rights.access_personal_information,
        manage_personal_information: data.rights.manage_personal_information,
        manage_ssh_keys: data.rights.manage_ssh_keys,
      },
    };
    console.log(data);
    return create({ id: this._ownerId }, newOauthConsumer).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
