import { getAssetUrl } from '../../lib/assets-url.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'matomo';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoaded} AddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpdateAvailable} AddonVersionStateUpdateAvailable
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpToDate} AddonVersionStateUpToDate
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateRequestingUpdate} AddonVersionStateRequestingUpdate
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateBaseProperties} AddonInfoStateBaseProperties
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('../../operators.types.js').MatomoOperatorInfo} MatomoOperatorInfo
 * @typedef {import('../../operators.types.js').OperatorVersionInfo} OperatorVersionInfo
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
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

    const api = new Api({ apiConfig, ownerId, addonId, grafanaLink, signal });

    /** @type {AddonInfoStateLoading} */
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
      .getMatomoAddonInfo()
      .then(({ addonInfo, grafanaAppLink, operator, operatorVersion }) => {
        const phpAppId = operator.resources.entrypoint;

        updateComponent('state', {
          type: 'loaded',
          version: { stateType: 'up-to-date', installed: operatorVersion, latest: operatorVersion },
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

class Api extends CcAddonInfoClient {
  /**
   * @param {Object} config - Configuration object
   * @param {ApiConfig} config.apiConfig - API configuration
   * @param {string} config.ownerId - Owner identifier
   * @param {string} config.addonId - Addon identifier
   * @param {{ base: string, console: string }} [config.grafanaLink] - Base url to build a grafana link to the app
   * @param {AbortSignal} config.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, addonId, grafanaLink, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, grafanaLink, signal });
  }

  /**
   * @param {string} providerId
   * @param {string} realId
   * @returns {Promise<MatomoOperatorInfo>}
   */
  _getMatomoOperator(providerId, realId) {
    return getOperator({ providerId, realId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /** @returns {Promise<OperatorVersionInfo>} */
  getOperatorVersionInfo() {
    return checkOperatorVersion({ providerId: this._providerId, realId: this._realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );
  }

  /**
   * @return {Promise<{addonInfo: RawAddon, operator: MatomoOperatorInfo, operatorVersion: string, grafanaAppLink: string}>}
   */
  async getMatomoAddonInfo() {
    // Fetch addon to get realId,
    const rawAddon = await this._getAddon();
    this._realId = rawAddon.realId;
    this._providerId = rawAddon.provider.id;
    // Fetch operator with realId,
    const operator = await this._getMatomoOperator(this._providerId, this._realId);
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
