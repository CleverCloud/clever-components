// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getSelf } from '@clevercloud/client/esm/api/v2/organisation.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { sendToAuthBridge } from '../../lib/send-to-auth-bridge.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-list.js';

/**
 * @import { CcTokenApiList } from './cc-token-api-list.js'
 * @import { TokenApiListStateLoaded, ApiTokenStateIdle, ApiTokenState, ApiToken, RawApiToken } from './cc-token-api-list.types.js'
 * @import { ApiConfig, AuthBridgeConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-token-api-list',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs<CcTokenApiList>} args */
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
      .then(([{ hasPassword }, tokens]) => {
        if (!hasPassword) {
          updateComponent('state', { type: 'no-password' });
          return;
        }

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

    onEvent('cc-password-reset', () => {
      updateComponent('state', { type: 'resetting-password' });
      api
        .resetPassword()
        .then((email) => {
          updateComponent('state', { type: 'no-password' });
          notify({
            intent: 'info',
            message: i18n('cc-token-api-list.no-password.reset-password-successful', { email }),
            options: {
              timeout: 0,
              closeable: true,
            },
          });
        })
        .catch((error) => {
          console.error(error);
          notifyError(i18n('cc-token-api-list.no-password.reset-password-error'));
          updateComponent('state', { type: 'no-password' });
        });
    });
  },
});

class Api {
  /** @param {AuthBridgeConfig & ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._authAndApiConfig = apiConfig;
  }

  /** @returns {Promise<{ hasPassword: boolean }>} */
  _getUserInfo() {
    return getSelf({})
      .then(sendToApi({ apiConfig: this._authAndApiConfig }))
      .then(
        /**
         * @param {{ email: string, partnerId: string, hasPassword: boolean }} user
         * @returns {{ hasPassword: boolean }}
         */
        ({ email, partnerId, hasPassword }) => {
          this._userEmail = email;
          this._userPartnerId = partnerId;
          return { hasPassword };
        },
      );
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

  /** @returns {Promise<[{ hasPassword: boolean }, ApiToken[]]>} */
  getApiTokens() {
    return Promise.all([
      this._getUserInfo(),
      this._listApiTokens()
        .then(sendToAuthBridge({ authBridgeConfig: this._authAndApiConfig }))
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
        ),
    ]);
  }

  /** @param {{ partner_id: string, login: string, drop_tokens: 'on'|'off' }} body */
  _resetPasswordRequest(body) {
    return Promise.resolve({
      method: 'post',
      url: `/v2/password_forgotten`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      // no query params
      body,
    });
  }

  /**
   * @param {string} apiTokenId
   * @returns {Promise<void>}
   */
  revokeApiToken(apiTokenId) {
    return this._deleteApiToken(apiTokenId).then(sendToAuthBridge({ authBridgeConfig: this._authAndApiConfig }));
  }

  /** @returns {Promise<string>} */
  resetPassword() {
    return this._resetPasswordRequest({
      // eslint-disable-next-line camelcase
      partner_id: this._userPartnerId,
      login: this._userEmail,
      // eslint-disable-next-line camelcase
      drop_tokens: 'off',
    })
      .then(sendToApi({ apiConfig: this._authAndApiConfig }))
      .then(() => this._userEmail);
  }
}
