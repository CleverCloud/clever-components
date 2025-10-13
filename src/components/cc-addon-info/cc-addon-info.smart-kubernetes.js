import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { generateDocsHref } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'kubernetes';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').RawAddon} RawAddon
 * @typedef {import('../../operators.types.js').KubernetesOperatorInfo} KubernetesOperatorInfo
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="kubernetes"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    logsUrlPattern: { type: String },
  },
  /** @param {OnContextUpdateArgs} _ */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId } = context;

    const api = new Api({ apiConfig, ownerId, addonId, signal });

    /** @type {AddonInfoStateLoading} */
    const LOADING_STATE = {
      type: 'loading',
      version: {
        stateType: 'up-to-date',
        installed: '0.0.0',
        latest: '0.0.0',
      },
      creationDate: '2025-08-06 15:03:00',
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.kubernetes'),
      href: generateDocsHref('/addons/kubernetes'),
    });

    api
      .getKubernetesAddonInfo()
      .then(({ operatorVersion, addonInfo }) => {
        updateComponent('state', {
          type: 'loaded',
          version: { stateType: 'up-to-date', installed: operatorVersion, latest: operatorVersion },
          creationDate: addonInfo.creationDate,
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
   * @param {string} providerId
   * @param {string} realId
   * @returns {Promise<KubernetesOperatorInfo>}
   */
  _getKubernetesOperator(providerId, realId) {
    return getOperator({ providerId, realId }).then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }));
  }

  /**
   * @return {Promise<{addonInfo: RawAddon, operator: KubernetesOperatorInfo, operatorVersion: string}>}
   */
  async getKubernetesAddonInfo() {
    // Fetch addon to get realId,
    const rawAddon = await this._getAddon();
    this._realId = rawAddon.realId;
    this.providerId = rawAddon.provider.id;
    // Fetch operator with realId,
    const operator = await this._getKubernetesOperator(this.providerId, this._realId);
    const operatorVersion = operator.version;

    return { addonInfo: rawAddon, operator, operatorVersion };
  }
}

/**
 * @param {{ providerId: string, realId: string }} params
 */
function getOperator(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/addon-providers/addon-${params.providerId}/addons/${params.realId}`,
    headers: { Accept: 'application/json' },
    // no queryParams
    // no body
  });
}
