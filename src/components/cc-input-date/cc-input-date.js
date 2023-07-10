import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { bindDate, isDateValid, shiftDateField } from '../../lib/date/date-utils.js';
import { IsoDateParser } from '../../lib/date/iso-date-parser.js';
import { SimpleDateParser } from '../../lib/date/simple-date-parser.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { TimestampFormatter } from '../../lib/timestamp-formatter.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const incrementSvg = new URL('../../assets/increment.svg', import.meta.url).href;
const decrementSvg = new URL('../../assets/decrement.svg', import.meta.url).href;

const FIELDS_POSITION = 'YYYYYMMMDDDHHHmmmsss';
function shiftDateFieldFromPosition (date, position, offset) {
  const field = FIELDS_POSITION[position];
  return shiftDateField(date, field, offset);
}

const ISO_DATE_PARSER = new IsoDateParser();

/**
 * @param {Date|string} dateOrString
 * @return {Date}
 */
function parseDateOrIso (dateOrString) {
  if (isDateValid(dateOrString)) {
    return dateOrString;
  }
  return ISO_DATE_PARSER.parse(dateOrString);
}

/**
 * @typedef {import('../../lib/timestamp-formatter.types.js').Timezone} Timezone
 */

/**
 * A custom date input with controls mode.
 *
 * ## Technical details
 *
 * * Uses a native `<input>` with a type `string`
 * * The `controls` feature enables increment and decrement buttons on the side of the input
 * * When an error slot is used, the input is decorated with a red border and a redish focus ring. You have to be aware that it uses the [`slotchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event) event which doesn't fire if the children of a slotted node change.
 *
 * @cssdisplay inline-block
 *
 * @event {CustomEvent<string>} cc-input-date:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent} cc-input-date:requestimplicitsubmit - Fires when enter key is pressed.
 *
 * @cssprop {FontFamily} --cc-input-font-family - The font-family for the input content (defaults: `inherit`).
 *
 * @slot error - The error message to be displayed below the `<input>` element or below the help text. Please use a `<p>` tag.
 * @slot help - The help message to be displayed right below the `<input>` element. Please use a `<p>` tag.
 */
export class CcInputDate extends LitElement {

  static get properties () {
    return {
      controls: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      label: { type: String },
      hiddenLabel: { type: Boolean, attribute: 'hidden-label' },
      max: { type: String },
      min: { type: String },
      name: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean },
      skeleton: { type: Boolean, reflect: true },
      step: { type: Number },
      timezone: { type: String },
      value: { type: String },
      _value: { type: String, state: true },
      _validity: { type: String, state: true },
      _hasError: { type: Boolean, state: true },
    };
  }

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

    /** @type {string|null} Sets the max date with ISO date format. */
    this.max = null;

    /** @type {string|null} Sets the min date with ISO date format. */
    this.min = null;

    /** @type {string|null} Sets `name` attribute on inner native `<input>` element. */
    this.name = null;

    /** @type {boolean} Sets `readonly` attribute on inner native `<input>` element. */
    this.readonly = false;

    /** @type {boolean} Sets whether the "required" text inside the label should be displayed. */
    this.required = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {number|null} Sets the step in millisecond used when shifting value with keyboard (`PageUp`, `PageDown`) or controls mode. */
    this.step = 60_000;

    /** @type {string|Date|null} Sets `value` attribute on inner native input element. */
    this.value = null;

    /** @type {Timezone} The timezone to use. */
    this.timezone = 'UTC';

    /** @type {'empty'|'valid'|'badFormat'|'tooLow'|'tooHigh'} */
    this._validity = 'empty';

    /** @type {boolean} */
    this._hasError = false;

    /** @type {Date|null} */
    this._maxDate = null;

    /** @type {Date|null} */
    this._minDate = null;

    /** @type {string|null} */
    this._value = null;

    /**
     * @type {TimestampFormatter} The formatter to use to format timestamp.
     * It is maintained in sync with the `timestampDisplay` and `timezone` properties.
     */
    this._timestampFormatter = this._resolveTimestampFormatter();

    /** @type {SimpleDateParser} */
    this._dateParser = this._resolveDateParser();

    /** @type {Ref<HTMLInputElement>} */
    this._inputRef = createRef();
  }

  get value () {
    return this._value;
  }

  /**
   * We allow setting value with a Date object, or date as ISO string.
   * If the given value is not a valid Date nor a valide ISO string, the value will be reset to null.
   *
   * @param {Date|string} v
   */
  set value (v) {
    const oldValue = this._value;
    if (v == null) {
      this._value = null;
    }
    try {
      this._value = parseDateOrIso(v).toISOString();
    }
    catch (e) {
      this._value = null;
    }
    this.requestUpdate('value', oldValue);
  }

  /**
   * Triggers focus on the inner `<input>` element.
   */
  focus (options) {
    this._inputRef.value.focus(options);
  }

  _onInput (e) {
    const text = e.target.value;
    const parseAndValidate = this._validate(text);
    this._validity = parseAndValidate.validity;
    if (parseAndValidate.date != null) {
      this._value = parseAndValidate.date.toISOString();
    }
    else {
      this._value = text;
    }

    dispatchCustomEvent(this, 'input', this._value);
  }

  _onFocus (e) {
    if (this.readonly) {
      e.target.select();
    }
  }

  _onKeyEvent (e) {
    // Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
    if (e.type === 'keydown' || e.type === 'keypress') {
      e.stopPropagation();
    }
    // Here we prevent keydown on enter key from modifying the value
    if (e.type === 'keydown' && e.keyCode === 13) {
      e.preventDefault();
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }
    // Request implicit submit with keypress on enter key
    if (!this.readonly && e.type === 'keypress' && e.keyCode === 13) {
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }

    if (e.type === 'keydown') {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
        const date = this.getValueAsDate();

        if (date != null) {
          e.preventDefault();

          const element = e.target;
          const position = element.selectionStart;

          if (e.key === 'ArrowDown') {
            this._shiftDateField(date, position, -1);
          }
          if (e.key === 'ArrowUp') {
            this._shiftDateField(date, position, 1);
          }
          if (e.key === 'PageDown') {
            this._shiftValue(date, -this.step);
          }
          if (e.key === 'PageUp') {
            this._shiftValue(date, this.step);
          }

          this.getUpdateComplete().then(() => {
            element.setSelectionRange(position, position);
          });
        }
      }
    }
  }

  _onDecrementButtonClick () {
    this._shiftValue(this.getValueAsDate(), -this.step);
  }

  _onIncrementButtonClick () {
    this._shiftValue(this.getValueAsDate(), this.step);
  }

  _onErrorSlotChanged (event) {
    this._hasError = event.target.assignedNodes()?.length > 0;
  }

  _resolveTimestampFormatter () {
    return new TimestampFormatter('datetime-short', this.timezone);
  }

  _resolveDateParser () {
    return new SimpleDateParser(this.timezone);
  }

  _setNewValue (date, bind = false) {
    const boundedDate = bind ? bindDate(date, this._minDate, this._maxDate) : date;
    const newValue = boundedDate.toISOString();

    if (newValue !== this._value) {
      this._value = newValue;
      this._validity = this._validateBounds(date);
      dispatchCustomEvent(this, 'input', this._value);
    }
  }

  _parseValue (v) {
    if (v == null) {
      return null;
    }
    try {
      return this._dateParser.parse(v);
    }
    catch (e) {
      return ISO_DATE_PARSER.parse(v);
    }
  }

  _shiftValue (date, offset) {
    if (date != null) {
      this._setNewValue(shiftDateField(date, 'S', offset), true);
    }
  }

  _shiftDateField (date, position, offset) {
    if (date != null) {
      this._setNewValue(shiftDateFieldFromPosition(date, position, offset), true);
    }
  }

  _validate (text) {
    if (isStringEmpty(text)) {
      return {
        validity: 'empty',
        date: null,
      };
    }

    try {
      const date = this._parseValue(text);
      return {
        validity: this._validateBounds(date),
        date: date,
      };
    }
    catch (e) {
      return {
        validity: 'badFormat',
        date: null,
      };
    }
  }

  _validateBounds (date) {
    if (this._minDate != null && date.getTime() < this._minDate.getTime()) {
      return 'tooLow';
    }

    if (this._maxDate != null && date.getTime() > this._maxDate.getTime()) {
      return 'tooHigh';
    }

    return 'valid';
  }

  _canDecrement () {
    const date = this.getValueAsDate();
    if (date == null) {
      return false;
    }

    if (this._minDate == null) {
      return true;
    }

    return date.getTime() > this._minDate.getTime();
  }

  _canIncrement () {
    const date = this.getValueAsDate();
    if (date == null) {
      return false;
    }

    if (this._maxDate == null) {
      return true;
    }

    return date.getTime() < this._maxDate.getTime();
  }

  _getDisplayValue () {
    if (this._validity === 'empty') {
      return '';
    }
    if (this._validity === 'badFormat') {
      return this._value;
    }

    const date = new Date(this._value);
    return this._timestampFormatter.format(date.getTime());
  }

  willUpdate (changedProperties) {
    if (changedProperties.has('timezone')) {
      this._timestampFormatter = this._resolveTimestampFormatter();
      this._dateParser = this._resolveDateParser();
    }

    if (changedProperties.has('min')) {
      try {
        this._minDate = parseDateOrIso(this.min);
      }
      catch (e) {
        this._minDate = null;
      }
    }
    if (changedProperties.has('max')) {
      try {
        this._maxDate = parseDateOrIso(this.max);
      }
      catch (e) {
        this._maxDate = null;
      }
    }

    if (changedProperties.has('required')
      || changedProperties.has('min')
      || changedProperties.has('max')
      || changedProperties.has('value')) {
      const validation = this._validate(this.value);
      this._validity = validation.validity;
    }
  }

  /* region Public methods */

  isValid () {
    if (this.required) {
      return this._validity === 'valid';
    }
    else {
      return this._validity === 'valid' || this._validity === 'empty';
    }
  }

  getValidity () {
    return {
      valid: this.isValid(),
      validity: this._validity,
    };
  }

  getValueAsDate () {
    if (this._validity === 'empty') {
      return null;
    }
    if (this._validity === 'badFormat') {
      return null;
    }
    return new Date(this._value);
  }

  /* endregion */

  render () {
    const controls = (this.controls && !this.skeleton);
    const __refName = this._inputRef;

    return html`
      ${this.label != null ? html`
        <label class=${classMap({ 'visually-hidden': this.hiddenLabel })} for="input-id">
          <span>${this.label}</span>
          ${this.required ? html`
            <span class="required">${i18n('cc-input-number.required')}</span>
          ` : ''}
        </label>
      ` : ''}

      <div class="meta-input">
        ${controls ? html`
          <button class="btn" @click=${this._onDecrementButtonClick}
                  ?disabled=${this.disabled || this.readonly || !this._canDecrement()}>
            <img class="btn-img" src=${decrementSvg} alt="${i18n('cc-input-number.decrease')}">
          </button>
        ` : ''}
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}">

          <input
            id="input-id"
            ${ref(__refName)}
            type="text"
            class="input ${classMap({ error: this._hasError })}"
            ?disabled=${this.disabled || this.skeleton}
            ?readonly=${this.readonly}
            .value=${this._getDisplayValue()}
            name=${this.name ?? ''}
            spellcheck="false"
            aria-describedby="help-id error-id"
            @focus=${this._onFocus}
            @input=${this._onInput}
            @keydown=${this._onKeyEvent}
            @keypress=${this._onKeyEvent}
          >
          <div class="ring"></div>
        </div>
        ${controls ? html`
          <button class="btn" @click=${this._onIncrementButtonClick}
                  ?disabled=${this.disabled || this.readonly || !this._canIncrement()}>
            <img class="btn-img" src=${incrementSvg} alt="${i18n('cc-input-number.increase')}">
          </button>
        ` : ''}
      </div>

      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      <div class="error-container" id="error-id">
        <slot name="error" @slotchange="${this._onErrorSlotChanged}"></slot>
      </div>
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
          gap: 0 1em;
          grid-template-areas: 
            'label input'
            '. help'
            '. error';
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

        :host([inline]) label {
          flex-direction: column;
          justify-content: center;
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

        slot[name='error'],
        slot[name='error']::slotted(*) {
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
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 15%;
          filter: grayscale(100%);
          opacity: 0.6;
        }

        .btn-img:hover {
          filter: grayscale(0%);
          opacity: 1;
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-date', CcInputDate);
