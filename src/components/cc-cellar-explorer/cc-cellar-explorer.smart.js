import { getAllEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { BucketsListController } from '../cc-cellar-bucket-list/cc-cellar-bucket-list.ctrl.js';
import { CellarExplorerClient } from './cc-cellar-explorer.client.js';
import './cc-cellar-explorer.js';

/**
 * @import { CcCellarExplorer } from './cc-cellar-explorer.js'
 * @import { CellarExplorerStateLoaded } from './cc-cellar-explorer.types.js'
 * @import { CellarEndpoint } from './cc-cellar-explorer.client.types.js'
 * @import { CcCellarBucketList } from '../cc-cellar-bucket-list/cc-cellar-bucket-list.js'
 * @import { CellarBucketListState } from '../cc-cellar-bucket-list/cc-cellar-bucket-list.types.js'
 * @import { EnvVar } from '../common.types.js'
 * @import { UpdateCallback } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-cellar-explorer-beta',
  params: {
    apiConfig: { type: Object },
    cellarProxyUrl: { type: String },
    ownerId: { type: String },
    addonId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcCellarExplorer>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, cellarProxyUrl, ownerId, addonId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', { type: 'loading' });

    api
      .getCellarEndpoint()
      .then((cellarEndpoint) => {
        updateComponent('state', { type: 'loaded', level: { type: 'buckets', state: { type: 'loading' } } });

        const cellarClient = new CellarExplorerClient(cellarProxyUrl, cellarEndpoint, signal);

        /** @type {() => CcCellarBucketList} */
        const getComponent = () => component.shadowRoot.querySelector('cc-cellar-bucket-list-beta');
        /** @type {UpdateCallback<CellarBucketListState>} */
        const updateBucketComponent = (newState) => {
          updateComponent(
            'state',
            /** @param {CellarExplorerStateLoaded} state*/ (state) => {
              if (state.level.type === 'buckets') {
                if (typeof newState === 'function') {
                  const result = newState(/** @type {any} */ (state.level.state));
                  if (result != null && typeof result === 'object') {
                    state.level.state = result;
                  }
                } else {
                  state.level.state = newState;
                }
              }
            },
          );
        };

        const bucketsListController = new BucketsListController(cellarClient, getComponent, updateBucketComponent);
        bucketsListController.init(onEvent);

        onEvent('cc-cellar-bucket-created', (bucketName) => {
          component.scrollToBucket(bucketName);
        });
      })
      .catch((error) => {
        console.log(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class Api {
  /**
   * @param {object} _
   * @param {ApiConfig} _.apiConfig
   * @param {string} _.ownerId
   * @param {string} _.addonId
   * @param {AbortSignal} _.signal
   */
  constructor({ apiConfig, ownerId, addonId, signal }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._signal = signal;
  }

  /**
   * @returns {Promise<CellarEndpoint>}
   */
  async getCellarEndpoint() {
    /** @type {Array<EnvVar>} */
    const envVars = await getAllEnvVars({ id: this._ownerId, addonId: this._addonId }).then(
      sendToApi({ apiConfig: this._apiConfig, signal: this._signal }),
    );

    return {
      host: envVars.find((envVar) => envVar.name === 'CELLAR_ADDON_HOST')?.value,
      accessKeyId: envVars.find((envVar) => envVar.name === 'CELLAR_ADDON_KEY_ID')?.value,
      secretAccessKey: envVars.find((envVar) => envVar.name === 'CELLAR_ADDON_KEY_SECRET')?.value,
    };
  }
}
