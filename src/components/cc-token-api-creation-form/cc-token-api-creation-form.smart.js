// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getSelf } from '@clevercloud/client/esm/api/v2/organisation.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { sendToAuthBridge } from '../../lib/send-to-oauth-bridge.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-creation-form.js';

/**
 * @typedef {import('./cc-token-api-creation-form.js').CcTokenApiCreationForm} CcTokenApiCreationForm
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiCreationForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-token-api-creation-form',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ context, onEvent, updateComponent }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    // TODO: reset form
    updateComponent('state', { type: 'loading' });
    api
      .getUserInfo()
      .then(({ isMfaEnabled }) => {
        updateComponent('state', { type: 'idle', isMfaEnabled, hasCredentialsError: false });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-token-api-creation-form:api-key-create', ({ name, description, expirationDate, password, mfaCode }) => {
      updateComponent('state', (state) => {
        state.type = 'creating';
      });

      api
        .createApiToken({ name, description, expirationDate, password, mfaCode })
        .then((token) => {
          // TODO: toast
          updateComponent('state', { type: 'created', token });
        })
        .catch(
          /** @param {Error & { response: Response }} error */
          (error) => {
            if (error.response.status === 401) {
              // TODO: add error message below Password & MFA
              updateComponent('state', { type: 'idle', isMfaEnabled: true, hasCredentialsError: true });
            }

            // else, idle + toast?
            // TODO: toast
          },
        );
    });
  },
});

class Api {
  /** @param {ApiConfig} apiConfig */
  constructor(apiConfig) {
    this._apiConfig = apiConfig;

    /** @type {string|null} */
    this._userEmail = null;
  }

  /**
   * @param {object} options
   * @param {string} options.name
   * @param {string} options.description
   * @param {string} options.expirationDate
   * @param {string} options.password
   * @param {string} options.mfaCode
   */
  _prepareCreateApiTokenRequest({ name, description, expirationDate, password, mfaCode }) {
    return Promise.resolve({
      method: 'post',
      url: '/api-tokens',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: { email: this._userEmail, password, mfaCode, name, description, expirationDate },
    });
  }

  /**
   * @param {object} options
   * @param {string} options.name
   * @param {string} options.description
   * @param {string} options.expirationDate
   * @param {string} options.password
   * @param {string} options.mfaCode
   */
  createApiToken({ name, description, expirationDate, password, mfaCode }) {
    return this._prepareCreateApiTokenRequest({
      password,
      mfaCode,
      name,
      description,
      expirationDate,
    })
      .then(sendToAuthBridge({ apiConfig: this._apiConfig }))
      .then(({ apiToken }) => apiToken);
  }

  /** @returns {Promise<{ isMfaEnabled: boolean }>} */
  getUserInfo() {
    return getSelf({})
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then((user) => {
        this._userEmail = user.email;
        return { isMfaEnabled: user.preferredMFA === 'TOTP' };
      });
  }
}
