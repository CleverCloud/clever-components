import { KvKeyEditorCtrl } from './kv-key-editor-ctrl.js';

/**
 * @typedef {import('./cc-kv-explorer.js').CcKvExplorer} CcKvExplorer
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerDetailState} CcKvExplorerDetailState
 * @typedef {import('./cc-kv-explorer.types.js').CcKvExplorerDetailStateEditString} CcKvExplorerDetailStateEditString
 * @typedef {import('./cc-kv-explorer.types.js').CcKvKeyValueString} CcKvKeyValueString
 * @typedef {import('./kv-client.js').KvClient} KvClient
 * @typedef {import('./kv-utils.js').Abortable} Abortable
 * @typedef {import('../common.types.js').ObjectOrFunction<CcKvExplorerDetailState>} CcKvExplorerDetailStateUpdater
 */

/**
 * @extends {KvKeyEditorCtrl<CcKvExplorerDetailStateEditString>}
 */
export class KvKeyEditorStringCtrl extends KvKeyEditorCtrl {
  /**
   * @param {string} keyName
   * @param {CcKvExplorer} component
   * @param {(stateUpdater: CcKvExplorerDetailStateUpdater) => void} updateDetailState
   * @param {KvClient} kvClient
   * @param {Abortable} abortable
   */
  constructor(keyName, component, updateDetailState, kvClient, abortable) {
    super(keyName, component, updateDetailState, kvClient);
    this._abortable = abortable;
  }

  /**
   * @returns {'string'}
   */
  getType() {
    return 'string';
  }

  async load() {
    this._updateEditorState({ type: 'loading' });
    const { value } = await this._abortable.run((signal) => this._kvClient.getStringKey(this.keyName, signal));
    this._updateEditorState({ type: 'idle', value });
  }

  /**
   * @param {CcKvKeyValueString} keyValue
   */
  async create(keyValue) {
    await this._kvClient.createStringKey(keyValue.name, keyValue.value);
    this._updateEditorState({ type: 'idle', value: keyValue.value });
  }

  /**
   * @param {string} value
   */
  async save(value) {
    this._updateEditorState({ type: 'saving', value });

    try {
      await this._kvClient.updateStringKey(this.keyName, value);
      this.setIdle(value);
    } catch (e) {
      this.setIdle(value);
      throw e;
    }
  }

  /**
   * @param {string} value
   */
  setIdle(value) {
    this._updateEditorState({ type: 'idle', value });
  }
}
