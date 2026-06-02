import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { CheckOtoroshiVersionCommand } from '@clevercloud/client/cc-api-commands/otoroshi/check-otoroshi-version-command.js';
import { GetOtoroshiInfoCommand } from '@clevercloud/client/cc-api-commands/otoroshi/get-otoroshi-info-command.js';
import { UpdateOtoroshiVersionCommand } from '@clevercloud/client/cc-api-commands/otoroshi/update-otoroshi-version-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { formatVersionState, getGrafanaAppLink } from './cc-addon-info.client.js';
import './cc-addon-info.js';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoaded, AddonInfoStateLoading, AddonVersionStateUpdateAvailable, AddonVersionStateRequestingUpdate } from './cc-addon-info.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="otoroshi"]',
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
  /** @param {OnContextUpdateArgs<CcAddonInfo>} _ */
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

    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

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
          name: 'Redis',
          logoUrl: null,
          link: 'https://example.com',
        },
      ],
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.otoroshi'),
      href: getDocUrl('/addons/otoroshi'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal }),
      ccApiClient.send(new GetOtoroshiInfoCommand({ addonId }), { signal }),
      ccApiClient.send(new CheckOtoroshiVersionCommand({ addonId }), { signal }),
    ])
      .then(async ([addon, operator, versionInfo]) => {
        const javaAppId = operator.resources.entrypoint;
        logsUrl = context.logsUrlPattern.replace(':id', javaAppId);

        const grafanaAppLink = await getGrafanaAppLink({
          grafanaLink,
          ownerId,
          dashboardPath: '/d/runtime/application-runtime',
          appId: javaAppId,
          ccApiClient,
          signal,
        });

        updateComponent('state', {
          type: 'loaded',
          version: formatVersionState(versionInfo),
          creationDate: addon.creationDate,
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

      ccApiClient
        .send(new UpdateOtoroshiVersionCommand({ addonId, targetVersion }))
        .then(() => ccApiClient.send(new CheckOtoroshiVersionCommand({ addonId })))
        .then((versionInfo) => {
          notifySuccess(
            i18n('cc-addon-info.version.update.success.content', { logsUrl }),
            i18n('cc-addon-info.version.update.success.heading', { version: targetVersion }),
          );
          updateComponent(
            'state',
            /** @param {AddonInfoStateLoaded} state */
            (state) => {
              state.version = formatVersionState(versionInfo);
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
