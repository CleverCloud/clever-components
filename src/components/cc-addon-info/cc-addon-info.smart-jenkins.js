import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { formatAddonFeatures } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'jenkins';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').JenkinsProviderInfo} JenkinsProviderInfo
 * @typedef {import('./cc-addon-info.types.js').LinkedService} LinkedService
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/send-to-api.types.js').AuthBridgeConfig} AuthBridgeConfig
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="jenkins"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} _
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;

    const api = new Api({ apiConfig, ownerId, addonId, signal });

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
      // Remove encryption since it's not part of the addon features
      features: [
        {
          code: 'cpu',
          type: 'number',
          value: 2,
        },
        {
          code: 'memory',
          type: 'bytes',
          value: 4,
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
    };

    updateComponent('state', { type: 'loading', ...LOADING_STATE });
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.jenkins'),
      href: generateDocsHref('/addons/jenkins'),
    });

    api
      .getJenkinsAddonInfo()
      .then(({ rawAddon, addonProvider }) => {
        // Get standard features from plan
        const features = formatAddonFeatures(rawAddon.plan.features, ['cpu', 'memory', 'disk-size']);

        // Add encryption feature from addonProvider
        const encryptionFeature = addonProvider.features.find((f) => f.name === 'encryption');
        if (encryptionFeature) {
          features.push({
            code: 'encryption-at-rest',
            type: 'boolean',
            value: `encryptionFeature.enabled`,
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
   * @returns {Promise<JenkinsProviderInfo>}
   */
  _getAddonProvider(providerId) {
    return getAddonProvider({ providerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @returns {Promise<{ rawAddon: RawAddon, addonProvider: JenkinsProviderInfo }>}
   */
  async getJenkinsAddonInfo() {
    const rawAddon = await this._getAddon();
    const addonProvider = await this._getAddonProvider(rawAddon.provider.id);

    return { rawAddon, addonProvider };
  }
}
