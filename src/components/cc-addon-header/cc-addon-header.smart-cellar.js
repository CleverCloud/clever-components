import { ONE_SECOND } from '@clevercloud/client/esm/with-cache.js';
import { fakeString } from '../../lib/fake-strings.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcAddonHeaderClient } from './cc-addon-header.client.js';
import './cc-addon-header.js';

const PROVIDER_ID = 'cellar-addon';

/**
 * @import { CcAddonHeader } from './cc-addon-header.js'
 * @import { CellarInfo } from './cc-addon-header.types.js'
 * @import { RawAddon } from './cc-addon-header.types.js'
 * @import { ZoneStateLoaded } from '../cc-zone/cc-zone.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-addon-header[smart-mode="cellar"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
    cellarId: { type: String },
    explorerUrlPattern: { type: String },
  },

  /** @param {OnContextUpdateArgs<CcAddonHeader>} args */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, addonId, cellarId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });
    let explorerUrl = '';
    updateComponent('state', {
      type: 'loading',
      logsUrl: fakeString(15),
      openLinks: [
        {
          url: fakeString(15),
          name: fakeString(5),
        },
      ],
    });

    api
      .getCellarInfoWithZone(ownerId, cellarId)
      .then(({ cellarInfo, rawAddon, zone }) => {
        // TODO: Cellar Explorer link
        explorerUrl = context.explorerUrlPattern.replace(':id', addonId);
        updateComponent('state', {
          type: 'loaded',
          providerId: rawAddon.provider.name,
          providerLogoUrl: rawAddon.provider.logoUrl,
          name: cellarInfo.name,
          id: cellarInfo.resourceId,
          zone,
          openLinks: [
            {
              name: 'CELLAR EXPLORER',
              url: explorerUrl,
            },
          ],
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', {
          type: 'error',
        });
      });
  },
});

class Api extends CcAddonHeaderClient {
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
   * @param {string} ownerId
   * @param {string} cellarId
   * @return {Promise<CellarInfo>}
   */
  _getCellarInfo(ownerId, cellarId) {
    return getCellarInfo({ ownerId, cellarId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal, cacheDelay: ONE_SECOND }),
    );
  }

  /**
   * @param {string} ownerId
   * @param {string} cellarId
   * @return {Promise<{ cellarInfo: CellarInfo, rawAddon: RawAddon, zone: ZoneStateLoaded }>}
   */
  async getCellarInfoWithZone(ownerId, cellarId) {
    const cellarInfo = await this._getCellarInfo(ownerId, cellarId);
    const rawAddon = await this.getAddon();
    const zone = await this.getZone(rawAddon.region);

    return { cellarInfo, rawAddon, zone };
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
