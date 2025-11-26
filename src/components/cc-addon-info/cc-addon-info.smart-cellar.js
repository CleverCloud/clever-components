import { getDocUrl } from '../../lib/dev-hub-url.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'cellar-addon';

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcAddonInfo>} OnContextUpdateArgs
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="cellar"]',
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
      creationDate: '2025-08-06 15:03:00',
      totalContent: {
        buckets: null,
        objects: null,
      },
      traffic: {
        inbound: null,
        outbound: null,
      },
      usedSpaces: {
        size: null,
      },
    };

    updateComponent('state', LOADING_STATE);
    updateComponent('docLink', {
      text: i18n('cc-addon-info.doc-link.cellar'),
      href: getDocUrl('/addons/cellar'),
    });

    api
      .getAllCellarInfo()
      .then(({ rawAddon, cellarInfo }) => {
        updateComponent('state', {
          type: 'loaded',
          creationDate: rawAddon.creationDate,
          totalContent: {
            buckets: cellarInfo.totalContent.buckets,
            objects: cellarInfo.totalContent.objects,
          },
          traffic: {
            inbound: cellarInfo.traffic.inbound,
            outbound: cellarInfo.traffic.outbound,
          },
          usedSpaces: {
            size: cellarInfo.usedSpace.size,
          },
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

  // TODO: replace with right call when API available
  _getCellarInfo() {
    return Promise.resolve({
      totalContent: {
        buckets: 6,
        objects: 450,
      },
      traffic: {
        inbound: '4 bytes',
        outbound: '40 KB',
      },
      usedSpace: {
        size: '17.2 GB',
      },
    });
  }

  async getAllCellarInfo() {
    const rawAddon = await this._getAddon();
    const cellarInfo = await this._getCellarInfo();

    return { rawAddon, cellarInfo };
  }
}
