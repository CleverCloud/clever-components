import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { iconRemixDeleteBinFill as iconDelete } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { FormErrorFocusController } from '../../lib/form/form-error-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { isStringEmpty, random, randomPick, randomString } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { getKeyEditor } from './key-value-editors.js';

/**
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisExplorerState} CcRedisExplorerState
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKey} CcRedisKey
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
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcRedisExplorer>} CcRedisExplorerPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLInputElement>} HTMLInputElementRef
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<KeyboardEvent,HTMLInputElement>} HTMLInputKeyboardEvent
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcInputText>} CcInputTextInputEvent
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcSelect>} CcSelectChangeEvent
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

/** @type {Array<CcRedisKeyType>} */
const REDIS_TYPES = ['string', 'hash', 'list'];

/** @type {Array<{keyState: CcRedisKeyState, skeleton: boolean}>} */
const SKELETON_KEYS = new Array(10).fill(0).map(() => ({
  skeleton: true,
  keyState: {
    type: 'idle',
    key: {
      key: randomString(random(8, 15)),
      type: randomPick(REDIS_TYPES),
    },
  },
}));

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

    /** @type {HTMLInputElementRef} */
    this._shellPromptRef = createRef();

    /** @type {number|null} */
    this._promptHistoryIndex = null;

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
        total: this.state.total + 1,
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

  /**
   * @param {CcInputTextInputEvent} e
   */
  _onTypeFilterChange(e) {
    this._filter = { ...this._filter, type: e.target.value };
    dispatchCustomEvent(this, 'filter-change', {
      match: isStringEmpty(this._filter.match) ? null : this._filter.match,
      type: this._filter.type === 'all' ? null : this._filter.type,
    });
  }

  /**
   * @param {CcSelectChangeEvent} e
   */
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

  _onLoadMoreButtonClick() {
    dispatchCustomEvent(this, 'fetch-more-keys');
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
      this._promptHistoryIndex = null;
      const cmd = e.target.value;
      if (!isStringEmpty(cmd)) {
        dispatchCustomEvent(this, 'send-command', cmd);
        e.target.value = '';
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (this._promptHistoryIndex == null) {
        this._promptHistoryIndex = this.shellState.history.length - 1;
      } else {
        this._promptHistoryIndex = Math.max(this._promptHistoryIndex - 1, 0);
      }

      if (this._promptHistoryIndex >= 0) {
        this._shellPromptRef.value.value = this.shellState.history[this._promptHistoryIndex].command;
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (this._promptHistoryIndex != null) {
        this._promptHistoryIndex++;

        if (this._promptHistoryIndex < this.shellState.history.length) {
          this._shellPromptRef.value.value = this.shellState.history[this._promptHistoryIndex].command;
        } else {
          this._promptHistoryIndex = null;
          this._shellPromptRef.value.value = '';
        }
      }
    }
  }

  _onShellClick() {
    this._shellPromptRef.value?.focus();
  }

  /**
   * @param {CcRedisExplorerPropertyValues} changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('shellState')) {
      this._shellPromptRef.value?.scrollIntoView();
    }
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.state.type === 'loading' ? html`<div class="loading"><cc-loader></cc-loader></div>` : ''}
        ${this.state.type === 'error' ? html`<div class="error">An error occurred while contacting backend</div>` : ''}
        ${this.state.type === 'loaded' || this.state.type === 'fetching-keys'
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
                <cc-button primary @cc-button:click=${this._onAddButtonClick}>Add new key</cc-button>
              </div>
              ${this._renderKeys()}
              <div class="detail">${this._renderDetail()}</div>
              ${this._renderShell()}
            `
          : ''}
      </div>
    `;
  }

  _renderKeys() {
    if (this.state.type !== 'loaded' && this.state.type !== 'fetching-keys') {
      return html`<div class="keys-area"></div>`;
    }

    if (this.state.type === 'loaded' && this.state.keys.length === 0) {
      return html`
        <div class="keys-area">
          <cc-notice intent="info" message="No keys"></cc-notice>
        </div>
      `;
    }

    const fetching = this.state.type === 'fetching-keys';
    const isInitialFetch = this.state.keys.length === 0;

    /** @type {Array<{keyState: CcRedisKeyState, skeleton: boolean}>} */
    let keys = this.state.keys.map((keyState) => ({ keyState, skeleton: false }));
    if (fetching) {
      keys = keys.concat(SKELETON_KEYS);
    }

    /**
     * @param {{keyState: CcRedisKeyState, skeleton: boolean}} k
     * @return {TemplateResult}
     */
    const renderItem = (k) => this._renderKey(k);

    return html`
      <ul class="keys-area keys-list" @change=${this._onSelectedKeyChange}>
        ${repeat(
          keys,
          /** @param {{keyState: CcRedisKeyState, skeleton: boolean}} k */
          (k) => `${k.skeleton}-${k.keyState.key.key}`,
          renderItem,
        )}
        <li class="load-more">
          ${!isInitialFetch && (this.state.type === 'fetching-keys' || this.state.hasMore)
            ? html`
                <cc-button
                  .waiting=${fetching && !isInitialFetch}
                  .disabled=${fetching}
                  link
                  @cc-button:click=${this._onLoadMoreButtonClick}
                  >Load more</cc-button
                >
              `
            : ''}
        </li>
      </ul>
    `;
  }

  /**
   * @param {object} _
   * @param {CcRedisKeyState} _.keyState
   * @param {boolean} _.skeleton
   * @return {TemplateResult}
   */
  _renderKey({ keyState, skeleton }) {
    const selected = keyState.type === 'selected';
    const loading = keyState.type === 'loading';
    const deleting = keyState.type === 'deleting';
    const id = `key-${keyState.key.key}`;

    return html`<li class="key">
      <input
        type="radio"
        id=${id}
        name="selectedKey"
        .value=${keyState.key.key}
        .checked=${selected || loading}
        .disabled=${skeleton}
      />
      <label for=${id}>
        <span class=${classMap({ 'key-name': true, skeleton })}>${keyState.key.key}</span>
        <cc-badge weight="outlined" ?skeleton=${skeleton}>${keyState.key.type}</cc-badge>
        <cc-button
          ?disabled=${loading || skeleton}
          ?waiting=${deleting}
          ?skeleton=${skeleton}
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
    if (this.keyEditorFormState.type === 'add') {
      return this._renderAddForm(this.keyEditorFormState.formState);
    } else if (this.keyEditorFormState.type === 'update') {
      return this._renderUpdateForm(
        this.keyEditorFormState.formState,
        { key: this.keyEditorFormState.keyValue.key, type: this.keyEditorFormState.keyValue.type },
        this.keyEditorFormState.keyValue,
      );
    } else if (this.keyEditorFormState.type === 'loading') {
      return this._renderUpdateForm(
        { type: 'idle' },
        { key: this.keyEditorFormState.key.key, type: this.keyEditorFormState.key.type },
      );
    }

    return null;
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
      ${getKeyEditor(this._addFormSelectedType).render(null, false)}
      <div class="buttons">
        <cc-button type="reset" .disabled=${saving}>Reset</cc-button>
        <cc-button type="submit" primary .waiting=${saving}>Add</cc-button>
      </div>
    </form>`;
  }

  /**
   * @param {CcRedisExplorerKeyUpdateFormState} formState
   * @param {CcRedisKey} key
   * @param {CcRedisKeyValue} [keyValue]
   * @return {TemplateResult}
   */
  _renderUpdateForm(formState, key, keyValue) {
    const editor = getKeyEditor(key.type);
    if (editor == null) {
      return html`Unsupported type`;
    }

    const saving = formState.type === 'updating';
    const deleting = this._isDeleting(key.key);
    const loading = this._getLoadingKey() != null;

    return html`<form ${ref(this._updateFormRef)} ${formSubmit(this._onKeyEditorUpdateFormSubmit.bind(this))}>
      <cc-input-text name="key" label="Key" required disabled .value=${key.key} .resetValue=${key.key}></cc-input-text>
      <cc-select
        name="type"
        label="Type"
        required
        disabled
        .options=${REDIS_TYPES_OPTIONS}
        .value=${key.type}
        .resetValue=${key.type}
      ></cc-select>
      ${editor.render(keyValue, loading)}
      <div class="buttons">
        <cc-button type="reset" .skeleton=${loading} .disabled=${saving || deleting}>Reset</cc-button>
        <cc-button type="submit" primary .skeleton=${loading} .waiting=${saving || deleting}>Save</cc-button>
        <cc-button type="button" danger outlined .skeleton=${loading} .disabled=${saving || deleting}>Delete</cc-button>
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
            ${ref(this._shellPromptRef)}
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

  /**
   *
   * @param {string} key
   * @return {boolean}
   * @private
   */
  _isDeleting(key) {
    if (this.state.type !== 'loaded') {
      return false;
    }

    const keyState = this.state.keys.find((keyState) => keyState.key.key === key);

    return keyState?.type === 'deleting';
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          background-color: var(--cc-color-bg-default, #fff);
          display: block;
        }

        .wrapper {
          display: grid;
          grid-gap: 1em;
          grid-template-areas:
            'top-bar top-bar'
            'keys-list detail'
            'shell shell';
          grid-template-columns: minmax(auto, 400px) 1fr;
          grid-template-rows: auto 1fr;
          height: 100%;
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
          overflow: auto;
          padding: 0;
        }

        .keys-area > cc-notice {
          margin: 0.5em;
        }

        .filters {
          display: flex;
          flex: 1;
          gap: 0.5em;
        }

        .detail {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-area: detail;
        }

        .filters cc-input-text {
          flex: 1;
        }

        .keys-list {
          list-style-type: none;
          margin: 0;
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
          cursor: pointer;
          display: flex;
          flex: 1;
          flex-direction: row;
          gap: 0.25em;
          padding: 0.35em;
        }

        .key label:hover {
          background-color: var(--cc-color-bg-neutral-hovered, #e7e7e7);
        }

        .key:nth-child(odd) {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
        }

        .key input[type='radio']:checked + label {
          background-color: var(--cc-color-bg-neutral-active, #d9d9d9);
        }

        .key input[type='radio']:focus + label {
          /* border-color: var(--cc-focus-outline, #595959); */
          /* border: var(--cc-focus-outline, #000 solid 2px); */
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: -2px;
        }

        .key-name {
          flex: 1;
        }

        .key-name.skeleton {
          background-color: #bbb;
        }

        .load-more {
          align-items: center;
          justify-content: center;
          display: flex;
          padding: 0.35em;
        }

        .detail form {
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 1em;
        }

        .buttons {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
        }

        .buttons cc-button:last-of-type {
          margin-left: auto;
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

        .shell-prompt {
          display: flex;
        }

        .result {
          white-space: pre-wrap;
        }

        .result.error {
          color: red;
        }

        .shell-prompt input {
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

        .shell-prompt input:focus,
        .shell-prompt input:active {
          outline: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-redis-explorer', CcRedisExplorer);
