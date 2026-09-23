import { CreateOauthConsumerCommand } from '@clevercloud/client/cc-api-commands/oauth-consumer/create-oauth-consumer-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcOauthConsumerWasCreatedEvent } from './cc-oauth-consumer-form.events.js';
import './cc-oauth-consumer-form.js';

/**
 * @import { CcOauthConsumerForm } from './cc-oauth-consumer-form.js'
 * @import { OauthConsumerWithoutKeyAndSecret } from './cc-oauth-consumer-form.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer-form[smart-mode=create]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /** @param {OnContextUpdateArgs<CcOauthConsumerForm>} args */
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
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._ownerId = ownerId;
  }

  /**
   * @param {OauthConsumerWithoutKeyAndSecret} data
   * @return {Promise<string>} key
   */
  createOauthConsumer(data) {
    return this._ccApiClient
      .send(
        new CreateOauthConsumerCommand({
          ownerId: this._ownerId,
          name: data.name,
          url: data.url,
          baseUrl: data.baseUrl,
          description: data.description,
          picture: data.picture,
          rights: data.rights,
        }),
      )
      .then((oauthConsumer) => oauthConsumer.key);
  }
}
