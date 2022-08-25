import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
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
      max: { type: Number },
      min: { type: Number },
      name: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean },
      skeleton: { type: Boolean, reflect: true },
      step: { type: Number },
      value: { type: Number },
      _invalid: { type: Boolean, attribute: false },
      _uniqueErrorId: { type: Boolean, attribute: false },
      _uniqueHelpId: { type: Boolean, attribute: false },
      _uniqueInputId: { type: Boolean, attribute: false },
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

    // use this unique id for isolation (Safari seems to have a bug)
    /** @type {string} used by the `aria-describedby` attribute on the `<input>` element and the `id` attribute on the error slot container */
    this._uniqueErrorId = Math.random().toString(36).slice(2);

    // use this unique id for isolation (Safari seems to have a bug)
    /** @type {string} used by the `aria-describedby` attribute on the `<input>` element and the `id` attribute on the help text container */
    this._uniqueHelpId = Math.random().toString(36).slice(2);

    // use this unique name for isolation (Safari seems to have a bug)
    /** @type {string} used by the for/id relation between `<label>` and `<input>` */
    this._uniqueInputId = Math.random().toString(36).slice(2);
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
    super.update(changedProperties);
  }

  render () {

    const value = (this.value != null) ? this.value : 0;
    const controls = (this.controls && !this.skeleton);
    const minDisabled = (this.value <= this.min) && (this.min != null);
    const maxDisabled = (this.value >= this.max) && (this.max != null);

    return html`

      ${this.label != null ? html`
        <label for=${this._uniqueInputId}>
          <span>${this.label}</span>
          ${this.required ? html`
            <span class="required">${i18n('cc-input-number.required')}</span>
          ` : ''}
        </label>
      ` : ''}

      <div class="meta-input">
        ${controls ? html`
          <button class="btn" @click=${this._onDecrement} ?disabled=${this.disabled || this.readonly || minDisabled}>
            <img class="btn-img" src=${decrementSvg} alt="">
          </button>
        ` : ''}
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}">

          <input
            id=${this._uniqueInputId}
            type="number"
            class="input ${classMap({ error: this._invalid })}"
            ?disabled=${this.disabled || this.skeleton}
            ?readonly=${this.readonly}
            min=${this.min ?? ''}
            max=${this.max ?? ''}
            step=${this.step ?? ''}
            .value=${value}
            name=${this.name ?? ''}
            spellcheck="false"
            aria-describedby="${this._uniqueHelpId} ${this._uniqueErrorId}"
            @focus=${this._onFocus}
            @input=${this._onInput}
            @keydown=${this._onKeyEvent}
            @keypress=${this._onKeyEvent}
          >
          <div class="ring"></div>
        </div>
        ${controls ? html`
          <button class="btn" @click=${this._onIncrement} ?disabled=${this.disabled || this.readonly || maxDisabled}>
            <img class="btn-img" src=${incrementSvg} alt="">
          </button>
        ` : ''}
      </div>

      <div class="help-container" id=${this._uniqueHelpId}>
        <slot name="help"></slot>
      </div>

      <div class="error-container" id=${this._uniqueErrorId}>
        <slot name="error"></slot>
      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: inline-block;
        }

        /*region Common to cc-input-* & cc-select*/
        :host([inline]) {
          display: inline-grid;
          gap: 0 1em;
          grid-template-areas: "label input"
                              ". help"
                              ". error";
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
          padding-bottom: 0.35em;
        }

        :host([inline]) label {
          flex-direction: column;
          gap: 0;
          grid-area: label;
          justify-content: center;
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
          margin: 0.3em 0 0 0;
        }
        
        slot[name='error']::slotted(*) {
          color: var(--cc-color-text-danger);
          margin: 0.5em 0 0 0;
        }
        /*endregion*/

        .meta-input {
          box-sizing: border-box;
          display: inline-flex;
          grid-area: input;
          height: max-content;
          overflow: visible;
          /* link to position:absolute of .ring */
          position: relative;
          vertical-align: top;
          width: 100%;
        }

        .wrapper {
          display: grid;
          flex: 1 1 0;
          min-width: 0;
          overflow: hidden;
          /* see input to know why 0.15em */
          padding: 0.15em 0.5em;
        }

        /* RESET */
        input {
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: none;
          border: 1px solid #000;
          box-sizing: border-box;
          color: inherit;
          display: block;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
          resize: none;
          width: 100%;
        }

        /* remove spinner firefox */
        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* remove spinner safari */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* BASE */
        input {
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          height: 2em;
          line-height: 2em;
          overflow: hidden;
          text-align: var(--cc-input-number-align, left);
          z-index: 2;
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
          opacity: .5;
          pointer-events: none;
        }

        /* We use this empty .ring element to decorate the input with background, border, box-shadows... */
        .ring {
          background: var(--cc-color-bg-default, #fff);
          border: 1px solid #aaa;
          border-radius: 0.25em;
          bottom: 0;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          left: 0;
          overflow: hidden;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 0;
        }

        input:focus + .ring {
          border-color: #777;
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
        }

        input:focus.error + .ring {
          /*border-color: #777;*/
          box-shadow: 0 0 0 .2em rgba(255, 0, 0, .25);
        }

        input.error + .ring {
          border-color: hsl(351, 70%, 47%);
        }

        input:hover + .ring {
          border-color: #777;
        }

        :host([disabled]) .ring {
          background: var(--cc-color-bg-neutral-disabled);
          border-color: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly);
        }

        /* SKELETON */
        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          background-color: var(--cc-color-bg-neutral-disabled);
          border-color: #eee;
          cursor: progress;
        }

        .skeleton input {
          color: transparent;
        }

        /* RESET */
        .btn {
          background: transparent;
          border: none;
          display: block;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
        }

        .btn {
          border-radius: 0.15em;
          cursor: pointer;
          flex-shrink: 0;
          height: 1.6em;
          margin: 0.2em;
          width: 1.6em;
          z-index: 2;
        }

        .btn:focus {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
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
          box-sizing: border-box;
          filter: grayscale(100%);
          height: 100%;
          opacity: 0.6;
          padding: 15%;
          width: 100%;
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
