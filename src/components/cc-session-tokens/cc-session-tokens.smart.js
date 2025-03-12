// prettier-ignore
// @ts-expect-error FIXME: remove when clever-client exports types
import { todo_listSelfTokens as getAllTokens, todo_revokeSelfToken as revokeToken } from '@clevercloud/client/esm/api/v2/user.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { notifySuccess, notifyError } from '../../lib/notifications.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-session-tokens.js';
import { i18n } from '../../translations/translation.js';

/**
 * @typedef {import('./cc-session-tokens.js').CcSessionTokens} CcSessionTokens
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenState} SessionTokenState
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensStateLoaded} SessionTokensStateLoaded
 * @typedef {import('./cc-session-tokens.types.js').SessionTokensStateRevokingAllTokens} SessionTokensStateRevokingAllTokens
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateRevoking} SessionTokensStateRevoking
 * @typedef {import('./cc-session-tokens.types.js').RawSessionTokenData} RawSessionTokenData
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcSessionTokens>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-session-tokens',
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
      updateComponent('state', (state) => {
        if (!('tokens' in state)) {
          return;
        }

        const sessionTokenToUpdate = state.tokens.find((token) => token.id === tokenId);

        if (sessionTokenToUpdate != null) {
          callback(sessionTokenToUpdate);
        }
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
        updateOneToken(tokenId, (sessionTokenState) => {
          sessionTokenState.type = 'revoking';
        });

        api
          .revokeSessionToken(tokenId)
          .then(() => {
            updateComponent(
              'state',
              /** @param {SessionTokensStateLoaded} state */
              (state) => {
                state.tokens = state.tokens.filter((token) => token.id !== tokenId);
              },
            );
            notifySuccess(i18n('cc-session-tokens.revoke-token.success'));
          })
          .catch((error) => {
            console.error(error);
            updateOneToken(tokenId, (sessionTokenState) => {
              sessionTokenState.type = 'idle';
            });
            notifyError(i18n('cc-session-tokens.revoke-token.error'));
          });
      },
    );

    onEvent('cc-session-tokens:revoke-all-tokens', () => {
      updateComponent(
        'state',
        /** @param {SessionTokensStateLoaded} state */
        (state) => ({
          ...state,
          type: 'revoking-all',
          tokens: state.tokens.map((token) => {
            if (!token.isCurrentSession) {
              return { ...token, type: 'revoking' };
            }

            return token;
          }),
        }),
      );

      const tokens = /** @type {SessionTokensStateLoaded} */ (component.state).tokens;

      api.revokeAllSessionTokens(tokens).then(({ remainingTokens, errors, revokedTokens }) => {
        updateComponent('state', (state) => {
          state.type = 'loaded';

          /** @type {SessionTokensStateLoaded} */
          (state).tokens = remainingTokens.map((token) => ({ ...token, type: 'idle' }));

          return state;
        });

        if (errors.length === 0) {
          notifySuccess(i18n('cc-session-tokens.revoke-all-tokens.success'));
        } else if (revokedTokens.length > 0) {
          notifyError(i18n('cc-session-tokens.revoke-all-tokens.partial-error'));
        } else {
          notifyError(i18n('cc-session-tokens.revoke-all-tokens.error'));
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
   * @returns {Promise<SessionTokenState[]>} A promise that resolves to an array of formatted session tokens
   */
  getSessionTokens() {
    return getAllTokens()
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then(
        /** @param {Array<RawSessionTokenData>} tokens */
        (tokens) => {
          const filteredTokens = tokens
            .filter((token) => token.consumer.key === this._apiConfig.OAUTH_CONSUMER_KEY || token.employeeId != null)
            .map((token) => {
              /** @type {SessionTokenState} */
              const formattedToken = {
                type: 'idle',
                id: token.token,
                isCurrentSession: token.token === this._apiConfig.API_OAUTH_TOKEN,
                isCleverTeam: token.employeeId != null,
                creationDate: token.creationDate,
                expirationDate: token.expirationDate,
                lastUsedDate: token.lastUtilisation,
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
   * @param {SessionTokenState[]} allTokens - An array of all session tokens
   * @returns {Promise<{ remainingTokens: SessionTokenState[], revokedTokens: string[], errors: any[] }>} A promise that resolves when all tokens are revoked
   */
  revokeAllSessionTokens(allTokens) {
    const tokensToRevoke = allTokens.filter((token) => !token.isCurrentSession);
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

        const remainingTokens = allTokens.filter((token) => !revokedTokens.includes(token.id));

        return { remainingTokens, revokedTokens, errors };
      },
    );
  }
}

/** TODO: remove - DO NOT REVIEW */
class MockApi {
  constructor() {}

  /**
   * Fetches and formats session tokens
   *
   * @returns {Promise<SessionTokenState[]>} A promise that resolves to an array of formatted session tokens
   */
  getSessionTokens() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data for session tokens
        const mockTokens = [
          {
            type: 'idle',
            id: 'token-123',
            isCurrentSession: true,
            isCleverTeam: false,
            creationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsedDate: new Date().toISOString(),
          },
          {
            type: 'idle',
            id: 'token-456',
            isCurrentSession: false,
            isCleverTeam: false,
            creationDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            type: 'idle',
            id: 'token-789',
            isCurrentSession: false,
            isCleverTeam: true,
            creationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
            lastUsedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            type: 'idle',
            id: 'token-101',
            isCurrentSession: false,
            isCleverTeam: false,
            creationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            type: 'idle',
            id: 'token-202',
            isCurrentSession: false,
            isCleverTeam: false,
            creationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        resolve(mockTokens);
      }, 2000);
    });
  }

  /**
   * Revokes a session token
   *
   * @param {string} tokenId - The ID of the token to revoke
   * @returns {Promise<void>} A promise that resolves when the token is revoked
   */
  revokeSessionToken(tokenId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  /**
   * Revokes all session tokens
   * We cannot rely on the dedicated API endpoint for this operation because it revokes all tokens, including the current session token and tokens coming from other consumers (oAuth tokens).
   * This is why we revoke each token individually and use `Promise.allSettled` to handle errors gracefully.
   *
   * @param {SessionTokenState[]} allTokens - An array of all session tokens
   * @returns {Promise<{ remainingTokens: SessionTokenState[], revokedTokens: string[], errors: any[] }>} A promise that resolves when all tokens are revoked
   */
  revokeAllSessionTokens(allTokens) {
    const tokensToRevoke = allTokens.filter((token) => !token.isCurrentSession);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful revocation of all tokens
        const revokedTokens = tokensToRevoke.map((token) => token.id);
        const errors = [];
        const remainingTokens = allTokens.filter((token) => token.isCurrentSession);

        resolve({ remainingTokens, revokedTokens, errors });
      }, 2000);
    });
  }
}
