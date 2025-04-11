// @ts-expect-error FIXME: remove when clever-client exports types
import { create } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { snakeCase } from '../../lib/change-case.js';
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

    updateComponent('state', { type: 'idle-create' });

    onEvent('cc-oauth-consumer-form:create', (data) => {
      updateComponent('state', (state) => {
        // console.log('le composant passent en creating');
        state.type = 'creating';
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
          updateComponent('state', (state) => {
            state.type = 'idle-create';
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
      url: data.url,
      baseUrl: data.baseUrl,
      description: data.description,
      picture: data.picture,
      rights: {
        access_organisations: data.rights.accessOrganisations,
        manage_organisations: data.rights.manageOrganisations,
        manage_organisations_services: data.rights.manageOrganisationsServices,
        manage_organisations_applications: data.rights.manageOrganisationsApplications,
        manage_organisations_members: data.rights.manageOrganisationsMembers,
        access_organisations_bills: data.rights.accessOrganisationsBills,
        access_organisations_credit_count: data.rights.accessOrganisationsCreditCount,
        access_organisations_consumption_statistics: data.rights.accessOrganisationsConsumptionStatistics,
        access_personal_information: data.rights.accessPersonalInformation,
        manage_personal_information: data.rights.managePersonalInformation,
        manage_ssh_keys: data.rights.manageSshKeys,
        ...Object.fromEntries(
          Object.entries(data.rights).map(([name, isEnabled]) => {
            const snakeCaseName = snakeCase(name);
            return [snakeCaseName, isEnabled];
          }),
        ),
      },
    };
    console.log(data);
    return create({ id: this._ownerId }, newOauthConsumer).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
