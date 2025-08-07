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
    const api = new Api({ apiConfig, type, ownerId, appId, signal });

    updateComponent('state', { type: 'loading' });
    updateComponent('type', type);

    api
      .getLinkedServicesWithEnvVars()
      .then((linkedServiceList) => {
        // FIXME: should take care of the app name, do we fetch it or take it from context?
        updateComponent('state', {
          type: 'loaded',
          servicesStates: linkedServiceList,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @param {EnvVarLinkedServicesType} params.type
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, appId, type, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._appId = appId;
    this._type = type;
    this._signal = signal;
  }

  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {AbortSignal} params.signal
   * @param {string} params.ownerId
   * @param {string} params.appId
   * @returns {Promise<Addon[]>}
   */
  _fetchLinkedAddons() {
    return getAllLinkedAddons({ id: this._ownerId, appId: this._appId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /** @param {string} addonId */
  _fetchEnvVarsForAddon(addonId) {
    return getAllAddonEnvVars({ id: this._ownerId, addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /** @returns {Promise<{ env: EnvVar[], name: string }[]>} */
  _fetchLinkedApps() {
    return getAllEnvVarsForDependencies({ id: this._ownerId, appId: this._appId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }))
      .then((/** @type {any[]} */ linkedApps) => linkedApps.map((app) => ({ ...app, name: app.app_name })));
  }

  /**
   * @param {string} addonName
   * @param {string} addonId
   * @returns {Promise<LinkedServiceState>}
   */
  async _getAddonNameWithEnvVars(addonName, addonId) {
    try {
      const variables = await this._fetchEnvVarsForAddon(addonId);
      return { type: 'loaded', name: addonName, variables };
    } catch (error) {
      console.error(error);
      return { name: addonName, type: 'error' };
    }
  }

  async _getLinkedAddonsWithEnvVars() {
    const linkedAddons = await this._fetchLinkedAddons();
    return Promise.all(linkedAddons.map(({ name, id }) => this._getAddonNameWithEnvVars(name, id)));
  }

  /** @returns {Promise<LinkedServiceState[]>} */
  _getLinkedAppsWithEnvVars() {
    return this._fetchLinkedApps().then((linkedApps) =>
      linkedApps.map(
        /** @returns {LinkedServiceState} */
        ({ env, name }) => ({
          type: 'loaded',
          name,
          variables: env,
        }),
      ),
    );
  }

  getLinkedServicesWithEnvVars() {
    switch (this._type) {
      case 'app':
        return Promise.allSettled([this._getAppName(), this._getLinkedAppsWithEnvVars()]);
      case 'addon':
        return Promise.allSettled([this.getAppName(), this._getLinkedAddonsWithEnvVars()]);
    }
  }
}
