import { KvScanner } from './kv-scanner.js';

/**
 * @typedef {import('./cc-kv-explorer.js').CcKvExplorer} CcKvExplorer
 * @typedef {import('./cc-kv-explorer.types.d.ts').CcKvExplorerDetailStateEditList} CcKvExplorerDetailStateEditList
 * @typedef {import('./cc-kv-explorer.types.d.ts').CcKvKey} CcKvKey
 * @typedef {import('./kv-client.js').KvClient} KvClient
 * @typedef {import('../cc-kv-list-explorer/cc-kv-list-explorer.types.d.ts').CcKvListExplorerStateLoaded} CcKvListExplorerStateLoaded
 * @typedef {import('../cc-kv-list-explorer/cc-kv-list-explorer.types.d.ts').CcKvListElementState} CcKvListElementState
 * @typedef {import('../cc-kv-list-explorer/cc-kv-list-explorer.types.d.ts').CcKvListExplorerState} CcKvListExplorerState
 * @typedef {import('../cc-kv-list-explorer/cc-kv-list-explorer.types.d.ts').CcKvListExplorerAddFormState} CcKvListExplorerAddFormState
 */

/**
 * Controller for `list` data type
 */
export class KvListKeyController {
  /**
   * @param {CcKvExplorer} component
   * @param {function} updateComponent
   * @param {KvListElementsScanner} scanner
   */
  constructor(component, updateComponent, scanner) {
    this.component = component;
    this.updateComponent = updateComponent;
    this.scanner = scanner;
  }

  /**
   * @param {CcKvExplorerDetailStateEditList|((detailState: CcKvExplorerDetailStateEditList) => void)} updater
   */
  updateDetailState(updater) {
    this.updateComponent('detailState', updater);
  }

  /**
   * @param {CcKvListExplorerState|((editor: CcKvListExplorerState) => void)} updater
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
   * @param {Array<CcKvListElementState>} elements
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
   * @param {number} index
   * @param {'idle'|'deleting'|'editing'|'updating'} state
   */
  updateEditorElementState(index, state) {
    /** @type {CcKvListElementState} */
    let toUpdate;

    this.updateEditor((e) => {
      const editor = /** @type {CcKvListExplorerStateLoaded} */ (e);
      toUpdate = editor.elements.find((e) => e.index === index);
      if (toUpdate != null) {
        toUpdate.type = state;
      }
    });

    if (this.component.detailState.type === 'edit-list' && this.component.detailState.editor.type !== 'loading') {
      const toUpdate = this.component.detailState.editor.elements.find((e) => e.index === index);
      if (toUpdate != null) {
        this.scanner.update([toUpdate]);
      }
    }
  }

  /**
   * @param {CcKvListExplorerAddFormState} addForm
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
      type: 'edit-list',
      key: { ...key, type: 'list' },
      editor: { type: 'loading' },
    });
  }

  /**
   * @param {CcKvKey} key
   */
  setLoaded(key) {
    this.updateDetailState({
      type: 'edit-list',
      key: { ...key, type: 'list' },
      editor: {
        type: 'loaded',
        elements: this.scanner.elements,
        addForm: { type: 'idle' },
      },
    });
  }
}

/**
 * @extends {KvScanner<CcKvListElementState, {keyName: string, index?: number}>}
 */
export class KvListElementsScanner extends KvScanner {
  /**
   * @param {KvClient} kvClient
   * @param {object} _
   * @param {AbortSignal} [_.signal]
   */
  constructor(kvClient, { signal }) {
    super(
      (it) => String(it.index),
      (it) => this._filter?.index == null || it.index === this._filter.index,
      async (cursor, count, filter) => {
        if (filter.index != null) {
          if (isNaN(filter.index)) {
            return {
              cursor: 0,
              total: 0,
              elements: [],
            };
          } else {
            try {
              const element = await kvClient.getListElementAt(this._filter.keyName, filter.index);

              if (element.value == null) {
                return {
                  cursor: 0,
                  total: 0,
                  elements: [],
                };
              } else {
                return {
                  cursor: 0,
                  total: 0,
                  elements: [{ type: 'idle', index: element.index, value: element.value }],
                };
              }
            } catch (e) {
              const err = /** @type {any} */ (e);
              if (err?.responseBody?.statusCode === 404 && err?.responseBody?.code === 'listElementNotFound') {
                return {
                  cursor: 0,
                  total: 0,
                  elements: [],
                };
              }
              throw e;
            }
          }
        }

        const r = await kvClient.scanList(this._filter.keyName, { cursor, count, match: null }, { signal });
        return {
          cursor: r.cursor,
          total: r.total,
          elements: r.elements.map((e) => ({ ...e, type: 'idle' })),
        };
      },
    );
  }
}
