import { css, html } from 'lit';
import { iconRemixAddFill as iconAdd, iconRemixDeleteBinFill as iconDelete } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @import { EventWithTarget, GenericEventWithTarget } from '../../lib/events.types.js'
 * @import { FormControlData, FormDataMap } from '../../lib/form/form.types.js'
 * @import { PropertyValues } from 'lit'
 */

/**
 * A form control element for editing a list of hash entries.
 *
 * A hash entry is made of two properties:
 *
 * * the `field`: a string value that can be empty,
 * * the `value`: a multiline string value that can be empty.
 *
 * It does not allow to have an empty list of entries.
 *
 * There is no control of the unicity of the fields.
 *
 * @cssdisplay block
 */
export class CcKvHashInput extends CcFormControlElement {
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

    /** @type {boolean} - Whether the control element should be disabled or not  */
    this.disabled = false;

    /** @type {boolean} - Whether the control element should be readonly or not */
    this.readonly = false;

    /** @type {Array<{field: string, value: string}>} - The value to set when the associated form is reset */
    this.resetValue = [];

    /** @type {Array<{field: string, value: string}>} - The value */
    this.value = [];

    new LostFocusController(this, '.element', ({ suggestedElement }) => {
      focusBySelector(suggestedElement, '.delete-button', () => {
        this._focusLastFieldInput();
      });
    });

    this._renderElement = this._renderElement.bind(this);
  }

  /**
   * Helps to decode the form data into an Array of hash entries.
   *
   * @param {FormDataMap} formData - The form data to decode
   * @param {string} fieldName - The name of control element where is stored the input data
   * @return {Array<{field: string, value: string}>}
   */
  static decodeFormData(formData, fieldName) {
    const data = formData[fieldName];
    const values = /** @type {Array<string>} */ (Array.isArray(data) ? data : [data]);
    return values.map((entry) => JSON.parse(entry));
  }

  /**
   * @param {FocusOptions} [options]
   */
  focus(options) {
    this._focusLastFieldInput(options);
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   */
  _getFormControlElement() {
    return this._getLastFieldInput();
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
    this.value.forEach((entry) => {
      data.append(this.name, JSON.stringify(entry));
    });
    return data;
  }

  /* endregion */

  /* region Private methods */

  /**
   * @return {HTMLElement}
   */
  _getLastFieldInput() {
    const all = this.shadowRoot.querySelectorAll('.input-field');
    return /** @type {HTMLElement} */ (all[all.length - 1]);
  }

  /**
   * @param {FocusOptions} [options]
   */
  _focusLastFieldInput(options) {
    this._getLastFieldInput().focus(options);
  }

  /* endregion */

  async _onAdd() {
    this.value = [...this.value, { field: '', value: '' }];

    await this.updateComplete;
    this._focusLastFieldInput();
  }

  /**
   * @param {EventWithTarget} e
   */
  _onDelete(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.filter((_, i) => i !== index);
  }

  /**
   * @param {GenericEventWithTarget<InputEvent, HTMLInputElement>} e
   */
  _onFieldInput(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.map((it, i) => (i === index ? { field: e.target.value, value: it.value } : it));
  }

  /**
   * @param {GenericEventWithTarget<InputEvent, HTMLInputElement>} e
   */
  _onValueInput(e) {
    const index = Number.parseInt(e.target.dataset.index);
    this.value = this.value.map((it, i) => (i === index ? { field: it.field, value: e.target.value } : it));
  }

  /**
   * @param {PropertyValues<CcKvHashInput>} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('value')) {
      if (this.value == null || this.value.length === 0) {
        this.value = [{ field: '', value: '' }];
      }
    }
  }

  render() {
    return html`
      <div class="elements">
        <span>${i18n('cc-kv-hash-input.header.field')}</span>
        <span class="element-last">${i18n('cc-kv-hash-input.header.value')}</span>
        ${this.value.map(this._renderElement)}
      </div>
    `;
  }

  /**
   * @param {{field: string, value: string}} element
   * @param {number} index
   */
  _renderElement(element, index) {
    const len = this.value.length;
    const isLast = index === len - 1;
    const isAlone = len === 1;

    return html`
      <div class="element">
        <cc-input-text
          class="input-field"
          label=${i18n('cc-kv-hash-input.element.field-input')}
          .value=${element.field}
          hidden-label
          data-index=${index}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @cc-input=${this._onFieldInput}
          @cc-request-submit=${this._onAdd}
        ></cc-input-text>
        <cc-input-text
          label=${i18n('cc-kv-hash-input.element.value-input')}
          .value=${element.value}
          hidden-label
          data-index=${index}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          multi
          @cc-input=${this._onValueInput}
          @cc-request-submit=${this._onAdd}
        ></cc-input-text>

        ${!isAlone
          ? html`
              <cc-button
                class="delete-button"
                .icon=${iconDelete}
                a11y-name=${i18n('cc-kv-hash-input.element.delete', { index })}
                data-index=${index}
                ?disabled=${this.disabled || this.readonly}
                hide-text
                danger
                outlined
                @cc-click=${this._onDelete}
              ></cc-button>
            `
          : ''}
        ${isLast
          ? html`
              <cc-button
                .icon=${iconAdd}
                a11y-name=${i18n('cc-kv-hash-input.element.add')}
                data-index=${index}
                ?disabled=${this.disabled || this.readonly}
                hide-text
                outlined
                @cc-click=${this._onAdd}
              ></cc-button>
            `
          : html`<div></div>`}
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .elements {
          display: grid;
          gap: 0.35em;
          grid-template-columns: 1fr 1fr auto auto;
        }

        .element-last {
          grid-column: 2 / -1;
        }

        .element {
          display: contents;
        }

        .input-field {
          align-self: start;
        }

        cc-button {
          margin-top: 2px;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-kv-hash-input-beta', CcKvHashInput);
