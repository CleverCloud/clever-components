import { Abortable } from '../../lib/abortable.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { isCellarExplorerErrorWithCode } from '../cc-cellar-explorer/cc-cellar-explorer.client.js';
import '../cc-smart-container/cc-smart-container.js';
import { CcCellarNavigateToHomeEvent } from './cc-cellar-object-list.events.js';
import './cc-cellar-object-list.js';

/**
 * @import { CcCellarObjectList } from './cc-cellar-object-list.js'
 * @import { CellarObjectListState, CellarObjectListStateLoaded, CellarObjectState, CellarFileState, CellarFileDetailsState } from './cc-cellar-object-list.types.js'
 * @import { CellarExplorerClient } from '../cc-cellar-explorer/cc-cellar-explorer.client.js'
 * @import { UpdateCallback } from '../common.types.js'
 * @import { OnEventCallback } from '../../lib/smart/smart-component.types.js'
 */

export class ObjectListController {
  /** @type {CellarExplorerClient} */
  #cellarClient;
  /** @type {() => CcCellarObjectList} */
  #getComponent;
  /** @type {UpdateCallback<CellarObjectListState>} */
  #updateState;
  /** @type {string} */
  #bucketName;
  /** @type {Array<string>} */
  #path;
  /** @type {Array<CellarObjectState>} */
  #objects;
  /** @type {string} */
  #filter;
  /** @type {string|null} */
  #nextCursor;
  /** @type {string|null} */
  #currentCursor;
  /** @type {Array<string>} */
  #previousPages = [];
  /** @type {Abortable} */
  #abortable;
  /** @type {NodeJS.Timeout} */
  #signedUrlInterval;

  /**
   * @param {CellarExplorerClient} cellarClient
   * @param {() => CcCellarObjectList} getComponent
   * @param {UpdateCallback<CellarObjectListState>} updateState
   */
  constructor(cellarClient, getComponent, updateState) {
    this.#cellarClient = cellarClient;
    this.#getComponent = getComponent;
    this.#updateState = updateState;
    this.#objects = [];
    this.#filter = '';
    this.#path = [];
    this.#abortable = new Abortable();
  }

  /**
   * @param {OnEventCallback} onEvent
   */
  init(onEvent) {
    onEvent('cc-cellar-object-filter', (filter) => {
      this.filter(filter);
    });

    onEvent('cc-cellar-navigate-to-path', (path) => {
      this.navigateTo(path);
    });

    onEvent('cc-cellar-navigate-to-previous-page', () => {
      this.previousPage();
    });

    onEvent('cc-cellar-navigate-to-next-page', () => {
      this.nextPage();
    });

    onEvent('cc-cellar-object-show', (objectKey) => {
      this.showDetails(objectKey);
    });

    onEvent('cc-cellar-object-hide', () => {
      this.hideDetails();
    });

    onEvent('cc-cellar-object-delete', (objectKey) => {
      this.deleteObject(objectKey);
    });
  }

  abort() {
    this.#clearSignedUrlInterval();
    this.#abortable.abort();
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  async changeBucket(bucketName) {
    this.#bucketName = bucketName;
    this.#path = [];
    this.#nextCursor = null;
    this.#currentCursor = null;
    this.#previousPages = [];

    this.#updateState({ type: 'loading', bucketName: this.#bucketName, path: this.#path });
    await this.#fetchObjects();
  }

  /**
   * @param {string} filter
   */
  async filter(filter) {
    this.#filter = filter;
    this.#nextCursor = null;
    this.#currentCursor = null;
    this.#previousPages = [];
    this.#updateState({ type: 'filtering', bucketName: this.#bucketName, path: this.#path, filter: this.#filter });

    await this.#fetchObjects();
  }

  /**
   * @param {Array<string>} path
   */
  async navigateTo(path) {
    this.#path = path;

    this.#updateState({ type: 'loading', bucketName: this.#bucketName, path: this.#path });
    await this.#fetchObjects();
  }

  async previousPage() {
    if (this.#previousPages.length === 0) {
      return;
    }
    this.#currentCursor = this.#previousPages.pop();

    this.#updateState({ type: 'loading', bucketName: this.#bucketName, path: this.#path });
    await this.#fetchObjects();
  }

  async nextPage() {
    if (this.#nextCursor == null) {
      return;
    }

    this.#previousPages.push(this.#currentCursor);
    this.#currentCursor = this.#nextCursor;

    this.#updateState({ type: 'loading', bucketName: this.#bucketName, path: this.#path });
    await this.#fetchObjects();
  }

  /**
   * @param {string} objectKey
   */
  async showDetails(objectKey) {
    this.#updateFileState(objectKey, { state: 'fetching' });
    try {
      const bucketDetails = await this.#cellarClient.getObject(this.#bucketName, objectKey);

      const refreshSignedUrl = async () => {
        const signedUrl = await this.#cellarClient.getObjectSignedUrl(this.#bucketName, objectKey, 30);
        this.#updateState(
          /** @param {CellarObjectListStateLoaded} state */ (state) => {
            state.details = { state: 'idle', ...bucketDetails, signedUrl: signedUrl.url };
          },
        );
      };

      await refreshSignedUrl();
      this.#signedUrlInterval = setInterval(refreshSignedUrl, 20_000);
    } catch (error) {
      this.#handleErrorOnObject({
        error,
        objectKey,
        orElse: () => notifyError(i18n('cc-cellar-object-list.error.object-fetch-failed', { objectKey })),
      });
    } finally {
      this.#updateFileState(objectKey, { state: 'idle' });
    }
  }

  hideDetails() {
    this.#clearSignedUrlInterval();
    this.#updateDetails(null);
  }

  /**
   * @param {string} objectKey
   * @returns {Promise<void>}
   */
  async deleteObject(objectKey) {
    this.#updateDetails({ state: 'deleting' });

    try {
      await this.#cellarClient.deleteObject(this.#bucketName, objectKey);
      notifySuccess(i18n('cc-cellar-object-list.success.object-deleted', { objectKey }));
      this.#removeObject(objectKey);
    } catch (error) {
      this.#handleErrorOnObject({
        error,
        objectKey,
        orElse: () => notifyError(i18n('cc-cellar-object-list.error.object-deletion-failed', { objectKey })),
        deleteMode: true,
      });
    } finally {
      // in any case, we need to hide the details to make the toast visible
      this.hideDetails();
    }
  }

  async #fetchObjects() {
    try {
      const response = await this.#abortable.run(() =>
        this.#cellarClient.listObjects(this.#bucketName, this.#path, {
          cursor: this.#currentCursor,
          filter: this.#filter,
        }),
      );
      this.#objects = response.content.map((object) => ({ state: 'idle', ...object }));
      this.#nextCursor = response.cursor;
      this.#updateState({
        type: 'loaded',
        bucketName: this.#bucketName,
        path: this.#path,
        filter: this.#filter,
        objects: this.#objects,
        hasNext: this.#nextCursor != null,
        hasPrevious: this.#currentCursor != null,
      });
      this.#getComponent().focusFirstCell();
    } catch (error) {
      console.log(error);
      this.#updateState({ type: 'error', bucketName: this.#bucketName, path: this.#path });
    }
  }

  /**
   * @param {string} objectKey
   */
  #removeObject(objectKey) {
    this.#objects = this.#objects.filter((object) => object.key !== objectKey);
    this.#updateState(
      /** @param {CellarObjectListStateLoaded} state */ (state) => {
        state.objects = this.#objects;
      },
    );
  }

  /**
   * @param {string} key
   * @param {Partial<CellarFileState>} newState
   */
  #updateFileState(key, newState) {
    this.#objects = this.#objects.map((object) =>
      object.key === key && object.type === 'file' ? { ...object, ...newState } : object,
    );
    this.#updateState(
      /** @param {CellarObjectListStateLoaded} state */ (state) => {
        state.objects = this.#objects;
      },
    );
  }

  /**
   * @param {Partial<CellarFileDetailsState>} newState
   */
  #updateDetails(newState) {
    this.#updateState(
      /** @param {CellarObjectListStateLoaded} state */ (state) => {
        if (newState == null) {
          state.details = null;
        } else {
          state.details = { ...state.details, ...newState };
        }
      },
    );
  }

  /**
   * @param {object} params
   * @param {unknown} params.error
   * @param {string} params.objectKey
   * @param {function} params.orElse
   * @param {boolean} [params.deleteMode]
   */
  #handleErrorOnObject({ error, objectKey, orElse, deleteMode = false }) {
    if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.bucket-not-found')) {
      notifyError(i18n('cc-cellar-object-list.error.bucket-not-found', { bucketName: this.#bucketName }));
      this.#getComponent().dispatchEvent(new CcCellarNavigateToHomeEvent());
    } else if (isCellarExplorerErrorWithCode(error, 'clever.file-explorer-proxy.cellar.object-not-found')) {
      if (deleteMode) {
        notifySuccess(i18n('cc-cellar-object-list.success.object-already-deleted', { objectKey }));
      } else {
        notifyError(i18n('cc-cellar-object-list.error.object-not-found', { objectKey }));
      }
      this.#removeObject(objectKey);
    } else {
      console.log(error);
      orElse();
    }
  }

  #clearSignedUrlInterval() {
    if (this.#signedUrlInterval != null) {
      clearInterval(this.#signedUrlInterval);
      this.#signedUrlInterval = null;
    }
  }
}
