import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToAuthBridge } from '../../lib/send-to-auth-bridge.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-list.js';

/**
 * @typedef {import('./cc-token-api-list.js').CcTokenApiList} CcTokenApiList
 * @typedef {import('./cc-token-api-list.types.js').TokenApiListStateLoaded} TokenApiListStateLoaded
 * @typedef {import('./cc-token-api-list.types.js').ApiTokenStateIdle} ApiTokenStateIdle
 * @typedef {import('./cc-token-api-list.types.js').ApiTokenState} ApiTokenState
 * @typedef {import('./cc-token-api-list.types.js').ApiToken} ApiToken
 * @typedef {import('./cc-token-api-list.types.js').RawApiToken} RawApiToken
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiList>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

defineSmartComponent({
  selector: 'cc-token-api-list',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, onEvent, updateComponent }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    /**
     * Updates a single session token
     *
     * @param {string} tokenId The ID of the token to update
     * @param {function(ApiTokenState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(tokenId, callback) {
      updateComponent(
        'state',
        /** @param {TokenApiListStateLoaded} state */
        (state) => {
          const apiTokenToUpdate = state.apiTokens.find((token) => token.id === tokenId);

          if (apiTokenToUpdate != null) {
            callback(apiTokenToUpdate);
          }
        },
      );
    }

    updateComponent('state', { type: 'loading' });

    api
      .getApiTokens()
      .then((tokens) => {
        /** @type {ApiTokenStateIdle[]} */
        const apiTokens = tokens.map((token) => ({
          type: 'idle',
          ...token,
        }));

        updateComponent('state', { type: 'loaded', apiTokens });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-token-revoke', (apiTokenId) => {
      updateOneToken(apiTokenId, (tokenState) => {
        tokenState.type = 'revoking';
      });

      api
        .revokeApiToken(apiTokenId)
        .then(() => {
          updateComponent(
            'state',
            /** @param {TokenApiListStateLoaded} state */
            (state) => {
              state.apiTokens = state.apiTokens.filter((token) => token.id !== apiTokenId);
            },
          );
          notifySuccess(i18n('cc-token-api-list.revoke-token.success'));
        })
        .catch((error) => {
          console.error(error);
          updateOneToken(apiTokenId, (sessionTokenState) => {
            sessionTokenState.type = 'idle';
          });
          notifyError(i18n('cc-token-api-list.revoke-token.error'));
        });
    });
  },
});

class Api {
  /** @param {AuthBridgeConfig} apiConfig */
  constructor(apiConfig) {
    this._authBridgeConfig = apiConfig;
  }

  _listApiTokens() {
    return Promise.resolve({
      method: 'get',
      url: '/api-tokens',
      headers: { Accept: 'application/json' },
    });
  }

  /** @param {string} apiTokenId */
  _deleteApiToken(apiTokenId) {
    return Promise.resolve({
      method: 'delete',
      url: `/api-tokens/${apiTokenId}`,
      headers: { Accept: 'application/json' },
    });
  }

  /** @returns {Promise<ApiToken[]>} */
  getApiTokens() {
    return this._listApiTokens()
      .then(sendToAuthBridge({ authBridgeConfig: this._authBridgeConfig }))
      .then(
        /** @param {RawApiToken[]} tokens */
        (tokens) =>
          tokens.map(
            /** @returns {ApiToken} */
            (token) => ({
              id: token.apiTokenId,
              creationDate: new Date(token.creationDate),
              expirationDate: new Date(token.expirationDate),
              name: token.name,
              description: token.description,
              isExpired: token.state === 'EXPIRED',
            }),
          ),
      );
  }

  /**
   * @param {string} apiTokenId
   * @returns {Promise<void>}
   */
  revokeApiToken(apiTokenId) {
    return this._deleteApiToken(apiTokenId).then(sendToAuthBridge({ authBridgeConfig: this._authBridgeConfig }));
  }
}
