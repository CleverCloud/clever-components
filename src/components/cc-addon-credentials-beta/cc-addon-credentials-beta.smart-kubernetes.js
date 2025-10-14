import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDevHubHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonCredentialsBetaClient } from './cc-addon-credentials-beta.client.js';
import './cc-addon-credentials-beta.js';

/** @type {AddonCredential[]} */
const SKELETON_DATA = [
  {
    code: 'external-api-server-url',
    value: 'fake-skeleton',
  },
  {
    code: 'config-file',
    value: 'fake-skeleton',
  },
];
const PROVIDER_ID = 'kubernetes';

/**
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../../operators.types.js').KubernetesOperatorInfo} KubernetesOperatorInfo
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonCredentialsBeta>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-addon-credentials-beta[smart-mode="kubernetes"]',
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

    updateComponent('state', {
      type: 'loading',
      tabs: {
        default: SKELETON_DATA,
      },
    });
    updateComponent('docLink', {
      text: i18n('cc-addon-credentials-beta.doc-link.kubernetes'),
      href: generateDevHubHref('/guides/kubernetes-operator/'),
    });

    api
      .getCredentials()
      .then((credentials) => {
        updateComponent('state', {
          type: 'loaded',
          tabs: {
            default: credentials,
          },
        });
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
   * @return {Promise<AddonCredential[]>}
   */
  async getCredentials() {
    await this.getAddonWithOperator();
    return /** @type {AddonCredential[]} */ ([
      {
        code: 'external-api-server-url',
        value: 'toto',
      },
      {
        code: 'config-file',
        value: i18n('cc-addon-credentials-beta.get-kubeconfig'),
      },
    ]);
  }
}
