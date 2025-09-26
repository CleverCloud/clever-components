import { getAssetUrl } from '../../lib/assets-url.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient, formatVersionState } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'keycloak';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoaded} AddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpdateAvailable} AddonVersionStateUpdateAvailable
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateRequestingUpdate} AddonVersionStateRequestingUpdate
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
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

    const api = new CcAddonInfoClient({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, grafanaLink, signal });

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
