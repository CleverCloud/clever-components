import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { RequiredValidator, validatorsBuilder } from '../../lib/validation/validation.js';
import { WithElementInternals } from '../../mixins/with-element-internals.js';

const DEFAULT_ERROR_MESSAGES = {
  get empty () {
    return i18n('cc-select.error.empty');
  },
};

/**
 * @typedef {import('./cc-select.types.js').Option} Option
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
 * @fires {CustomEvent<string>} cc-select:input - Fires the `value` whenever the `value` changes.
 *
 * @cssprop {Color} --cc-select-label-color - The color for the select's label (defaults: `inherit`).
 * @cssprop {FontSize} --cc-select-label-font-size - The font-size for the select's label (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-select-label-font-weight - The font-weight for the select's label (defaults: `normal`).
 *
 * @slot error - The error message to be displayed below the `<select>` element or below the help text. Please use a `<p>` tag.
 * @slot help - The help message to be displayed right below the `<select>` element. Please use a `<p>` tag.
 */
export class CcSelect extends WithElementInternals(LitElement) {
  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      /** @required */
      label: { type: String },
      name: { type: String, reflect: true },
      options: { type: Array },
      placeholder: { type: String },
      required: { type: Boolean },
      value: { type: String },
      resetValue: { type: String, attribute: 'reset-value' },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inner native `<select>` element. */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the `<select>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets `name` attribute on inner native `<select>` element. */
    this.name = null;

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

    /** @type {string} Sets the reset value */
    this.resetValue = '';

    /** @type {Ref<HTMLSelectElement>} */
    this._selectRef = createRef();

    /** @type {string|null} Sets the selected value of the element. This prop should always be set. It should always match one of the option values. */
    this.value = null;
  }

  /**
   * Triggers focus on the inner `<select>` element.
   */
  focus () {
    this.updateComplete.then(() => this._selectRef?.value?.focus());
  }

  _onSelectInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  getElementInternalsSettings () {
    return {
      valuePropertyName: 'value',
      resetValuePropertyName: 'resetValue',
      inputSelector: '#input-id',
      errorSelector: '#error-id',
      validationSettingsProvider: () => this._getValidationSettings(),
      reactiveValidationProperties: ['required', 'options'],
    };
  }

  _getValidationSettings () {
    return {
      errorMessages: DEFAULT_ERROR_MESSAGES,
      validator: validatorsBuilder()
        .add(this.required ? new RequiredValidator() : null)
        .combine(),
    };
  }

  updated (changedProperties) {
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

  render () {
    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';

    return html`
      <label for="input-id">
        <span class="label-text">${this.label}</span>
        ${this.required ? html`
          <span class="required">${i18n('cc-select.required')}</span>
        ` : ''}
      </label>
      <div class="select-wrapper ${classMap({ disabled: this.disabled })}">
        <select
          id="input-id"
          class="${classMap({ error: hasErrorMessage })}"
          ?disabled=${this.disabled}
          aria-describedby="help-id error-id"
          @input=${this._onSelectInput}
          .value=${this.value}
          name=${ifDefined(this.name ?? undefined)}
          ${ref(this._selectRef)}
        >
          ${this.placeholder != null && this.placeholder !== '' ? html`
            <option value="" ?disabled=${this.required}>${this.placeholder}</option>
          ` : ''}
          ${this.options.map((option) => html`
            <option value=${option.value}>${option.label}</option>
          `)}
        </select>
      </div>

      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      ${hasErrorMessage ? html`
        <p class="error-container" id="error-id">
          ${this.errorMessage}
        </p>` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          display: inline-block;
        }

        /* region Common to cc-input-* & cc-select */

        :host([inline]) {
          display: inline-grid;
          align-items: baseline;
          gap: 0 1em;
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
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 0.35em;
          cursor: pointer;
          gap: 2em;
          line-height: 1.25em;
        }

        label .label-text {
          color: var(--cc-select-label-color, inherit);
          font-size: var(--cc-select-label-font-size, inherit);
          font-weight: var(--cc-select-label-font-weight, normal);
        }

        :host([inline]) label {
          flex-direction: column;
          padding: 0;
          gap: 0;
          grid-area: label;
          line-height: normal;
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
          margin: 0.3em 0 0;
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
        }
        
        .error-container {
          margin: 0.5em 0 0;
          color: var(--cc-color-text-danger);
        }
        /* endregion */

        /* RESET */

        select {
          width: 100%;
          padding: 0;
          border: none;
          margin: 0;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          background: none;
          color: inherit;
          cursor: inherit;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }

        select {
          height: 2em;
          box-sizing: border-box;
          padding: 0 3em 0 0.5em;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-area: input;
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
          position: relative;
          display: inline-flex;
          width: 100%;
          vertical-align: top;
        }

        .select-wrapper::after {
          position: absolute;
          top: 50%;
          right: 0.5em;
          width: 0.8em;
          height: 0.5em;
          background-color: var(--cc-color-bg-primary, #000);
          clip-path: polygon(100% 0%, 0 0%, 50% 100%);
          content: '';
          pointer-events: none;
          transform: translateY(-50%);
        }

        .disabled::after {
          background-color: hsl(0deg 0% 62%);
        }

        select[disabled] {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background: var(--cc-color-bg-neutral-disabled);
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }
      `,
    ];
  }
}

window.customElements.define('cc-select', CcSelect);
