import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-cellar-explorer.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { isStringEmpty, sortByProps } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import { CellarExplorerClient, isCellarExplorerErrorWithCode } from './cc-cellar-explorer.client.js';

/**
 * @import { CcCellarExplorer } from './cc-cellar-explorer.js'
 * @import { CellarEndpoint, CellarBucket, CellarBucketState, CellarBucketDetailsState, CellarExplorerStateLoaded, CellarExplorerBucketsListState, CellarExplorerBucketsListStateLoaded, CellarBucketCreateFormState, CellarBucketSort } from './cc-cellar-explorer.types.js'
 * @import { EnvVar } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.js'
 * @import { OnContextUpdateArgs, UpdateComponentCallback } from '../../lib/smart/smart-component.types.js'
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
        const cellarClient = new CellarExplorerClient(cellarProxyUrl, cellarEndpoint, signal);
        const bucketsListController = new BucketsListController(cellarClient, component, updateComponent);
        bucketsListController.initialFetch();

        onEvent('cc-cellar-bucket-create', ({ bucketName }) => {
          bucketsListController.createBucket(bucketName);
        });

        onEvent('cc-cellar-bucket-show', (bucketName) => {
          bucketsListController.showBucketDetails(bucketName);
        });

        onEvent('cc-cellar-bucket-hide', () => {
          bucketsListController.hideBucketDetails();
        });

        onEvent('cc-cellar-bucket-delete', (bucketName) => {
          bucketsListController.deleteBucket(bucketName);
        });

        onEvent('cc-cellar-bucket-filter', (filter) => {
          bucketsListController.filter(filter);
        });

        onEvent('cc-cellar-bucket-sort', (sort) => {
          bucketsListController.sort(sort);
        });
      })
      .catch((error) => {
        console.log(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

class BucketsListController {
  /** @type {CellarExplorerClient} */
  #cellarClient;
  /** @type {CcCellarExplorer} */
  #component;
  /** @type {UpdateComponentCallback<CcCellarExplorer>} */
  #updateComponent;
  /** @type {Array<CellarBucketState>} */
  #buckets;
  /** @type {CellarBucketSort} */
  #sort;
  /** @type {string} */
  #filter;

  /**
   * @param {CellarExplorerClient} cellarClient
   * @param {CcCellarExplorer} component
   * @param {UpdateComponentCallback<CcCellarExplorer>} updateComponent
   */
  constructor(cellarClient, component, updateComponent) {
    this.#cellarClient = cellarClient;
    this.#component = component;
    this.#updateComponent = updateComponent;
    this.#buckets = [];
    this.#sort = { column: 'name', direction: 'asc' };
    this.#filter = '';
  }

  async initialFetch() {
    this.#updateComponent('state', { type: 'loaded', list: { type: 'loading', level: 'buckets' } });
    try {
      const bucketsListResponse = await this.#cellarClient.listBuckets();
      this.#buckets = bucketsListResponse.buckets.map((bucket) => ({ state: 'idle', type: 'bucket', ...bucket }));
      this.#updateState({
        type: 'loaded',
        level: 'buckets',
        sort: this.#sort,
        filter: this.#filter,
        total: this.#buckets.length,
        items: this.#sortAndFilterItems(),
      });
    } catch (error) {
      console.log(error);
      this.#updateState({ type: 'error', level: 'buckets' });
    }
  }

  /**
   * @param {string} filter
   */
  filter(filter) {
    this.#filter = filter;
    this.#updateBucketsList();
  }

  /**
   * @param {CellarBucketSort} sort
   */
  sort(sort) {
    this.#sort = sort;
    this.#updateBucketsList();
  }

  /**
   * @param {string} bucketName
   */
  async createBucket(bucketName) {
    this.#updateCreateForm({ type: 'creating', bucketName });
    try {
      const bucket = await this.#cellarClient.createBucket({ name: bucketName, versioningEnabled: false });
      notifySuccess(i18n('cc-cellar-explorer.success.bucket-created', { bucketName: bucket.name }));
      this.#updateCreateForm(null);

      /** @type {CellarBucketState} */
      const newBucketState = { state: 'idle', type: 'bucket', ...bucket };
      this.#buckets.push(newBucketState);
      if (this.#matchFilter(newBucketState)) {
        this.#updateBucketsList();
        this.#component.scrollToBucket(newBucketState);
      }
    } catch (error) {
      if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-already-exists')) {
        this.#updateCreateForm({ type: 'idle', error: 'bucket-already-exists' });
      } else if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-name-invalid')) {
        this.#updateCreateForm({ type: 'idle', error: 'bucket-name-invalid' });
      } else if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.too-many-buckets')) {
        this.#updateCreateForm({ type: 'idle', error: 'too-many-buckets' });
      } else {
        console.log(error);
        notifyError(i18n('cc-cellar-explorer.error.bucket-creation-failed', { bucketName }));
        this.#updateCreateForm(null);
      }
    }
  }

  /**
   * @param {string} bucketName
   */
  async deleteBucket(bucketName) {
    this.#updateBucketDetails({ state: 'deleting' });

    try {
      await this.#cellarClient.deleteBucket(bucketName);
      notifySuccess(i18n('cc-cellar-explorer.success.bucket-deleted', { bucketName }));
      this.#removeBucket(bucketName);
    } catch (error) {
      if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
        notifySuccess(i18n('cc-cellar-explorer.success.bucket-already-deleted', { bucketName }));
        this.#removeBucket(bucketName);
      } else {
        this.#updateBucketDetails({ state: 'idle' });
        if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-empty')) {
          notifyError(i18n('cc-cellar-explorer.error.bucket-not-empty', { bucketName }));
        } else {
          console.log(error);
          notifyError(i18n('cc-cellar-explorer.error.bucket-deletion-failed', { bucketName }));
        }
      }
    } finally {
      // in any case, we need to hide the details to make the toast visible
      this.hideBucketDetails();
    }
  }

  /**
   * @param {string} bucketName
   */
  async showBucketDetails(bucketName) {
    this.#updateBucket(bucketName, { state: 'fetching' });
    try {
      const bucketDetails = await this.#cellarClient.getBucket(bucketName);
      this.#updateState(
        /** @param {CellarExplorerBucketsListStateLoaded} list */ (list) => {
          list.details = { state: 'idle', ...bucketDetails };
        },
      );
    } catch (error) {
      if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
        notifyError(i18n('cc-cellar-explorer.error.bucket-not-found', { bucketName }));
        this.#removeBucket(bucketName);
      } else {
        console.log(error);
        notifyError(i18n('cc-cellar-explorer.error.bucket-fetch-failed', { bucketName }));
      }
    } finally {
      this.#updateBucket(bucketName, { state: 'idle' });
    }
  }

  hideBucketDetails() {
    this.#updateBucketDetails(null);
  }

  /**
   * @param {string} bucketName
   */
  #removeBucket(bucketName) {
    this.#buckets = this.#buckets.filter((bucket) => bucket.name !== bucketName);
    this.#updateBucketsList();
  }

  /**
   * @param {T|((list: T) => void|CellarExplorerBucketsListState)} newState
   * @template {CellarExplorerBucketsListState} T
   */
  #updateState(newState) {
    this.#updateComponent(
      'state',
      /** @param {CellarExplorerStateLoaded} state */ (state) => {
        if (typeof newState === 'function') {
          const result = newState(/** @type T*/ (state.list));
          if (result != null && typeof result === 'object') {
            state.list = result;
          }
        } else {
          state.list = newState;
        }
      },
    );
  }

  #updateBucketsList() {
    this.#updateState(
      /** @param {CellarExplorerBucketsListStateLoaded} list */ (list) => {
        list.sort = this.#sort;
        list.filter = this.#filter;
        list.items = this.#sortAndFilterItems();
      },
    );
  }

  /**
   * @param {string} bucketName
   * @param {Partial<CellarBucketState>} newBucketState
   */
  #updateBucket(bucketName, newBucketState) {
    this.#buckets = this.#buckets.map((bucket) =>
      bucket.name === bucketName ? { ...bucket, ...newBucketState } : bucket,
    );
    this.#updateBucketsList();
  }

  /**
   * @param {Partial<CellarBucketDetailsState>} newState
   */
  #updateBucketDetails(newState) {
    this.#updateState(
      /** @param {CellarExplorerBucketsListStateLoaded} list */ (list) => {
        if (newState == null) {
          list.details = null;
        } else {
          list.details = { ...list.details, ...newState };
        }
      },
    );
  }

  /**
   * @param {Partial<CellarBucketCreateFormState|null>} newState
   */
  #updateCreateForm(newState) {
    this.#updateState(
      /** @param {CellarExplorerBucketsListStateLoaded} list */ (list) => {
        if (newState == null) {
          list.createForm = null;
        } else {
          list.createForm = { ...list.createForm, ...newState };
        }
      },
    );
  }

  /**
   * @returns {Array<CellarBucketState>}
   */
  #sortAndFilterItems() {
    return this.#buckets
      .filter((item) => this.#matchFilter(item))
      .sort(
        sortByProps([
          [this.#sort.column, this.#sort.direction],
          ['name', 'asc'],
        ]),
      );
  }

  /**
   * @param {CellarBucket} bucket
   */
  #matchFilter(bucket) {
    return isStringEmpty(this.#filter) || bucket.name.toLowerCase().includes(this.#filter.toLowerCase());
  }
}

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
