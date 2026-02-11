import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { i18n } from '../../translations/translation.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonInfoClient } from './cc-addon-info.client.js';
import './cc-addon-info.js';

const PROVIDER_ID = 'cellar-addon';

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoading } from './cc-addon-info.types.js'
 * @import { CellarInfo } from './cc-addon-info.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-info[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} args
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
      .then(({ cellarInfo }) => {
        updateComponent('state', {
          type: 'loaded',
          creationDate: cellarInfo.creationDate,
          totalContent: {
            buckets: cellarInfo.buckets.count,
            objects: cellarInfo.buckets.objects,
          },
          traffic: {
            inbound: cellarInfo.traffic.inbound,
            outbound: cellarInfo.traffic.outbound,
          },
          usedSpaces: {
            size: cellarInfo.buckets.size,
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

  /**
   * @return {Promise<CellarInfo>}
   */
  async _getCellarInfo() {
    const rawAddon = await this._getAddon();
    return getCellarInfo({ ownerId: this._ownerId, cellarId: rawAddon.realId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @return {Promise<{ cellarInfo: CellarInfo }>}
   */
  async getAllCellarInfo() {
    const cellarInfo = await this._getCellarInfo();
    return { cellarInfo };
  }
}

// FIXME: remove and use the clever-client call from the new clever-client
/** @param {{ ownerId: string, cellarId: string }} params */
function getCellarInfo(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v4/cellar/organisations/${params.ownerId}/cellar/${params.cellarId}`,
    // no queryParams
    // no body
  });
}
