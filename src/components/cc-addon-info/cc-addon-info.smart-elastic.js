import { GetAddonCommand } from '@clevercloud/client/cc-api-commands/addon/get-addon-command.js';
import { GetElasticsearchInfoCommand } from '@clevercloud/client/cc-api-commands/elasticsearch/get-elasticsearch-info-command.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { getGrafanaAppLink } from './cc-addon-info.client.js';
import './cc-addon-info.js';

/**
 * @param {string} serviceName
 * @param {{ apmApplication: string, kibanaApplication: string }} esInfo
 * @param {string} appOverviewUrlPattern
 * @return {LinkedService}
 */
function getServiceData(serviceName, esInfo, appOverviewUrlPattern) {
  switch (serviceName) {
    case 'apm':
      return {
        type: 'app',
        name: 'APM',
        logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
        link: appOverviewUrlPattern.replace(':id', esInfo.apmApplication),
      };
    case 'kibana':
      return {
        type: 'app',
        name: 'Kibana',
        logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
        link: appOverviewUrlPattern.replace(':id', esInfo.kibanaApplication),
      };
    default:
      return null;
  }
}

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading, LinkedService } from './cc-addon-info.types.js'
 * @import { FormattedFeature } from '../common.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    appOverviewUrlPattern: { type: String },
    grafanaLink: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} _
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, appOverviewUrlPattern, grafanaLink } = context;

    const ccApiClient = getCcApiClientWithOAuth(apiConfig);

    /**
     * @type {AddonInfoStateLoading}
     */
    const LOADING_STATE = {
      type: 'loading',
      version: {
        stateType: 'up-to-date',
        installed: '0.0.0',
        latest: '0.0.0',
      },
      creationDate: '2025-08-06 15:03:00',
      specifications: [
        {
          code: 'plan',
          type: 'string',
          value: 'XS',
        },
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
        {
          code: 'encryption-at-rest',
          type: 'boolean',
          value: 'false',
        },
      ],
      encryption: true,
      openGrafanaLink: grafanaLink != null ? 'https://example.com' : null,
      linkedServices: [
        {
          type: 'app',
          name: 'APM',
          logoUrl: 'https://example.com',
          link: 'https://example.com',
        },
        {
          type: 'app',
          name: 'Kibana',
          logoUrl: 'https://example.com',
          link: 'https://example.com',
        },
      ],
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.elastic'),
      href: getDocUrl('/addons/elastic'),
    });

    Promise.all([
      ccApiClient.send(new GetAddonCommand({ ownerId, addonId }), { signal, dedupe: true, cache: { ttl: ONE_SECOND } }),
      ccApiClient.send(new GetElasticsearchInfoCommand({ addonId }), {
        signal,
        dedupe: true,
        cache: { ttl: ONE_SECOND },
      }),
    ])
      .then(async ([addon, esInfo]) => {
        const plan = addon.plan.name;
        // Get standard features from addon
        const selectedFeatureCodes = ['cpu', 'memory', 'disk-size'];
        const features = selectedFeatureCodes
          .map((code) => addon.plan.features.find((f) => f.nameCode === code))
          .filter((feature) => feature != null)
          .map(
            (feature) =>
              /** @type {FormattedFeature} */ ({
                code: feature.nameCode,
                type: /** @type {FormattedFeature['type']} */ (feature.type.toLowerCase()),
                value: feature.computableValue ?? '',
                name: feature.name,
              }),
          );
        // Combine data (plan and features) in a `specifications` array
        /** @type {Array<FormattedFeature>} */
        const specifications = [
          /** @type {FormattedFeature} */
          ({
            code: 'plan',
            type: 'string',
            value: plan,
          }),
          ...features,
        ];
        // Add encryption feature from esInfo
        const encryptionFeature = esInfo.features.find((f) => f.name === 'encryption');

        const grafanaAppLink = await getGrafanaAppLink({
          grafanaLink,
          ownerId,
          dashboardPath: '/d/elasticsearch/elasticsearch-cluster',
          appId: addon.realId,
          ccApiClient,
          signal,
        });

        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: esInfo.version,
            latest: esInfo.version,
          },
          creationDate: addon.creationDate,
          specifications,
          encryption: encryptionFeature.enabled,
          openGrafanaLink: grafanaAppLink,
          linkedServices: esInfo.services
            .filter((service) => service.enabled)
            .map((service) => getServiceData(service.name, esInfo, appOverviewUrlPattern))
            .sort((a, b) => a.name.localeCompare(b.name)),
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});
