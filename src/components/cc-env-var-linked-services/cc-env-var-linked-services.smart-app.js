import { get, getAllEnvVarsForDependencies } from '@clevercloud/client/esm/api/v2/application.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-linked-services.js';

/**
 * @import { CcEnvVarLinkedServices } from './cc-env-var-linked-services.js'
 * @import { LinkedService } from './cc-env-var-linked-services.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-env-var-linked-services[type="app"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcEnvVarLinkedServices>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    updateComponent('state', { type: 'loading', name: '' });

    const api = new Api(apiConfig, signal);

    api.fetchAppName({ ownerId, appId }).then((name) => {
      updateComponent('appName', name);
    });

    api
      .fetchEnvVarLinkedApps({ ownerId, appId })
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
  async fetchEnvVarLinkedApps({ ownerId, appId }) {
    const linkedApps = await getAllEnvVarsForDependencies({ id: ownerId, appId }).then(
      sendToApi({ apiConfig: this.apiConfig, signal: this.signal }),
    );

    return linkedApps.map((/** @type {any} */ linkedApp) => {
      return {
        id: linkedApp.app_id,
        name: linkedApp.app_name,
        variables: linkedApp.env,
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
