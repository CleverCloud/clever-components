import {
  todo_listSelfTokens as getAllTokens,
  todo_revokeSelfToken as revokeToken,
} from '@clevercloud/client/esm/api/v2/user.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-oauth-list.js';

/**
 * @import { CcTokenOauthList } from './cc-token-oauth-list.js'
 * @import { OauthTokenState, TokenOauthListStateLoaded, TokenOauthListStateRevokingAll, OauthToken } from './cc-token-oauth-list.types.js'
 * @import { RawTokenData } from '../cc-token-session-list/cc-token-session-list.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-token-oauth-list',
  params: {
    apiConfig: { type: Object },
    authBridgeConsumerKey: { type: String },
  },
  /** @param {OnContextUpdateArgs<CcTokenOauthList>} args */
  onContextUpdate({ component, context, onEvent, updateComponent }) {
    const { apiConfig, authBridgeConsumerKey } = context;
    const api = new Api(apiConfig, authBridgeConsumerKey);

    /**
     * Updates a single OAuth token
     *
     * @param {string} tokenId The ID of the token to update
     * @param {function(OauthTokenState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(tokenId, callback) {
      updateComponent(
        'state',
        /** @param {TokenOauthListStateLoaded} state */
        (state) => {
          const oauthTokenToUpdate = state.oauthTokens.find((token) => token.id === tokenId);

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
        const oauthTokens = tokens.map(
          /** @return {OauthTokenState} */
          (token) => ({
            type: 'idle',
            ...token,
          }),
        );
        updateComponent('state', { type: 'loaded', oauthTokens });
      })
      .catch(() => {
        updateComponent('state', { type: 'error' });
      });

    onEvent(
      'cc-token-revoke',
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
              /** @param {TokenOauthListStateLoaded} state */
              (state) => {
                state.oauthTokens = state.oauthTokens.filter((token) => token.id !== tokenId);
              },
            );
            notifySuccess(i18n('cc-token-oauth-list.revoke-token.success'));
          })
          .catch((error) => {
            console.error(error);
            updateOneToken(tokenId, (oauthTokenState) => {
              oauthTokenState.type = 'idle';
            });
            notifyError(i18n('cc-token-oauth-list.revoke-token.error'));
          });
      },
    );

    onEvent('cc-tokens-revoke-all', () => {
      updateComponent(
        'state',
        /** @param {TokenOauthListStateLoaded} state */
        (state) =>
          /** @type {TokenOauthListStateRevokingAll} */ ({
            ...state,
            type: 'revoking-all',
            oauthTokens: state.oauthTokens.map((token) => ({ ...token, type: 'revoking' })),
          }),
      );

      const tokens = /** @type {TokenOauthListStateLoaded} */ (component.state).oauthTokens;

      api.revokeAllOauthTokens(tokens).then(({ remainingTokens, errors, revokedTokens }) => {
        updateComponent('state', (state) => {
          state.type = 'loaded';

          /** @type {TokenOauthListStateLoaded} */
          (state).oauthTokens = remainingTokens.map((token) => ({
            ...token,
            type: 'idle',
          }));

          return state;
        });

        if (errors.length === 0) {
          notifySuccess(i18n('cc-token-oauth-list.revoke-all-tokens.success'));
        } else if (revokedTokens.length > 0) {
          errors.forEach((error) => console.error(error));
          notifyError(i18n('cc-token-oauth-list.revoke-all-tokens.partial-error'));
        } else {
          errors.forEach((error) => console.error(error));
          notifyError(i18n('cc-token-oauth-list.revoke-all-tokens.error'));
        }
      });
    });
  },
});

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} authBridgeConsumerKey
   */
  constructor(apiConfig, authBridgeConsumerKey) {
    this._apiConfig = apiConfig;
    this._authBridgeConsumerKey = authBridgeConsumerKey;
  }

  /**
   * Fetches and formats OAuth tokens
   *
   * @returns {Promise<OauthToken[]>} A promise that resolves to an array of formatted OAuth tokens
   */
  getOauthTokens() {
    return getAllTokens()
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then(
        /** @param {Array<RawTokenData>} tokens */
        (tokens) => {
          return tokens
            .filter(
              (token) =>
                token.consumer.key !== this._apiConfig.OAUTH_CONSUMER_KEY &&
                token.employeeId == null &&
                token.consumer.key !== this._authBridgeConsumerKey,
            )
            .map(
              /** @return {OauthToken} */
              (token) => ({
                id: token.token,
                consumerName: token.consumer.name,
                creationDate: new Date(token.creationDate),
                expirationDate: new Date(token.expirationDate),
                lastUsedDate: new Date(token.lastUtilisation),
                imageUrl: token.consumer.picture,
              }),
            );
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

    return Promise.allSettled(allTokens.map((token) => this.revokeOauthToken(token.id).then(() => token.id))).then(
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
