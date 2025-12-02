import { KvKeyEditorHashCtrl } from './kv-key-editor-hash-ctrl.js';
import { KvKeyEditorListCtrl } from './kv-key-editor-list-ctrl.js';
import { KvKeyEditorSetCtrl } from './kv-key-editor-set-ctrl.js';
import { KvKeyEditorStringCtrl } from './kv-key-editor-string-ctrl.js';
import { Abortable } from './kv-utils.js';

/**
 * @import { CcKvExplorer } from './cc-kv-explorer.js'
 * @import { CcKvExplorerDetailState, CcKvExplorerDetailStateAdd, CcKvKey, CcKvKeyType, CcKvKeyValue } from './cc-kv-explorer.types.js'
 * @import { KvClient } from './kv-client.js'
 * @import { KvKeyEditorCtrl } from './kv-key-editor-ctrl.js'
 * @import { ObjectOrFunction } from '../common.types.js'
 */

export class KvDetailsCtrl {
  /**
   * @param {CcKvExplorer} component
   * @param {(stateUpdater: ObjectOrFunction<CcKvExplorerDetailState>) => void} updateDetailState
   * @param {KvClient} kvClient
   */
  constructor(component, updateDetailState, kvClient) {
    this._component = component;
    this._updateDetailState = updateDetailState;
    this._kvClient = kvClient;
    this._abortable = new Abortable();

    /** @type {KvKeyEditorCtrl<?>} */
    this._currentEditorCtrl = null;
  }

  abort() {
    this._abortable.abort();
  }

  /**
   * @returns {KvKeyEditorCtrl<?>}
   */
  get editorCtrl() {
    // @ts-ignore
    return this._currentEditorCtrl;
  }

  hide() {
    this._currentEditorCtrl = null;
    this._updateDetailState({ type: 'hidden' });
  }

  /**
   * @returns {string|null}
   */
  get keyName() {
    return this._currentEditorCtrl?.keyName;
  }

  /**
   * @param {CcKvKey} key
   */
  async load(key) {
    this._currentEditorCtrl = this._createKeyEditorCtrl(key.name, key.type);

    try {
      await this._currentEditorCtrl.load();
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        throw e;
      }
    }
  }

  /**
   * @param {CcKvKeyValue} keyValue
   * @returns {Promise<void>}
   */
  async add(keyValue) {
    this._currentEditorCtrl = this._createKeyEditorCtrl(keyValue.name, keyValue.type);

    this._updateDetailState((state) => {
      const addState = /** @type {CcKvExplorerDetailStateAdd} state */ (state);
      addState.formState.type = 'adding';
    });

    try {
      await this._currentEditorCtrl.create(keyValue);
    } catch (e) {
      const errorCode = getErrorCode(e);
      if (errorCode === 'clever.redis-http.key-already-exists') {
        this._updateDetailState({
          type: 'add',
          formState: { type: 'idle', errors: { keyName: 'already-used' } },
        });
      } else {
        this._updateDetailState({
          type: 'add',
          formState: { type: 'idle' },
        });

        throw e;
      }
    }
  }

  /**
   * @param {string} keyName
   * @param {CcKvKeyType} type
   * @return {KvKeyEditorCtrl<?>}
   */
  _createKeyEditorCtrl(keyName, type) {
    switch (type) {
      case 'string':
        return new KvKeyEditorStringCtrl(
          keyName,
          this._component,
          this._updateDetailState,
          this._kvClient,
          this._abortable,
        );
      case 'hash':
        return new KvKeyEditorHashCtrl(
          keyName,
          this._component,
          this._updateDetailState,
          this._kvClient,
          this._abortable,
        );
      case 'list':
        return new KvKeyEditorListCtrl(
          keyName,
          this._component,
          this._updateDetailState,
          this._kvClient,
          this._abortable,
        );
      case 'set':
        return new KvKeyEditorSetCtrl(
          keyName,
          this._component,
          this._updateDetailState,
          this._kvClient,
          this._abortable,
        );
    }
  }
}

/**
 * @param {{responseBody?: { code?: string}}} e
 * @return {string | null} e
 */
function getErrorCode(e) {
  return e?.responseBody?.code;
}
