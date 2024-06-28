import { css, html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-select/cc-select.js';

/**
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerState} CcRedisExplorerState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyState} CcRedisKeyState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorState} CcRedisExplorerKeyEditorState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValue} CcRedisKeyValue
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyType} CcRedisKeyType
 *
 */

export class CcRedisExplorer extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      addFormState: { type: Object },
      _addFormSelectedType: { type: String, state: true },
    };
  }

  constructor() {
    super();
    /** @type {CcRedisExplorerState} */
    this.state = {
      type: 'loaded',
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
    this.addFormState = {
      type: 'hidden',
    };

    /** @type {CcRedisKeyType} */
    this._addFormSelectedType = 'string';
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
    dispatchCustomEvent(this, 'selected-key-change', keyName);
  }

  /**
   * @param {CustomEvent<CcRedisKeyType>} event
   */
  _onKeyTypeChanged({ detail }) {
    this._addFormSelectedType = detail;
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
    const id = `key-${keyState.key.name}`;

    return html`<li class="key">
      <input type="radio" id=${id} name="selectedKey" .value=${keyState.key.name} ?checked=${selected} />
      <label for=${id}>
        <div>${keyState.key.name}</div>
        <div>${keyState.key.type}</div>
        ${loading ? html` <div>loading...</div>` : ''}
      </label>
    </li>`;
  }

  _renderDetail() {
    const loading = this._getLoadingKey() != null;

    if (loading) {
      return html`<div>loading...</div>`;
    }

    if (this.addFormState.type === 'hidden') {
      return null;
    }

    if (this.addFormState.initialKeyValue == null) {
      return this._renderAddForm();
    }

    return this._renderEditForm(this.addFormState.initialKeyValue);
  }

  _renderAddForm() {
    const saving = this.addFormState.type === 'saving';

    return html`<form>
      <cc-input-text name="keyName" required></cc-input-text>
      <cc-select name="keyType" required @cc-select:input=${this._onKeyTypeChanged}></cc-select>
      ${this._renderKeyValueFormByType(this._addFormSelectedType)}
      <cc-button primary ?skeleton=${saving}>Add</cc-button>
    </form>`;
  }

  /**
   * @param {CcRedisKeyValue} keyValue
   * @return {TemplateResult}
   */
  _renderEditForm(keyValue) {
    const saving = this.addFormState.type === 'saving';

    return html`<form>
      <cc-input-text name="keyName" disabled .resetValue=${keyValue.name} .value=${keyValue.name}></cc-input-text>
      <cc-select name="keyType" disabled .resetValue=${keyValue.type} .value=${keyValue.type}></cc-select>
      ${this._renderKeyValueFormByType(keyValue.type, keyValue)}
      <div class="buttons">
        <cc-button type="reset" ?disabled=${saving}>Cancel</cc-button>
        <cc-button type="submit" primary ?skeleton=${saving}>Save</cc-button>
      </div>
    </form>`;
  }

  /**
   * @param {CcRedisKeyType} keyType
   * @param {CcRedisKeyValue} [keyValue]
   * @return {TemplateResult}
   */
  _renderKeyValueFormByType(keyType, keyValue) {
    if (keyType === 'string') {
      if (keyValue != null) {
        return html`<cc-input-text
          name="value"
          multi
          required
          .resetValue=${keyValue.value}
          .value=${keyValue.value}
        ></cc-input-text>`;
      }
      return html`<cc-input-text name="value" multi required></cc-input-text>`;
    }

    if (keyType === 'list') {
      return html`listEditor`;
    }

    if (keyType === 'hash') {
      return html`hashEditor`;
    }

    return html`Unsupported type`;
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
