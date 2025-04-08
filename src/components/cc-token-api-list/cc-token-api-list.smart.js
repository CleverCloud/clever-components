import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToAuthBridge } from '../../lib/send-to-oauth-bridge.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-list.js';

/**
 * @typedef {import('./cc-token-api-list.js').CcTokenApiList} CcTokenApiList
 * @typedef {import('./cc-token-api-list.types.js').TokenApiListStateLoaded} TokenApiListStateLoaded
 * @typedef {import('./cc-token-api-list.types.js').TokenApiStateIdle} TokenApiStateIdle
 * @typedef {import('./cc-token-api-list.types.js').TokenApiState} TokenApiState
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiList>} OnContextUpdateArgs
 * @typedef {import('./cc-token-api-list.types.js').RawApiToken} RawApiToken
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

console.log('SMART FILE IMPORTED');

defineSmartComponent({
  selector: 'cc-token-api-list',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, onEvent, updateComponent }) {
    console.log('context update triggered');
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    /**
     * Updates a single session token
     *
     * @param {string} tokenId The ID of the token to update
     * @param {function(TokenApiState): void} callback A callback function to execute with the updated token
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
        const formattedTokens = tokens.map((token) => {
          /** @type {TokenApiStateIdle} */
          const formattedToken = {
            type: 'idle',
            id: token.apiTokenId,
            creationDate: new Date(token.creationDate),
            expirationDate: new Date(token.expirationDate),
            name: token.name,
            description: token.description,
          };
          return formattedToken;
        });
        updateComponent('state', { type: 'loaded', apiTokens: formattedTokens });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-token-api-list:revoke-token', (apiTokenId) => {
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

console.log('parsing right before Api class declaration');
class Api {
  /** @param {ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
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

  /** @returns {Promise<RawApiToken[]>} */
  getApiTokens() {
    return this._listApiTokens().then(sendToAuthBridge({ apiConfig: this._apiConfig }));
  }

  /**
   * @param {string} apiTokenId
   * @returns {Promise<void>}
   */
  revokeApiToken(apiTokenId) {
    return this._deleteApiToken(apiTokenId).then(sendToAuthBridge({ apiConfig: this._apiConfig }));
  }
}
