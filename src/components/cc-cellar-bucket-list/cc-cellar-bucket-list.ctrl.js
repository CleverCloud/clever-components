import { Abortable } from '../../lib/abortable.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { isStringEmpty, sortByProps } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import { isCellarExplorerErrorWithCode } from '../cc-cellar-explorer/cc-cellar-explorer.client.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcCellarBucketCreatedEvent } from './cc-cellar-bucket-list.events.js';
import './cc-cellar-bucket-list.js';

/**
 * @import { CcCellarBucketList } from './cc-cellar-bucket-list.js'
 * @import { CellarBucketListState, CellarBucketListStateLoaded, CellarBucketState, CellarBucketDetailsState, CellarBucketCreateFormState, CellarBucketSort } from './cc-cellar-bucket-list.types.js'
 * @import { CellarExplorerClient } from '../cc-cellar-explorer/cc-cellar-explorer.client.js'
 * @import { CellarBucket } from '../cc-cellar-explorer/cc-cellar-explorer.client.types.js'
 * @import { UpdateCallback } from '../common.types.js'
 * @import { OnEventCallback } from '../../lib/smart/smart-component.types.js'
 */

export class BucketsListController {
  /** @type {CellarExplorerClient} */
  #cellarClient;
  /** @type {() => CcCellarBucketList} */
  #getComponent;
  /** @type {UpdateCallback<CellarBucketListState>} */
  #updateState;
  /** @type {Array<CellarBucketState>} */
  #buckets;
  /** @type {CellarBucketSort} */
  #sort;
  /** @type {string} */
  #filter;
  /** @type {Abortable} */
  #abortable;

  /**
   * @param {CellarExplorerClient} cellarClient
   * @param {() => CcCellarBucketList} getComponent
   * @param {UpdateCallback<CellarBucketListState>} updateState
   */
  constructor(cellarClient, getComponent, updateState) {
    this.#cellarClient = cellarClient;
    this.#getComponent = getComponent;
    this.#updateState = updateState;
    this.#buckets = [];
    this.#sort = { column: 'name', direction: 'asc' };
    this.#filter = '';
    this.#abortable = new Abortable();
  }

  /**
   * @param {OnEventCallback} onEvent
   */
  init(onEvent) {
    this.initialFetch();

    onEvent('cc-cellar-bucket-create', (bucketName) => {
      this.createBucket(bucketName);
    });

    onEvent('cc-cellar-bucket-show', (bucketName) => {
      this.showBucketDetails(bucketName);
    });

    onEvent('cc-cellar-bucket-hide', () => {
      this.hideBucketDetails();
    });

    onEvent('cc-cellar-bucket-delete', (bucketName) => {
      this.deleteBucket(bucketName);
    });

    onEvent('cc-cellar-bucket-filter', (filter) => {
      this.filter(filter);
    });

    onEvent('cc-cellar-bucket-sort', (sort) => {
      this.sort(sort);
    });
  }

  abort() {
    this.#abortable.abort();
  }

  async initialFetch() {
    this.#updateState({ type: 'loading' });
    try {
      const response = await this.#abortable.run(() => this.#cellarClient.listBuckets());
      this.#buckets = response.buckets.map((bucket) => ({ state: 'idle', ...bucket }));
      this.#updateState({
        type: 'loaded',
        sort: this.#sort,
        filter: this.#filter,
        total: this.#buckets.length,
        buckets: this.#sortAndFilterItems(),
      });
    } catch (error) {
      console.log(error);
      this.#updateState({ type: 'error' });
    }
  }

  /**
   * @param {string} filter
   */
  filter(filter) {
    this.#filter = filter;
    this.#updateState(
      /** @param {CellarBucketListStateLoaded} state */ (state) => {
        state.filter = this.#filter;
        state.buckets = this.#sortAndFilterItems();
      },
    );
  }

  /**
   * @param {CellarBucketSort} sort
   */
  sort(sort) {
    this.#sort = sort;
    this.#updateState(
      /** @param {CellarBucketListStateLoaded} state */ (state) => {
        state.sort = this.#sort;
        state.buckets = this.#sortAndFilterItems();
      },
    );
  }

  /**
   * @param {string} bucketName
   */
  async createBucket(bucketName) {
    this.#updateCreateForm({ type: 'creating', bucketName, error: null });
    try {
      const bucket = await this.#cellarClient.createBucket({ name: bucketName, versioningEnabled: false });
      notifySuccess(i18n('cc-cellar-bucket-list.success.bucket-created', { bucketName: bucket.name }));
      this.#updateCreateForm(null);

      /** @type {CellarBucketState} */
      const newBucketState = { state: 'idle', ...bucket };
      this.#buckets.push(newBucketState);
      if (this.#matchFilter(newBucketState)) {
        this.#updateState(
          /** @param {CellarBucketListStateLoaded} state */ (state) => {
            state.total = state.total + 1;
            state.buckets = this.#sortAndFilterItems();
          },
        );
        this.#getComponent().dispatchEvent(new CcCellarBucketCreatedEvent(bucketName));
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
        notifyError(i18n('cc-cellar-bucket-list.error.bucket-creation-failed', { bucketName }));
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
      notifySuccess(i18n('cc-cellar-bucket-list.success.bucket-deleted', { bucketName }));
      this.#removeBucket(bucketName);
    } catch (error) {
      if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
        notifySuccess(i18n('cc-cellar-bucket-list.success.bucket-already-deleted', { bucketName }));
        this.#removeBucket(bucketName);
      } else {
        this.#updateBucketDetails({ state: 'idle' });
        if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-empty')) {
          notifyError(i18n('cc-cellar-bucket-list.error.bucket-not-empty', { bucketName }));
        } else {
          console.log(error);
          notifyError(i18n('cc-cellar-bucket-list.error.bucket-deletion-failed', { bucketName }));
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
    this.#updateBucketState(bucketName, { state: 'fetching' });
    try {
      const bucketDetails = await this.#abortable.run(() => this.#cellarClient.getBucket(bucketName));
      this.#updateState(
        /** @param {CellarBucketListStateLoaded} list */ (list) => {
          list.details = { state: 'idle', ...bucketDetails };
        },
      );
    } catch (error) {
      if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
        notifyError(i18n('cc-cellar-bucket-list.error.bucket-not-found', { bucketName }));
        this.#removeBucket(bucketName);
      } else {
        console.log(error);
        notifyError(i18n('cc-cellar-bucket-list.error.bucket-fetch-failed', { bucketName }));
      }
    } finally {
      this.#updateBucketState(bucketName, { state: 'idle' });
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
    this.#updateState(
      /** @param {CellarBucketListStateLoaded} state */ (state) => {
        state.total = state.total - 1;
        state.buckets = this.#sortAndFilterItems();
      },
    );
  }

  /**
   * @param {string} bucketName
   * @param {Partial<CellarBucketState>} newBucketState
   */
  #updateBucketState(bucketName, newBucketState) {
    this.#buckets = this.#buckets.map((bucket) =>
      bucket.name === bucketName ? { ...bucket, ...newBucketState } : bucket,
    );
    this.#updateState(
      /** @param {CellarBucketListStateLoaded} state */ (state) => {
        state.buckets = this.#sortAndFilterItems();
      },
    );
  }

  /**
   * @param {Partial<CellarBucketDetailsState>} newState
   */
  #updateBucketDetails(newState) {
    this.#updateState(
      /** @param {CellarBucketListStateLoaded} state */ (state) => {
        if (newState == null) {
          state.details = null;
        } else {
          state.details = { ...state.details, ...newState };
        }
      },
    );
  }

  /**
   * @param {Partial<CellarBucketCreateFormState|null>} newState
   */
  #updateCreateForm(newState) {
    this.#updateState(
      /** @param {CellarBucketListStateLoaded} state */ (state) => {
        if (newState == null) {
          state.createForm = null;
        } else {
          state.createForm = { ...state.createForm, ...newState };
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
