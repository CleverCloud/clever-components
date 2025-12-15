import { get as getSelf } from '@clevercloud/client/esm/api/v2/organisation.js';
import { notifyError } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { sendToAuthBridge } from '../../lib/send-to-auth-bridge.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcTokenApiCreationForm } from './cc-token-api-creation-form.js';

/**
 * @import { TokenApiCreationFormStateLoadedConfiguration, TokenApiCreationFormStateLoadedValidation, TokenApiCreationFormStateLoadedCopy, TokenApiCreationFormStateCreating } from './cc-token-api-creation-form.types.js'
 * @import { ApiConfig, AuthBridgeConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-token-api-creation-form',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs<CcTokenApiCreationForm>} args */
  onContextUpdate({ component, context, onEvent, updateComponent }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    updateComponent('state', { type: 'loading' });

    api
      .getUserInfo()
      .then(({ isMfaEnabled }) => {
        /** @type {TokenApiCreationFormStateLoadedConfiguration} */
        const newState = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled,
          values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
        };
        updateComponent('state', newState);
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-token-create', ({ name, description, expirationDate, password, mfaCode }) => {
      updateComponent('state', (state) => {
        state.type = 'creating';
      });
      const componentState = /** @type {TokenApiCreationFormStateCreating} */ (component.state);

      api
        .createApiToken({ name, description, expirationDate, password, mfaCode })
        .then((token) => {
          /** @type {TokenApiCreationFormStateLoadedCopy} */
          const newState = {
            ...componentState,
            type: 'loaded',
            activeStep: 'copy',
            token,
          };

          updateComponent('state', newState);
        })
        .catch(
          /** @param {Error} error */
          (error) => {
            const errorCode =
              'responseBody' in error && typeof error.responseBody === 'object' && 'code' in error.responseBody
                ? error.responseBody.code
                : null;
            /** @type {TokenApiCreationFormStateLoadedValidation['credentialsError']} */
            let credentialsError;

            if (errorCode === 'invalid-credential') {
              credentialsError = 'password';
            }

            if (errorCode === 'invalid-mfa-code') {
              credentialsError = 'mfaCode';
            }

            /** @type {TokenApiCreationFormStateLoadedValidation} */
            const newState = {
              ...componentState,
              type: 'loaded',
              credentialsError,
            };

            updateComponent('state', newState);

            if (credentialsError == null) {
              notifyError(i18n('cc-token-api-creation-form.validation-step.error.generic'));
            }
          },
        );
    });
  },
});

class Api {
  /** @param {ApiConfig & AuthBridgeConfig} apiConfig */
  constructor(apiConfig) {
    this._authAndApiConfig = apiConfig;

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
      expirationDate: expirationDate,
    })
      .then(sendToAuthBridge({ authBridgeConfig: this._authAndApiConfig }))
      .then(({ apiToken }) => apiToken);
  }

  /** @returns {Promise<{ isMfaEnabled: boolean }>} */
  getUserInfo() {
    return getSelf({})
      .then(sendToApi({ apiConfig: this._authAndApiConfig }))
      .then(
        /**
         * @param {{ email: string, preferredMFA: 'TOTP' | null }} user
         * @returns {{ isMfaEnabled: boolean }}
         */
        (user) => {
          this._userEmail = user.email;
          return { isMfaEnabled: user.preferredMFA === 'TOTP' };
        },
      );
  }
}
