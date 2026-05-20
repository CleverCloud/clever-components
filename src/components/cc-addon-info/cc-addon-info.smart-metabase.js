import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { CheckMetabaseVersionCommand } from '@clevercloud/client/cc-api-commands/metabase/check-metabase-version-command.js';
import { GetMetabaseInfoCommand } from '@clevercloud/client/cc-api-commands/metabase/get-metabase-info-command.js';
import { UpdateMetabaseVersionCommand } from '@clevercloud/client/cc-api-commands/metabase/update-metabase-version-command.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
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
  selector: 'cc-addon-info[smart-mode="metabase"]',
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
      text: i18n('cc-addon-info.doc-link.metabase'),
      href: getDocUrl('/addons/metabase'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } }),
      ccApiClient.send(new GetMetabaseInfoCommand({ addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } }),
      ccApiClient.send(new CheckMetabaseVersionCommand({ addonId }), { signal }),
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
              name: 'PostgreSQL',
              logoUrl: getAssetUrl('/logos/pgsql.svg'),
              link: addonDashboardUrlPattern.replace(':id', operator.resources.pgsqlId),
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
        .send(new UpdateMetabaseVersionCommand({ addonId, targetVersion }))
        .then(() => ccApiClient.send(new CheckMetabaseVersionCommand({ addonId })))
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
