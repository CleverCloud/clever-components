import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withCache } from '@clevercloud/client/esm/with-cache.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-list.js';

/**
 */

/**
 * @typedef {import('./cc-token-api-list.js').CcTokenApiList} CcTokenApiList
 * @typedef {import('./cc-token-api-list.types.js').TokenApiListStateLoaded} TokenApiListStateLoaded
 * @typedef {import('./cc-token-api-list.types.js').TokenApiStateIdle} TokenApiStateIdle
 * @typedef {import('./cc-token-api-list.types.js').TokenApiState} TokenApiState
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiList>} OnContextUpdateArgs
 * @typedef {import('./cc-token-api-list.types.js').RawApiToken} RawApiToken
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

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
    return this._deleteApiToken(apiTokenId).then({ apiConfig: this._apiConfig });
  }
}

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
     * @param {function(TokenApiState): void} callback A callback function to execute with the updated token
     */
    function updateOneToken(tokenId, callback) {
      updateComponent(
        'state',
        /** @param {TokenApiListStateLoaded} state */
        (state) => {
          const apiTokenToUpdate = state.tokens.find((token) => token.id === tokenId);

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
        updateComponent('state', { type: 'loaded', tokens: formattedTokens });
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
              state.tokens = state.tokens.filter((token) => token.id !== apiTokenId);
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

function sendToAuthBridge({ apiConfig, signal, cacheDelay, timeout }) {
  return (requestParams) => {
    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {
      const { API_HOST, ...tokens } = apiConfig ?? {};
      return Promise.resolve(requestParams)
        .then(prefixUrl('https://api-bridge.clever-cloud.com'))
        .then(addOauthHeaderPlaintext(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request)
        .catch(
          /** @param {Error} error */
          (error) => {
            const code = error.code ?? error?.cause?.code;
            let properError;
            if (code === 'EAI_AGAIN') {
              properError = new Error('Cannot reach the Clever Cloud API, please check your internet connection.', {
                cause: error,
              });
            }
            if (code === 'ECONNRESET') {
              properError = new Error('The connection to the Clever Cloud API was closed abruptly, please try again.', {
                cause: error,
              });
            }
            if (error?.response?.status === 401) {
              properError = new Error(`You're not logged in, use  command to connect to your Clever Cloud account`, {
                cause: error,
              });
            }
            if (properError != null) {
              throw properError;
            }
            dispatchCustomEvent(window, 'cc-api:error', properError ?? error);
            throw error;
          },
        );
    });
  };
}

export function addOauthHeaderPlaintext(tokens) {
  return async function (requestParams) {
    const authorizationHeader =
      'OAuth ' +
      [
        `oauth_consumer_key="${tokens.OAUTH_CONSUMER_KEY}"`,
        `oauth_token="${tokens.API_OAUTH_TOKEN}"`,
        // %26 is URL escaped character "&"
        `oauth_signature="${tokens.OAUTH_CONSUMER_SECRET}%26${tokens.API_OAUTH_TOKEN_SECRET}"`,
        // oauth_nonce is not mandatory
        // oauth_signature_method is not mandatory, it defaults to PLAINTEXT
        // oauth_timestamp is not mandatory
        // oauth_version is not mandatory, it defaults to 1.0
      ].join(', ');

    return {
      ...requestParams,
      headers: {
        authorization: authorizationHeader,
        ...requestParams.headers,
      },
    };
  };
}
