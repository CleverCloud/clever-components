import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddLine as iconIncrement,
  iconRemixSubtractLine as iconDecrement,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { combineValidators, NumberValidator, RequiredValidator } from '../../lib/form/validation.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('lit/directives/ref.js').Ref<HTMLInputElement>} HTMLInputElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('../../lib/form/validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../lib/form/form.types.js').FormControlData} FormControlData
 */

/**
 * A custom number input with controls mode.
 *
 * ## Technical details
 *
 * * Uses a native `<input>` with a type `number` without native arrows mode
 * * The `controls` feature enables the "arrow" mode but with an increment/decrement button on the side of the input
 * * When an `errorMessage` is set, the input is decorated with a red border and a redish focus ring.
 *
 * @cssdisplay inline-block
 *
 * @fires {CustomEvent<string>} cc-input-number:input - Fires the `value` whenever the `value` changes.
 * @fires {CustomEvent} cc-input-number:requestimplicitsubmit - Fires when enter key is pressed.
 *
 * @cssprop {Align} --cc-input-number-align - Change the alignment of the number present in the input (defaults: `right`).
 * @cssprop {Color} --cc-input-btn-icon-color - The color for the icon within the +/- buttons (defaults: `#595959`).
 * @cssprop {FontFamily} --cc-input-font-family - The font-family for the input content (defaults: `inherit`).
 * @cssprop {Color} --cc-input-label-color - The color for the input's label (defaults: `inherit`).
 * @cssprop {FontSize} --cc-input-label-font-size - The font-size for the input's label (defaults: `inherit`).
 * @cssprop {FontWeight} --cc-input-label-font-weight - The font-weight for the input's label (defaults: `normal`).
 *
 * @slot help - The help message to be displayed right below the `<input>` element. Please use a `<p>` tag.
 */
export class CcInputNumber extends CcFormControlElement {

  static get properties () {
    return {
      ...super.properties,
      controls: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      label: { type: String },
      hiddenLabel: { type: Boolean, attribute: 'hidden-label' },
      max: { type: Number },
      min: { type: Number },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean },
      resetValue: { type: Number, attribute: 'reset-value' },
      skeleton: { type: Boolean, reflect: true },
      step: { type: Number },
      value: { type: Number },
    };
  }

  static reactiveValidationProperties = ['required', 'min', 'max'];

  constructor () {
    super();

    /** @type {boolean} Sets the control mode with a decrement and increment buttons. */
    this.controls = false;

    /** @type {boolean} Sets `disabled` attribute on inner native `<input>` element. */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the `<input>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets label for the input. */
    this.label = null;

    /** @type {boolean} Hides the label visually if `true`. */
    this.hiddenLabel = false;

    /** @type {number|null} Sets the max range of the `<input>` element. */
    this.max = null;

    /** @type {number|null} Sets the min range of the `<input>` element. */
    this.min = null;

    /** @type {boolean} Sets `readonly` attribute on inner native `<input>` element. */
    this.readonly = false;

    /** @type {boolean} Sets the "required" text inside the label */
    this.required = false;

    /** @type {number|null} Sets the `value` to set when parent `<form>` element is reset. */
    this.resetValue = null;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {number|null} Sets the step of the `<input>` element affecting the value when changing it on the keyboard or controls mode. */
    this.step = null;

    /** @type {number|null} Sets `value` attribute on inner native input number element. */
    this.value = null;

    /** @type {HTMLElementRef} */
    this._errorRef = createRef();

    /** @type {HTMLInputElementRef} */
    this._inputRef = createRef();

    /** @type {ErrorMessageMap} */
    this._errorMessages = {
      empty: () => i18n('cc-input-number.error.empty'),
      badType: () => i18n('cc-input-number.error.bad-type'),
      rangeUnderflow: () => i18n('cc-input-number.error.range-underflow', { min: this.min }),
      rangeOverflow: () => i18n('cc-input-number.error.range-overflow', { max: this.max }),
    };
  }

  /**
   * Triggers focus on the inner `<input>/<textarea>` element.
   */
  focus () {
    this._inputRef.value.focus();
  }

  /* region CcFormControlElement implementation */

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getFormControlElement () {
    return this._inputRef.value;
  }

  /**
   * @return {HTMLElement}
   * @protected
   */
  _getErrorElement () {
    return this._errorRef.value;
  }

  /**
   * @return {ErrorMessageMap}
   * @protected
   */
  _getErrorMessages () {
    return this._errorMessages;
  }

  /**
   * @return {Validator}
   * @protected
   */
  _getValidator () {
    return combineValidators([
      this.required ? new RequiredValidator() : null,
      new NumberValidator({ min: this.min, max: this.max }),
    ]);
  }

  /**
   * @return {FormControlData}
   * @protected
   */
  _getFormControlData () {
    return this._inputRef.value.value;
  }

  /**
   * @return {Array<string>}
   * @protected
   */
  _getReactiveValidationProperties () {
    return CcInputNumber.reactiveValidationProperties;
  }

  /* endregion */

  /**
   * @param {HTMLInputElementEvent} e
   */
  _onInput (e) {
    this.value = e.target.valueAsNumber;
    dispatchCustomEvent(this, 'input', this.value);
  }

  /**
   * @param {HTMLInputElementEvent} e
   */
  _onFocus (e) {
    if (this.readonly) {
      e.target.select();
    }
  }

  /**
   * Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
   *
   * @param {HTMLInputElementEvent & { keyCode: number}} e
   */
  _onKeyEvent (e) {
    if (e.type === 'keydown' || e.type === 'keypress') {
      e.stopPropagation();
    }
    // Here we prevent keydown on enter key from modifying the value
    if (e.type === 'keydown' && e.keyCode === 13) {
      e.preventDefault();
      this._internals.form?.requestSubmit();
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }
    // Request implicit submit with keypress on enter key
    if (!this.readonly && e.type === 'keypress' && e.keyCode === 13) {
      this._internals.form?.requestSubmit();
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }
  }

  _onDecrement () {
    this._inputRef.value.stepDown();
    this.value = this._inputRef.value.valueAsNumber;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onIncrement () {
    this._inputRef.value.stepUp();
    this.value = this._inputRef.value.valueAsNumber;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render () {

    const value = (this.value != null) ? this.value : 0;
    const controls = (this.controls && !this.skeleton);
    const minDisabled = (this.value <= this.min) && (this.min != null);
    const maxDisabled = (this.value >= this.max) && (this.max != null);
    const hasErrorMessage = this.errorMessage != null && this.errorMessage !== '';

    return html`

      ${this.label != null ? html`
        <label class=${classMap({ 'visually-hidden': this.hiddenLabel })} for="input-id">
          <span class="label-text">${this.label}</span>
          ${this.required ? html`
            <span class="required">${i18n('cc-input-number.required')}</span>
          ` : ''}
        </label>
      ` : ''}

      <div class="meta-input">
        ${controls ? html`
          <button class="btn" @click=${this._onDecrement} ?disabled=${this.disabled || this.readonly || minDisabled}>
            <cc-icon class="btn-img" .icon=${iconDecrement} a11y-name="${i18n('cc-input-number.decrease')}" size="lg"></cc-icon>
          </button>
        ` : ''}
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}">

          <input
            id="input-id"
            type="number"
            class="input ${classMap({ error: hasErrorMessage })}"
            ?disabled=${this.disabled || this.skeleton}
            ?readonly=${this.readonly}
            min=${this.min ?? ''}
            max=${this.max ?? ''}
            step=${this.step ?? ''}
            .value=${value}
            spellcheck="false"
            aria-describedby="help-id error-id"
            @focus=${this._onFocus}
            @input=${this._onInput}
            @keydown=${this._onKeyEvent}
            @keypress=${this._onKeyEvent}
            ${ref(this._inputRef)}
          >
          <div class="ring"></div>
        </div>
        ${controls ? html`
          <button class="btn" @click=${this._onIncrement} ?disabled=${this.disabled || this.readonly || maxDisabled}>
            <cc-icon class="btn-img" .icon=${iconIncrement} a11y-name="${i18n('cc-input-number.increase')}" size="lg"></cc-icon>
          </button>
        ` : ''}
      </div>

      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      ${hasErrorMessage ? html`
        <p class="error-container" id="error-id" ${ref(this._errorRef)}>
          ${this.errorMessage}
        </p>` : ''}
    `;
  }

  static get styles () {
    return [
      accessibilityStyles,
      skeletonStyles,
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
          color: var(--cc-input-label-color, inherit);
          font-size: var(--cc-input-label-font-size, inherit);
          font-weight: var(--cc-input-label-font-weight, normal);
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

        .meta-input {
          /* link to position:absolute of .ring */
          position: relative;
          display: inline-flex;
          overflow: visible;
          width: 100%;
          height: max-content;
          box-sizing: border-box;
          grid-area: input;
          vertical-align: top;
        }

        .wrapper {
          display: grid;
          overflow: hidden;
          min-width: 0;
          flex: 1 1 0;
          /* see input to know why 0.15em */
          padding: 0.15em 0.5em;
        }

        /* RESET */

        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 0;
          border: 1px solid #000;
          margin: 0;
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: none;
          color: inherit;
          font-family: inherit;
          font-size: unset;
          resize: none;
        }

        /* remove spinner firefox */

        input[type='number'] {
          -moz-appearance: textfield;
        }

        /* remove spinner safari */

        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }

        /* BASE */

        input {
          z-index: 2;
          overflow: hidden;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          height: 2em;
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          line-height: 2em;
          text-align: var(--cc-input-number-align, left);
        }

        /* STATES */

        input:focus,
        input:active {
          outline: 0;
        }

        input[disabled] {
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }

        button[disabled] {
          opacity: 0.5;
          pointer-events: none;
        }

        /* We use this empty .ring element to decorate the input with background, border, box-shadows... */

        .ring {
          position: absolute;
          z-index: 0;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          background: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
        }

        input:focus + .ring {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        input.error + .ring {
          border-color: var(--cc-color-border-danger) !important;
        }

        input.error:focus + .ring {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        input:hover + .ring {
          border-color: var(--cc-color-border-neutral-hovered, #777);
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background-color: var(--cc-color-bg-neutral-disabled);
          cursor: progress;
        }

        .skeleton input {
          color: transparent;
        }

        /* RESET */

        .btn {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: transparent;
          font-family: inherit;
          font-size: unset;
        }

        .btn {
          z-index: 2;
          width: 1.6em;
          height: 1.6em;
          flex-shrink: 0;
          margin: 0.2em;
          border-radius: var(--cc-border-radius-small, 0.15em);
          cursor: pointer;
        }

        .btn:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .btn:active,
        .btn:hover {
          box-shadow: none;
          outline: 0;
        }

        .btn:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .btn:active {
          background-color: var(--cc-color-bg-neutral-active);
        }

        /* We can do this because we set a visible focus state */

        .btn::-moz-focus-inner {
          border: 0;
        }

        .btn-img {
          --cc-icon-color: var(--cc-input-btn-icons-color, #595959);
          
          box-sizing: border-box;
          padding: 15%;
        }

        .btn-img:hover {
          --cc-icon-color: var(--cc-color-text-primary);
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-number', CcInputNumber);
