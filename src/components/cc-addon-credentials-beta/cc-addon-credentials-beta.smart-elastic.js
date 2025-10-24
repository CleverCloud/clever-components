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
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgEnabled} AddonCredentialNgEnabled
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNgDisabled} AddonCredentialNgDisabled
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
      .then((tabs) => {
        updateComponent(
          'state',
          /** @param {AddonCredentialsBetaStateLoaded|AddonCredentialsBetaStateLoading} state */
          (state) => {
            state.type = 'loaded';
            state.tabs = Object.fromEntries(
              Object.entries(state.tabs).map(([tabName, tabValue]) => [
                tabName,
                {
                  ...tabValue,
                  content: tabs[/** @type {'elastic'|'kibana'|'apm'} */ (tabName)],
                },
              ]),
            );
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
    // const rawAddon = await this._getAddon();
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
   * @return {Promise<{elastic: AddonCredential[], kibana: AddonCredential[], apm: AddonCredential[]}>}
   */
  async getAllCredentials() {
    const [elasticCredentials, kibanaCredentials, apmCredentials] = await Promise.all([
      this.getCredentials('elastic'),
      this.getCredentials('kibana'),
      this.getCredentials('apm'),
    ]);

    return {
      elastic: elasticCredentials,
      kibana: kibanaCredentials,
      apm: apmCredentials,
    };
  }
}
