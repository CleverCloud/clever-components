import '@lit-labs/virtualizer';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddLine as iconAdd,
  iconRemixCheckFill as iconCheck,
  iconRemixFileCopyLine as iconCopy,
  iconRemixCloseFill as iconCross,
  iconRemixSearchLine as iconFilter,
  iconRemixEditFill as iconPen,
} from '../../assets/cc-remix.icons.js';
import { copyToClipboard } from '../../lib/clipboard.js';
import { fakeString } from '../../lib/fake-strings.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { isStringEmpty, random } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import {
  CcKvListElementAddEvent,
  CcKvListElementUpdateEvent,
  CcKvListExplorerStateChangeEvent,
  CcKvListFilterChangeEvent,
  CcKvListLoadMoreEvent,
} from './cc-kv-list-explorer.events.js';

/** @type {Array<{state: CcKvListElementState, skeleton: boolean}>} */
const SKELETON_ELEMENTS = Array(5)
  .fill(0)
  .map((_, index) => ({
    state: { type: 'idle', index, value: fakeString(random(10, 20)) },
    skeleton: true,
  }));

/** @type {number} */
const LOAD_MORE_THRESHOLD = 5;

/**
 * @typedef {import('./cc-kv-list-explorer.types.js').CcKvListExplorerState} CcKvListExplorerState
 * @typedef {import('./cc-kv-list-explorer.types.js').CcKvListElementState} CcKvListElementState
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('../../lib/events.types.js').EventWithTarget} EventWithTarget
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('lit/directives/ref.js').Ref<CcInputText>} CcInputTextRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('lit/directives/ref.js').Ref<Virtualizer>} VirtualizerRef
 * @typedef {import('@lit-labs/virtualizer/events.js').VisibilityChangedEvent} VisibilityChangedEvent
 * @typedef {import('@lit-labs/virtualizer/LitVirtualizer.js').LitVirtualizer} Virtualizer
 */

/**
 * A component displaying an explorer for a kv `list` data type.
 *
 * It offers the ability to:
 *
 * * show elements
 * * dynamically ask for more elements when scrolling to the bottom of the elements panel
 * * ask for elements filtering
 * * ask for any element update
 * * ask for any element addition
 * * copy any element value to the clipboard
 *
 * @cssdisplay block
 */
export class CcKvListExplorer extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {boolean} - Whether all actions should be disabled */
    this.disabled = false;

    /** @type {CcKvListExplorerState} - The state of the component */
    this.state = { type: 'loading' };

    /** @type {'tail'|'head'} */
    this._addFormPosition = 'tail';

    /** @type {HTMLFormElementRef} */
    this._addFormRef = createRef();

    /** @type {CcInputTextRef} */
    this._editElementValueRef = createRef();

    /** @type {VirtualizerRef} */
    this._elementsRef = createRef();

    // this is for lit-virtualizer
    this._elementRender = {
      /** @param {{state: CcKvListElementState, skeleton: boolean}} e */
      key: (e) => e.state.value,
      /**
       * @param {{state: CcKvListElementState, skeleton: boolean}} e
       * @param {number} index
       */
      item: (e, index) => this._renderElement(e.state, e.skeleton, index),
    };
    this._onStartEdit = this._onStartEdit.bind(this);
    this._onCancelEdit = this._onCancelEdit.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    // this is for form submission
    this._onAddFormSubmit = this._onAddFormSubmit.bind(this);
    this._onFilterFormSubmit = this._onFilterFormSubmit.bind(this);
  }

  /**
   * Resets the add form.
   *
   * @param {boolean} [focus] Whether to focus the value input.
   */
  resetAddForm(focus = true) {
    this._addFormRef.value.reset();
    if (focus) {
      this._addFormRef.value.value.focus();
    }
  }

  /**
   * @return {Array<{state: CcKvListElementState, skeleton: boolean}>}
   */
  _getElements() {
    switch (this.state.type) {
      case 'loading':
      case 'filtering':
        return SKELETON_ELEMENTS;
      case 'loaded':
        return this.state.elements.map((state) => ({ state, skeleton: false }));
      case 'loading-more':
        return [...this.state.elements.map((state) => ({ state, skeleton: false })), ...SKELETON_ELEMENTS];
    }
  }

  /**
   * @param {VisibilityChangedEvent} e
   */
  _onVisibilityChanged(e) {
    if (
      this.state.type === 'loaded' &&
      this.state.elements.length > 0 &&
      e.last >= this.state.elements.length - LOAD_MORE_THRESHOLD
    ) {
      this.dispatchEvent(new CcKvListLoadMoreEvent());
    }
  }

  /**
   * @param {EventWithTarget} e
   */
  async _onStartEdit(e) {
    if (this.state.type === 'loading') {
      return;
    }

    const index = Number(e.target.dataset.index);

    this.state = {
      ...this.state,
      elements: this.state.elements.map((e) => {
        if (e.type === 'editing') {
          return { type: 'idle', index: e.index, value: e.value };
        }
        if (e.index === index) {
          return { type: 'editing', index: e.index, value: e.value };
        }
        return e;
      }),
    };

    this.dispatchEvent(new CcKvListExplorerStateChangeEvent(this.state));

    await this._elementsRef.value.layoutComplete;
    this._editElementValueRef.value.focus();
  }

  /**
   * @param {EventWithTarget} e
   */
  _onCancelEdit(e) {
    if (this.state.type === 'loading') {
      return;
    }

    const index = Number(e.target.dataset.index);

    this.state = {
      ...this.state,
      elements: this.state.elements.map((e) => {
        if (e.index === index) {
          return { type: 'idle', index: e.index, value: e.value };
        }
        return e;
      }),
    };

    this.dispatchEvent(new CcKvListExplorerStateChangeEvent(this.state));
  }

  /**
   * @param {EventWithTarget} e
   */
  _onCopyKeyButtonClick(e) {
    copyToClipboard(e.target.dataset.text);
  }

  /**
   * @param {EventWithTarget} e
   */
  _onUpdate(e) {
    if (this.state.type === 'loading') {
      return;
    }
    const index = Number(e.target.dataset.index);
    this.dispatchEvent(new CcKvListElementUpdateEvent({ index, value: this._editElementValueRef.value.value }));
  }

  /**
   * @param {FormDataMap} formData
   */
  _onFilterFormSubmit(formData) {
    if (this.state.type === 'loading') {
      return;
    }
    const pattern = /** @type {string} */ (formData.pattern);
    const index = isStringEmpty(pattern) ? null : Number(pattern);
    this.dispatchEvent(new CcKvListFilterChangeEvent(index));
  }

  /**
   * @param {FormDataMap} formData
   */
  _onAddFormSubmit(formData) {
    if (this.state.type === 'loading') {
      return;
    }

    this._addFormPosition = /** @type {'tail'|'head'} */ (formData.position);
    const value = /** @type {string} */ (formData.value);

    this.dispatchEvent(new CcKvListElementAddEvent({ position: this._addFormPosition, value }));
  }

  render() {
    const isLoading = this.state.type === 'loading';
    const isFiltering = this.state.type === 'filtering';
    const hasNoElements = this.state.type === 'loaded' && this.state.elements.length === 0;
    const elements = this._getElements();

    return html`
      <div class="wrapper">
        <form class="top-bar" ${formSubmit(this._onFilterFormSubmit)}>
          <cc-input-text
            name="pattern"
            inline
            label=${i18n('cc-kv-list-explorer.filter')}
            ?disabled=${this.disabled}
            ?readonly=${isLoading || isFiltering}
          ></cc-input-text>
          <cc-button
            type="submit"
            .icon=${iconFilter}
            hide-text
            outlined
            ?disabled=${this.disabled || isLoading}
            ?waiting=${isFiltering}
          >
            ${i18n('cc-kv-list-explorer.filter.apply')}
          </cc-button>
        </form>

        ${hasNoElements
          ? html`
              <div class="no-results">
                <cc-notice intent="info" message="${i18n('cc-kv-list-explorer.no-results')}"></cc-notice>
              </div>
            `
          : ''}
        ${!hasNoElements
          ? html`
              <div class="header">
                <div>${i18n('cc-kv-list-explorer.header.index')}</div>
                <div>${i18n('cc-kv-list-explorer.header.value')}</div>
              </div>
              <lit-virtualizer
                ${ref(this._elementsRef)}
                class="elements"
                ?scroller=${true}
                .items=${elements}
                .keyFunction=${this._elementRender.key}
                .renderItem=${this._elementRender.item}
                @visibilityChanged=${this._onVisibilityChanged}
              ></lit-virtualizer>
            `
          : ''}
        ${this._renderAddForm()}
      </div>
    `;
  }

  /**
   * @param {CcKvListElementState} state
   * @param {boolean} skeleton
   * @param {number} index
   * @return {TemplateResult}
   */
  _renderElement(state, skeleton, index) {
    const isEditing = state.type === 'editing' || state.type === 'updating';

    return html`
      <div class="element">
        <div class=${classMap({ 'element-index': true, skeleton })}>${state.index}</div>
        <div class="element-value">
          ${isEditing
            ? html`
                <cc-input-text
                  class="element-value-input"
                  ${ref(this._editElementValueRef)}
                  label=${i18n('cc-kv-list-explorer.element.edit.value-input')}
                  .value=${state.value}
                  data-index=${state.index}
                  hidden-label
                  multi
                  ?skeleton=${skeleton}
                  ?readonly=${state.type === 'updating'}
                  @cc-request-submit=${this._onUpdate}
                ></cc-input-text>
              `
            : ''}
          ${!isEditing ? html`<span class="element-value-span ${classMap({ skeleton })}">${state.value}</span>` : ''}

          <div class="element-value-buttons">${this._renderElementButtons(state, skeleton, isEditing, index)}</div>
        </div>
      </div>
    `;
  }

  /**
   * @param {CcKvListElementState} state
   * @param {boolean} skeleton
   * @param {boolean} isEditing
   * @param {number} index
   * @return {TemplateResult}
   */
  _renderElementButtons(state, skeleton, isEditing, index) {
    const firstButton = isEditing
      ? {
          icon: iconCross,
          class: 'edit-cancel-button',
          onClick: this._onCancelEdit,
          label: i18n('cc-kv-list-explorer.element.edit.cancel'),
          outlined: true,
          primary: false,
          danger: false,
          waiting: false,
          disabled: state.type === 'updating',
        }
      : {
          icon: iconPen,
          class: 'edit-start-button',
          onClick: this._onStartEdit,
          label: i18n('cc-kv-list-explorer.element.edit.start', { index }),
          outlined: true,
          primary: true,
          danger: false,
          waiting: false,
          disabled: false,
        };

    const secondBtn = isEditing
      ? {
          icon: iconCheck,
          class: 'edit-validate-button',
          onClick: this._onUpdate,
          label: i18n('cc-kv-list-explorer.element.edit.save'),
          outlined: false,
          primary: true,
          danger: false,
          waiting: state.type === 'updating',
          disabled: false,
        }
      : null;

    return html`
      <cc-button
        class=${firstButton.class}
        .icon=${firstButton.icon}
        a11y-name=${firstButton.label}
        data-index=${state.index}
        hide-text
        ?outlined=${firstButton.outlined}
        ?skeleton=${skeleton}
        ?danger=${firstButton.danger}
        ?primary=${firstButton.primary}
        ?disabled=${firstButton.disabled || this.disabled}
        ?waiting=${firstButton.waiting}
        @cc-click=${firstButton.onClick}
      ></cc-button>
      ${secondBtn != null
        ? html`
            <cc-button
              class=${secondBtn.class}
              .icon=${secondBtn.icon}
              a11y-name=${secondBtn.label}
              data-index=${state.index}
              hide-text
              ?outlined=${secondBtn.outlined}
              ?skeleton=${skeleton}
              ?danger=${secondBtn.danger}
              ?primary=${secondBtn.primary}
              ?disabled=${secondBtn.disabled || this.disabled}
              ?waiting=${secondBtn.waiting}
              @cc-click=${secondBtn.onClick}
            ></cc-button>
          `
        : ''}
      <cc-button
        .icon=${iconCopy}
        outlined
        hide-text
        data-text=${state.value}
        ?skeleton=${skeleton}
        ?disabled=${this.disabled}
        @cc-click=${this._onCopyKeyButtonClick}
        >${i18n('cc-kv-list-explorer.element.copy', { index })}</cc-button
      >
    `;
  }

  _renderAddForm() {
    const positionOptions = [
      { label: i18n('cc-kv-list-explorer.add-form.element-position.tail'), value: 'tail' },
      { label: i18n('cc-kv-list-explorer.add-form.element-position.head'), value: 'head' },
    ];

    const isLoading = this.state.type === 'loading';
    const isFiltering = this.state.type === 'filtering';
    const isAdding = this.state.type !== 'loading' && this.state.addForm.type === 'adding';
    const isReadonly = isLoading || isFiltering || isAdding;

    return html`<form class="add-form" ${ref(this._addFormRef)} ${formSubmit(this._onAddFormSubmit)}>
      <cc-select
        name="position"
        label=${i18n('cc-kv-list-explorer.add-form.element-position')}
        .options=${positionOptions}
        .value=${this._addFormPosition}
        .resetValue=${this._addFormPosition}
        ?disabled=${this.disabled}
        inline
      ></cc-select>
      <cc-input-text
        name="value"
        label=${i18n('cc-kv-list-explorer.add-form.element-value')}
        ?readonly=${isReadonly}
        ?disabled=${this.disabled}
        inline
        multi
      ></cc-input-text>
      <cc-button
        type="submit"
        a11y-name=${i18n('cc-kv-list-explorer.add-form.submit.a11y')}
        .icon=${iconAdd}
        ?waiting=${isAdding}
        ?disabled=${isLoading || isFiltering || this.disabled}
        >${i18n('cc-kv-list-explorer.add-form.submit')}</cc-button
      >
    </form>`;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .top-bar {
          align-items: center;
          border-bottom: 1px solid var(--cc-color-border-neutral-strong);
          display: grid;
          gap: 0.5em;
          grid-template-columns: 1fr auto;
          padding: 0.5em;
        }

        .elements {
          flex: 1;
        }

        .element,
        .header {
          align-items: center;
          display: grid;
          gap: 0.5em;
          grid-template-columns: 0.25fr 1fr;
          padding: 0.25em 0.5em;
          width: 100%;
        }

        .element-value {
          align-items: center;
          display: grid;
          gap: 0.5em;
          grid-template-columns: 1fr auto;
        }

        .element-index,
        .element-value-span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header {
          background-color: var(--cc-color-bg-neutral-active, #d9d9d9);
          font-weight: bold;
          padding: 0.5em;
          width: unset;
        }

        .element:nth-child(odd) {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
        }

        .element:hover {
          background-color: var(--cc-color-bg-neutral-hovered, #e7e7e7);
        }

        .element-value-input {
          margin: 0.15em 0;
        }

        .element-value-buttons {
          display: flex;
          gap: 0.35em;
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }

        .no-results {
          align-items: center;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          padding: 0.5em;
        }

        .add-form {
          border-top: 1px solid var(--cc-color-border-neutral-strong);
          display: flex;
          gap: 1em;
          padding: 0.5em;
        }

        .add-form cc-input-text {
          flex: 1;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-kv-list-explorer-beta', CcKvListExplorer);
