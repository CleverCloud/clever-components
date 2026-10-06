import { DeleteOauthConsumerCommand } from '@clevercloud/client/cc-api-commands/oauth-consumer/delete-oauth-consumer-command.js';
import { GetOauthConsumerCommand } from '@clevercloud/client/cc-api-commands/oauth-consumer/get-oauth-consumer-command.js';
import { UpdateOauthConsumerCommand } from '@clevercloud/client/cc-api-commands/oauth-consumer/update-oauth-consumer-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { DISABLED_RIGHTS } from '../../lib/oauth-consumer.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcOauthConsumerWasDeletedEvent, CcOauthConsumerWasUpdatedEvent } from './cc-oauth-consumer-form.events.js';
import './cc-oauth-consumer-form.js';

/**
 * @import { CcOauthConsumerForm } from './cc-oauth-consumer-form.js'
 * @import { OauthConsumerWithoutKeyAndSecret } from './cc-oauth-consumer-form.types.js'
 * @import { RawOauthConsumer } from '../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-oauth-consumer-form[smart-mode=update]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    key: { type: String },
  },
  /** @param {OnContextUpdateArgs<CcOauthConsumerForm>} args */
  onContextUpdate({ context, updateComponent, onEvent, component }) {
    const { apiConfig, ownerId, key } = context;
    const api = new Api(apiConfig, ownerId, key);

    updateComponent('state', { type: 'loading' });

    api
      .getOauthConsumer()
      .then((data) => {
        const rights = {
          ...DISABLED_RIGHTS,
          ...Object.fromEntries(Object.entries(data.rights).filter(([, isEnabled]) => isEnabled != null)),
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
   * @param {string} ownerId
   * @param {string} key
   */
  constructor(apiConfig, ownerId, key) {
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._ownerId = ownerId;
    this._key = key;
  }

  /** @return {Promise<RawOauthConsumer>} */
  getOauthConsumer() {
    return this._ccApiClient.send(
      new GetOauthConsumerCommand({ ownerId: this._ownerId, oauthConsumerKey: this._key, withSecret: false }),
    );
  }

  /**
   * @param {OauthConsumerWithoutKeyAndSecret} data
   * @return {Promise<void>}
   */
  async updateOauthConsumer(data) {
    await this._ccApiClient.send(
      new UpdateOauthConsumerCommand({
        ownerId: this._ownerId,
        oauthConsumerKey: this._key,
        name: data.name,
        url: data.url,
        baseUrl: data.baseUrl,
        description: data.description,
        picture: data.picture,
        rights: data.rights,
      }),
    );
  }

  /** @return {Promise<void>} */
  async deleteOauthConsumer() {
    await this._ccApiClient.send(
      new DeleteOauthConsumerCommand({ ownerId: this._ownerId, oauthConsumerKey: this._key }),
    );
  }
}
