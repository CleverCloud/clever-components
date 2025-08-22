// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars as getAllAddonEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get, getAllEnvVarsForDependencies, getAllLinkedAddons } from '@clevercloud/client/esm/api/v2/application.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-linked-services.js';

/**
 * @typedef {import('./cc-env-var-linked-services.js').CcEnvVarLinkedServices} CcEnvVarLinkedServices
 * @typedef {import('./cc-env-var-linked-services.types.js').LinkedServiceState} LinkedServiceState
 * @typedef {import('./cc-env-var-linked-services.types.js').EnvVarLinkedServicesType} EnvVarLinkedServicesType
 * @typedef {import('../common.types.js').App} App
 * @typedef {import('../common.types.js').Addon} Addon
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcEnvVarLinkedServices>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-env-var-linked-services',
  params: {
    apiConfig: { type: Object },
    type: { type: String },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, type, ownerId, appId } = context;

    updateComponent('state', { type: 'loading' });
    updateComponent('type', type);

    const api = new Api(apiConfig, signal);

    api.fetchAppName({ ownerId, appId }).then((name) => {
      updateComponent('appName', name);
    });

    api
      .fetchEnvVarLinkedService({ ownerId, appId, type })
      .then((linkedServiceList) => {
        updateComponent('state', {
          type: 'loaded',
          servicesStates: linkedServiceList,
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
   */
  async fetchEnvVarLinkedAddons({ ownerId, appId }) {
    const addons = await getAllLinkedAddons({ id: ownerId, appId }).then(
      sendToApi({ apiConfig: this.apiConfig, signal: this.signal }),
    );

    const promises = await addons.map(async (/** @type {Addon} */ addon) => {
      try {
        const envVarList = await getAllAddonEnvVars({ id: ownerId, addonId: addon.id }).then(
          sendToApi({ apiConfig: this.apiConfig, signal: this.signal }),
        );
        return /** @type {LinkedServiceState} */ ({
          type: 'loaded',
          name: addon.name,
          variables: envVarList,
        });
      } catch (e) {
        console.error(e);
        return /** @type {LinkedServiceState} */ ({
          type: 'error',
          name: addon.name,
        });
      }
    });
    return Promise.all(promises);
  }

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   */
  async fetchEnvVarLinkedApps({ ownerId, appId }) {
    const apps = await getAllEnvVarsForDependencies({ id: ownerId, appId })
      .then(sendToApi({ apiConfig: this.apiConfig, signal: this.signal }))
      .then((/** @type {any[]} */ linkedApps) => linkedApps.map((app) => ({ ...app, name: app.app_name })));
    return apps.map((/** @type {App & { env: Array<EnvVar> }} */ app) => {
      return /** @type {LinkedServiceState} */ ({
        type: 'loaded',
        name: app.name,
        variables: app.env,
      });
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

  /**
   * @param {object} params
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @param {EnvVarLinkedServicesType} params.type
   */
  async fetchEnvVarLinkedService({ ownerId, appId, type }) {
    switch (type) {
      case 'addon': {
        return this.fetchEnvVarLinkedAddons({ ownerId, appId });
      }
      case 'app': {
        return this.fetchEnvVarLinkedApps({ ownerId, appId });
      }
      default: {
        return null;
      }
    }
  }
}
