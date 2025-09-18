import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-cellar-explorer.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { CellarExplorerClient, isCellarExplorerErrorWithCode } from './cc-cellar-explorer.client.js';

/**
 * @typedef {import('./cc-cellar-explorer.js').CcCellarExplorer} CcCellarExplorer
 * @typedef {import('./cc-cellar-explorer.types.js').CellarEndpoint} CellarEndpoint
 * @typedef {import('./cc-cellar-explorer.types.js').CellarItemStateBucket} CellarItemStateBucket
 * @typedef {import('./cc-cellar-explorer.types.js').CellarBucketStateType} CellarBucketStateType
 * @typedef {import('./cc-cellar-explorer.types.js').CellarExplorerStateLoaded} CellarExplorerStateLoaded
 * @typedef {import('./cc-cellar-explorer.types.js').CellarExplorerItemsListStateBucketsLoaded} CellarExplorerItemsListStateBucketsLoaded
 * @typedef {import('../common.types.js').EnvVar} EnvVar
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcCellarExplorer>} OnContextUpdateArgs
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
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, onEvent, updateComponent, signal }) {
    const { apiConfig, cellarProxyUrl, ownerId, addonId } = context;
    const api = new Api({ apiConfig, ownerId, addonId, signal });

    updateComponent('state', { type: 'loading' });

    api
      .getCellarEndpoint()
      .then((cellarEndpoint) => {
        const cellarClient = new CellarExplorerClient(cellarProxyUrl, cellarEndpoint, signal);

        function refreshBuckets() {
          updateComponent('state', { type: 'loaded', list: { type: 'loading', level: 'buckets' } });

          cellarClient
            .listBuckets()
            .then((bucketsListResponse) => {
              updateComponent('state', {
                type: 'loaded',
                list: {
                  type: 'loaded',
                  level: 'buckets',
                  items: bucketsListResponse.buckets.map((bucket) => ({ state: 'idle', type: 'bucket', ...bucket })),
                },
              });
            })
            .catch((error) => {
              console.log(error);
              updateComponent('state', { type: 'loaded', list: { type: 'error', level: 'buckets' } });
            });
        }

        /**
         * @param {string} bucketName
         * @param {Partial<CellarItemStateBucket>} newBucketState
         */
        function updateBucket(bucketName, newBucketState) {
          updateComponent(
            'state',
            /** @param {CellarExplorerStateLoaded} state */ (state) => {
              if (state.list.type === 'loaded' && state.list.level === 'buckets') {
                state.list.items = state.list.items.map((item) => {
                  if (item.name === bucketName && item.type === 'bucket') {
                    return { ...item, ...newBucketState };
                  }
                  return item;
                });
              }
            },
          );
        }

        refreshBuckets();

        onEvent('cc-cellar-bucket-create', ({ bucketName }) => {
          cellarClient
            .createBucket({ name: bucketName, versioningEnabled: false })
            .then((bucket) => {
              notifySuccess(`Bucket ${bucket.name} created successfully`);
              refreshBuckets();
            })
            .catch((error) => {
              if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-already-exists')) {
                // todo: replace toast by error message displayed under the bucket name input
                notifyError(`Bucket ${bucketName} already exists`);
                return;
              }
              if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-name-invalid')) {
                // todo: replace toast by error message displayed under the bucket name input
                notifyError(
                  `Bucket name ${bucketName} is invalid. It must be between 3 and 63 characters long and contain only lowercase letters, numbers, dashes and underscores.`,
                );
                return;
              }
              if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.too-many-buckets')) {
                notifyError(
                  `You reached the maximum number of buckets allowed. Please delete some buckets to create a new one.`,
                );
                return;
              }
              console.log(error);
              notifyError(`Bucket ${bucketName} creation failed`);
            });
        });

        onEvent('cc-cellar-bucket-show', (bucketName) => {
          updateBucket(bucketName, { state: 'showing' });
          cellarClient
            .getBucket(bucketName)
            .then((bucket) => {
              updateBucket(bucketName, { state: 'shown', ...bucket });
            })
            .catch((error) => {
              if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
                notifyError(`Bucket ${bucketName} does not exist.`);
                refreshBuckets();
                return;
              }
              updateBucket(bucketName, { state: 'idle' });
              console.log(error);
              notifyError(`Failed to get bucket ${bucketName}`);
            });
        });

        onEvent('cc-cellar-bucket-hide', (bucketName) => {
          updateBucket(bucketName, { state: 'idle' });
        });

        onEvent('cc-cellar-bucket-delete', (bucketName) => {
          updateBucket(bucketName, { state: 'deleting' });
          cellarClient
            .deleteBucket(bucketName)
            .then(() => {
              notifySuccess(`Bucket ${bucketName} deleted successfully`);
              refreshBuckets();
            })
            .catch((error) => {
              if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
                notifySuccess(`Bucket ${bucketName} was already deleted`);
                refreshBuckets();
                return;
              }
              updateBucket(bucketName, { state: 'shown' });

              if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-empty')) {
                notifyError(`Bucket ${bucketName} cannot be deleted because it is not empty`);
                return;
              }
              console.log(error);
              notifyError(`Failed to delete bucket ${bucketName}`);
            });
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
