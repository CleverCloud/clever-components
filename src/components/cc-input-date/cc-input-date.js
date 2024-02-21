import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { live } from 'lit/directives/live.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { DateFormatter } from '../../lib/date/date-formatter.js';
import {
  clampDate,
  isDateValid,
  parseIsoDateString,
  parseSimpleDateString,
  shiftDateField,
} from '../../lib/date/date-utils.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';

// This is the date format chosen to format the date displayed to the user.
const DATE_FORMAT = 'datetime-short';
// This string is hard coded and corresponds directly to the date format defined above.
const FIELDS_POSITION = 'YYYYYMMMDDDHHHmmmsss';

/**
 * @param {Date|string} dateOrString
 * @return {Date}
 * @throws {Error} Whenever the given argument is not a string with valid ISO date format.
 */
function getDateOrParseIso (dateOrString) {
  if (isDateValid(dateOrString)) {
    return dateOrString;
  }
  return parseIsoDateString(dateOrString);
}

/**
 * @return {InputDateValueStateEmpty}
 */
function dateStateEmpty () {
  return {
    state: 'empty',
  };
}

/**
 * @param {string} value
 * @return {InputDateValueStateNaD}
 */
function dateStateNaD (value) {
  return {
    state: 'NaD',
    value,
  };
}

/**
 * @param {Date} date
 * @return {InputDateValueStateValid}
 */
function dateStateValid (date) {
  return {
    state: 'valid',
    value: date.toISOString(),
    date,
  };
}

const VALID = { valid: true };

/**
 * @param {T} code
 * @return {{valid: false, code: T}}
 * @template T
 */
function invalid (code) {
  return {
    valid: false,
    code,
  };
}

/**
 * @typedef {import('../../lib/date/date.types.js').Timezone} Timezone
 * @typedef {import('./cc-input-date.types.js').InputDateValueState} InputDateValueState
 */

/**
 * A custom date input.
 *
 * ## Technical details
 *
 * * Uses a native `<input>` with a type `text`
 * * When an error slot is used, the input is decorated with a red border and a redish focus ring. You have to be aware that it uses the [`slotchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event) event which doesn't fire if the children of a slotted node change.
 *
 * @cssdisplay inline-block
 *
 * @fires {CustomEvent<string>} cc-input-date:input - Fires the `value` whenever the `value` changes.
 * @fires {CustomEvent} cc-input-date:requestimplicitsubmit - Fires when enter key is pressed.
 *
 * @cssprop {FontFamily} --cc-input-font-family - The font-family for the input content (defaults: `inherit`).
 *
 * @slot error - The error message to be displayed below the `<input>` element or below the help text. Please use a `<p>` tag.
 * @slot help - The help message to be displayed right below the `<input>` element. Please use a `<p>` tag.
 */
export class CcInputDate extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      hiddenLabel: { type: Boolean, attribute: 'hidden-label' },
      inline: { type: Boolean, reflect: true },
      label: { type: String },
      max: { type: String },
      min: { type: String },
      name: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean },
      skeleton: { type: Boolean, reflect: true },
      timezone: { type: String },
      value: { type: String },
      _valueState: { type: Object, state: true },
      _hasError: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inner native `<input>` element. */
    this.disabled = false;

    /** @type {boolean} Hides the label visually if `true`. */
    this.hiddenLabel = false;

    /** @type {boolean} Sets the `<label>` on the left of the `<input>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets label for the input. */
    this.label = null;

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

    /** @type {Timezone} The timezone to use. */
    this.timezone = 'UTC';

    /** @type {string|Date|null} Sets `value` attribute on inner native input element. */
    this.value = null;

    /** @type {Ref<HTMLInputElement>} */
    this._inputRef = createRef();

    /**
     * @type {DateFormatter} The formatter to use to format the date.
     * It is maintained in sync with the `timezone` properties.
     */
    this._dateFormatter = this._resolveDateFormatter();

    /** @type {boolean} Whether or not the error slot is empty. */
    this._hasError = false;

    /** @type {Date|null} The resolved maximum date or null if no maximum is specified. */
    this._maxDate = null;

    /** @type {Date|null} The resolved minimum date or null if no minimum is specified. */
    this._minDate = null;

    /** @type {InputDateValueState} */
    this._valueState = dateStateEmpty();
  }

  /* region Public methods */

  /**
   * Triggers focus on the inner `<input>` element.
   */
  focus (options) {
    this._inputRef.value.focus(options);
  }

  /**
   * @return {{valid: false, code: 'empty' | 'badInput' | 'rangeUnderflow' | 'rangeOverflow'}|{valid: true}}
   */
  validate () {
    if (this._valueState.state === 'empty') {
      return this.required ? invalid('empty') : VALID;
    }

    if (this._valueState.state === 'NaD') {
      return invalid('badInput');
    }

    const date = this._valueState.date;

    if (this._minDate != null && date.getTime() < this._minDate.getTime()) {
      return invalid('rangeUnderflow');
    }

    if (this._maxDate != null && date.getTime() > this._maxDate.getTime()) {
      return invalid('rangeOverflow');
    }

    return VALID;
  }

  /**
   * @return {Date|null} The current value as Date or null if the value is not a valid date.
   */
  get valueAsDate () {
    return this._valueState.date || null;
  }

  /* endregion */

  /* region Private methods */

  _resolveDateFormatter () {
    return new DateFormatter(DATE_FORMAT, this.timezone);
  }

  /**
   * Try to parse the given string with the current date parser, or if it fails, the ISO date parser.
   *
   * @param {string} string
   * @return {Date|null} null if given string is empty. Otherwise, the parsed Date.
   * @throws {Error} whenever the given string is not a parseable date.
   */
  _parseAsDate (string) {
    if (isStringEmpty(string)) {
      return null;
    }
    try {
      return parseSimpleDateString(string, this.timezone);
    }
    catch (e) {
      return parseIsoDateString(string);
    }
  }

  /**
   * Formats the current value using the current date formatter.
   * @return {string}
   */
  _formatValue () {
    return this._valueState.date != null
      ? this._dateFormatter.format(this._valueState.date)
      : this._valueState.value ?? '';
  }

  /**
   * @param {InputDateValueState} newValueState
   * @param {boolean} [dispatchEvent=true]
   */
  _setNewValueState (newValueState, dispatchEvent = true) {
    const oldValue = this._valueState.value;

    // You may wonder why we always change the reactive property `_valueState`!
    // It's because in some case we need to enforce the render method to be called to reformat the value that will be displayed in the native input.
    // This is needed in the case covered by this unit test: 'should have the formatted value when setting the same value with iso string'
    this._valueState = newValueState;

    // We also want to make sure that the value property is maintained in sync.
    this.value = this._valueState.value;

    if (dispatchEvent && oldValue !== this._valueState.value) {
      dispatchCustomEvent(this, 'input', this._valueState.value);
    }
  }

  /**
   * @param {null|Date|string} value
   * @return {InputDateValueState}
   */
  _toValueState (value) {
    if (value instanceof Date) {
      if (isDateValid(value)) {
        return dateStateValid(value);
      }

      return dateStateEmpty();
    }

    try {
      const date = this._parseAsDate(value);

      if (date == null) {
        return dateStateEmpty();
      }

      return dateStateValid(date);
    }
    catch (e) {
      return dateStateNaD(value);
    }
  }

  /* endregion */

  /* region Event handling */

  _onInput (e) {
    const inputValue = e.target.value;
    this._setNewValueState(this._toValueState(inputValue));
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
    if (e.type === 'keydown' && e.key === 'Enter') {
      e.preventDefault();
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }
    // Request implicit submit with keypress on enter key
    if (!this.readonly && e.type === 'keypress' && e.key === 'Enter') {
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }

    if (!this.readonly
      && this._valueState.date != null
      && e.type === 'keydown'
      && ['ArrowDown', 'ArrowUp'].includes(e.key)
    ) {
      e.preventDefault();

      const element = e.target;
      const position = element.selectionStart;
      const offset = e.key === 'ArrowDown' ? -1 : +1;

      const shiftedDate = shiftDateField(this._valueState.date, FIELDS_POSITION[position], offset);
      const boundedDate = clampDate(shiftedDate, this._minDate, this._maxDate);

      this._setNewValueState(dateStateValid(boundedDate));

      // Reset the cursor to its initial position.
      this.getUpdateComplete().then(() => {
        element.setSelectionRange(position, position);
      });
    }
  }

  _onErrorSlotChanged (e) {
    this._hasError = e.target.assignedNodes()?.length > 0;
  }

  /* endregion */

  willUpdate (changedProperties) {
    if (changedProperties.has('timezone')) {
      this._dateFormatter = this._resolveDateFormatter();
    }

    if (changedProperties.has('min')) {
      try {
        this._minDate = getDateOrParseIso(this.min);
      }
      catch (e) {
        this._minDate = null;
      }
    }

    if (changedProperties.has('max')) {
      try {
        this._maxDate = getDateOrParseIso(this.max);
      }
      catch (e) {
        this._maxDate = null;
      }
    }

    if (changedProperties.has('value')) {
      this._setNewValueState(this._toValueState(this.value), false);
    }
  }

  render () {
    // We use the live directive for binding the value of the native input.
    // We need that for the case tested by 'should have the formatted value when setting the same value with iso string'

    return html`
      ${this.label != null ? html`
        <label class=${classMap({ 'visually-hidden': this.hiddenLabel })} for="input-id">
          <span>${this.label}</span>
          ${this.required ? html`
            <span class="required">${i18n('cc-input-date.required')}</span>
          ` : ''}
        </label>
      ` : ''}

      <div class="meta-input">
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}">
          ${this._renderUnderlay()}
          <input
            id="input-id"
            ${ref(this._inputRef)}
            type="text"
            class="input ${classMap({ error: this._hasError })}"
            ?disabled=${this.disabled || this.skeleton}
            ?readonly=${this.readonly}
            .value=${live(this._formatValue())}
            name=${this.name ?? ''}
            spellcheck="false"
            aria-describedby="help error keyboard-hint"
            @focus=${this._onFocus}
            @input=${this._onInput}
            @keydown=${this._onKeyEvent}
            @keypress=${this._onKeyEvent}
          >
          <div class="ring"></div>
        </div>
      </div>

      <div class="help-container" id="help">
        <slot name="help"></slot>
      </div>

      <div class="error-container" id="error">
        <slot name="error" @slotchange="${this._onErrorSlotChanged}"></slot>
      </div>

      ${this._valueState.date != null ? html`
        <p id="keyboard-hint" class="visually-hidden">${i18n('cc-input-date.keyboard-hint')}</p>
      ` : ''}
    `;
  }

  _renderUnderlay () {
    if (this.skeleton || this._valueState.date == null) {
      return null;
    }

    return html`
      <div class="input underlay" aria-hidden="true">
        ${
          this._dateFormatter.mapParts(this._valueState.date, ({ type, value }) => {
            return type === 'separator' ? value : html`<span>${value}</span>`;
          })
        }
      </div>`;
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
          color: var(--cc-color-text-weak, #333);
          font-size: 0.9em;
          font-variant: small-caps;
        }

        :host([inline]) .required {
          font-size: 0.8em;
        }

        slot[name='help']::slotted(*) {
          margin: 0.3em 0 0;
          color: var(--cc-color-text-weak, #333);
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

        .input {
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

        /* BASE */

        .input {
          z-index: 2;
          overflow: hidden;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          height: 2em;
          border: none;
          font-family: var(--cc-input-font-family, var(--cc-ff-monospace, monospace));
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
          color: var(--cc-color-text-weak, #333);
          opacity: 1;
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
          background: var(--cc-color-bg-neutral-disabled, #eee);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background-color: var(--cc-color-bg-neutral-disabled, #eee);
          cursor: progress;
        }

        .skeleton input {
          color: transparent;
        }

        /* UNDERLAY */

        .input,
        .underlay {
          height: auto;
          padding: 0 3px;
          font-family: var(--cc-input-font-family, var(--cc-ff-monospace, monospace));
        }

        .underlay {
          z-index: 1;
          color: transparent;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          white-space: nowrap;
        }

        .underlay span:not(:empty) {
          --color: var(--cc-color-border-neutral, #aaa);

          padding: 1px 0;
          border-bottom: 2px solid var(--cc-color-border-neutral, #eee);
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-date', CcInputDate);
