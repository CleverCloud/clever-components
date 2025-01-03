import { isStringEmpty } from '../../lib/utils.js';
import { KvScanner } from './kv-scanner.js';
import { matchKvPattern } from './kv-utils.js';

/**
 * @typedef {import('./cc-kv-explorer.js').CcKvExplorer} CcKvExplorer
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerDetailStateEditHash} CcKvExplorerDetailStateEditHash
 * @typedef {import('./cc-kv-explorer.types.js').CcKvKey} CcKvKey
 * @typedef {import('./kv-client.js').KvClient} KvClient
 * @typedef {import('../cc-kv-hash-explorer/cc-kv-hash-explorer.types.js').CcKvHashExplorerStateLoaded} CcKvHashExplorerStateLoaded
 * @typedef {import('../cc-kv-hash-explorer/cc-kv-hash-explorer.types.js').CcKvHashElementState} CcKvHashElementState
 * @typedef {import('../cc-kv-hash-explorer/cc-kv-hash-explorer.types.js').CcKvHashExplorerState} CcKvHashExplorerState
 * @typedef {import('../cc-kv-hash-explorer/cc-kv-hash-explorer.types.js').CcKvHashExplorerAddFormState} CcKvHashExplorerAddFormState
 */

/**
 * Controller for `hash` data type
 */
export class KvHashKeyController {
  /**
   * @param {CcKvExplorer} component
   * @param {function} updateComponent
   * @param {KvHashElementsScanner} scanner
   */
  constructor(component, updateComponent, scanner) {
    this.component = component;
    this.updateComponent = updateComponent;
    this.scanner = scanner;
  }

  /**
   * @param {CcKvExplorerDetailStateEditHash|((detailState: CcKvExplorerDetailStateEditHash) => void)} updater
   */
  updateDetailState(updater) {
    this.updateComponent('detailState', updater);
  }

  /**
   * @param {CcKvHashExplorerState|((editor: CcKvHashExplorerState) => void)} updater
   */
  updateEditor(updater) {
    this.updateDetailState((detailState) => {
      if (typeof updater === 'function') {
        updater(detailState.editor);
      } else {
        detailState.editor = updater;
      }
    });
  }

  /**
   * @param {Array<CcKvHashElementState>} elements
   */
  updateEditorElements(elements) {
    this.updateEditor((editor) => {
      if (editor.type === 'loading') {
        return;
      }
      editor.elements = elements;
    });
  }

  /**
   * @param {string} field
   * @param {CcKvHashElementState['type']} stateType
   */
  updateEditorElementState(field, stateType) {
    /** @type {CcKvHashElementState} */
    let toUpdate;

    this.updateEditor((e) => {
      const editor = /** @type {CcKvHashExplorerStateLoaded} */ (e);
      toUpdate = editor.elements.find((e) => e.field === field);
      if (toUpdate != null) {
        toUpdate.type = stateType;
      }
    });

    if (this.component.detailState.type === 'edit-hash' && this.component.detailState.editor.type !== 'loading') {
      const toUpdate = this.component.detailState.editor.elements.find((e) => e.field === field);
      if (toUpdate != null) {
        this.scanner.update([toUpdate]);
      }
    }
  }

  /**
   * @param {CcKvHashExplorerAddFormState} addForm
   */
  updateAddForm(addForm) {
    this.updateEditor((editor) => {
      if (editor.type !== 'loading') {
        editor.addForm = addForm;
      }
    });
  }

  /**
   * @param {CcKvKey} key
   */
  setLoading(key) {
    this.updateDetailState({
      type: 'edit-hash',
      key: { ...key, type: 'hash' },
      editor: { type: 'loading' },
    });
  }

  /**
   * @param {CcKvKey} key
   */
  setLoaded(key) {
    this.updateDetailState({
      type: 'edit-hash',
      key: { ...key, type: 'hash' },
      editor: {
        type: 'loaded',
        elements: this.scanner.elements,
        addForm: { type: 'idle' },
      },
    });
  }
}

/**
 * @extends {KvScanner<CcKvHashElementState, {keyName: string, pattern?: string}>}
 */
export class KvHashElementsScanner extends KvScanner {
  /**
   * @param {KvClient} kvClient
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   */
  constructor(kvClient, { signal }) {
    super(
      (it) => it.field,
      (it) => isStringEmpty(this._filter?.pattern) || matchKvPattern(this._filter.pattern, it.field),
      async (cursor, count, filter) => {
        const r = await kvClient.scanHash(this._filter.keyName, { cursor, count, match: filter?.pattern }, { signal });
        return {
          cursor: r.cursor,
          total: r.total,
          elements: r.elements.map((e) => ({ ...e, type: 'idle' })),
        };
      },
    );
  }
}
