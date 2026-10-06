import { CreateApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/create-api-token-command.js';
import { GetProfileCommand } from '@clevercloud/client/cc-api-commands/profile/get-profile-command.js';
import { getCcApiBridgeClient, getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { notifyError } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcTokenApiCreationForm } from './cc-token-api-creation-form.js';

/**
 * @import { TokenApiCreationFormStateLoadedConfiguration, TokenApiCreationFormStateLoadedValidation, TokenApiCreationFormStateLoadedCopy, TokenApiCreationFormStateCreating } from './cc-token-api-creation-form.types.js'
 * @import { ApiConfig, AuthBridgeConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 * @import { CreateApiTokenResult } from '@clevercloud/client/cc-api-bridge-commands/api-token/create-api-token-command.types.js'
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

    updateComponent('apiBridgeBaseUrl', apiConfig.AUTH_BRIDGE_HOST);
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
        .then((result) => {
          if (result.type === 'created') {
            /** @type {TokenApiCreationFormStateLoadedCopy} */
            const newState = {
              ...componentState,
              type: 'loaded',
              activeStep: 'copy',
              token: result.apiToken,
            };
            updateComponent('state', newState);
            return;
          }

          /** @type {TokenApiCreationFormStateLoadedValidation} */
          const newState = {
            ...componentState,
            type: 'loaded',
            credentialsError: result.type === 'invalid-credential' ? 'password' : 'mfaCode',
          };
          updateComponent('state', newState);
        })
        .catch((error) => {
          console.error(error);
          /** @type {TokenApiCreationFormStateLoadedValidation} */
          const newState = {
            ...componentState,
            type: 'loaded',
          };
          updateComponent('state', newState);
          notifyError(i18n('cc-token-api-creation-form.validation-step.error.generic'));
        });
    });
  },
});

class Api {
  /** @param {ApiConfig & AuthBridgeConfig} apiConfig */
  constructor(apiConfig) {
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
    this._ccApiBridgeClient = getCcApiBridgeClient(apiConfig);

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
   * @returns {Promise<CreateApiTokenResult>}
   */
  createApiToken({ name, description, expirationDate, password, mfaCode }) {
    // the form can only be submitted once the user info has been fetched so `_userEmail` cannot be `null` at this point
    const email = /** @type {string} */ (this._userEmail);
    return this._ccApiBridgeClient.send(
      new CreateApiTokenCommand({
        emailAddress: email,
        password,
        mfaCode,
        name,
        description,
        expiresAt: expirationDate,
        shouldResolveRefusedCredential: /** @type {const} */ (true),
      }),
    );
  }

  /** @returns {Promise<{ isMfaEnabled: boolean }>} */
  getUserInfo() {
    return this._ccApiClient.send(new GetProfileCommand()).then((profile) => {
      this._userEmail = profile.emailAddress;
      return { isMfaEnabled: profile.preferredMfa === 'TOTP' };
    });
  }
}
