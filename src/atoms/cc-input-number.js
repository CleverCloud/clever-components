import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';

const incrementSvg = new URL('../assets/increment.svg', import.meta.url).href;
const decrementSvg = new URL('../assets/decrement.svg', import.meta.url).href;

/**
 * A custom number input with controls mode.
 *
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/atoms/cc-input-number.js)
 *
 * ## Technical details
 *
 * * Uses a native `<input>` with a type `number` without native arrows mode
 * * The `controls` feature enables the "arrow" mode but with an increment/decrement button on the side of the input
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="assets/decrement.svg" style="height: 1.5rem; vertical-align: middle"> | <code>decrement.svg</code>
 * | <img src="assets/increment.svg" style="height: 1.5rem; vertical-align: middle"> | <code>increment.svg</code>
 *
 * @cssdisplay inline-block
 *
 * @prop {Boolean} controls - Sets the control mode with a decrement and increment buttons.
 * @prop {Boolean} disabled - Sets `disabled` attribute on inner native `<input>` element.
 * @prop {String} label - Sets label for the input.
 * @prop {Number} max - Sets the max range of the `<input>` element.
 * @prop {Number} min - Sets the min range of the `<input>` element.
 * @prop {String} name - Sets `name` attribute on inner native `<input>` element.
 * @prop {Boolean} readonly - Sets `readonly` attribute on inner native `<input>` element.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {Number} step - Sets the step of the `<input>` element affecting the value when changing it on the keyboard or controls mode.
 * @prop {Number} value - Sets `value` attribute on inner native input number element.
 *
 * @event {CustomEvent<String>} cc-input-number:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent} cc-input-number:requestimplicitsubmit - Fires when enter key is pressed.
 *
 * @cssprop {Align} --cc-input-number-align - Change the alignment of the number present in the input (defaults: `right`).
 */
export class CcInputNumber extends LitElement {

  static get properties () {
    return {
      controls: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      label: { type: String },
      max: { type: Number },
      min: { type: Number },
      name: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      step: { type: Number },
      value: { type: Number },
      _invalid: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.disabled = false;
    this.readonly = false;
    this.skeleton = false;
    this.controls = false;
    this._invalid = false;
    // use this unique name for isolation (Safari seems to have a bug)
    this._uniqueName = Math.random().toString(36).slice(2);
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
    const minDisabled = (this.value <= this.min);
    const maxDisabled = (this.value >= this.max);

    return html`

      ${this.label != null ? html`
        <label for=${this._uniqueName}>${this.label}</label>
      ` : ''}
      
      <div class="meta-input">
        ${controls ? html`
        <button class="btn" @click=${this._onDecrement} ?disabled=${this.disabled || this.readonly || minDisabled}>
          <img class="btn-img" src=${decrementSvg} alt="">
        </button>
        ` : ''}
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}">
          
            <input
              id=${this._uniqueName}
              type="number"
              class="input ${classMap({ error: this._invalid })}"
              ?disabled=${this.disabled || this.skeleton} 
              ?readonly=${this.readonly}
              min=${(this.min != null) ? this.min : ''}
              max=${(this.max != null) ? this.max : ''}
              step=${(this.step != null) ? this.step : ''}
              .value=${value}
              name=${(this.name != null) ? this.name : ''}
              spellcheck="false"
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
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: inline-block;
        }
        
        label {
          cursor: pointer;
          display: block;
          padding-bottom: 0.35rem;
        }

        .meta-input {
          box-sizing: border-box;
          display: inline-flex;
          overflow: visible;
          /* link to position:absolute of .ring */
          position: relative;
          vertical-align: top;
          width: 100%;
        }

        .wrapper {
          display: grid;
          flex: 1 1 0;
          margin: 0.15rem 0.5rem;
          min-width: 0;
          overflow: hidden;
        }

        /* RESET */
        input {
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: #fff;
          border: 1px solid #000;
          box-sizing: border-box;
          display: block;
          font-family: var(--cc-ff-monospace);
          font-size: 14px;
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
          background: none;
          border: none;
          grid-area: 1 / 1 / 1 / 1;
          height: 1.7rem;
          line-height: 1.7rem;
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
          opacity: .75;
          pointer-events: none;
        }
        
        button[disabled] {
          opacity: .5;
          pointer-events: none;
        }
        
        /* We use this empty .ring element to decorate the input with background, border, box-shadows... */
        .ring {
          background: #fff;
          border: 1px solid #aaa;
          border-radius: 0.25rem;
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

        input:focus.error  + .ring {
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
          background: #eee;
          border-color: #eee;
        }

        :host([readonly]) .ring {
          background: #eee;
        }

        /* SKELETON */
        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          background-color: #eee;
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
          margin: 0;
          padding: 0;
        }

        .btn {
          border-radius: 0.15rem;
          cursor: pointer;
          flex-shrink: 1;
          height: 1.6rem;
          margin: 0.2rem 0.2rem 0.2rem 0.2rem;
          width: 1.6rem;
          z-index: 2;
        }

        .btn:focus {
          box-shadow: 0 0 0 .2rem rgba(50, 115, 220, .25);
          outline: 0;
        }

        .btn:active,
        .btn:hover {
          box-shadow: none;
          outline: 0;
        }

        .btn:hover {
          background-color: #f5f5f5;
        }

        .btn:active {
          background-color: #eee;
        }

        :host([readonly]) .btn:hover {
          background-color: #e5e5e5;
        }

        :host([readonly]) .btn:active {
          background-color: #ddd;
        }

        /* We can do this because we set a visible focus state */
        .btn::-moz-focus-inner {
          border: 0;
        }

        .btn-img {
          box-sizing: border-box;
          filter: grayscale(100%);
          height: 100%;
          padding: 15%;
          width: 100%;
        }

        .btn-img:hover {
          filter: grayscale(0%);
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-number', CcInputNumber);
