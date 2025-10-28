// @ts-expect-error FIXME: remove when clever-client exports types
import { getAddon as getAddonProvider } from '@clevercloud/client/esm/api/v2/providers.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
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
        href: generateDocsHref('/addons/elastic/'),
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
        href: generateDocsHref('/addons/elastic/#kibana'),
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
        href: generateDocsHref('/addons/elastic/#elastic-apm'),
      },
    },
  },
};
const PROVIDER_ID = 'es-addon';

/**
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoaded} AddonCredentialsBetaStateLoaded
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaStateLoading} AddonCredentialsBetaStateLoading
 * @typedef {import('./cc-addon-credentials-beta.types.js').ElasticProviderInfo} ElasticProviderInfo
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonCredentialsBeta>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="elastic"]',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, addonId, ownerId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', LOADING_STATE);

    api
      .getAllCredentials()
      .then(({ elastic, kibana, apm, enabledServices }) => {
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

            if (enabledServices.kibana) {
              updatedTabs.kibana = {
                ...state.tabs.kibana,
                content: kibana,
              };
            }

            if (enabledServices.apm) {
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
    if (tabType === 'elastic') {
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
    } else if (tabType === 'kibana') {
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
    }
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

  /**
   * @return {Promise<{elastic: AddonCredential[], kibana: AddonCredential[], apm: AddonCredential[], enabledServices: {kibana: boolean, apm: boolean}}>}
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
      this.getCredentials('kibana'),
      this.getCredentials('apm'),
    ]);

    return {
      elastic: elasticCredentials,
      kibana: kibanaCredentials,
      apm: apmCredentials,
      enabledServices: {
        kibana: isKibanaEnabled,
        apm: isApmEnabled,
      },
    };
  }
}
