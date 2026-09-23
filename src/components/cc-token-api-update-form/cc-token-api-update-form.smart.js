import { GetApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/get-api-token-command.js';
import { UpdateApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/update-api-token-command.js';
import { getCcApiBridgeClient } from '../../lib/cc-api-client.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcTokenWasUpdatedEvent } from './cc-token-api-update-form.events.js';
import './cc-token-api-update-form.js';

/**
 * @import { CcTokenApiUpdateForm } from './cc-token-api-update-form.js'
 * @import { CcTokenChangePayload } from './cc-token-api-update-form.types.js'
 * @import { AuthBridgeConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-token-api-update-form',
  params: {
    apiConfig: { type: Object },
    apiTokenId: { type: String },
  },
  /** @param {OnContextUpdateArgs<CcTokenApiUpdateForm>} args */
  onContextUpdate({ context, component, onEvent, updateComponent }) {
    const { apiConfig, apiTokenId } = context;
    const api = new Api(apiConfig, apiTokenId);

    updateComponent('apiBridgeBaseUrl', apiConfig.AUTH_BRIDGE_HOST);
    updateComponent('state', { type: 'loading' });

    api
      .getToken()
      .then(({ name, description }) => {
        updateComponent('state', { type: 'loaded', values: { name, description } });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-token-change', ({ name, description }) => {
      updateComponent('state', (state) => {
        state.type = 'updating';
      });

      api
        .updateToken({ name, description })
        .then(() => {
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
          // Dispatch event to make the console redirect to the list of tokens
          component.dispatchEvent(new CcTokenWasUpdatedEvent(apiTokenId));
          notifySuccess(i18n('cc-token-api-update-form.update-token.success'));
        })
        .catch((error) => {
          console.error(error);
          updateComponent('state', (state) => {
            state.type = 'loaded';
          });
          notifyError(i18n('cc-token-api-update-form.update-token.error'));
        });
    });
  },
});

class Api {
  /**
   * @param {AuthBridgeConfig} authBridgeConfig
   * @param {string} tokenId
   */
  constructor(authBridgeConfig, tokenId) {
    this._ccApiBridgeClient = getCcApiBridgeClient(authBridgeConfig);
    this._tokenId = tokenId;
  }

  getToken() {
    return this._ccApiBridgeClient.send(new GetApiTokenCommand({ apiTokenId: this._tokenId }));
  }

  /** @param {CcTokenChangePayload} body */
  updateToken(body) {
    return this._ccApiBridgeClient.send(
      new UpdateApiTokenCommand({ apiTokenId: this._tokenId, name: body.name, description: body.description }),
    );
  }
}
