import { css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { RequiredValidator } from '../../lib/form/validation.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-picker-option/cc-picker-option.js';
import { CcSelectEvent } from '../common.events.js';

const DEFAULT_ERROR_MESSAGES = {
  get empty() {
    return i18n('cc-select.error.empty');
  },
};

/**
 * @typedef {import('./cc-picker.types.js').PickerOption} PickerOption
 * @typedef {import('../cc-picker-option/cc-picker-option.types.js').PickerOptionSelectionStyle} PickerOptionSelectionStyle
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../lib/form/validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLSelectElement>} HTMLSelectElementRef
 */

/**
 * A generic picker component that allows users to select from a list of options displayed as tiles.
 *
 * Once a value is selected, it cannot be unselected without script.
 *
 * It extends `CcFormControlElement`, so it can be used in a form and its value can be submitted.
 *
 * @cssdisplay inline-block
 *
 * @csspart tiles - Styles the tiles container, mainly to modify their layout.
 *
 * @cssprop {Size} --cc-form-label-gap - The space between the label and the control (defaults: `0.35em`).
 * @cssprop {Size} --cc-form-label-gap-inline - The space between the label and the control when layout is inline (defaults: `0.75em`).
 * @cssprop {Color} --cc-input-label-color - The color for the input's label (defaults: `inherit`).
 * @cssprop {FontSize} --cc-input-label-font-size - The font-size for the input's label (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-input-label-font-weight - The font-weight for the input's label (defaults: `normal`).
 * @cssprop {Width} --cc-picker-tiles-width - Sets the width of the form control content (defaults: `fit-content`).
 * @cssprop {Size} --cc-picker-tiles-indent - horizontal space between the start of the line and the tiles (defaults: `0.25em`).
 *
 * @slot help - The help message to be displayed right below the tiles. Please use a `<p>` tag.
 */
export class CcPicker extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      // eslint-disable-next-line lit/no-native-attributes
      autofocus: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      label: { type: String },
      options: { type: Array },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      resetValue: { type: String, attribute: 'reset-value' },
      selectionStyle: { type: String, reflect: true, attribute: 'selection-style' },
      value: { type: String },
    };
  }

  static reactiveValidationProperties = ['required', 'options'];

  constructor() {
    super();

    /** @type {boolean} Automatically focus the picker when the page loads. **Note:** Using this attribute is generally discouraged for accessibility reasons. See [MDN autofocus accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus#accessibility_concerns) for more information. */
    this.autofocus = false;

    /** @type {boolean} Whether the component should be disabled (default: 'false') */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the tiles.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string} The label describing the picker, displayed on before the tiles (default: '') */
    this.label = '';

    /** @type {PickerOptionSelectionStyle} How tiles selected state is rendered (default: 'check') */
    this.selectionStyle = 'check';

    /** @type {PickerOption[]} The list of options */
    this.options = null;

    /** @type {boolean} Whether the component should be readonly when not disabled (default: 'false') */
    this.readonly = false;

    /** @type {boolean} Sets the "required" text inside the label. */
    this.required = false;

    /** @type {string|null} Sets the `value` to set when parent `<form>` element is reset. */
    this.resetValue = null;

    /** @type {string|null} Current selected value */
    this.value = null;

    /** @type {HTMLElementRef} */
    this._errorRef = createRef();

    /** @type {HTMLSelectElementRef} */
    this._pickerRef = createRef();
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getFormControlElement() {
    return this._pickerRef.value;
  }

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getErrorElement() {
    return this._errorRef.value;
  }

  /**
   * @return {ErrorMessageMap}
   * @protected
   */
  _getErrorMessages() {
    return DEFAULT_ERROR_MESSAGES;
  }

  /**
   * @return {Validator}
   * @protected
   */
  _getValidator() {
    return this.required ? new RequiredValidator() : null;
  }

  /**
   * @return {Array<string>}
   * @protected
   */
  _getReactiveValidationProperties() {
    return CcPicker.reactiveValidationProperties;
  }

  /* endregion */

  /**
   * Triggers focus on the fieldset element.
   */
  focus() {
    this._pickerRef.value?.focus();
  }

  /**
   * @param {HTMLInputElementEvent} e
   * @private
   */
  _onTileSelect(e) {
    if (this.readonly) {
      return;
    }

    this.value = e.target.value;
    this.dispatchEvent(new CcSelectEvent(this.value));
  }

  /**
   * @param {number} index
   * @param {string} value
   * @return {boolean}
   * @private
   */
  _shouldAutoFocus(index, value) {
    if (!isStringEmpty(this.value)) {
      return this.value === value;
    }

    const firstFocusableIndex = this.options.findIndex((option) => !option.disabled);
    return index === firstFocusableIndex;
  }

  render() {
    if (this.options?.length === 0) {
      return '';
    }

    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';

    return html`
      <fieldset class="fieldset" @input=${this._onTileSelect} ${ref(this._pickerRef)} tabindex="-1">
        <div class="fieldset-content">
          <legend class="legend">
            <span class="legend-text">${this.label}</span>
            ${this.required ? html` <span class="required">${i18n('cc-picker.required')}</span> ` : ''}
          </legend>

          <div class="tiles" part="tiles">
            ${this.options.map((option, index) => this._renderOption(option, hasErrorMessage, index))}
          </div>

          <div class="help-container" id="help-id">
            <slot name="help"></slot>
          </div>

          ${hasErrorMessage
            ? html`<p class="error-container" id="error-id" ${ref(this._errorRef)}>${this.errorMessage}</p>`
            : ''}
        </div>
      </fieldset>
    `;
  }

  /**
   * @param {PickerOption} option
   * @param {boolean} isError
   * @param {number} index
   * @private
   */
  _renderOption(option, isError, index) {
    const { body, footer, value, disabled } = option;
    const id = this.name + '-' + value;
    const isChecked = this.value === value;
    const isDisabled = this.disabled || disabled;
    const isReadonly = !isChecked && !isDisabled && this.readonly;
    const isAutofocus = this.autofocus && this._shouldAutoFocus(index, value);

    return html`
      <input
        class="visually-hidden"
        type="radio"
        id="${id}"
        name="${this.name}"
        .value=${value}
        .checked=${isChecked}
        ?disabled=${isDisabled || (isReadonly && !isChecked)}
        aria-describedby="help-id error-id"
        ?autofocus=${isAutofocus}
      />
      <label for="${id}">
        <cc-picker-option
          ?selected=${isChecked}
          ?disabled=${isDisabled}
          ?readonly=${isReadonly}
          ?error=${isError}
          selection-style="${this.selectionStyle}"
        >
          <span slot="body">${body}</span>
          ${footer != null ? html`<span slot="footer">${footer}</span>` : ''}
        </cc-picker-option>
      </label>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        /* region global */
        :host {
          display: inline-block;
        }
        /* endregion */

        /* region fieldset */
        fieldset {
          border: none;
          display: inline-block;
          margin: 0;
          padding: 0;
        }

        fieldset:focus-visible {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline-error);
          outline-offset: 0.5em;
        }

        fieldset,
        .fieldset-content {
          width: var(--cc-picker-tiles-width, fit-content);
        }
        /* endregion */

        /* region legend */
        .legend {
          align-items: flex-end;
          cursor: pointer;
          display: flex;
          gap: 2em;
          justify-content: space-between;
          padding-block-end: var(--cc-form-label-gap, 0.35em);
          width: 100%;
        }

        .legend-text {
          color: var(--cc-input-label-color, inherit);
          font-size: var(--cc-input-label-font-size, inherit);
          font-weight: var(--cc-input-label-font-weight, normal);
        }

        .required {
          color: var(--cc-color-text-weak, #404040);
          font-size: 0.9em;
          font-variant: small-caps;
        }
        /* endregion */

        /* region tiles layout */
        .tiles {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          grid-area: input;
          padding-inline-start: var(--cc-picker-tiles-indent, 0.25em);
        }
        /* endregion */

        /* region tile */
        label {
          display: grid;
        }

        input[type='radio']:focus-visible + label cc-picker-option {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        input[type='radio']:focus-visible + label cc-picker-option[error] {
          outline-color: var(--cc-color-border-danger, #be242d);
        }
        /* endregion */

        /* region inline layout */
        :host([inline]) .fieldset-content {
          align-items: baseline;
          display: grid;
          gap: 0 var(--cc-form-label-gap-inline, 0.75em);
          grid-auto-rows: min-content;
          grid-template-areas:
            'label input'
            'label help'
            'label error';
          grid-template-columns: auto 1fr;
        }

        :host([inline]) .legend {
          flex-direction: column;
          gap: 0;
          grid-area: label;
          line-height: normal;
          padding: 0;
          width: auto;
        }
        /* endregion */

        /* region help & error messages */
        slot[name='help']::slotted(*) {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          margin: 0.3em 0 0;
        }

        .help-container {
          grid-area: help;
        }

        .error-container {
          color: var(--cc-color-text-danger, #be242d);
          grid-area: error;
          margin: 0.5em 0 0;
        }
        /* endregion */
      `,
    ];
  }
}

customElements.define('cc-picker', CcPicker);
