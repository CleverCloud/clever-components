// @ts-expect-error FIXME: remove when clever-client exports types
import { get, getAllEnvVarsForAddons } from '@clevercloud/client/esm/api/v2/application.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-linked-services.js';

/**
 * @typedef {import('./cc-env-var-linked-services.js').CcEnvVarLinkedServices} CcEnvVarLinkedServices
 * @typedef {import('./cc-env-var-linked-services.types.js').LinkedService} LinkedService
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcEnvVarLinkedServices>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-env-var-linked-services[type="addon"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    updateComponent('state', { type: 'loading', name: '' });

    const api = new Api(apiConfig, signal);

    api.fetchAppName({ ownerId, appId }).then((name) => {
      updateComponent('appName', name);
    });

    api
      .fetchEnvVarLinkedAddons({ ownerId, appId })
      .then((linkedServices) => {
        updateComponent('state', {
          type: 'loaded',
          services: linkedServices,
        });
      })
      .catch((e) => {
        console.error(e);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

// -- API calls
class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {AbortSignal} signal
   */
  constructor(apiConfig, signal) {
    this.apiConfig = apiConfig;
    this.signal = signal;
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @returns {Promise<LinkedService[]>}
   */
  async fetchEnvVarLinkedAddons({ ownerId, appId }) {
    const linkedAddons = await getAllEnvVarsForAddons({ id: ownerId, appId }).then(
      sendToApi({ apiConfig: this.apiConfig, signal: this.signal }),
    );

    return linkedAddons.map((/** @type {any} */ linkedAddon) => {
      return {
        id: linkedAddon.addon_id,
        name: linkedAddon.addon_name,
        variables: linkedAddon.env,
      };
    });
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   */
  async fetchAppName({ ownerId, appId }) {
    const app = await get({ id: ownerId, appId }).then(sendToApi({ apiConfig: this.apiConfig, signal: this.signal }));
    return app.name;
  }
}
