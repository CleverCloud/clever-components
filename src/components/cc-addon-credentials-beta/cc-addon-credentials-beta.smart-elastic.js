import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsBetaClient } from './cc-addon-credentials-beta.client.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredentialsBetaStateLoading} */
const LOADING_STATE = {
  type: 'loading',
  tabs: {
    elastic: {
      content: [
        {
          code: 'host',
          value: 'fake-skeleton',
        },
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.elastic'),
        href: getDocUrl('/addons/elastic'),
      },
    },
    kibana: {
      content: [
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.elastic-kibana'),
        href: getDocUrl('/addons/elastic/#kibana'),
      },
    },
    apm: {
      content: [
        {
          code: 'user',
          value: 'fake-skeleton',
        },
        {
          code: 'password',
          value: 'fake-skeleton',
        },
        {
          code: 'token',
          value: 'fake-skeleton',
        },
      ],
      docLink: {
        text: i18n('cc-addon-credentials-beta.doc-link.elastic-apm'),
        href: getDocUrl('/addons/elastic/#elastic-apm'),
      },
    },
  },
};
const PROVIDER_ID = 'es-addon';

/**
 * @import { CcAddonCredentialsBeta } from './cc-addon-credentials-beta.js'
 * @import { AddonCredentialsBetaStateLoaded, AddonCredentialsBetaStateLoading, ElasticProviderInfo } from './cc-addon-credentials-beta.types.js'
 * @import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonCredentialsBeta>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', LOADING_STATE);

    api
      .getAllCredentials()
      .then(({ elastic, kibana, apm }) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            // Build tabs object with only enabled services
            /** @type {Record<string, {content: AddonCredential[], docLink: {text: string, href: string}}>} */
            const updatedTabs = {
              elastic: {
                ...state.tabs.elastic,
                content: elastic,
              },
            };

            if (kibana != null) {
              updatedTabs.kibana = {
                ...state.tabs.kibana,
                content: kibana,
              };
            }

            if (apm != null) {
              updatedTabs.apm = {
                ...state.tabs.apm,
                content: apm,
              };
            }

            state.tabs = updatedTabs;
          },
        );
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api extends CcAddonCredentialsBetaClient {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {string} params.ownerId
   * @param {string} params.addonId
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
  }

  /**
   *
   * @param {string} providerId
   * @returns {Promise<ElasticProviderInfo>}
   */
  _getAddonProvider(providerId) {
    return getAddonProvider({ providerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {'elastic' | 'kibana' | 'apm'} tabType
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials(tabType) {
    const addonProvider = await this._getAddonProvider(this._providerId);
    switch (tabType) {
      case 'elastic':
        return [
          {
            code: 'host',
            value: addonProvider.config.host,
          },
          {
            code: 'user',
            value: addonProvider.config.user,
          },
          {
            code: 'password',
            value: addonProvider.config.password,
          },
        ];
      case 'kibana':
        return [
          {
            code: 'user',
            value: addonProvider.config.kibana_user,
          },
          {
            code: 'password',
            value: addonProvider.config.kibana_password,
          },
        ];
      case 'apm':
        return [
          {
            code: 'user',
            value: addonProvider.config.apm_user,
          },
          {
            code: 'password',
            value: addonProvider.config.apm_password,
          },
          {
            code: 'token',
            value: addonProvider.config.apm_auth_token,
          },
        ];
    }
  }

  /**
   * @return {Promise<{elastic: AddonCredential[], kibana: AddonCredential[] | null, apm: AddonCredential[] | null}>}
   */
  async getAllCredentials() {
    const addonProvider = await this._getAddonProvider(this._providerId);

    // Check which services are enabled
    const kibanaService = addonProvider.services.find((service) => service.name === 'kibana');
    const apmService = addonProvider.services.find((service) => service.name === 'apm');
    const isKibanaEnabled = kibanaService?.enabled ?? false;
    const isApmEnabled = apmService?.enabled ?? false;

    const [elasticCredentials, kibanaCredentials, apmCredentials] = await Promise.all([
      this.getCredentials('elastic'),
      isKibanaEnabled ? this.getCredentials('kibana') : null,
      isApmEnabled ? this.getCredentials('apm') : null,
    ]);

    return {
      elastic: elasticCredentials,
      kibana: kibanaCredentials,
      apm: apmCredentials,
    };
  }
}
