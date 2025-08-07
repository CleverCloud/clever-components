// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars as getAllAddonEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVarsForDependencies, getAllLinkedAddons } from '@clevercloud/client/esm/api/v2/application.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-linked-services.js';

/**
 * @typedef {import('./cc-env-var-linked-services.js').CcEnvVarLinkedServices} CcEnvVarLinkedServices
 * @typedef {import('./cc-env-var-linked-services.types.js').LinkedServiceState} LinkedServiceState
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
    updateComponent('state', { type: 'loading' });

    const { apiConfig, type, ownerId, appId } = context;

    fetchLinkedServiceStateList({ apiConfig, signal, ownerId, appId, type }).then((linkedServiceList) => {
      updateComponent('state', {
        type: 'loaded',
        servicesStates: linkedServiceList,
      });
    });
  },
});

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.appId
 */
function fetchLinkedAddons({ apiConfig, signal, ownerId, appId }) {
  return getAllLinkedAddons({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.appId
 */
function fetchLinkedApps({ apiConfig, signal, ownerId, appId }) {
  return getAllEnvVarsForDependencies({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }))
    .then((/** @type {any[]} */ linkedApps) => linkedApps.map((app) => ({ ...app, name: app.app_name })));
}

/**
 * @param {object} params
 * @param {ApiConfig} params.apiConfig
 * @param {AbortSignal} params.signal
 * @param {string} params.ownerId
 * @param {string} params.appId
 * @param {string} params.type
 * @return LinkedServiceState[]
 */
async function fetchLinkedServiceStateList({ apiConfig, signal, ownerId, appId, type }) {
  /**
   * @type {LinkedServiceState[]}
   */
  let linkedServiceStateList = [];

  const fetchEnvVarsForAddon = (/** @type {Addon} */ addon) =>
    getAllAddonEnvVars({ id: ownerId, addonId: addon.id }).then(sendToApi({ apiConfig, signal }));

  const fetchEnvVarsForApp = (/** @type {{ env: any; }} */ app) => app.env;

  switch (type) {
    case 'addon': {
      const addons = await fetchLinkedAddons({ apiConfig, signal, ownerId, appId });
      // @ts-ignore
      linkedServiceStateList = await buildLinkedServiceStates(addons, fetchEnvVarsForAddon);
      break;
    }

    case 'application': {
      const apps = await fetchLinkedApps({ apiConfig, signal, ownerId, appId });
      // @ts-ignore
      linkedServiceStateList = await buildLinkedServiceStates(apps, fetchEnvVarsForApp);
      break;
    }
  }

  return linkedServiceStateList;
}

/**
 * @param {Array<Addon | App>} resources - addons ou apps
 * @param {(resource: Addon | App) => Promise<EnvVar[]>} fetchEnvVarsFn
 * @returns {Promise<LinkedServiceState[]>}
 */
async function buildLinkedServiceStates(resources, fetchEnvVarsFn) {
  const promises = resources.map(async (resource) => {
    try {
      const envVarList = await fetchEnvVarsFn(resource);
      return /** @type {LinkedServiceState} */ ({
        type: 'loaded',
        name: resource.name,
        variables: envVarList,
      });
    } catch (e) {
      console.error(e);
      return /** @type {LinkedServiceState} */ ({
        type: 'error',
        name: resource.name,
      });
    }
  });

  return Promise.all(promises);
}
