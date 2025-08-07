import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @type {BaseProperties}
 */
const SKELETON_DATA = {
  version: {
    stateType: 'up-to-date',
    installed: '0.0.0',
  },
  creationDate: '2025-08-06 15:03:00',
  openGrafanaLink: 'https://example.com',
  openScalabilityLink: '/placeholder',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: 'https://example.com',
      link: 'https://example.com',
    },
  ],
};

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').CcAddonInfoStateLoaded} CcAddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpdateAvailable} AddonVersionStateUpdateAvailable
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpToDate} AddonVersionStateUpToDate
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateRequestingUpdate} AddonVersionStateRequestingUpdate
 * @typedef {import('./cc-addon-info.types.js').BaseProperties} BaseProperties
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-info.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="keycloak"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    appOverviewUrlPattern: { type: String },
    addonDashboardUrlPattern: { type: String },
    scalabilityUrlPattern: { type: String },
    // Grafana may be disabled in some environments
    grafanaLink: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs} _
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const {
      apiConfig,
      ownerId,
      addonId,
      appOverviewUrlPattern,
      addonDashboardUrlPattern,
      scalabilityUrlPattern,
      grafanaLink,
    } = context;

    const api = new Api({ apiConfig, ownerId, addonId, grafanaLink, signal });

    updateComponent('state', { type: 'loading', ...SKELETON_DATA });

    api
      .getAddonInfo()
      .then(({ addonInfo, operator, operatorVersionInfo, grafanaAppLink }) => {
        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: operatorVersionInfo.needUpdate ? 'update-available' : 'up-to-date',
            installed: operatorVersionInfo.installed,
            available: operatorVersionInfo.needUpdate ? operatorVersionInfo.available : null,
            changelogLink: 'https://www.clever.cloud/developers/changelog',
          },
          creationDate: addonInfo.creationDate,
          openGrafanaLink: grafanaLink,
          openScalabilityLink: scalabilityUrlPattern.replace(':id', operator.resources.entrypoint),
          linkedServices: [
            {
              type: 'app',
              name: 'Java',
              // hardcoded right now because if we want to rely on the API, we need to fetch all the applications in order to find the variantLogo for this specific app?!
              logoUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
              link: appOverviewUrlPattern.replace(':id', operator.resources.entrypoint),
            },
            {
              type: 'addon',
              name: 'PostgreSQL',
              logoUrl: 'https://assets.clever-cloud.com/logos/pgsql.svg',
              link: addonDashboardUrlPattern.replace(':id', operator.resources.pgsqlId),
            },
            {
              type: 'addon',
              name: 'FS Bucket',
              logoUrl: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
              link: addonDashboardUrlPattern.replace(':id', operator.resources.fsbucketId),
            },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
      });

    onEvent('cc-addon-version-change', (targetVersion) => {
      updateComponent(
        'state',
        /** @param {CcAddonInfoStateLoaded & { version: AddonVersionStateUpdateAvailable | AddonVersionStateRequestingUpdate }} state */
        (state) => {
          state.version = {
            ...state.version,
            stateType: 'requesting-update',
          };
        },
      );

      api
        .updateOperatorVersion(targetVersion)
        .then(() => {
          updateComponent(
            'state',
            /** @param {CcAddonInfoStateLoaded & { version: AddonVersionStateUpToDate }} state */
            (state) => {
              state.version = {
                stateType: 'up-to-date',
                installed: targetVersion,
              };
            },
          );
          notifySuccess('youpi');
        })
        .catch((error) => {
          updateComponent(
            'state',
            /** @param {CcAddonInfoStateLoaded & { version: AddonVersionStateUpdateAvailable | AddonVersionStateRequestingUpdate }} state */
            (state) => {
              state.version = {
                ...state.version,
                stateType: 'update-available',
              };
            },
          );

          notifyError('nope');
          console.error(error);
        });
    });
  },
});

class Api {
  /**
   * @param {Object} config - Configuration object
   * @param {ApiConfig} config.apiConfig - API configuration
   * @param {string} config.ownerId - Owner identifier
   * @param {string} config.addonId - Addon identifier
   * @param {{ base: string; console: string; }} [config.grafanaLink] - Grafana link info
   * @param {AbortSignal} config.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, addonId, grafanaLink, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._grafanaLink = grafanaLink;
    this._realId = null;
    this._signal = signal;
  }

  /** @return {Promise<RawAddon>} */
  _getAddon() {
    return getAddon({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @param {string} providerId
   * @param {string} realId
   * @returns {Promise<KeycloakOperatorInfo>}
   */
  _getOperator(providerId, realId) {
    return getOperator({ providerId, realId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /**
   * @param {string} providerId
   * @param {string} realId
   * @returns {Promise<object>}
   */
  _getOperatorVersionInfo(providerId, realId) {
    return checkOperatorVersion({ providerId, realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  // TODO: also handle cases where grafana is not enabled (with grafana link from console)
  /**
   * @param {Object} parameters
   * @param {string} parameters.appId
   * @param {AbortSignal} parameters.signal
   * @returns {Promise<string>}
   */
  _getGrafanaAppLink({ appId, signal }) {
    return getGrafanaOrganisation({ id: this._ownerId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal }))
      .then(
        /** @param {{id: string}} grafanaOrg*/ (grafanaOrg) => {
          const grafanaLink = new URL('/d/runtime/application-runtime', this._grafanaLink.base);
          grafanaLink.searchParams.set('orgId', grafanaOrg.id);
          grafanaLink.searchParams.set('var-SELECT_APP', appId);
          return grafanaLink.toString();
        },
      )
      .catch(
        /** @param {Error & { response?: { status?: number }}} error */
        (error) => {
          if (error.response?.status === 404) {
            return this._grafanaLink.console;
          }
          return error;
        },
      );
  }

  // TODO: should we move the waiting & update stuff to the state because it triggers modal closing ?!
  updateOperatorVersion(targetVersion) {
    return new Promise((resolve) => setTimeout(resolve, 2000));
    return updateOperatorVersion({ providerId: this._providerId, realId: this._realId }, targetVersion).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  async getAddonInfo() {
    // Fetch addon to get realId,
    // Fetch operator with realId,
    // return version, creationDate, Grafana, Scalability, LinkedServices
    const rawAddon = await this._getAddon();
    this._realId = rawAddon.realId;
    this._providerId = /** @type {import('../common.types.js').RawAddonProvider} */ (rawAddon.provider).id;
    const [operator, operatorVersionInfo] = await Promise.all([
      this._getOperator(this._providerId, this._realId),
      this._getOperatorVersionInfo(this._providerId, this._realId),
    ]);
    const isGrafanaGloballyEnabled = this._grafanaLink != null;
    const grafanaAppLink = isGrafanaGloballyEnabled
      ? await this._getGrafanaAppLink({ appId: operator.resources.entrypoint, signal: this._signal })
      : null;

    return { addonInfo: rawAddon, operator, operatorVersionInfo, grafanaAppLink };
  }
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function getOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function checkOperatorVersion(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}/version/check`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}

/**
 * @param {object} params
 * @param {string} params.providerId
 * @param {string} params.realId
 * @param {object} body
 */
export function updateOperatorVersion(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}/version/update`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no queryParams
    body,
  });
}
