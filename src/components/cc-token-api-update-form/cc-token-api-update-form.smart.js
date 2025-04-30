import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToAuthBridge } from '../../lib/send-to-auth-bridge.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcTokenWasUpdatedEvent } from './cc-token-api-update-form.events.js';
import './cc-token-api-update-form.js';

/**
 * @typedef {import('./cc-token-api-update-form.js').CcTokenApiUpdateForm} CcTokenApiUpdateForm
 * @typedef {import('./cc-token-api-update-form.types.js').CcTokenChangePayload} CcTokenChangePayload
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiUpdateForm>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

defineSmartComponent({
  selector: 'cc-token-api-update-form',
  params: {
    apiConfig: { type: Object },
    apiTokenId: { type: String },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, component, onEvent, updateComponent }) {
    const { apiConfig, apiTokenId } = context;
    const api = new Api(apiConfig, apiTokenId);

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
    this._authBridgeConfig = authBridgeConfig;
    this._tokenId = tokenId;
  }

  /**
   * @param {{ tokenId: string }} params
   */
  _getOneToken(params) {
    return Promise.resolve({
      method: 'get',
      url: `/api-tokens/${params.tokenId}`,
      headers: { Accept: 'application/json' },
    });
  }

  /**
   * @param {{ tokenId: string }} params
   * @param {CcTokenChangePayload} body
   */
  _updateOneToken(params, body) {
    return Promise.resolve({
      method: 'put',
      url: `/api-tokens/${params.tokenId}`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body,
    });
  }

  getToken() {
    return this._getOneToken({ tokenId: this._tokenId }).then(
      sendToAuthBridge({ authBridgeConfig: this._authBridgeConfig }),
    );
  }

  /** @param {CcTokenChangePayload} body */
  updateToken(body) {
    return this._updateOneToken({ tokenId: this._tokenId }, body).then(
      sendToAuthBridge({ authBridgeConfig: this._authBridgeConfig }),
    );
  }
}
