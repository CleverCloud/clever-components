import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const incrementSvg = new URL('../../assets/increment.svg', import.meta.url).href;
const decrementSvg = new URL('../../assets/decrement.svg', import.meta.url).href;

/**
 * A custom number input with controls mode.
 *
 * ## Technical details
 *
 * * Uses a native `<input>` with a type `number` without native arrows mode
 * * The `controls` feature enables the "arrow" mode but with an increment/decrement button on the side of the input
 * * When an error slot is used, the input is decorated with a red border and a redish focus ring. You have to be aware that it uses the [`slotchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event) event which doesn't fire if the children of a slotted node change.
 *
 * @cssdisplay inline-block
 *
 * @event {CustomEvent<string>} cc-input-number:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent} cc-input-number:requestimplicitsubmit - Fires when enter key is pressed.
 *
 * @cssprop {Align} --cc-input-number-align - Change the alignment of the number present in the input (defaults: `right`).
 * @cssprop {FontFamily} --cc-input-font-family - The font-family for the input content (defaults: `inherit`).
 *
 * @slot error - The error message to be displayed below the `<input>` element or below the help text. Please use a `<p>` tag.
 * @slot help - The help message to be displayed right below the `<input>` element. Please use a `<p>` tag.
 */
export class CcInputNumber extends LitElement {

  static get properties () {
    return {
      controls: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      label: { type: String },
      hiddenLabel: { type: Boolean, attribute: 'hidden-label' },
      max: { type: Number },
      min: { type: Number },
      name: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean },
      skeleton: { type: Boolean, reflect: true },
      step: { type: Number },
      value: { type: Number },
      _invalid: { type: Boolean, state: true },
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

    /** @type {number|null} Sets the max range of the `<input>` element. */
    this.max = null;

    /** @type {number|null} Sets the min range of the `<input>` element. */
    this.min = null;

    /** @type {string|null} Sets `name` attribute on inner native `<input>` element. */
    this.name = null;

    /** @type {boolean} Sets `readonly` attribute on inner native `<input>` element. */
    this.readonly = false;

    /** @type {boolean} Sets the "required" text inside the label */
    this.required = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {number|null} Sets the step of the `<input>` element affecting the value when changing it on the keyboard or controls mode. */
    this.step = null;

    /** @type {number|null} Sets `value` attribute on inner native input number element. */
    this.value = null;

    /** @type {boolean} */
    this._invalid = false;

    /** @type {boolean} */
    this._hasError = false;
  }

  /**
   * Triggers focus on the inner `<input>/<textarea>` element.
   */
  focus () {
    this._input.focus();
  }

  _onInput (e) {
    this.value = e.target.valueAsNumber;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onFocus (e) {
    if (this.readonly) {
      e.target.select();
    }
  }

  // Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
  _onKeyEvent (e) {
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
  }

  _onDecrement () {
    this._input.stepDown();
    this.value = this._input.valueAsNumber;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onIncrement () {
    this._input.stepUp();
    this.value = this._input.valueAsNumber;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onErrorSlotChanged (event) {
    this._hasError = event.target.assignedNodes()?.length > 0;
  }

  firstUpdated () {
    /** @type {HTMLInputElement} */
    this._input = this.shadowRoot.querySelector('.input');
    this._invalid = !this._input.checkValidity();
  }

  // updated and not udpate because we need this._input before
  updated (changedProperties) {
    if (changedProperties.has('value')) {
      this._invalid = !this._input.checkValidity();
    }
  }

  render () {

    const value = (this.value != null) ? this.value : 0;
    const controls = (this.controls && !this.skeleton);
    const minDisabled = (this.value <= this.min) && (this.min != null);
    const maxDisabled = (this.value >= this.max) && (this.max != null);

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
          <button class="btn" @click=${this._onDecrement} ?disabled=${this.disabled || this.readonly || minDisabled}>
            <img class="btn-img" src=${decrementSvg} alt="${i18n('cc-input-number.decrease')}">
          </button>
        ` : ''}
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}">

          <input
            id="input-id"
            type="number"
            class="input ${classMap({ error: this._invalid || this._hasError })}"
            ?disabled=${this.disabled || this.skeleton}
            ?readonly=${this.readonly}
            min=${this.min ?? ''}
            max=${this.max ?? ''}
            step=${this.step ?? ''}
            .value=${value}
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
          <button class="btn" @click=${this._onIncrement} ?disabled=${this.disabled || this.readonly || maxDisabled}>
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
          border: 1px solid #aaa;
          background: var(--cc-color-bg-default, #fff);
          border-radius: 0.25em;
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
        }

        input:focus + .ring {
          border-color: #777;
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
          border-color: #777;
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-bg-neutral-disabled);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          border-color: #eee;
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
          border-radius: 0.15em;
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

window.customElements.define('cc-input-number', CcInputNumber);
