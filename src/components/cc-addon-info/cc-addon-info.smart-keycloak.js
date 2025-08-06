import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @type {BaseProperties}
 */
const SKELETON_DATA = {
  version: {
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
    grafanaBaseLink: { type: String, optional: true },
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
      grafanaBaseLink,
    } = context;

    const api = new Api({ apiConfig, ownerId, addonId, grafanaBaseLink, signal });

    updateComponent('state', { type: 'loading', ...SKELETON_DATA });

    api
      .getAddonInfo()
      .then(({ addonInfo, operator, operatorVersionInfo, grafanaLink }) => {
        const javaAppId = operator.resources.entrypoint;
        // const url = operator.accessUrl;
        logsUrl = context.logsUrlPattern.replace(':id', javaAppId);
        console.log(addonInfo, operator, operatorVersionInfo);
        updateComponent('state', {
          type: 'loaded',
          version: {
            installed: operatorVersionInfo.installed,
            available: operatorVersionInfo.needUpdate ? operatorVersionInfo.available : null,
          },
          creationDate: addonInfo.creationDate,
          openGrafanaLink: grafanaLink,
          openScalabilityLink: '/placeholder',
          linkedServices: [
            {
              type: 'app',
              name: 'Java',
              logoUrl: 'https://example.com',
              link: 'https://example.com',
            },
            {
              type: 'addon',
              name: 'PostgreSQL',
              logoUrl: 'https://example.com',
              link: 'https://example.com',
            },
            {
              type: 'addon',
              name: 'FS Bucket',
              logoUrl: 'https://example.com',
              link: 'https://example.com',
            },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
});

class Api {
  /**
   * @param {Object} config - Configuration object
   * @param {ApiConfig} config.apiConfig - API configuration
   * @param {string} config.ownerId - Owner identifier
   * @param {string} config.addonId - Addon identifier
   * @param {string} config.grafanaBaseLink - Grafana base link
   * @param {AbortSignal} config.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, addonId, grafanaBaseLink, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._grafanaBaseLink = grafanaBaseLink;
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
          const grafanaLink = new URL('/d/runtime/application-runtime', this._grafanaBaseLink);
          grafanaLink.searchParams.set('orgId', grafanaOrg.id);
          grafanaLink.searchParams.set('var-SELECT_APP', appId);
          return grafanaLink.toString();
        },
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
    const grafanaAppLink = await this._getGrafanaAppLink({
      appId: operator.resources.entrypoint,
      signal: this._signal,
    });

    return { addonInfo: rawAddon, operator, operatorVersionInfo, grafanaLink: grafanaAppLink == null ?  };
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
