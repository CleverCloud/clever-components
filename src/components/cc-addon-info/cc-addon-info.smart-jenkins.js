import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { formatAddonFeatures } from '../../lib/product.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'jenkins';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading, JenkinsProviderInfo, RawAddon } from './cc-addon-info.types.js'
 * @import { FormattedFeature } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="jenkins"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} _
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
          value: 4,
        },
        {
          code: 'disk-size',
          type: 'bytes',
          value: 40,
        },
      ],
      encryption: true,
    };

    updateComponent('state', { type: 'loading', ...LOADING_STATE });
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.jenkins'),
      href: getDocUrl('/addons/jenkins'),
    });

    api
      .getJenkinsAddonInfo()
      .then(({ rawAddon, addonProvider }) => {
        const plan = rawAddon.plan.name;
        const features = formatAddonFeatures(rawAddon.plan.features, ['cpu', 'memory', 'disk-size']);
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
   * @param {AbortSignal} config.signal - Signal to abort calls
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
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
