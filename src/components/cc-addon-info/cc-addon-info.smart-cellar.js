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
    cellarId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonInfo>} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, cellarId } = context;

    const api = new Api({ apiConfig, ownerId, addonId, signal }, cellarId);

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
      .then(({ cellarInfo, mockedCellarInfo }) => {
        updateComponent('state', {
          type: 'loaded',
          creationDate: cellarInfo.creationDate,
          totalContent: {
            buckets: mockedCellarInfo.totalContent.buckets,
            objects: mockedCellarInfo.totalContent.objects,
          },
          traffic: {
            inbound: mockedCellarInfo.traffic.inbound,
            outbound: mockedCellarInfo.traffic.outbound,
          },
          usedSpaces: {
            size: mockedCellarInfo.usedSpace.size,
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
   * @param {string} cellarId - Cellar identifier
   */
  constructor({ apiConfig, ownerId, addonId, signal }, cellarId) {
    super({ apiConfig, ownerId, addonId, providerId: PROVIDER_ID, signal });
    this._cellarId = cellarId;
  }

  /**
   * @return {Promise<CellarInfo>}
   */
  _getCellarInfo() {
    return getCellarInfo({ ownerId: this._ownerId, cellarId: this._cellarId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  // TODO: replace with right call when API available
  _getMockedCellarInfo() {
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

  /**
   * @return {Promise<{ cellarInfo: CellarInfo, mockedCellarInfo: any }>}
   */
  async getAllCellarInfo() {
    const cellarInfo = await this._getCellarInfo();
    const mockedCellarInfo = await this._getMockedCellarInfo();

    return { cellarInfo, mockedCellarInfo };
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
