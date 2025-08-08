import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonDetails } from '@clevercloud/client/esm/api/v2/providers.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { formatAddonFeatures } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

const SERVICE_CONFIG = {
  kibana: {
    name: 'Kibana',
    logoUrl: 'https://assets.clever-cloud.com/logos/kibana.svg',
    getAppId: (addonDetails) => addonDetails.kibana_application,
  },
  apm: {
    name: 'APM',
    logoUrl: 'https://assets.clever-cloud.com/logos/apm.svg',
    getAppId: (addonDetails) => addonDetails.apm_application,
  },
};

function getServiceData(service, addonDetails, appOverviewUrlPattern) {
  const config = SERVICE_CONFIG[service.name];
  if (!config) {
    throw new Error(`Unknown service type: ${service.name}`);
  }

  return {
    type: 'app',
    name: config.name,
    logoUrl: config.logoUrl,
    link: appOverviewUrlPattern.replace(':id', config.getAppId(addonDetails)),
  };
}

/**
 * @type {BaseProperties}
 */
const SKELETON_DATA = {
  version: {
    stateType: 'up-to-date',
    installed: '0.0.0',
  },
  creationDate: '2025-08-06 15:03:00',
  plan: 'XS',
  // Remove encryption since it's not part of the addon features
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: 2,
    },
    {
      code: 'memory',
      type: 'bytes',
      value: 2,
    },
    {
      code: 'disk-size',
      type: 'bytes',
      value: 40,
    },
  ],
  openGrafanaLink: 'https://example.com',
  openScalabilityLink: '/placeholder',
  linkedServices: [
    {
      type: 'app',
      name: 'Kibana',
      logoUrl: 'https://example.com',
      link: 'https://example.com',
    },
    {
      type: 'app',
      name: 'APM',
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
  selector: 'cc-addon-info[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    appOverviewUrlPattern: { type: String },
    scalabilityUrlPattern: { type: String },
    // Grafana may be disabled in some environments
    grafanaLink: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs} _
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, appOverviewUrlPattern, scalabilityUrlPattern, grafanaLink } = context;

    const api = new Api({ apiConfig, ownerId, addonId, grafanaLink, signal });

    updateComponent('state', { type: 'loading', ...SKELETON_DATA });

    api
      .getAddonInfo()
      .then(({ rawAddon, addonDetails, grafanaAppLink, isKibanaEnabled }) => {
        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: addonDetails.version,
          },
          creationDate: rawAddon.creationDate,
          plan: rawAddon.plan.name,
          features: formatAddonFeatures(rawAddon.plan.features, ['cpu', 'disk-size', 'memory']),
          openGrafanaLink: grafanaAppLink,
          openScalabilityLink: isKibanaEnabled
            ? scalabilityUrlPattern.replace(':id', addonDetails.kibana_application)
            : null,
          linkedServices: addonDetails.services
            .filter((service) => service.enabled)
            .map((service) => getServiceData(service, addonDetails, appOverviewUrlPattern)),
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

  /**
   *
   * @param {string} providerId
   * @returns {Promise<object>}
   */
  _getAddonDetails(providerId) {
    return getAddonDetails({ providerId, addonId: this._addonId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  async getAddonInfo() {
    const rawAddon = await this._getAddon();
    const addonDetails = await this._getAddonDetails(rawAddon.provider.id);
    const isKibanaEnabled = addonDetails.services.some((service) => service.name === 'kibana' && service.enabled);
    const grafanaAppLink = isKibanaEnabled
      ? await this._getGrafanaAppLink({ appId: addonDetails.kibana_application, signal: this._signal })
      : null;
    return { rawAddon, addonDetails, grafanaAppLink, isKibanaEnabled };
  }
}
