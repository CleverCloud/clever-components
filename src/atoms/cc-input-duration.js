import './cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';

const DURATION_REGEX = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
const keyboardSvg = new URL('../assets/keyboard.svg', import.meta.url).href;
const keyboardExpertSvg = new URL('../assets/keyboard-inverted.svg', import.meta.url).href;

function parseDuration (durationString) {
  const matches = durationString.match(DURATION_REGEX)?.slice(1) ?? Array.from({ length: 7 });
  const [years, months, weeks, days, hours, minutes, seconds] = matches
    .map((s) => (s != null) ? parseInt(s) : 0) ?? [];

  return { years, months, weeks, days, hours, minutes, seconds };
}

function validateDuration (durationString) {
  return DURATION_REGEX.test(durationString);
}

function serializeDuration ({ years, months, days }) {
  const yearsPart = years > 0 ? `${years}Y` : '';
  const monthsPart = months > 0 ? `${months}M` : '';
  const daysPart = days > 0 ? `${days}D` : '';

  return `P${yearsPart}${monthsPart}${daysPart}`;
}


/**
 * A custom duration input with simple and expert modes.
 *
 * @cssdisplay inline-block
 *
 * @event {CustomEvent<string>} cc-input-duration:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent} cc-input-duration:requestimplicitsubmit - Fires when enter key is pressed.
 */
export class CcInputDuration extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      expert: { type: Boolean, reflect: true },
      label: { type: String },
      readonly: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      value: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inner native `<input>` element. */
    this.disabled = false;

    /** @type {boolean} Displays the expert mode, where users need to input ISO8601 duration */
    this.expert = false;

    /** @type {string|null} Sets label for the input. */
    this.label = null;

    /** @type {boolean} Sets `readonly` attribute on inner native `<input>` elements. */
    this.readonly = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {string|null} Sets `value` attribute on inner native "expert" input number element. */
    this.value = null;

    // use this unique name for isolation (Safari seems to have a bug)
    /** @type {string} */
    this._uniqueName = Math.random().toString(36).slice(2);
  }

  /**
   * Triggers focus on the inner `<input>` elements.
   * TODO: fix this using a property.
   */
  focus () {
    this.shadowRoot.querySelector('.meta-input').classList.add('focus');
  }

  blur () {
    this.shadowRoot.querySelector('.meta-input').classList.remove('focus');
  }

  _isInvalid () {
    return !validateDuration(this.value);
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

  _onExpertInput (e) {
    this.value = e.target.value;

    if (!this._isInvalid()) {
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  _onSimpleInput (e) {
    const durationObj = {
      years: this.shadowRoot.querySelector('.input-years').valueAsNumber || 0,
      months: this.shadowRoot.querySelector('.input-months').valueAsNumber || 0,
      days: this.shadowRoot.querySelector('.input-days').valueAsNumber || 0,
    };

    this.value = serializeDuration(durationObj);

    dispatchCustomEvent(this, 'input', this.value);
  }

  _switchMode () {
    this.expert = !this.expert;
  }

  render () {

    const expertValue = this.value ?? '';
    const { years, months, weeks, days } = (this.value != null) ? parseDuration(this.value) : {};
    const theDays = weeks * 7 + days;

    return html`
      ${this.label != null ? html`
        <label for=${this._uniqueName}>${this.label}</label>
      ` : ''}

      <div class="meta-input ${classMap({ expert: this.expert, error: this._isInvalid() })}" @keypress=${this._onKeyEvent} @keydown=${this._onKeyEvent}>
        <div class="expert-wrapper">
          <input type="text" .value="${expertValue}" @input=${this._onExpertInput} @focus=${this.focus} @blur=${this.blur}>
        </div>
        <div class="simple-wrapper">
          <input type="number" class="input-years" .value="${years}" ?readonly=${this.readonly} ?disabled=${this.disabled} @input=${this._onSimpleInput} @focus=${this.focus} @blur=${this.blur}>
          <span class="unit-char">Y</span>
          <input type="number" class="input-months" .value="${months}" ?readonly=${this.readonly} ?disabled=${this.disabled} @input=${this._onSimpleInput} @focus=${this.focus} @blur=${this.blur}>
          <span class="unit-char">M</span>
          <input type="number" class="input-days" .value="${theDays}" ?readonly=${this.readonly} ?disabled=${this.disabled} @input=${this._onSimpleInput} @focus=${this.focus} @blur=${this.blur}>
          <span class="unit-char">D</span>
        </div>
        <div class="ring"></div>
        <button class="btn" @click=${this._switchMode} @focus=${this.focus} ?disabled=${this.disabled} title=${i18n('cc-input-duration.switch.' + (this.expert ? 'simple' : 'expert'))}>
          <img class="btn-img" src=${this.expert ? keyboardExpertSvg : keyboardSvg} alt="">
        </button>
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
          /*min-width: 7em;*/
        }

        .meta-input {
          box-sizing: border-box;
          display: grid;
          overflow: visible;
          /* link to position:absolute of .ring */
          position: relative;
          vertical-align: top;
          width: 100%;
          grid-template-columns: min-content min-content;
          grid-template-areas: "input button";
        }

        label {
          cursor: pointer;
          display: block;
          padding-bottom: 0.35em;
        }

        cc-input-text {
          flex-grow: 1;
          margin-left: .1em;
          width:100%;
        }

        /* RESET */
        input {
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: #fff;
          border: 1px solid #000;
          box-sizing: border-box;
          display: block;
          font-family: monospace;
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
          flex-grow: 1;
          background: none;
          border: none;
          font-family: var(--cc-ff-monospace);
          font-size: 0.85em;
          height: 2em;
          line-height: 2em;
          overflow: hidden;
        }

        input[type="number"] {
          width: 4ch;
          text-align: right;
        }

        input[type="text"] {
          padding-left: .6em;
        }

        /* STATES */
        input:focus,
        input:active {
          outline: 0;
        }

        .unit-char {
          margin:0;
          margin-left:.1em;
          padding:0;
          z-index: 1;
          flex-grow: 0;
          color: #bbb;
          font-family: var(--cc-ff-monospace);
        }

        .unit-char:last-child {
          margin-right: 0;
        }

        input:focus + .unit-char {
          color: #777;
          font-weight: bold;
        }

        .simple-wrapper,
        .expert-wrapper {
          box-sizing: border-box;
          display: inline-flex;
          overflow: visible;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 0;
          border-radius: 0.25em;
          position: relative;
          z-index: 1;
          grid-area: input;
        }

        .meta-input.expert .simple-wrapper,
        .meta-input:not(.expert) .expert-wrapper {
          visibility: hidden;
        }

        /* We use this empty .ring element to decorate the input with background, border, box-shadows... */
        .ring {
          background: #fff;
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

        .meta-input.focus .ring {
          border-color: #777;
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
        }

        .meta-input.focus.error .ring {
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
          grid-area: button;
        }

        .btn:focus {
          box-shadow: 0 0 0 .1em rgba(50, 115, 220, .25);
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

        .btn-img.expert {
          background-color: #eee;
        }

        .btn-img:hover {
          filter: grayscale(0%);
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-duration', CcInputDuration);
