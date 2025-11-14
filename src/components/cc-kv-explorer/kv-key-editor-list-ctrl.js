import { KvKeyEditorCtrl } from './kv-key-editor-ctrl.js';
import { KvScanner } from './kv-scanner.js';

/**
 * @import { CcKvExplorer } from './cc-kv-explorer.js'
 * @import { CcKvExplorerDetailState, CcKvExplorerDetailStateEditList, CcKvKeyValueList } from './cc-kv-explorer.types.js'
 * @import { KvClient } from './kv-client.js'
 * @import { CcKvListElementState, CcKvListExplorerState, CcKvListExplorerStateLoading, CcKvListExplorerAddFormState } from '../cc-kv-list-explorer/cc-kv-list-explorer.types.js'
 * @import { Abortable } from './kv-utils.js'
 * @import { ObjectOrFunction } from '../common.types.js'
 */

/**
 * @extends {KvKeyEditorCtrl<CcKvExplorerDetailStateEditList>}
 */
export class KvKeyEditorListCtrl extends KvKeyEditorCtrl {
  /**
   * @param {string} keyName
   * @param {CcKvExplorer} component
   * @param {(stateUpdater: ObjectOrFunction<CcKvExplorerDetailState>) => void} updateDetailState
   * @param {KvClient} kvClient
   * @param {Abortable} abortable
   */
  constructor(keyName, component, updateDetailState, kvClient, abortable) {
    super(keyName, component, updateDetailState, kvClient);
    this._scanner = new KvListElementsScanner(keyName, kvClient, abortable);
  }

  /**
   * @return {'list'}
   */
  getType() {
    return 'list';
  }

  async load() {
    this._updateEditorState({ type: 'loading' });
    await this._scanner.loadMore();
    this._updateEditorState({
      type: 'loaded',
      elements: this._scanner.elements,
      addForm: { type: 'idle' },
    });
  }

  /**
   * @param {CcKvKeyValueList} keyValue
   */
  async create(keyValue) {
    await this._kvClient.createListKey(keyValue.name, keyValue.elements);

    this._scanner.update(keyValue.elements.map((value, index) => ({ index, value, type: 'idle' })));
    this._updateEditorState({
      type: 'loaded',
      elements: this._scanner.elements,
      addForm: { type: 'idle' },
    });
  }

  /**
   * @param {number} index
   */
  async filter(index) {
    this._updateEditorState((editor) => (editor.type = 'filtering'));

    try {
      this._scanner.setFilter({ index });
      await this._scanner.loadMore();
      this._updateEditor((editor) => {
        editor.type = 'loaded';
        editor.elements = this._scanner.elements;
      });
    } catch (e) {
      this._updateEditorState((editor) => (editor.type = 'loaded'));
      throw e;
    }
  }

  async loadMore() {
    this._updateEditorState((editor) => (editor.type = 'loading-more'));

    try {
      await this._scanner.loadMore();
      this._updateEditor((editor) => {
        editor.type = 'loaded';
        editor.elements = this._scanner.elements;
      });
    } catch (e) {
      this._updateEditorState((editor) => (editor.type = 'loaded'));
      throw e;
    }
  }

  /**
   * @param {number} index
   * @param {string} value
   */
  async updateElement(index, value) {
    this._updateEditorElementState(index, 'updating');

    try {
      await this._kvClient.updateListElement(this.keyName, index, value);
      this._scanner.update([{ type: 'idle', index, value }]);
      this._updateEditor((editor) => {
        editor.elements = this._scanner.elements;
      });
    } catch (e) {
      this._updateEditorElementState(index, 'editing');
      throw e;
    }
  }

  /**
   * @param {'head'|'tail'} position
   * @param {string} value
   * @return {Promise<number>}
   */
  async addElement(position, value) {
    this._updateAddForm({ type: 'adding' });

    try {
      const result = await this._kvClient.pushListElement(this.keyName, position, value);

      this.component.resetEditorForm();

      // re-fetch all elements
      this._scanner.reset();
      await this.load();

      return result.index;
    } catch (e) {
      this._updateAddForm({ type: 'idle' });
      throw e;
    }
  }

  /**
   * @param {number} index
   * @param {CcKvListElementState['type']} stateType
   */
  _updateEditorElementState(index, stateType) {
    const toUpdate = this._scanner.getElement(String(index));
    if (toUpdate != null) {
      this._scanner.update([{ ...toUpdate, type: stateType }]);
    }

    this._updateEditor((editor) => {
      editor.elements = this._scanner.elements;
    });
  }

  /**
   * @param {CcKvListExplorerAddFormState} addFormState
   */
  _updateAddForm(addFormState) {
    this._updateEditor((editorState) => {
      editorState.addForm = addFormState;
    });
  }

  /**
   * @param {(editorState: Exclude<CcKvListExplorerState, CcKvListExplorerStateLoading>) => void} updater
   */
  _updateEditor(updater) {
    this._updateEditorState(updater);
  }
}

/**
 * @extends {KvScanner<CcKvListElementState, {index?: number}>}
 */
export class KvListElementsScanner extends KvScanner {
  /**
   * @param {string} keyName
   * @param {KvClient} kvClient
   * @param {Abortable} abortable
   */
  constructor(keyName, kvClient, abortable) {
    super(abortable);
    this._kvClient = kvClient;
    this._keyName = keyName;
  }

  /**
   * @param {CcKvListElementState} item
   * @returns {string}
   */
  getId(item) {
    return String(item.index);
  }

  /**
   * @param {CcKvListElementState} item
   * @returns {boolean}
   */
  matchFilter(item) {
    return this._filter?.index == null || item.index === this._filter.index;
  }

  /**
   * @param {number} count
   * @param {AbortSignal} [signal]
   * @return {Promise<{cursor: number, total: number, elements: Array<CcKvListElementState>}>}
   */
  async fetch(count, signal) {
    // no filtering
    if (this._filter?.index == null) {
      const r = await this._kvClient.scanList(this._keyName, signal, { cursor: this._cursor, count, match: null });
      return {
        cursor: r.cursor,
        total: r.total,
        elements: r.elements.map((e) => ({ ...e, type: 'idle' })),
      };
    }

    // bad filter
    if (isNaN(this._filter.index)) {
      return emptyScanResult();
    }

    // filtering by index is like getting item at the given index
    try {
      const element = await this._kvClient.getListElementAt(this._keyName, this._filter.index, signal);

      if (element.value == null) {
        return emptyScanResult();
      }

      return {
        cursor: 0,
        total: 0,
        elements: [{ type: 'idle', index: element.index, value: element.value }],
      };
    } catch (e) {
      const err = /** @type {any} */ (e);
      if (err?.responseBody?.code === 'clever.redis-http.list-element-not-found') {
        return emptyScanResult();
      }
      throw e;
    }
  }
}

/**
 * @returns {{cursor: number, total: number, elements: Array<CcKvListElementState>}}
 */
function emptyScanResult() {
  return {
    cursor: 0,
    total: 0,
    elements: [],
  };
}
