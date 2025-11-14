import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { formatAddonFeatures } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
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
    case 'kibana':
      return {
        type: 'app',
        name: 'Kibana',
        logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
        link: appOverviewUrlPattern.replace(':id', addonProvider.kibana_application),
      };
    case 'apm':
      return {
        type: 'app',
        name: 'APM',
        logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
        link: appOverviewUrlPattern.replace(':id', addonProvider.apm_application),
      };
    default:
      return null;
  }
}

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading, ElasticAddonInfo, LinkedService, RawAddon } from './cc-addon-info.types.js'
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
    scalabilityUrlPattern: { type: String },
    grafanaLink: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} _
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, appOverviewUrlPattern, scalabilityUrlPattern, grafanaLink } = context;

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
      plan: 'XS',
      features: [
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
      openGrafanaLink: grafanaLink != null ? 'https://example.com' : null,
      openScalabilityLink: '/placeholder',
      linkedServices: [
        {
          type: 'app',
          name: 'Kibana',
          logoUrl: 'https://example.com',
          link: 'https://example.com',
        },
        {
          type: 'app',
          name: 'APM',
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
      .then(({ rawAddon, addonProvider, grafanaAppLink, isKibanaEnabled }) => {
        // Get standard features from plan
        const features = formatAddonFeatures(rawAddon.plan.features, ['cpu', 'memory', 'disk-size']);

        // Add encryption feature from addonProvider
        const encryptionFeature = addonProvider.features.find((f) => f.name === 'encryption');
        if (encryptionFeature) {
          features.push({
            code: 'encryption-at-rest',
            type: 'boolean',
            value: encryptionFeature.enabled ? 'true' : 'false',
          });
        }

        updateComponent('state', {
          type: 'loaded',
          version: {
            stateType: 'up-to-date',
            installed: addonProvider.version,
            latest: addonProvider.version,
          },
          creationDate: rawAddon.creationDate,
          plan: rawAddon.plan.name,
          features,
          openGrafanaLink: grafanaAppLink,
          openScalabilityLink: isKibanaEnabled
            ? scalabilityUrlPattern.replace(':id', addonProvider.kibana_application)
            : null,
          linkedServices: addonProvider.services
            .filter((service) => service.enabled)
            .map((service) => getServiceData(service.name, addonProvider, appOverviewUrlPattern)),
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
   * @returns {Promise<{ rawAddon: RawAddon, addonProvider: ElasticAddonInfo, grafanaAppLink: string,isKibanaEnabled: boolean }>}
   */
  async getElasticAddonInfo() {
    const rawAddon = await this._getAddon();
    const addonProvider = await this._getAddonProvider(rawAddon.provider.id);
    const isKibanaEnabled = addonProvider.services.some((service) => service.name === 'kibana' && service.enabled);
    const grafanaAppLink =
      this._grafanaLink != null
        ? await this._getGrafanaAppLink({ appId: addonProvider.app_id, signal: this._signal })
        : null;

    return { rawAddon, addonProvider, grafanaAppLink, isKibanaEnabled };
  }
}
