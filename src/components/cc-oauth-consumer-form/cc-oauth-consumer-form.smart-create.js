// @ts-expect-error FIXME: remove when clever-client exports types
import { create } from '@clevercloud/client/esm/api/v2/oauth-consumer.js';
import { snakeCase } from '../../lib/change-case.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcOauthConsumerWasCreatedEvent } from './cc-oauth-consumer-form.events.js';
import './cc-oauth-consumer-form.js';

/**
 * @typedef {import('./cc-oauth-consumer-form.js').CcOauthConsumerForm} CcOauthConsumerForm
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerWithoutKeyAndSecret} OauthConsumerWithoutKeyAndSecret
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcOauthConsumerForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer-form[smart-mode=create]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, updateComponent, onEvent, component }) {
    const { apiConfig, ownerId } = context;
    const api = new Api(apiConfig, ownerId);

    updateComponent('state', { type: 'idle-create' });

    onEvent('cc-oauth-consumer-create', (data) => {
      const oauthConsumerName = data.name;
      updateComponent('state', (state) => {
        state.type = 'creating';
      });
      api
        .createOauthConsumer(data)
        .then((key) => {
          notifySuccess(i18n('cc-oauth-consumer-form.create.success', { oauthConsumerName }));
          component.resetOauthConsumerForm();
          updateComponent('state', { type: 'idle-create' });
          component.dispatchEvent(new CcOauthConsumerWasCreatedEvent(key));
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            console.error(error);
            notifyError(i18n('cc-oauth-consumer-form.create.error'));
            updateComponent('state', (state) => {
              state.type = 'idle-create';
            });
          },
        );
    });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} ownerId
   */
  constructor(apiConfig, ownerId) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
  }

  /**
   * @param {OauthConsumerWithoutKeyAndSecret} data
   * @return {Promise<string>} key
   */
  createOauthConsumer(data) {
    const rights = Object.fromEntries(
      Object.entries(data.rights).map(([name, isEnabled]) => {
        const snakeCaseName = snakeCase(name);
        return [snakeCaseName, isEnabled];
      }),
    );

    const newOauthConsumer = {
      name: data.name,
      url: data.url,
      baseUrl: data.baseUrl,
      description: data.description,
      picture: data.picture,
      rights,
    };
    return create({ id: this._ownerId }, newOauthConsumer)
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then(/** @param {OauthConsumer} response */ (response) => response.key);
  }
}
