import '../cc-smart-container/cc-smart-container.js';
import './cc-cellar-object-list.js';

/**
 * @import { CellarObjectListState, CellarObjectState } from './cc-cellar-object-list.types.js'
 * @import { CellarExplorerClient } from '../cc-cellar-explorer/cc-cellar-explorer.client.js'
 * @import { UpdateCallback } from '../common.types.js'
 * @import { OnEventCallback } from '../../lib/smart/smart-component.types.js'
 */

export class ObjectListController {
  /** @type {CellarExplorerClient} */
  #cellarClient;
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

  /**
   * @param {CellarExplorerClient} cellarClient
   * @param {UpdateCallback<CellarObjectListState>} updateState
   */
  constructor(cellarClient, updateState) {
    this.#cellarClient = cellarClient;
    this.#updateState = updateState;
    this.#objects = [];
    this.#filter = '';
    this.#path = [];
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

  async #fetchObjects() {
    try {
      const response = await this.#cellarClient.listObjects(this.#bucketName, this.#path, {
        cursor: this.#currentCursor,
        filter: this.#filter,
      });
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
    } catch (error) {
      console.log(error);
      this.#updateState({ type: 'error', bucketName: this.#bucketName, path: this.#path });
    }
  }
}
