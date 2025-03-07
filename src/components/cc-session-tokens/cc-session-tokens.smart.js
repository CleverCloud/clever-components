// @ts-expect-error FIXME: remove when clever-client exports types
import {
  todo_listSelfTokens as getAllTokens,
  todo_revokeSelfToken as revokeToken,
} from '@clevercloud/client/esm/api/v2/user.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-session-tokens.js';
import { updateContext } from '../../lib/smart/smart-manager.js';
import { notifyError } from '../../lib/notifications.js';

// TODO: find API call in clever-client
/**
 * @typedef {import('./cc-session-tokens.js').CcSessionTokens} CcSessionTokens
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensStateLoaded} SessionTokensStateLoaded
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateRevoking} SessionTokensStateRevoking
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcSessionTokens>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-session-tokens',
  params: {
    apiConfig: { type: Object },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    /**
     * Updates a single session token
     * @param {string} tokenId The ID of the token to update
     * @param {function(SessionTokenState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(tokenId, callback) {
      updateComponent('state', (state) => {
        if (state.type !== 'loaded') {
          return;
        }

        const sessionTokenToUpdate = state.tokens.find((token) => token.id !== tokenId);
        callback(sessionTokenToUpdate);
      });
    }

    updateComponent('state', { type: 'loading' });

    api
      .getSessionTokens()
      .then((tokens) => {
        updateComponent('state', { type: 'loaded', tokens });
      })
      .catch(() => {
        updateComponent('state', { type: 'error' });
      });

    onEvent(
      'cc-session-tokens:revoke-token',
      /** @param {string} tokenId */
      (tokenId) => {
        console.log('tokenId', tokenId);
        updateOneToken(tokenId, (sessionTokenState) => {
          sessionTokenState.type = 'revoking';
        });

        api
          .revokeSessionToken(tokenId)
          .then(() => {
            updateComponent('state', (state) => {
              if (state.type === 'loaded') {
                state.tokens = state.tokens.filter((token) => token.id !== tokenId);
              }
              return state;
            });
          })
          .catch((error) => {
            console.error('Error revoking token:', error);
            updateOneToken(tokenId, (sessionTokenState) => {
              sessionTokenState.type = 'idle';
            });
            notifyError('nope');
          });
      },
    );
  },
});

class Api {
  /** @param {ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
  }

  /**
   * Fetches and formats session tokens
   * @returns {Promise<SessionTokenState[]>} A promise that resolves to an array of formatted session tokens
   */
  getSessionTokens() {
    return (
      getAllTokens()
        .then(sendToApi({ apiConfig: this._apiConfig }))
        // TODO: type raw response
        .then((tokens) => {
          const filteredTokens = tokens
            .filter((token) => token.consumer.key === this._apiConfig.OAUTH_CONSUMER_KEY)
            .map((token) => {
              /** @type {SessionTokenState} */
              const formattedToken = {
                type: 'idle',
                id: token.token,
                isCurrentSession: token.token === this._apiConfig.API_OAUTH_TOKEN,
                creationDate: token.creationDate,
                expirationDate: token.expirationDate,
                lastUsedDate: token.lastUtilisation,
              };
              return formattedToken;
            });

          return filteredTokens;
        })
    );
  }

  /**
   * Revokes a session token
   * @param {string} tokenId - The ID of the token to revoke
   * @returns {Promise<void>} A promise that resolves when the token is revoked
   */
  revokeSessionToken(tokenId) {
    return revokeToken({ token: tokenId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}
