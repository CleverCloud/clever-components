import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetMatomoInfoCommand } from '@clevercloud/client/cc-api-commands/matomo/get-matomo-info-command.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { getGrafanaAppLink } from './cc-addon-info.client.js';
import './cc-addon-info.js';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading } from './cc-addon-info.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
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
  /** @param {OnContextUpdateArgs<CcAddonInfo>} _ */
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
      href: getDocUrl('/addons/matomo'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal }),
      ccApiClient.send(new GetMatomoInfoCommand({ addonId }), { signal }),
    ])
      .then(async ([addon, operator]) => {
        const phpAppId = operator.resources.entrypoint;

        const grafanaAppLink = await getGrafanaAppLink({
          grafanaLink,
          ownerId,
          dashboardPath: '/d/runtime/application-runtime',
          appId: phpAppId,
          ccApiClient,
          signal,
        });

        updateComponent('state', {
          type: 'loaded',
          version: { stateType: 'up-to-date', installed: operator.version, latest: operator.version },
          creationDate: addon.creationDate,
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
