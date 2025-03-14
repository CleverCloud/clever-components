// prettier-ignore
// @ts-expect-error FIXME: remove when clever-client exports types
import { todo_listSelfTokens as getAllTokens, todo_revokeSelfToken as revokeToken } from '@clevercloud/client/esm/api/v2/user.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { notifySuccess, notifyError } from '../../lib/notifications.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-oauth-token-list.js';
import { i18n } from '../../translations/translation.js';

/**
 * @typedef {import('./cc-oauth-token-list.js').CcOauthTokenList} CcOauthTokenList
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenState} OauthTokenState
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenListStateLoaded} OauthTokenListStateLoaded
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenListStateRevokingAll} OauthTokenListStateRevokingAll
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenStateRevoking} OauthTokenStateRevoking
 * @typedef {import('../cc-session-tokens/cc-session-tokens.types.js').RawTokenData} RawTokenData
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcOauthTokenList>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-oauth-token-list',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ component, context, onEvent, updateComponent }) {
    const { apiConfig } = context;
    // @ts-ignore
    const api = new Api(apiConfig);

    /**
     * Updates a single OAuth token
     *
     * @param {string} tokenId The ID of the token to update
     * @param {function(OauthTokenState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(tokenId, callback) {
      updateComponent(
        'state',
        /** @param {OauthTokenListStateLoaded} state */
        (state) => {
          const oauthTokenToUpdate = state.tokens.find((token) => token.id === tokenId);

          console.log({ oauthTokenToUpdate, tokenId, tokens: state.tokens });
          if (oauthTokenToUpdate != null) {
            callback(oauthTokenToUpdate);
          }
        },
      );
    }

    updateComponent('state', { type: 'loading' });

    api
      .getOauthTokens()
      .then((tokens) => {
        const formattedTokens = tokens.map((token) => {
          /** @type {OauthTokenState} */
          const formattedToken = {
            type: 'idle',
            id: token.token,
            consumerName: token.consumer.name,
            creationDate: new Date(token.creationDate),
            expirationDate: new Date(token.expirationDate),
            lastUsedDate: new Date(token.lastUtilisation),
            imageUrl: token.consumer.picture,
          };

          return formattedToken;
        });
        updateComponent('state', { type: 'loaded', tokens: formattedTokens });
      })
      .catch(() => {
        updateComponent('state', { type: 'error' });
      });

    onEvent(
      'cc-oauth-token-list:revoke-token',
      /** @param {string} tokenId */
      (tokenId) => {
        updateOneToken(tokenId, (oauthTokenState) => {
          oauthTokenState.type = 'revoking';
        });

        api
          .revokeOauthToken(tokenId)
          .then(() => {
            updateComponent(
              'state',
              /** @param {OauthTokenListStateLoaded} state */
              (state) => {
                state.tokens = state.tokens.filter((token) => token.id !== tokenId);
              },
            );
            notifySuccess(i18n('cc-oauth-token-list.revoke-token.success'));
          })
          .catch((error) => {
            console.error(error);
            updateOneToken(tokenId, (oauthTokenState) => {
              oauthTokenState.type = 'idle';
            });
            notifyError(i18n('cc-oauth-token-list.revoke-token.error'));
          });
      },
    );

    onEvent('cc-oauth-token-list:revoke-all-tokens', () => {
      updateComponent(
        'state',
        /** @param {OauthTokenListStateLoaded} state */
        (state) => ({
          ...state,
          type: 'revoking-all',
          tokens: state.tokens.map((token) => ({ ...token, type: 'revoking' })),
        }),
      );

      const tokens = /** @type {OauthTokenListStateLoaded} */ (component.state).tokens;

      api.revokeAllOauthTokens(tokens).then(({ remainingTokens, errors, revokedTokens }) => {
        updateComponent('state', (state) => {
          state.type = 'loaded';

          /** @type {OauthTokenListStateLoaded} */
          (state).tokens = remainingTokens.map((token) => ({
            ...token,
            type: 'idle',
          }));

          return state;
        });

        if (errors.length === 0) {
          notifySuccess(i18n('cc-oauth-token-list.revoke-all-tokens.success'));
        } else if (revokedTokens.length > 0) {
          notifyError(i18n('cc-oauth-token-list.revoke-all-tokens.partial-error'));
        } else {
          notifyError(i18n('cc-oauth-token-list.revoke-all-tokens.error'));
        }
      });
    });
  },
});

// @ts-ignore
class Api {
  /** @param {ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
  }

  /**
   * Fetches and formats OAuth tokens
   *
   * @returns {Promise<RawTokenData[]>} A promise that resolves to an array of formatted OAuth tokens
   */
  getOauthTokens() {
    return getAllTokens()
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then(
        /** @param {Array<RawTokenData>} tokens */
        (tokens) => {
          const filteredTokens = tokens.filter(
            (token) => token.consumer.key !== this._apiConfig.OAUTH_CONSUMER_KEY && token.employeeId == null,
          );
          return filteredTokens;
        },
      );
  }

  /**
   * Revokes an OAuth token
   *
   * @param {string} tokenId - The ID of the token to revoke
   * @returns {Promise<void>} A promise that resolves when the token is revoked
   */
  revokeOauthToken(tokenId) {
    return revokeToken({ token: tokenId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  /**
   * Revokes all OAuth tokens
   *
   * @param {OauthTokenState[]} allTokens - An array of all OAuth tokens
   * @returns {Promise<{ remainingTokens: OauthTokenState[], revokedTokens: string[], errors: any[] }>} A promise that resolves when all tokens are revoked
   */
  revokeAllOauthTokens(allTokens) {
    let errors = [];
    /** @type {string[]} */
    let revokedTokens = [];

    return Promise.allSettled(
      allTokens.map((token) =>
        revokeToken({ id: token.id })
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

// @ts-ignore
class MockApi {
  /** @param {ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;
  }

  /**
   * Fetches and formats OAuth tokens
   *
   * @returns {Promise<RawTokenData[]>} A promise that resolves to an array of formatted OAuth tokens
   */
  getOauthTokens() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data for OAuth tokens
        /** @type {RawTokenData[]} */
        const mockTokens = [
          {
            token: 'oauth-123',
            consumer: {
              key: 'consumer-key-123',
              name: 'clever-tools',
              picture: 'https://assets.clever-cloud.com/logos/clever-tools.svg',
            },
            employeeId: null,
            creationDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
            expirationDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            lastUtilisation: Date.now() - 2 * 24 * 60 * 60 * 1000,
          },
          {
            token: 'oauth-456',
            consumer: {
              key: 'consumer-key-456',
              name: 'Matomo',
              picture: 'https://assets.clever-cloud.com/logos/matomo.svg',
            },
            employeeId: null,
            creationDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
            expirationDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
            lastUtilisation: Date.now() - 10 * 24 * 60 * 60 * 1000,
          },
          {
            token: 'oauth-789',
            consumer: {
              key: 'consumer-key-789',
              name: 'Jenkins',
              picture: 'https://assets.clever-cloud.com/logos/jenkins.svg',
            },
            employeeId: null,
            creationDate: Date.now() - 14 * 24 * 60 * 60 * 1000,
            expirationDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
            lastUtilisation: Date.now() - 1 * 24 * 60 * 60 * 1000,
          },
          {
            token: 'oauth-101',
            consumer: {
              key: 'consumer-key-101',
              name: 'Keycloak',
              picture: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
            },
            employeeId: null,
            creationDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
            expirationDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
            lastUtilisation: Date.now() - 4 * 24 * 60 * 60 * 1000,
          },
        ];
        resolve(mockTokens);
      }, 2000);
    });
  }

  /**
   * Revokes an OAuth token
   *
   * @param {string} tokenId - The ID of the token to revoke
   * @returns {Promise<void>} A promise that resolves when the token is revoked
   */
  revokeOauthToken(tokenId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  /**
   * Revokes all OAuth tokens
   *
   * @param {OauthTokenState[]} allTokens - An array of all OAuth tokens
   * @returns {Promise<{ remainingTokens: OauthTokenState[], revokedTokens: string[], errors: any[] }>} A promise that resolves when all tokens are revoked
   */
  revokeAllOauthTokens(allTokens) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful revocation of all tokens
        const revokedTokens = allTokens.map((token) => token.id);
        const errors = [];
        const remainingTokens = [];

        resolve({ remainingTokens, revokedTokens, errors });
      }, 2000);
    });
  }
}
