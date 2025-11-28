/**
 * @import { CcKvExplorer } from './cc-kv-explorer.js'
 * @import { CcKvKeyType, CcKvKeyValue, CcKvExplorerDetailState, CcKvExplorerDetailStateEdit, GenericCcKvExplorerDetailStateEdit } from './cc-kv-explorer.types.js'
 * @import { KvClient } from './kv-client.js'
 * @import { ObjectOrFunction } from '../common.types.js'
 */

/**
 * @template {CcKvKeyType} T
 * @template E
 */

/**
 * @template {CcKvExplorerDetailStateEdit} D
 */
export class KvKeyEditorCtrl {
  /**
   * @param {string} keyName
   * @param {CcKvExplorer} component
   * @param {(stateUpdater: ObjectOrFunction<CcKvExplorerDetailState>) => void} updateDetailState
   * @param {KvClient} kvClient
   */
  constructor(keyName, component, updateDetailState, kvClient) {
    this._keyName = keyName;
    this._component = component;
    this._updateDetailState = updateDetailState;
    this._kvClient = kvClient;
  }

  /**
   * @returns {string}
   */
  get keyName() {
    return this._keyName;
  }

  /**
   * @returns {CcKvExplorer}
   */
  get component() {
    return this._component;
  }

  /**
   * @return {CcKvKeyType}
   */
  getType() {
    throw new Error('Abstract method: please implement me');
  }

  async load() {
    throw new Error('Abstract method: please implement me');
  }

  /**
   * @param {CcKvKeyValue} _keyValue
   */
  async create(_keyValue) {
    throw new Error('Abstract method: please implement me');
  }

  /**
   * @param {E|((editorState:E) => void)} editorState
   * @template {D['editor']} E
   */
  _updateEditorState(editorState) {
    if (typeof editorState === 'function') {
      this._updateDetailState((detailState) => {
        const s = /** @type {GenericCcKvExplorerDetailStateEdit<CcKvKeyType, E>}*/ (detailState);
        editorState(s.editor);
      });
    } else {
      const type = this.getType();

      const newState = {
        type: `edit-${type}`,
        key: { type: type, name: this._keyName },
        editor: editorState,
      };

      this._updateDetailState(/** @type {CcKvExplorerDetailState} */ (newState));
    }
  }
}
