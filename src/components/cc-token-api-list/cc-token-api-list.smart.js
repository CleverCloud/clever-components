import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-list.js';

/**
 * @typedef {import('./cc-token-api-list.js').CcTokenApiList} CcTokenApiList
 * @typedef {import('./cc-token-api-list.types.js').TokenApiListStateLoaded} TokenApiListStateLoaded
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiList>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: '',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
    const api = new Api({ apiConfig });

    /**
     * Updates a single session token
     *
     * @param {string} tokenId The ID of the token to update
     * @param {function(apiTokenState): void} callback A callback function to execute with the updated token
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
        // TODO: pass tokens to component (might be some transformation to do)
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api {
  /** @param {{ apiConfig: ApiConfig }} */
  constructor({ apiConfig }) {
    this._apiConfig = apiConfig;
  }

  getApiTokens() {
    return;
  }
}
