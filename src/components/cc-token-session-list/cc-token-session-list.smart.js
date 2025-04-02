// prettier-ignore
// @ts-expect-error FIXME: remove when clever-client exports types
import { todo_listSelfTokens as getAllTokens,todo_revokeSelfToken as revokeToken } from '@clevercloud/client/esm/api/v2/user.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-session-list.js';

/**
 * @typedef {import('./cc-token-session-list.js').CcTokenSessionList} CcTokenSessionList
 * @typedef {import('./cc-token-session-list.types.js').SessionToken} SessionToken
 * @typedef {import('./cc-token-session-list.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-token-session-list.types.js').SessionTokenStateIdle} SessionTokenStateIdle
 * @typedef {import('./cc-token-session-list.types.js').TokenSessionListStateLoaded} TokenSessionListStateLoaded
 * @typedef {import('./cc-token-session-list.types.js').TokenSessionListStateRevokingAll} TokenSessionListStateRevokingAll
 * @typedef {import('./cc-token-session-list.types.js').RawTokenData} RawTokenData
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenSessionList>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-token-session-list',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ component, context, onEvent, updateComponent }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    /**
     * Updates a single session token
     *
     * @param {string} tokenId The ID of the token to update
     * @param {function(SessionTokenState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(tokenId, callback) {
      updateComponent(
        'state',
        /** @param {TokenSessionListStateLoaded} state */
        (state) => {
          const sessionTokenToUpdate = state.otherSessions.find((token) => token.id === tokenId);

          if (sessionTokenToUpdate != null) {
            callback(sessionTokenToUpdate);
          }
        },
      );
    }

    updateComponent('state', { type: 'loading' });

    api
      .getSessionTokens()
      .then((tokens) => {
        const rawCurrentToken = tokens.find((token) => token.token === apiConfig.API_OAUTH_TOKEN);
        /** @type {SessionToken} */
        const currentSession = {
          id: rawCurrentToken.token,
          isCleverTeam: rawCurrentToken.employeeId != null,
          creationDate: new Date(rawCurrentToken.creationDate),
          expirationDate: new Date(rawCurrentToken.expirationDate),
          lastUsedDate: new Date(rawCurrentToken.lastUtilisation),
        };

        const otherSessions = tokens
          .filter((token) => token.token !== apiConfig.API_OAUTH_TOKEN)
          .map((token) => {
            /** @type {SessionTokenStateIdle} */
            const formattedToken = {
              type: 'idle',
              id: token.token,
              isCleverTeam: token.employeeId != null,
              creationDate: new Date(token.creationDate),
              expirationDate: new Date(token.expirationDate),
              lastUsedDate: new Date(token.lastUtilisation),
            };
            return formattedToken;
          });

        updateComponent('state', { type: 'loaded', currentSession, otherSessions });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent(
      'cc-token-session-list:revoke-session',
      /** @param {string} tokenId */
      (tokenId) => {
        updateOneToken(tokenId, (sessionTokenState) => {
          sessionTokenState.type = 'revoking';
        });

        api
          .revokeSessionToken(tokenId)
          .then(() => {
            updateComponent(
              'state',
              /** @param {TokenSessionListStateLoaded} state */
              (state) => {
                state.otherSessions = state.otherSessions.filter((token) => token.id !== tokenId);
              },
            );
            notifySuccess(i18n('cc-token-session-list.revoke-session.success'));
          })
          .catch((error) => {
            console.error(error);
            updateOneToken(tokenId, (sessionTokenState) => {
              sessionTokenState.type = 'idle';
            });
            notifyError(i18n('cc-token-session-list.revoke-session.error'));
          });
      },
    );

    onEvent('cc-token-session-list:revoke-all-sessions', () => {
      updateComponent(
        'state',
        /** @param {TokenSessionListStateLoaded} state */
        (state) =>
          /** @type {TokenSessionListStateRevokingAll} */ ({
            ...state,
            type: 'revoking-all',
            otherSessions: state.otherSessions.map((token) => ({ ...token, type: 'revoking' })),
          }),
      );

      const tokens = /** @type {TokenSessionListStateLoaded} */ (component.state).otherSessions;

      api.revokeAllSessionTokens(tokens).then(({ remainingTokens, errors, revokedTokens }) => {
        updateComponent('state', (state) => {
          state.type = 'loaded';

          /** @type {TokenSessionListStateLoaded} */
          (state).otherSessions = remainingTokens.map((token) => ({
            ...token,
            type: 'idle',
          }));

          return state;
        });

        if (errors.length === 0) {
          notifySuccess(i18n('cc-token-session-list.revoke-all-sessions.success'));
        } else if (revokedTokens.length > 0) {
          notifyError(i18n('cc-token-session-list.revoke-all-sessions.partial-error'));
        } else {
          notifyError(i18n('cc-token-session-list.revoke-all-sessions.error'));
        }
      });
    });
  },
});

class Api {
  /** @param {ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
  }

  /**
   * Fetches and formats session tokens
   *
   * @returns {Promise<RawTokenData[]>} A promise that resolves to an array of formatted session tokens
   */
  getSessionTokens() {
    return getAllTokens()
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then(
        /** @param {Array<RawTokenData>} tokens */
        (tokens) => {
          const filteredTokens = tokens.filter(
            (token) => token.consumer.key === this._apiConfig.OAUTH_CONSUMER_KEY || token.employeeId != null,
          );

          return filteredTokens;
        },
      );
  }

  /**
   * Revokes a session token
   *
   * @param {string} tokenId - The ID of the token to revoke
   * @returns {Promise<void>} A promise that resolves when the token is revoked
   */
  revokeSessionToken(tokenId) {
    return revokeToken({ token: tokenId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * Revokes all session tokens
   * We cannot rely on the dedicated API endpoint for this operation because it revokes all tokens, including the current session token and tokens coming from other consumers (oAuth tokens).
   * This is why we revoke each token individually and use `Promise.allSettled` to handle errors gracefully.
   *
   * @param {SessionTokenState[]} tokensToRevoke - An array of all session tokens
   * @returns {Promise<{ remainingTokens: SessionTokenState[], revokedTokens: string[], errors: any[] }>} A promise that resolves when all tokens are revoked
   */
  revokeAllSessionTokens(tokensToRevoke) {
    let errors = [];
    /** @type {string[]} */
    let revokedTokens = [];

    return Promise.allSettled(
      tokensToRevoke.map((token) =>
        revokeToken({ token: token.id })
          .then(sendToApi({ apiConfig: this._apiConfig }))
          .then(() => token.id),
      ),
    ).then(
      /** @param {PromiseSettledResult<string>[]} results */
      (results) => {
        revokedTokens = results
          .filter(
            /** @returns {result is PromiseFulfilledResult<string>} */
            (result) => result.status === 'fulfilled',
          )
          .map(({ value }) => value);
        errors = results.filter((result) => result.status === 'rejected');

        const remainingTokens = tokensToRevoke.filter((token) => !revokedTokens.includes(token.id));

        return { remainingTokens, revokedTokens, errors };
      },
    );
  }
}
