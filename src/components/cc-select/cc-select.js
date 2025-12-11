import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { RequiredValidator } from '../../lib/form/validation.js';
import { i18n } from '../../translations/translation.js';
import { CcSelectEvent } from '../common.events.js';

const DEFAULT_ERROR_MESSAGES = {
  get empty() {
    return i18n('cc-select.error.empty');
  },
};

/**
 * @import { Option } from './cc-select.types.js'
 * @import { Validator, ErrorMessageMap } from '../../lib/form/validation.types.js'
 * @import { Ref } from 'lit/directives/ref.js'
 * @import { PropertyValues } from 'lit'
 * @import { EventWithTarget } from '../../lib/events.types.js'
 */

/**
 * A component wrapping native select element and its label.
 *
 * Caution:
 *
 *   * Setting an empty / undefined value displays a `<select>` element with no selected value unless a placeholder is set.
 *   * Setting a value that does not match any option displays a `<select>` element with no selected value.
 *
 * @cssdisplay inline-block
 *
 * @cssprop {Size} --cc-form-label-gap - The space between the label and the control (defaults: `0.35em`).
 * @cssprop {Size} --cc-form-label-gap-inline - The space between the label and the control when layout is inline (defaults: `0.75em`).
 * @cssprop {Color} --cc-select-label-color - The color for the select's label (defaults: `inherit`).
 * @cssprop {FontSize} --cc-select-label-font-size - The font-size for the select's label (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-select-label-font-weight - The font-weight for the select's label (defaults: `normal`).
 *
 * @slot help - The help message to be displayed right below the `<select>` element. Please use a `<p>` tag.
 */
export class CcSelect extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      // eslint-disable-next-line lit/no-native-attributes
      autofocus: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      /** @required */
      label: { type: String },
      options: { type: Array },
      placeholder: { type: String },
      required: { type: Boolean },
      resetValue: { type: String, attribute: 'reset-value' },
      value: { type: String },
    };
  }

  static reactiveValidationProperties = ['required', 'options'];

  constructor() {
    super();

    /** @type {boolean} Automatically focus the select when the page loads. **Note:** Using this attribute is generally discouraged for accessibility reasons. See [MDN autofocus accessibility concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus#accessibility_concerns) for more information. */
    this.autofocus = false;

    /** @type {boolean} Sets `disabled` attribute on inner native `<select>` element. */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the `<select>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets label for the input. Mandatory but can be hidden if necessary. */
    this.label = null;

    /** @type {Option[]|[]} Sets the list of options displayed inside the select element. */
    this.options = [];

    /** @type {string|null} Sets a disabled option with empty value.
     * This option will always be the first of the list. It can be selected by default by setting `value=''`.
     * This option is only selectable by the user if the field is optional (`required=false`).
     */
    this.placeholder = null;

    /** @type {boolean} Sets the "required" text inside the label. If a placeholder is set, it won't be selectable by the user, it may only be selected as a default value. */
    this.required = false;

    /** @type {string|null} Sets the `value` to set when parent `<form>` element is reset. */
    this.resetValue = '';

    /** @type {string|null} Sets the selected value of the element. This prop should always be set. It should always match one of the option values. */
    this.value = null;

    /** @type {Ref<HTMLElement>} */
    this._errorRef = createRef();

    /** @type {Ref<HTMLSelectElement>} */
    this._selectRef = createRef();
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getFormControlElement() {
    return this._selectRef.value;
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
    return CcSelect.reactiveValidationProperties;
  }

  /* endregion */

  /**
   * Triggers focus on the inner `<select>` element.
   */
  focus() {
    this._selectRef.value?.focus();
  }

  /**
   * @param {EventWithTarget<HTMLSelectElement>} e
   */
  _onSelectInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CcSelectEvent(this.value));
  }

  /**
   * @param {PropertyValues<CcSelect>} changedProperties
   */
  updated(changedProperties) {
    /*
     * The `<select>` value must match the value of an `<option>` element.
     * We need to make sure the value of the `<select>` element in only updated after
     * `<option>` elements have been rendered.
     */
    if (changedProperties.has('value') || changedProperties.has('options')) {
      this.shadowRoot.querySelector('select').value = this.value;
    }

    super.updated(changedProperties);
  }

  render() {
    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';

    return html`
      <label for="input-id">
        <span class="label-text">${this.label}</span>
        ${this.required ? html` <span class="required">${i18n('cc-select.required')}</span> ` : ''}
      </label>
      <div class="select-wrapper ${classMap({ disabled: this.disabled })}">
        <select
          id="input-id"
          class="${classMap({ error: hasErrorMessage })}"
          ?autofocus=${this.autofocus}
          ?disabled=${this.disabled}
          aria-describedby="help-id error-id"
          @input=${this._onSelectInput}
          .value=${this.value}
          ${ref(this._selectRef)}
        >
          ${this.placeholder != null && this.placeholder !== ''
            ? html` <option value="" ?disabled=${this.required}>${this.placeholder}</option> `
            : ''}
          ${this.options.map((option) => html` <option value=${option.value}>${option.label}</option> `)}
        </select>
      </div>

      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      ${hasErrorMessage
        ? html` <p class="error-container" id="error-id" ${ref(this._errorRef)}>${this.errorMessage}</p>`
        : ''}
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */
        :host {
          display: inline-block;
        }

        /* region Common to cc-input-* & cc-select */

        :host([inline]) {
          align-items: baseline;
          display: inline-grid;
          gap: 0 var(--cc-form-label-gap-inline, 0.75em);
          grid-auto-rows: min-content;
          grid-template-areas:
            'label input'
            'label help'
            'label error';
          grid-template-columns: auto 1fr;
        }

        .help-container {
          grid-area: help;
        }

        .error-container {
          grid-area: error;
        }

        label {
          align-items: flex-end;
          cursor: pointer;
          display: flex;
          gap: 2em;
          justify-content: space-between;
          line-height: 1.25em;
          padding-block-end: var(--cc-form-label-gap, 0.35em);
        }

        label .label-text {
          color: var(--cc-select-label-color, inherit);
          font-size: var(--cc-select-label-font-size, inherit);
          font-weight: var(--cc-select-label-font-weight, normal);
        }

        :host([inline]) label {
          flex-direction: column;
          gap: 0;
          grid-area: label;
          line-height: normal;
          padding: 0;
        }

        .required {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          font-variant: small-caps;
        }

        :host([inline]) .required {
          font-size: 0.8em;
        }

        slot[name='help']::slotted(*) {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          margin: 0.3em 0 0;
        }

        .error-container {
          color: var(--cc-color-text-danger);
          margin: 0.5em 0 0;
        }
        /* endregion */

        /* RESET */

        select {
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          background: none;
          border: none;
          color: inherit;
          cursor: inherit;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        select {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-sizing: border-box;
          grid-area: input;
          height: 2em;
          padding: 0 3em 0 0.5em;
        }

        select:hover {
          border-color: var(--cc-color-border-neutral-hovered, #777);
          cursor: pointer;
        }

        select:focus {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        select.error {
          border-color: var(--cc-color-border-danger) !important;
        }

        select.error:focus {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .select-wrapper {
          display: inline-flex;
          position: relative;
          vertical-align: top;
          width: 100%;
        }

        .select-wrapper::after {
          background-color: var(--cc-color-bg-primary, #000);
          clip-path: polygon(100% 0%, 0 0%, 50% 100%);
          content: '';
          height: 0.5em;
          pointer-events: none;
          position: absolute;
          right: 0.5em;
          top: 50%;
          transform: translateY(-50%);
          width: 0.8em;
        }

        .disabled::after {
          background-color: hsl(0deg 0% 62%);
        }

        select[disabled] {
          background: var(--cc-color-bg-neutral-disabled);
          border-color: var(--cc-color-border-neutral-disabled, #777);
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }
      `,
    ];
  }
}

window.customElements.define('cc-select', CcSelect);
