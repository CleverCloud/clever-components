import { get as getSelf } from '@clevercloud/client/esm/api/v2/organisation.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { sendToOauthBridge } from '../../lib/send-to-oauth-bridge.js';
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
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
    const api = new Api(apiConfig);

    updateComponent('state', { type: 'loading' });
    api.getUserInfo().then(({ isMfaEnabled }) => {
      updateComponent('state', { type: 'idle', isMfaEnabled });
    });

    onEvent('cc-token-api-creation-form:api-key-create', ({ name, description, expirationDate, password, mfaCode }) => {
      api.createApiToken({ name, description, expirationDate, password, mfaCode });
      // .then((token) => {
      //   // TODO: toast
      //   updateComponent('state', { type: 'created', token });
      // })
      // .catch((error) => {
      //   console.error(error);
      //   // TODO: toast
      // });
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
   * @returns {Promise<RequestInit>}
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
   * @returns
   */
  createApiToken({ name, description, expirationDate, password, mfaCode }) {
    this._prepareCreateApiTokenRequest({
      password,
      mfaCode,
      name,
      description,
      expirationDate,
    })
      .then(sendToOauthBridge({ apiConfig: this._apiConfig }))
      .then((response) => {
        // Handle response
        console.log(response);
        return response;
      });
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
};
      });
  }
}
      });
  }
}
