// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getOauthConsumer, remove, update } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { camelCase, snakeCase } from '../../lib/change-case.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcOauthConsumerWasDeletedEvent, CcOauthConsumerWasUpdatedEvent } from './cc-oauth-consumer-form.events.js';
import './cc-oauth-consumer-form.js';

/**
 * @typedef {import('./cc-oauth-consumer-form.js').CcOauthConsumerForm} CcOauthConsumerForm
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateIdleUpdate} OauthConsumerFormStateIdleUpdate
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerWithoutKeyAndSecret} OauthConsumerWithoutKeyAndSecret
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumerRights} OauthConsumerRights
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').RawOauthConsumer} RawOauthConsumer
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcOauthConsumerForm>} OnContextUpdateArgs
 */

/** @type {OauthConsumerRights} */
const DISABLED_RIGHTS_BY_DEFAULT = {
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
};

defineSmartComponent({
  selector: 'cc-oauth-consumer-form[smart-mode=update]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, onEvent, component }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('state', { type: 'loading' });

    api
      .getOauthConsumer()
      .then((data) => {
        const rightsFromApiData = Object.fromEntries(
          Object.entries(data.rights).map(([name, isEnabled]) => {
            const camelCaseName = camelCase(name);
            return [camelCaseName, isEnabled];
          }),
        );
        const rights = {
          ...DISABLED_RIGHTS_BY_DEFAULT,
          ...rightsFromApiData,
        };

        /** @type {OauthConsumerWithoutKeyAndSecret} */
        const oauthConsumerValues = {
          name: data.name,
          url: data.url,
          baseUrl: data.baseUrl,
          description: data.description,
          picture: data.picture,
          rights,
        };

        updateComponent('state', {
          type: 'idle-update',
          values: oauthConsumerValues,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });

    onEvent('cc-oauth-consumer-change', (data) => {
      const oauthConsumerName = data.name;
      updateComponent('state', (state) => {
        state.type = 'updating';
      });
      api
        .updateOauthConsumer(data)
        .then(() => {
          notifySuccess(i18n('cc-oauth-consumer-form.update.success', { oauthConsumerName }));
          component.dispatchEvent(new CcOauthConsumerWasUpdatedEvent());
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-oauth-consumer-form.update.error', { oauthConsumerName }));
        })
        .finally(() => {
          updateComponent('state', (state) => {
            state.type = 'idle-update';
          });
        });
    });

    onEvent('cc-oauth-consumer-delete', () => {
      updateComponent('state', (state) => {
        state.type = 'deleting';
      });
      api
        .deleteOauthConsumer()
        .then(() => {
          notifySuccess(i18n('cc-oauth-consumer-form.delete.success'));
          component.dispatchEvent(new CcOauthConsumerWasDeletedEvent());
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-oauth-consumer-form.delete.error'));
          updateComponent('state', (state) => {
            state.type = 'idle-update';
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

  /** @return {Promise<RawOauthConsumer>} */
  getOauthConsumer() {
    return getOauthConsumer({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {OauthConsumerWithoutKeyAndSecret} data
   * @return {Promise<void>}
   */
  updateOauthConsumer(data) {
    const rights = Object.fromEntries(
      Object.entries(data.rights).map(([name, isEnabled]) => {
        const snakeCaseName = snakeCase(name);
        return [snakeCaseName, isEnabled];
      }),
    );

    const updatedOauthConsumer = {
      name: data.name,
      url: data.url,
      baseUrl: data.baseUrl,
      description: data.description,
      picture: data.picture,
      rights: rights,
    };
    return update({ id: this._ownerId, key: this._key }, updatedOauthConsumer).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  /** @return {Promise<void>} */
  deleteOauthConsumer() {
    return remove({ id: this._ownerId, key: this._key }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
