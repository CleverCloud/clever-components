import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { iconRemixDeleteBinFill as iconDelete } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { FormErrorFocusController } from '../../lib/form/form-error-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { isStringEmpty } from '../../lib/utils.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { getKeyEditor } from './key-value-editors.js';

/**
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<KeyboardEvent,HTMLInputElement>} HTMLInputKeyboardEvent
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerState} CcRedisExplorerState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyState} CcRedisKeyState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyEditorState} CcRedisExplorerKeyEditorState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValue} CcRedisKeyValue
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueString} CcRedisKeyValueString
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueHash} CcRedisKeyValueHash
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueList} CcRedisKeyValueList
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyType} CcRedisKeyType
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyAddFormState} CcRedisExplorerKeyAddFormState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerKeyUpdateFormState} CcRedisExplorerKeyUpdateFormState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerShellState} CcRedisExplorerShellState
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 */

const REDIS_TYPES_OPTIONS = [
  { label: 'String', value: 'string' },
  { label: 'Hash', value: 'hash' },
  { label: 'List', value: 'list' },
];

const REDIS_TYPES_FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'String', value: 'string' },
  { label: 'Hash', value: 'hash' },
  { label: 'List', value: 'list' },
];

export class CcRedisExplorer extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      keyEditorFormState: { type: Object },
      shellState: { type: Object },
      _addFormSelectedType: { type: String, state: true },
      _filter: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    /** @type {CcRedisExplorerState} */
    this.state = { type: 'loading' };

    /** @type {CcRedisExplorerKeyEditorState} */
    this.keyEditorFormState = { type: 'hidden' };

    /** @type {CcRedisExplorerShellState} */
    this.shellState = { history: [] };

    /** @type {CcRedisKeyType} */
    this._addFormSelectedType = 'string';

    /** @type {HTMLFormElementRef} */
    this._addFormRef = createRef();

    /** @type {HTMLFormElementRef} */
    this._updateFormRef = createRef();

    /** @type {HTMLFormElementRef} */
    this._promptRef = createRef();

    this._promptHistoryIndex = -1;

    this._filter = { type: 'all', match: '' };

    new FormErrorFocusController(this, this._addFormRef, () => {
      if (this.keyEditorFormState.type === 'add') {
        return this.keyEditorFormState.formState.errors;
      }
      return null;
    });

    new FormErrorFocusController(this, this._updateFormRef, () => {
      if (this.keyEditorFormState.type === 'update') {
        return this.keyEditorFormState.formState.errors;
      }
      return null;
    });
  }

  resetAddEditorForm() {
    this._addFormRef.value?.reset();
  }

  resetUpdateEditorForm() {
    this._updateFormRef.value?.reset();
  }

  _onAddButtonClick() {
    // display editor with add mode
    this.keyEditorFormState = {
      type: 'add',
      formState: {
        type: 'idle',
      },
    };
    // unselect any selected key
    const selectedKey = this._getSelectedKey();
    if (selectedKey != null && this.state.type === 'loaded') {
      this.state = {
        type: 'loaded',
        keys: this.state.keys.map((keyState) => {
          if (keyState.type === 'selected') {
            return {
              type: 'idle',
              key: keyState.key,
            };
          }
          return keyState;
        }),
      };
    }
  }

  /**
   * @param {HTMLInputElementEvent} e
   */
  _onSelectedKeyChange(e) {
    if (this.state.type !== 'loaded') {
      return;
    }

    const key = e.target.value;
    const selectedKey = this._getSelectedKey();

    if (key === selectedKey) {
      return;
    }

    // todo: cancel current call if any
    dispatchCustomEvent(this, 'selected-key-change', key);
  }

  _onTypeFilterChange(e) {
    this._filter = { ...this._filter, type: e.target.value };
    dispatchCustomEvent(this, 'filter-change', {
      match: isStringEmpty(this._filter.match) ? null : this._filter.match,
      type: this._filter.type === 'all' ? null : this._filter.type,
    });
  }

  _onPatternFilterChange(e) {
    this._filter = { ...this._filter, match: e.target.value };
    dispatchCustomEvent(this, 'filter-change', {
      match: isStringEmpty(this._filter.match) ? null : this._filter.match,
      type: this._filter.type === 'all' ? null : this._filter.type,
    });
  }

  /**
   * @param {CustomEvent<CcRedisKeyType>} event
   */
  _onKeyTypeChanged({ detail }) {
    this._addFormSelectedType = detail;
  }

  /**
   * @param {Event & {target: {dataset: {key: string}}}} e
   */
  _onDeleteKeyButtonClick(e) {
    dispatchCustomEvent(this, 'delete-key', e.target.dataset.key);
  }

  /**
   * @param {FormDataMap & {key: string, type: CcRedisKeyType}} formData
   */
  _onKeyEditorAddFormSubmit(formData) {
    if (this.keyEditorFormState.type !== 'add') {
      return;
    }
    this.keyEditorFormState = {
      ...this.keyEditorFormState,
      formState: { ...this.keyEditorFormState.formState, errors: null },
    };

    const { key, type } = this._decodeKey(formData);
    dispatchCustomEvent(this, 'add-key', getKeyEditor(type).decodeFormData(key, formData));
  }

  /**
   * @param {FormDataMap & {key: string, type: CcRedisKeyType}} formData
   */
  _onKeyEditorUpdateFormSubmit(formData) {
    if (this.keyEditorFormState.type !== 'update') {
      return;
    }
    this.keyEditorFormState = {
      ...this.keyEditorFormState,
      formState: { ...this.keyEditorFormState.formState, errors: null },
    };

    const { key, type } = this.keyEditorFormState.keyValue;
    dispatchCustomEvent(this, 'update-key', getKeyEditor(type).decodeFormData(key, formData));
  }

  /**
   * Stop propagation of keydown events (to prevent conflicts with shortcuts)
   *
   * @param {HTMLInputKeyboardEvent} e
   */
  _onShellPromptKeyDown(e) {
    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = e.target.value;
      if (!isStringEmpty(cmd)) {
        dispatchCustomEvent(this, 'send-command', cmd);
        e.target.value = '';
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this._promptHistoryIndex === -1) {
        this._promptHistoryIndex = this.shellState.history.length - 1;
      } else {
        this._promptHistoryIndex--;
      }

      if (this._promptHistoryIndex >= 0) {
        this._promptRef.value.value = this.shellState.history[this._promptHistoryIndex].command;
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      this._promptHistoryIndex++;

      if (this._promptHistoryIndex < this.shellState.history.length) {
        this._promptRef.value.value = this.shellState.history[this._promptHistoryIndex].command;
      } else {
        this._promptHistoryIndex = -1;
        this._promptRef.value.value = '';
      }
    }
  }

  _onShellClick() {
    this._promptRef.value?.focus();
  }

  updated(changedProperties) {
    if (changedProperties.has('shellState')) {
      this.shadowRoot.querySelector('.command-prompt').scrollIntoView();
    }
  }

  render() {
    /**
     * @param {CcRedisKeyState} keyState
     * @return {TemplateResult}
     */
    const renderItem = (keyState) => this._renderKey(keyState);

    return html`
      <div class="wrapper">
        ${this.state.type === 'loading' ? html`<div class="loading"><cc-loader></cc-loader></div>` : ''}
        ${this.state.type === 'error' ? html`<div class="error">An error occurred while contacting backend</div>` : ''}
        ${this.state.type === 'loaded' || this.state.type === 'fetching-keys' || this.state.type === 'fetch-keys-error'
          ? html`
              <div class="top-bar">
                <div class="filters">
                  <cc-select
                    inline
                    label="Filter by type"
                    .value=${this._filter.type}
                    .options=${REDIS_TYPES_FILTER_OPTIONS}
                    @cc-select:input=${this._onTypeFilterChange}
                  ></cc-select>
                  <cc-input-text
                    inline
                    label="Filter by pattern"
                    .value=${this._filter.match}
                    @cc-input-text:requestimplicitsubmit=${this._onPatternFilterChange}
                  ></cc-input-text>
                </div>
                <cc-button @cc-button:click=${this._onAddButtonClick}>Add new key</cc-button>
              </div>
              ${this.state.type === 'fetching-keys'
                ? html`
                    <div class="keys-area loading">
                      <cc-loader></cc-loader>
                    </div>
                  `
                : ''}
              ${this.state.type === 'fetch-keys-error'
                ? html`
                    <div class="keys-area">
                      <cc-notice intent="danger" message="Could not load keys"></cc-notice>
                    </div>
                  `
                : ''}
              ${this.state.type === 'loaded' && this.state.keys.length === 0
                ? html`
                    <div class="keys-area">
                      <cc-notice intent="info" message="No keys"></cc-notice>
                    </div>
                  `
                : ''}
              ${this.state.type === 'loaded' && this.state.keys.length > 0
                ? html`
                    <ul class="keys-area keys-list" @change=${this._onSelectedKeyChange}>
                      ${repeat(
                        this.state.keys,
                        /** @param {CcRedisKeyState} keyState */
                        (keyState) => keyState.key.key,
                        renderItem,
                      )}
                    </ul>
                  `
                : ''}

              <div class="detail">${this._renderDetail()}</div>
              ${this._renderShell()}
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
    const id = `key-${keyState.key.key}`;

    // todo: display focus ring on label

    return html`<li class="key">
      <input type="radio" id=${id} name="selectedKey" .value=${keyState.key.key} .checked=${selected || loading} />
      <label for=${id}>
        <span class="key-name">${keyState.key.key}</span>
        <cc-badge>${keyState.key.type}</cc-badge>
        <cc-button
          ?disabled=${loading}
          ?waiting=${deleting}
          hide-text
          danger
          circle
          outlined
          a11y-name="Delete key"
          .icon=${iconDelete}
          data-key=${keyState.key.key}
          @cc-button:click=${this._onDeleteKeyButtonClick}
        ></cc-button>
      </label>
    </li>`;
  }

  _renderDetail() {
    const loading = this._getLoadingKey() != null;

    if (loading) {
      return html`<div class="loading"><cc-loader></cc-loader></div>`;
    }

    if (this.keyEditorFormState.type === 'hidden') {
      return null;
    }

    if (this.keyEditorFormState.type === 'add') {
      return this._renderAddForm(this.keyEditorFormState.formState);
    }

    return this._renderUpdateForm(this.keyEditorFormState.formState, this.keyEditorFormState.keyValue);
  }

  /**
   *
   * @param {CcRedisExplorerKeyAddFormState} formState
   * @return {TemplateResult}
   */
  _renderAddForm(formState) {
    const saving = formState.type === 'adding';

    return html`<form ${ref(this._addFormRef)} ${formSubmit(this._onKeyEditorAddFormSubmit.bind(this))}>
      <cc-input-text name="key" label="Key" required></cc-input-text>
      <cc-select
        name="type"
        label="Type"
        required
        .options=${REDIS_TYPES_OPTIONS}
        .value=${this._addFormSelectedType}
        @cc-select:input=${this._onKeyTypeChanged}
      ></cc-select>
      ${getKeyEditor(this._addFormSelectedType).render(null)}
      <div class="buttons">
        <cc-button type="reset" ?disabled=${saving}>Reset</cc-button>
        <cc-button type="submit" primary ?waiting=${saving}>Add</cc-button>
      </div>
    </form>`;
  }

  /**
   * @param {CcRedisExplorerKeyUpdateFormState} formState
   * @param {CcRedisKeyValue} keyValue
   * @return {TemplateResult}
   */
  _renderUpdateForm(formState, keyValue) {
    const saving = formState.type === 'updating';

    const editor = getKeyEditor(keyValue.type);
    if (editor == null) {
      return html`Unsupported type`;
    }

    return html`<form ${ref(this._updateFormRef)} ${formSubmit(this._onKeyEditorUpdateFormSubmit.bind(this))}>
      <cc-input-text
        name="key"
        label="Key"
        required
        disabled
        .value=${keyValue.key}
        .resetValue=${keyValue.key}
      ></cc-input-text>
      <cc-select
        name="type"
        label="Type"
        required
        disabled
        .options=${REDIS_TYPES_OPTIONS}
        .value=${keyValue.type}
        .resetValue=${keyValue.type}
      ></cc-select>
      ${editor.render(keyValue)}
      <div class="buttons">
        <cc-button type="reset" ?disabled=${saving}>Reset</cc-button>
        <cc-button type="submit" primary ?waiting=${saving}>Save</cc-button>
        <!--        toto: add delete button -->
      </div>
    </form>`;
  }

  _renderShell() {
    const isCommandRunning = this.shellState.runningCommand != null;

    return html`
      <form class="shell" @click=${this._onShellClick}>
        ${this.shellState.history.map(({ command, result, error }) => {
          return html`
            <div>redis>&nbsp;${command}</div>
            ${result.map((l) => html`<div class=${classMap({ result: true, error })}>${l}</div>`)}
          `;
        })}
        <div class="shell-prompt">
          <span>redis>&nbsp;</span>
          <input
            ${ref(this._promptRef)}
            type="text"
            name="command"
            autocomplete="false"
            spellcheck="false"
            .readonly=${isCommandRunning}
            @keydown=${this._onShellPromptKeyDown}
          />
        </div>
      </form>
    `;
  }

  /**
   * @param {FormDataMap & {key: string, type: CcRedisKeyType}} formData
   * @return {{key: string, type: CcRedisKeyType}}
   */
  _decodeKey(formData) {
    return { key: formData.key, type: formData.type };
  }

  _getSelectedKey() {
    if (this.state.type !== 'loaded') {
      return null;
    }

    return this.state.keys.find((keyState) => keyState.type === 'selected')?.key.key;
  }

  _getLoadingKey() {
    if (this.state.type !== 'loaded') {
      return null;
    }

    return this.state.keys.find((keyState) => keyState.type === 'loading')?.key.key;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          background-color: var(--cc-color-bg-default, #fff);
          display: block;
        }

        .wrapper {
          display: grid;
          grid-gap: 0.5em;
          grid-template-areas:
            'top-bar top-bar'
            'keys-list detail'
            'shell shell';
          grid-template-columns: minmax(auto, 400px) 1fr;
          grid-template-rows: auto 1fr;
        }

        .loading {
          align-items: center;
          display: flex;
          flex-direction: column;
        }

        .top-bar {
          display: flex;
          gap: 0.5em;
          grid-area: top-bar;
        }

        .keys-area {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          grid-area: keys-list;
          padding: 0.5em;
        }

        .keys-list {
          gap: 0.2em;
          list-style-type: none;
          margin: 0;
        }

        .detail {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-area: detail;
        }

        .filters {
          display: flex;
          flex: 1;
          gap: 0.5em;
        }

        .filters cc-input-text {
          flex: 1;
        }

        .key {
          display: flex;
          flex-direction: row;
        }

        .key input[type='radio'] {
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          border: 0;
          display: block;
          height: 0;
          margin: 0;
          outline: none;
          width: 0;
        }

        .key label {
          align-items: center;
          border-radius: var(--cc-border-radius-default, 0.25em);
          cursor: pointer;
          display: flex;
          flex: 1;
          flex-direction: row;
          gap: 0.2em;
          padding: 0.25em;
        }

        .key label:hover {
          background-color: var(--cc-color-bg-neutral-hovered, #e7e7e7);
        }

        .key input[type='radio']:checked + label {
          background-color: var(--cc-color-bg-neutral-active, #d9d9d9);
        }

        .key input[type='radio']:focus + label {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: -1px;
        }

        .key-name {
          flex: 1;
        }

        .detail form {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 1em;
        }

        .shell {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.875em;
          gap: 0.2em;
          grid-area: shell;
          max-height: 250px;
          overflow: auto;
          padding: 0.5em;
        }

        .command-prompt {
          display: flex;
        }

        .result {
          white-space: pre-wrap;
        }

        .result.error {
          color: red;
        }

        .command-prompt input {
          -webkit-appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: inherit;
          display: block;
          flex: 1;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
          resize: none;
        }

        .command-prompt input:focus,
        .command-prompt input:active {
          outline: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-redis-explorer', CcRedisExplorer);
