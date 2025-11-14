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
 * @import { CcTokenSessionList } from './cc-token-session-list.js'
 * @import { SessionToken, SessionTokenState, SessionTokenStateIdle, TokenSessionListStateLoaded, TokenSessionListStateRevokingAll, RawTokenData } from './cc-token-session-list.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-token-session-list',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs<CcTokenSessionList>} args */
  onContextUpdate({ component, context, onEvent, updateComponent }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    /**
     * Updates a single session token
     *
     * @param {string} sessionTokenId The ID of the token to update
     * @param {function(SessionTokenState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(sessionTokenId, callback) {
      updateComponent(
        'state',
        /** @param {TokenSessionListStateLoaded} state */
        (state) => {
          const sessionTokenToUpdate = state.otherSessionTokens.find((token) => token.id === sessionTokenId);

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
        const currentSessionToken = tokens.find((token) => token.id === apiConfig.API_OAUTH_TOKEN);

        const otherSessionTokens = tokens
          .filter((token) => token.id !== apiConfig.API_OAUTH_TOKEN)
          .map((token) => {
            /** @type {SessionTokenStateIdle} */
            const formattedToken = {
              type: 'idle',
              ...token,
            };
            return formattedToken;
          });

        updateComponent('state', {
          type: 'loaded',
          currentSessionToken,
          otherSessionTokens,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-token-revoke', (sessionTokenId) => {
      updateOneToken(sessionTokenId, (sessionTokenState) => {
        sessionTokenState.type = 'revoking';
      });

      api
        .revokeSessionToken(sessionTokenId)
        .then(() => {
          updateComponent(
            'state',
            /** @param {TokenSessionListStateLoaded} state */
            (state) => {
              state.otherSessionTokens = state.otherSessionTokens.filter((token) => token.id !== sessionTokenId);
            },
          );
          notifySuccess(i18n('cc-token-session-list.revoke-session.success'));
        })
        .catch((error) => {
          console.error(error);
          updateOneToken(sessionTokenId, (sessionTokenState) => {
            sessionTokenState.type = 'idle';
          });
          notifyError(i18n('cc-token-session-list.revoke-session.error'));
        });
    });

    onEvent('cc-tokens-revoke-all', () => {
      updateComponent(
        'state',
        /** @param {TokenSessionListStateLoaded} state */
        (state) =>
          /** @type {TokenSessionListStateRevokingAll} */ ({
            ...state,
            type: 'revoking-all',
            otherSessionTokens: state.otherSessionTokens.map((token) => ({ ...token, type: 'revoking' })),
          }),
      );

      const tokens = /** @type {TokenSessionListStateLoaded} */ (component.state).otherSessionTokens;

      api.revokeAllSessionTokens(tokens).then(({ remainingTokens, errors, revokedTokens }) => {
        updateComponent('state', (state) => {
          state.type = 'loaded';

          /** @type {TokenSessionListStateLoaded} */
          (state).otherSessionTokens = remainingTokens.map((token) => ({
            ...token,
            type: 'idle',
          }));

          return state;
        });

        if (errors.length === 0) {
          notifySuccess(i18n('cc-token-session-list.revoke-all-sessions.success'));
        } else if (revokedTokens.length > 0) {
          errors.forEach((error) => console.error(error));
          notifyError(i18n('cc-token-session-list.revoke-all-sessions.partial-error'));
        } else {
          errors.forEach((error) => console.error(error));
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
   * @returns {Promise<SessionToken[]>} A promise that resolves to an array of formatted session tokens
   */
  getSessionTokens() {
    return getAllTokens()
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then(
        /** @param {Array<RawTokenData>} tokens */
        (tokens) => {
          const filteredTokens = tokens
            /*
             * Only keep sessions related to the console in use and all login as sessions (those with an employeeId).
             * We cannot keep only login as sessions for the console in use because the login as OAuth consumer
             * is always the prod console OAuth consumer
             */
            .filter((token) => token.consumer.key === this._apiConfig.OAUTH_CONSUMER_KEY || token.employeeId != null)
            .map((token) => {
              /** @type {SessionToken} */
              const formattedToken = {
                id: token.token,
                isCleverTeam: token.employeeId != null,
                creationDate: new Date(token.creationDate),
                expirationDate: new Date(token.expirationDate),
                lastUsedDate: new Date(token.lastUtilisation),
              };
              return formattedToken;
            });

          return filteredTokens;
        },
      );
  }

  /**
   * Revokes a session token
   *
   * @param {string} sessionTokenId - The ID of the token to revoke
   * @returns {Promise<void>} A promise that resolves when the token is revoked
   */
  revokeSessionToken(sessionTokenId) {
    return revokeToken({ token: sessionTokenId }).then(sendToApi({ apiConfig: this._apiConfig }));
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
      tokensToRevoke.map((token) => this.revokeSessionToken(token.id).then(() => token.id)),
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
