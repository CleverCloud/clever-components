import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * + * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoaded} AddonInfoStateLoaded
 * + * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpdateAvailable} AddonVersionStateUpdateAvailable
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpToDate} AddonVersionStateUpToDate
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateRequestingUpdate} AddonVersionStateRequestingUpdate
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateBaseProperties} AddonInfoStateBaseProperties
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-info.types.js').MatomoOperatorInfo} MatomoOperatorInfo
 * @typedef {import('./cc-addon-info.types.js').OperatorVersionInfo} OperatorVersionInfo
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="matomo"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    appOverviewUrlPattern: { type: String },
    addonDashboardUrlPattern: { type: String },
    scalabilityUrlPattern: { type: String },
    grafanaLink: { type: Object, optional: true },
    logsUrlPattern: { type: String },
  },
  /** @param {OnContextUpdateArgs} _ */
  onContextUpdate({ context, updateComponent, signal }) {
    const {
      apiConfig,
      ownerId,
      addonId,
      appOverviewUrlPattern,
      addonDashboardUrlPattern,
      scalabilityUrlPattern,
      grafanaLink,
    } = context;
    let logsUrl = '';

    const api = new Api({ apiConfig, ownerId, addonId, grafanaLink, signal });

    /** @type {CcAddonInfoStateLoading} */
    const LOADING_STATE = {
      type: 'loading',
      version: {
        stateType: 'up-to-date',
        installed: '0.0.0',
        latest: '0.0.0',
      },
      creationDate: '2025-08-06 15:03:00',
      // if Grafana is totally disabled within the console, do not display a skeleton for grafana link
      openGrafanaLink: grafanaLink != null ? 'https://example.com' : null,
      openScalabilityLink: '/placeholder',
      linkedServices: [
        {
          type: 'app',
          name: 'PHP',
          logoUrl: null,
          link: 'https://example.com',
        },
        {
          type: 'addon',
          name: 'MySQL',
          logoUrl: null,
          link: 'https://example.com',
        },
        {
          type: 'addon',
          name: 'Redis',
          logoUrl: null,
          link: 'https://example.com',
        },
      ],
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.matomo'),
      href: generateDocsHref('/addons/matomo'),
    });

    api
      .getAddonInfo()
      .then(({ addonInfo, grafanaAppLink, operator, operatorVersion }) => {
        const phpAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', phpAppId);

        updateComponent('state', {
          type: 'loaded',
          version: { stateType: 'up-to-date', installed: operatorVersion },
          creationDate: addonInfo.creationDate,
          openGrafanaLink: grafanaAppLink,
          openScalabilityLink: scalabilityUrlPattern.replace(':id', phpAppId),
          linkedServices: [
            {
              type: 'app',
              name: 'PHP',
              logoUrl: getAssetUrl('/logos/php.svg'),
              link: appOverviewUrlPattern.replace(':id', phpAppId),
            },
            {
              type: 'addon',
              name: 'MySQL',
              logoUrl: getAssetUrl('/logos/mysql.svg'),
              link: addonDashboardUrlPattern.replace(':id', operator.resources.mysqlId),
            },
            {
              type: 'addon',
              name: 'Redis',
              logoUrl: getAssetUrl('/logos/redis.svg'),
              link: addonDashboardUrlPattern.replace(':id', operator.resources.redisId),
            },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api {
  /**
   * @param {Object} config - Configuration object
   * @param {ApiConfig} config.apiConfig - API configuration
   * @param {string} config.ownerId - Owner identifier
   * @param {string} config.addonId - Addon identifier
   * @param {{ base: string, console: string }} [config.grafanaLink] - Base url to build a grafana link to the app
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
   * @returns {Promise<MatomoOperatorInfo>}
   */
  _getOperator(providerId, realId) {
    return getOperator({ providerId, realId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /** @returns {Promise<OperatorVersionInfo>} */
  getOperatorVersionInfo() {
    return checkOperatorVersion({ providerId: this._providerId, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

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
        /** @param {{id: string}} grafanaOrg*/
        (grafanaOrg) => {
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
   * @return {Promise<{addonInfo: RawAddon, operator: MatomoOperatorInfo, operatorVersion: string, grafanaAppLink: string}>}
   */
  async getAddonInfo() {
    // Fetch addon to get realId,
    const rawAddon = await this._getAddon();
    this._realId = rawAddon.realId;
    this._providerId = /** @type {import('../common.types.js').RawAddonProvider} */ rawAddon.provider.id;
    // Fetch operator with realId,
    const operator = await this._getOperator(this._providerId, this._realId);
    const operatorVersion = operator.version;

    const grafanaAppLink =
      this._grafanaLink != null
        ? await this._getGrafanaAppLink({ appId: operator.resources.entrypoint, signal: this._signal })
        : null;

    return { addonInfo: rawAddon, operator, operatorVersion, grafanaAppLink };
  }
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function getOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/${params.providerId}/addons/${params.realId}`,
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
    url: `/v4/addon-providers/${params.providerId}/addons/${params.realId}/version/check`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}
