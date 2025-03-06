// @ts-expect-error FIXME: remove when clever-client exports types
import { getTokens } from '@clevercloud/client/esm/api/v2/user.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-session-tokens.js';

// TODO: find API call in clever-client
/**
 * @typedef {import('./cc-session-tokens.js').CcSessionTokens} CcSessionTokens
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcSessionTokens>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-session-tokens',
  params: {
    apiConfig: { type: Object },
    currentOauthConsumer: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, currentOauthConsumer } = context;

    updateComponent('state', { type: 'loading' });

    getSessionTokens({ apiConfig, currentOauthConsumer })
      .then((tokens) => updateComponent('state', { type: 'loaded', tokens }))
      .catch((error) => updateComponent('state', { type: 'error', error }));
  },
});

class Api {
  constructor(apiConfig, currentOauthConsumer) {
    this._apiConfig = apiConfig;
    this._currentOauthConsumer = currentOauthConsumer;
  }

  getSessionTokens() {
    return sendToApi({
      ...this._apiConfig,
      method: 'GET',
      path: `/oauth/consumers/${this._currentOauthConsumer}/tokens`,
    });
  }
}
