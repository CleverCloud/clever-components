import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
import { getGrafanaOrganisation } from '@clevercloud/client/esm/api/v4/saas.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { formatAddonFeatures } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'es-addon';

/**
 * @param {string} serviceName
 * @param {ElasticAddonInfo} addonProvider
 * @param {string} appOverviewUrlPattern
 * @return {LinkedService}
 */
function getServiceData(serviceName, addonProvider, appOverviewUrlPattern) {
  switch (serviceName) {
    case 'apm':
      return {
        type: 'app',
        name: 'APM',
        logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
        link: appOverviewUrlPattern.replace(':id', addonProvider.apm_application),
      };
    case 'kibana':
      return {
        type: 'app',
        name: 'Kibana',
        logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
        link: appOverviewUrlPattern.replace(':id', addonProvider.kibana_application),
      };
    default:
      return null;
  }
}

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading, ElasticAddonInfo, LinkedService, RawAddon } from './cc-addon-info.types.js'
 * @import { FormattedFeature } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
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

    const api = new Api({ apiConfig, ownerId, addonId, grafanaLink, signal });

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

    api
      .getElasticAddonInfo()
      .then(({ rawAddon, addonProvider, grafanaAppLink }) => {
        const plan = rawAddon.plan.name;
        // Get standard features from rawAddon
        const features = formatAddonFeatures(rawAddon.plan.features, ['cpu', 'memory', 'disk-size']);
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
        // Add encryption feature from addonProvider
        const encryptionFeature = addonProvider.features.find((f) => f.name === 'encryption');

        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: addonProvider.version,
            latest: addonProvider.version,
          },
          creationDate: rawAddon.creationDate,
          specifications,
          encryption: encryptionFeature.enabled,
          openGrafanaLink: grafanaAppLink,
          linkedServices: addonProvider.services
            .filter((service) => service.enabled)
            .map((service) => getServiceData(service.name, addonProvider, appOverviewUrlPattern))
            .sort((a, b) => a.name.localeCompare(b.name)),
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
   *
   * @param {string} providerId
   * @returns {Promise<ElasticAddonInfo>}
   */
  _getAddonProvider(providerId) {
    return getAddonProvider({ providerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {Object} parameters
   * @param {string} parameters.realId
   * @param {AbortSignal} parameters.signal
   * @returns {Promise<string>}
   */
  _getGrafanaClusterLink({ realId, signal }) {
    return getGrafanaOrganisation({ id: this._ownerId })
      .then(sendToApi({ apiConfig: this._apiConfig, signal }))
      .then((grafanaOrg) => {
        const grafanaClusterLink = new URL('/d/elasticsearch/elasticsearch-cluster', this._grafanaLink.base);
        grafanaClusterLink.searchParams.set('orgId', grafanaOrg.id);
        grafanaClusterLink.searchParams.set('var-SELECT_APP', realId);
        return grafanaClusterLink.toString();
      })
      .catch(
        /** @param {Error & { response?: { status?: number }}} error */
        (error) => {
          if (error.response?.status === 404) {
            return this._grafanaLink.console;
          }
          throw error;
        },
      );
  }

  /**
   * @returns {Promise<{ rawAddon: RawAddon, addonProvider: ElasticAddonInfo, grafanaAppLink: string }>}
   */
  async getElasticAddonInfo() {
    const rawAddon = await this._getAddon();
    const addonProvider = await this._getAddonProvider(rawAddon.provider.id);
    const grafanaAppLink =
      this._grafanaLink != null
        ? await this._getGrafanaClusterLink({ realId: rawAddon.realId, signal: this._signal })
        : null;

    return { rawAddon, addonProvider, grafanaAppLink };
  }
}
