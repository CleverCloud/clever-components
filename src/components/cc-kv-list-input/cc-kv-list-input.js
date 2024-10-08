import { css, html } from 'lit';
import { iconRemixAddFill as iconAdd, iconRemixDeleteBinFill as iconDelete } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('../../lib/events.types.js').EventWithTarget} EventWithTarget
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/form/form.types.js').FormControlData} FormControlData
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('lit').PropertyValues<CcKvListInput>} PropertyValues
 */

/**
 * A form control element for editing a list of element.
 *
 * Each element can be a multiline string value that can be empty.
 *
 * It does not allow to have an empty list of entries.
 *
 * @cssdisplay block
 */
export class CcKvListInput extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      resetValue: { type: Array, attribute: 'reset-value' },
      value: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {boolean} - Whether the control element should be disabled or not */
    this.disabled = false;

    /** @type {boolean} - Whether the control element should be readonly or not */
    this.readonly = false;

    /** @type {Array<string>} - The value to set when the associated form is reset */
    this.resetValue = [];

    /** @type {Array<string>} - The value */
    this.value = [];

    new LostFocusController(this, '.element', ({ suggestedElement }) => {
      focusBySelector(suggestedElement, '.delete-button', () => {
        this._focusLastElementInput();
      });
    });

    this._renderItem = this._renderItem.bind(this);
  }

  /**
   * Helps to decode the form data into an Array of strings.
   *
   * @param {FormDataMap} formData - The form data to decode
   * @param {string} fieldName - The name of control element where is stored the input data
   * @return {Array<string>}
   */
  static decodeFormData(formData, fieldName) {
    const data = formData[fieldName];
    return /** @type {Array<string>} */ (Array.isArray(data) ? data : [data]);
  }

  /**
   * @param {FocusOptions} [options]
   */
  focus(options) {
    this._focusLastElementInput(options);
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   */
  _getFormControlElement() {
    return this._getLastElementInput();
  }

  /**
   * @return {HTMLElement}
   */
  _getErrorElement() {
    return null;
  }

  /**
   * @return {FormControlData}
   */
  _getFormControlData() {
    const data = new FormData();
    this.value.forEach((value) => {
      data.append(this.name, value);
    });
    return data;
  }

  /* endregion */

  /* region Private methods */

  /**
   * @return {HTMLElement}
   */
  _getLastElementInput() {
    const all = this.shadowRoot.querySelectorAll('.element-value-input');
    return /** @type {HTMLElement} */ (all[all.length - 1]);
  }

  /**
   * @param {FocusOptions} [options]
   */
  _focusLastElementInput(options) {
    this._getLastElementInput().focus(options);
  }

  /* endregion */

  async _onAdd() {
    this.value = [...this.value, ''];

    await this.updateComplete;
    this._focusLastElementInput();
  }

  /**
   * @param {EventWithTarget} e
   */
  _onDelete(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.filter((_, i) => i !== index);
  }

  /**
   * @param {HTMLInputElementEvent} e
   */
  _onValueInput(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.map((it, i) => (i === index ? e.target.value : it));
  }

  /**
   * @param {PropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('value')) {
      if (this.value == null || this.value.length === 0) {
        this.value = [''];
      }
    }
  }

  render() {
    return html`
      <div class="elements">
        <span class="element-last">${i18n('cc-kv-list-input.header.elements')}</span>
        ${this.value.map(this._renderItem)}
      </div>
    `;
  }

  /**
   * @param {string} element
   * @param {number} index
   */
  _renderItem(element, index) {
    const len = this.value.length;
    const isLast = index === len - 1;
    const isAlone = len === 1;

    return html`<div class="element">
      <cc-input-text
        class="element-value-input"
        label=${i18n('cc-kv-list-input.element.value-input')}
        .value=${element}
        hidden-label
        data-index=${index}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        multi
        @cc-input-text:input=${this._onValueInput}
        @cc-input-text:requestimplicitsubmit=${this._onAdd}
      ></cc-input-text>

      ${!isAlone
        ? html`
            <cc-button
              class="delete-button"
              .icon=${iconDelete}
              a11y-name=${i18n('cc-kv-list-input.element.delete', { index })}
              data-index=${index}
              ?disabled=${this.disabled || this.readonly}
              hide-text
              danger
              outlined
              @cc-button:click=${this._onDelete}
            ></cc-button>
          `
        : ''}
      ${isLast
        ? html`
            <cc-button
              .icon=${iconAdd}
              a11y-name=${i18n('cc-kv-list-input.element.add')}
              data-index=${index}
              ?disabled=${this.disabled || this.readonly}
              hide-text
              outlined
              @cc-button:click=${this._onAdd}
            ></cc-button>
          `
        : html`<div></div>`}
    </div>`;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .elements {
          column-gap: 0.5em;
          display: grid;
          grid-template-columns: 1fr auto auto;
          padding: 0.25em;
          row-gap: 0.25em;
        }

        .element-last {
          grid-column: 1 / -1;
        }

        .element {
          display: contents;
        }

        cc-button {
          margin-top: 2px;
        }
      `,
    ];
  }
}

window.customElements.define('cc-kv-list-input-beta', CcKvListInput);
