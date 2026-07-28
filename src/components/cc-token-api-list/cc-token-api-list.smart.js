import { DeleteApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/delete-api-token-command.js';
import { ListApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/list-api-token-command.js';
import { RequestAuthPasswordResetCommand } from '@clevercloud/client/cc-api-commands/auth/request-auth-password-reset-command.js';
import { GetProfileCommand } from '@clevercloud/client/cc-api-commands/profile/get-profile-command.js';
import { getCcApiBridgeClient, getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notify, notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-list.js';

/**
 * @import { CcTokenApiList } from './cc-token-api-list.js'
 * @import { TokenApiListStateLoaded, ApiTokenStateIdle, ApiTokenState, ApiToken } from './cc-token-api-list.types.js'
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

    updateComponent('apiBridgeBaseUrl', apiConfig.AUTH_BRIDGE_HOST);

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
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._ccApiBridgeClient = getCcApiBridgeClient(apiConfig);
  }

  /** @returns {Promise<{ hasPassword: boolean }>} */
  _getUserInfo() {
    return this._ccApiClient.send(new GetProfileCommand()).then(({ emailAddress, partnerId, hasPassword }) => {
      this._userEmail = emailAddress;
      this._userPartnerId = partnerId;
      return { hasPassword };
    });
  }

  /** @returns {Promise<[{ hasPassword: boolean }, ApiToken[]]>} */
  getApiTokens() {
    return Promise.all([
      this._getUserInfo(),
      this._ccApiBridgeClient.send(new ListApiTokenCommand()).then((tokens) =>
        tokens.map(
          /** @returns {ApiToken} */
          (token) => ({
            id: token.apiTokenId,
            creationDate: new Date(token.createdAt),
            expirationDate: new Date(token.expiresAt),
            name: token.name,
            description: token.description,
            isExpired: token.state === 'EXPIRED',
          }),
        ),
      ),
    ]);
  }

  /**
   * @param {string} apiTokenId
   * @returns {Promise<void>}
   */
  revokeApiToken(apiTokenId) {
    return this._ccApiBridgeClient.send(new DeleteApiTokenCommand({ apiTokenId }));
  }

  /** @returns {Promise<string>} */
  async resetPassword() {
    await this._ccApiClient.send(
      new RequestAuthPasswordResetCommand({
        login: this._userEmail,
        partnerId: this._userPartnerId,
      }),
    );
    return this._userEmail;
  }
}
