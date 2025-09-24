import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { get as getAddon } from '@clevercloud/client/esm/api/v2/addon.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { generateDevHubHref, generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-addon-info.js';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoaded} AddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpdateAvailable} AddonVersionStateUpdateAvailable
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpToDate} AddonVersionStateUpToDate
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateRequestingUpdate} AddonVersionStateRequestingUpdate
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateBaseProperties} AddonInfoStateBaseProperties
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('./cc-addon-info.types.js').KeycloakOperatorInfo} KeycloakOperatorInfo
 * @typedef {import('./cc-addon-info.types.js').OperatorVersionInfo} OperatorVersionInfo
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
    grafanaLink: { type: Object, optional: true },
    logsUrlPattern: { type: String },
  },
  /** @param {OnContextUpdateArgs} _ */
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
    let logsUrl = '';

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
          name: 'Java',
          logoUrl: null,
          link: 'https://example.com',
        },
        {
          type: 'addon',
          name: 'PostgreSQL',
          logoUrl: null,
          link: 'https://example.com',
        },
        {
          type: 'addon',
          name: 'FS Bucket',
          logoUrl: null,
          link: 'https://example.com',
        },
      ],
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.keycloak'),
      href: generateDocsHref('/addons/keycloak'),
    });

    api
      .getAddonInfo()
      .then(({ operatorVersionInfo, addonInfo, grafanaAppLink, operator }) => {
        const javaAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', javaAppId);

        updateComponent('state', {
          type: 'loaded',
          version: formatVersionState(operatorVersionInfo),
          creationDate: addonInfo.creationDate,
          openGrafanaLink: grafanaAppLink,
          openScalabilityLink: scalabilityUrlPattern.replace(':id', javaAppId),
          linkedServices: [
            {
              type: 'app',
              name: 'Java',
              logoUrl: getAssetUrl('/logos/java-jar.svg'),
              link: appOverviewUrlPattern.replace(':id', javaAppId),
            },
            {
              type: 'addon',
              name: 'PostgreSQL',
              logoUrl: getAssetUrl('/logos/pgsql.svg'),
              link: addonDashboardUrlPattern.replace(':id', operator.resources.pgsqlId),
            },
            {
              type: 'addon',
              name: 'FS Bucket',
              logoUrl: getAssetUrl('/logos/fsbucket.svg'),
              link: addonDashboardUrlPattern.replace(':id', operator.resources.fsbucketId),
            },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    onEvent('cc-addon-version-change', (targetVersion) => {
      updateComponent(
        'state',
        /** @param {AddonInfoStateLoaded & { version: AddonVersionStateUpdateAvailable | AddonVersionStateRequestingUpdate }} state */
        (state) => {
          state.version = {
            ...state.version,
            stateType: 'requesting-update',
          };
        },
      );

      api
        .updateOperatorVersion(targetVersion)
        .then(({ availableVersions }) => {
          notifySuccess(
            i18n('cc-addon-info.version.update.success.content', { logsUrl }),
            i18n('cc-addon-info.version.update.success.heading', { version: targetVersion }),
          );

          updateComponent(
            'state',
            /** @param {AddonInfoStateLoaded} state */
            (state) => {
              const needUpdate = targetVersion !== state.version.latest;
              state.version = formatVersionState({
                installed: targetVersion,
                available: availableVersions,
                latest: state.version.latest,
                needUpdate,
              });
            },
          );
        })
        .catch((error) => {
          updateComponent(
            'state',
            /** @param {AddonInfoStateLoaded & { version: AddonVersionStateUpdateAvailable | AddonVersionStateRequestingUpdate }} state */
            (state) => {
              state.version = {
                ...state.version,
                stateType: 'update-available',
              };
            },
          );
          notifyError(i18n('cc-addon-info.version.update.error'));
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
   * @returns {Promise<KeycloakOperatorInfo>}
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
   * @param {string} targetVersion
   * @returns {Promise<KeycloakOperatorInfo>}
   **/
  updateOperatorVersion(targetVersion) {
    return updateOperatorVersion({ providerId: this._providerId, realId: this._realId }, { targetVersion }).then(
      sendToApi({ apiConfig: this._apiConfig }),
    );
  }

  /**
   * @return {Promise<{addonInfo: RawAddon, operator: KeycloakOperatorInfo, operatorVersionInfo: OperatorVersionInfo, grafanaAppLink: string}>}
   */
  async getAddonInfo() {
    // Fetch addon to get realId,
    const rawAddon = await this._getAddon();
    this._realId = rawAddon.realId;
    this._providerId = /** @type {import('../common.types.js').RawAddonProvider} */ rawAddon.provider.id;
    // Fetch operator with realId,
    const [operator, operatorVersionInfo] = await Promise.all([
      this._getOperator(this._providerId, this._realId),
      this.getOperatorVersionInfo(),
    ]);
    const grafanaAppLink =
      this._grafanaLink != null
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

/**
 * @param {OperatorVersionInfo} operatorVersionInfo
 * @returns {AddonInfoStateLoaded['version']}
 **/
function formatVersionState(operatorVersionInfo) {
  if (operatorVersionInfo.needUpdate) {
    return {
      stateType: 'update-available',
      installed: operatorVersionInfo.installed,
      available: operatorVersionInfo.available.filter((version) => version !== operatorVersionInfo.installed),
      latest: operatorVersionInfo.latest,
      changelogLink: `${generateDevHubHref('/changelog')}`,
    };
  }

  return {
    stateType: 'up-to-date',
    installed: operatorVersionInfo.installed,
    latest: operatorVersionInfo.latest,
  };
}
