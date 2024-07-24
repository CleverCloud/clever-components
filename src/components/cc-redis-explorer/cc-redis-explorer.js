import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { FormErrorFocusController } from '../../lib/form/form-error-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-select/cc-select.js';
import { KeyValueEditorHash, KeyValueEditorList, KeyValueEditorString } from './key-value-editors.js';

/**
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerState} CcRedisExplorerState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyState} CcRedisKeyState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorState} CcRedisExplorerKeyEditorState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValue} CcRedisKeyValue
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueString} CcRedisKeyValueString
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueHash} CcRedisKeyValueHash
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueList} CcRedisKeyValueList
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyType} CcRedisKeyType
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyAddFormState} CcRedisExplorerKeyAddFormState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditFormState} CcRedisExplorerKeyEditFormState
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 *
 */

/**
 * @typedef {KeyValueEditorString|KeyValueEditorList|KeyValueEditorHash} KeyValueEditor
 */

const KEY_EDITORS = {
  string: new KeyValueEditorString(),
  hash: new KeyValueEditorHash(),
  list: new KeyValueEditorList(),
};

export class CcRedisExplorer extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      keyEditorFormState: { type: Object },
      _addFormSelectedType: { type: String, state: true },
    };
  }

  constructor() {
    super();
    /** @type {CcRedisExplorerState} */
    this.state = {
      type: 'loading',
      keys: [
        {
          type: 'idle',
          key: {
            type: 'string',
            name: 'key1',
          },
        },
        {
          type: 'idle',
          key: {
            type: 'string',
            name: 'key2',
          },
        },
        {
          type: 'idle',
          key: {
            type: 'string',
            name: 'key3',
          },
        },
      ],
    };

    /** @type {CcRedisExplorerKeyEditorState} */
    this.keyEditorFormState = {
      type: 'hidden',
    };

    /** @type {CcRedisKeyType} */
    this._addFormSelectedType = 'string';

    /** @type {HTMLFormElementRef} */
    this._addFormRef = createRef();

    /** @type {HTMLFormElementRef} */
    this._editFormRef = createRef();

    new FormErrorFocusController(this, this._addFormRef, () => {
      if (this.keyEditorFormState.type === 'add') {
        return this.keyEditorFormState.addFormState.errors;
      }
      return null;
    });

    new FormErrorFocusController(this, this._editFormRef, () => {
      if (this.keyEditorFormState.type === 'edit') {
        return this.keyEditorFormState.editFormState.errors;
      }
      return null;
    });
  }

  resetAddEditorForm() {
    this._addFormRef.value?.reset();
  }

  resetEditEditorForm() {
    this._editFormRef.value?.reset();
  }

  _getSelectedKey() {
    if (this.state.type !== 'loaded') {
      return null;
    }

    return this.state.keys.find((keyState) => keyState.type === 'selected')?.key.name;
  }

  _getLoadingKey() {
    if (this.state.type !== 'loaded') {
      return null;
    }

    return this.state.keys.find((keyState) => keyState.type === 'loading')?.key.name;
  }

  _onAddButtonClick() {
    this.addFormState = {
      type: 'idle',
      initialKeyValue: null,
    };
  }

  /**
   * @param {HTMLInputElementEvent} e
   */
  _onSelectedKeyChange(e) {
    if (this.state.type !== 'loaded') {
      return;
    }

    const keyName = e.target.value;
    console.log(keyName);

    const selectedKey = this._getSelectedKey();

    if (keyName === selectedKey) {
      return;
    }

    this.state = {
      type: 'loaded',
      keys: this.state.keys.map((keyState) => {
        if (keyState.key.name === keyName) {
          return {
            type: 'loading',
            key: keyState.key,
          };
        }
        if (keyState.type === 'selected') {
          return {
            type: 'idle',
            key: keyState.key,
          };
        }
        return keyState;
      }),
    };

    // todo: cancel current call if any
    dispatchCustomEvent(this, 'selected-key-change', { keyName, keyType });
  }

  /**
   * @param {CustomEvent<CcRedisKeyType>} event
   */
  _onKeyTypeChanged({ detail }) {
    this._addFormSelectedType = detail;
  }

  /**
   * @param {Event & {dataset: {key: string}}} e
   */
  _onDeleteKeyButtonClick(e) {
    dispatchCustomEvent(this, 'delete-key', e.dataset.key);
  }

  /**
   * @param {FormDataMap & {keyName: string, keyType: CcRedisKeyType}} formData
   */
  _onKeyEditorAddFormSubmit(formData) {
    if (this.keyEditorFormState.type !== 'add') {
      return;
    }
    this.keyEditorFormState = {
      ...this.keyEditorFormState,
      addFormState: { ...this.keyEditorFormState.addFormState, errors: null },
    };

    const decodedKey = this._decodeKey(formData);
    dispatchCustomEvent(this, 'add-key', {
      ...decodedKey,
      ...KEY_EDITORS[decodedKey.keyType].decodeFormData(formData),
    });
  }

  /**
   * @param {FormDataMap & {keyName: string, keyType: CcRedisKeyType}} formData
   */
  _onKeyEditorEditFormSubmit(formData) {
    if (this.keyEditorFormState.type !== 'edit') {
      return;
    }
    this.keyEditorFormState = {
      ...this.keyEditorFormState,
      editFormState: { ...this.keyEditorFormState.editFormState, errors: null },
    };

    const decodedKey = this._decodeKey(formData);
    dispatchCustomEvent(this, 'edit-key', {
      ...decodedKey,
      ...KEY_EDITORS[decodedKey.keyType].decodeFormData(formData),
    });
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.state.type === 'loading' ? html`<div class="loading">loading...</div>` : ''}
        ${this.state.type === 'error' ? html`<div class="error">error</div>` : ''}
        ${this.state.type === 'loaded'
          ? html`
              <div class="top-bar">
                <div class="filters"></div>
                <cc-button @cc-button:click=${this._onAddButtonClick}>Add</cc-button>
              </div>
              <ul class="keys-list" @change=${this._onSelectedKeyChange}>
                ${repeat(
                  this.state.keys,
                  /** @param {CcRedisKeyState} keyState */
                  (keyState) => keyState.key.name,
                  this._renderKey,
                )}
              </ul>
              <div class="detail">${this._renderDetail()}</div>
            `
          : ''}
      </div>
    `;
  }

  /**
   * @param {CcRedisKeyState} keyState
   * @return {TemplateResult}
   */
  _renderKey(keyState) {
    const selected = keyState.type === 'selected';
    const loading = keyState.type === 'loading';
    const deleting = keyState.type === 'deleting';
    const id = `key-${keyState.key.name}`;

    return html`<li class="key">
      <input type="radio" id=${id} name="selectedKey" .value=${keyState.key.name} ?checked=${selected || loading} />
      <label for=${id}>
        <div>${keyState.key.name}</div>
        <div>${keyState.key.type}</div>
        ${loading ? html` ...` : ''}
      </label>
      <div class="buttons">
        <cc-button
          ?disabled=${loading}
          ?waiting=${deleting}
          data-key=${keyState.key.name}
          @cc-button:click=${this._onDeleteKeyButtonClick}
          >Del</cc-button
        >
      </div>
    </li>`;
  }

  _renderDetail() {
    const loading = this._getLoadingKey() != null;

    if (loading) {
      return html`<div>loading...</div>`;
    }

    if (this.keyEditorFormState.type === 'hidden') {
      return null;
    }

    if (this.keyEditorFormState.type === 'add') {
      return this._renderAddForm(this.keyEditorFormState.addFormState);
    }

    return this._renderEditForm(this.keyEditorFormState.editFormState, this.keyEditorFormState.keyValue);
  }

  /**
   *
   * @param {CcRedisExplorerKeyAddFormState} addFormState
   * @return {TemplateResult}
   */
  _renderAddForm(addFormState) {
    const saving = addFormState.type === 'adding';

    return html`<form ${ref(this._addFormRef)} ${formSubmit(this._onKeyEditorAddFormSubmit.bind(this))}>
      <cc-input-text name="keyName" label="Name" required></cc-input-text>
      <cc-select name="keyType" label="Type" required @cc-select:input=${this._onKeyTypeChanged}></cc-select>
      ${this._renderKeyValueFormByType(this._addFormSelectedType)}
      <div class="buttons">
        <cc-button type="submit" primary ?waiting=${saving}>Add</cc-button>
      </div>
    </form>`;
  }

  /**
   * @param {CcRedisExplorerKeyEditFormState} editFormState
   * @param {CcRedisKeyValue} keyValue
   * @return {TemplateResult}
   */
  _renderEditForm(editFormState, keyValue) {
    const saving = editFormState.type === 'saving';

    return html`<form ${ref(this._editFormRef)} ${formSubmit(this._onKeyEditorEditFormSubmit.bind(this))}>
      <cc-input-text name="keyName" disabled .resetValue=${keyValue.name} .value=${keyValue.name}></cc-input-text>
      <cc-select name="keyType" disabled .resetValue=${keyValue.type} .value=${keyValue.type}></cc-select>
      ${this._renderKeyValueFormByType(keyValue.type, keyValue)}
      <div class="buttons">
        <cc-button type="reset" ?disabled=${saving}>Reset</cc-button>
        <cc-button type="submit" primary ?waiting=${saving}>Save</cc-button>
      </div>
    </form>`;
  }

  /**
   * @param {CcRedisKeyType} keyType
   * @param {CcRedisKeyValue} [keyValue]
   * @return {TemplateResult}
   */
  _renderKeyValueFormByType(keyType, keyValue) {
    if (keyType === 'string' && keyValue.type === 'string') {
      KEY_EDITORS.string.render(keyValue);
    }

    if (keyType === 'list' && keyValue.type === 'list') {
      KEY_EDITORS.list.render(keyValue);
    }

    if (keyType === 'hash' && keyValue.type === 'hash') {
      KEY_EDITORS.hash.render(keyValue);
    }

    return html`Unsupported type`;
  }

  /**
   * @param {FormDataMap & {keyName: string, keyType: CcRedisKeyType}} formData
   * @return {{keyName: string, keyType: CcRedisKeyType}}
   */
  _decodeKey(formData) {
    return { keyName: formData.keyName, keyType: formData.keyType };
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-redis-explorer', CcRedisExplorer);
