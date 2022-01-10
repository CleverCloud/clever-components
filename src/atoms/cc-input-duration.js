import './cc-input-number.js';
import './cc-input-text.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';

const REGEX = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
const keyboardSvg = new URL('../assets/keyboard.svg', import.meta.url).href;
const keyboardExpertSvg = new URL('../assets/keyboard-inverted.svg', import.meta.url).href;

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
 * @event {CustomEvent<string>} cc-input-duration:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent} cc-input-duration:requestimplicitsubmit - Fires when enter key is pressed.
 */
export class CcInputDuration extends LitElement {

  static get properties () {
    return {
      controls: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      label: { type: String },
      name: { type: String, reflect: true },
      readonly: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      value: { type: Number },
      expert: { type: Boolean, reflect: true },
      _invalid: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets the control mode with a decrement and increment buttons. */
    this.controls = false;

    /** @type {boolean} Sets `disabled` attribute on inner native `<input>` element. */
    this.disabled = false;

    /** @type {string|null} Sets label for the input. */
    this.label = null;

    /** @type {string|null} Sets `name` attribute on inner native `<input>` "expert" element. */
    this.name = null;

    /** @type {boolean} Sets `readonly` attribute on inner native `<input>` elements. */
    this.readonly = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {number|null} Sets `value` attribute on inner native "expert" input number element. */
    this.value = null;

    /** @type {boolean} Displays the expert mode, where users need to input ISO8601 duration */
    this.expert = false;

    /** @type {boolean} */
    this._invalid = false;

    // use this unique name for isolation (Safari seems to have a bug)
    /** @type {string} */
    this._uniqueName = Math.random().toString(36).slice(2);
  }

  /**
   * Triggers focus on the inner `<input>/<textarea>` element.
   */
  focus () {
    this.shadowRoot.querySelector('.meta-input').classList.add('focus');
  }

  blur () {
    this.shadowRoot.querySelector('.meta-input').classList.remove('focus');
  }

  _onExpertInput (e) {
    this.value = e.target.value;
    this._invalid = !REGEX.test(this.value);

    if (!this._invalid) {
      dispatchCustomEvent(this, 'input', this.value);
    }
  }

  _onFocus (e) {
    console.log(`focus on ${e.target}`);
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

  _onSimpleInput (e) {
    const years = this.shadowRoot.querySelector('.input-years').value || 0;
    const months = this.shadowRoot.querySelector('.input-months').value || 0;
    const days = this.shadowRoot.querySelector('.input-days').value || 0;

    const yearsPart = years > 0 ? `${years}Y` : '';
    const monthsPart = months > 0 ? `${months}M` : '';
    const daysPart = days > 0 ? `${days}D` : '';

    this.value = `P${yearsPart}${monthsPart}${daysPart}`;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _switchMode () {
    this.expert = !this.expert;
  }

  // updated and not udpate because we need this._input before
  updated (changedProperties) {
    if (changedProperties.has('value')) {
      this._invalid = !REGEX.test(this.value);
    }
    super.update(changedProperties);
  }

  render () {
    return html`
      ${this.label != null ? html`
        <label for=${this._uniqueName}>${this.label}</label>
      ` : ''}

      <div class="meta-input">
      ${this.expert ? this._renderExpert() : this._renderSimple()}
      <div class="ring"></div>
      <button class="btn" @click=${this._switchMode} ?disabled=${this.disabled}>
      <img class="btn-img ${this.expert ? 'expert' : ''}" src=${this.expert ? keyboardExpertSvg : keyboardSvg} alt="">
      </button>
      </div>
    `;
  }

  _renderExpert () {
    const value = (this.value != null) ? this.value : '';

    return html`
    <div class="expert-wrapper">
    <cc-input-text value="${value}" focus @cc-input-text:input=${this._onExpertInput} @focus=${this.focus} @blur=${this.blur}></cc-input-text>
    </div>
    `;
  }

  _renderSimple () {
    const [, years, months, weeks, days] = (this.value != null) ? this.value.match(REGEX) : [];

    const theDays = parseInt(weeks || 0) * 7 + parseInt(days || 0);

    return html`
    <div class="simple-wrapper">
      <cc-input-number class="input-years" value="${years || 0}" ?readonly=${this.readonly} ?disabled=${this.disabled} @cc-input-number:input=${this._onSimpleInput} @focus=${this.focus} @blur=${this.blur}></cc-input-number><span class="unit-char">Y</span>
      <cc-input-number class="input-months" value="${months || 0}" ?readonly=${this.readonly} ?disabled=${this.disabled} @cc-input-number:input=${this._onSimpleInput} @focus=${this.focus} @blur=${this.blur}></cc-input-number><span class="unit-char">M</span>
      <cc-input-number class="input-days" value="${theDays}" ?readonly=${this.readonly} ?disabled=${this.disabled} @cc-input-number:input=${this._onSimpleInput} @focus=${this.focus} @blur=${this.blur}></cc-input-number><span class="unit-char">D</span>
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
          min-width: 7em;
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

        label {
          cursor: pointer;
          display: block;
          padding-bottom: 0.35em;
        }

        cc-input-text {
          --wrapped: 1;
          flex-grow: 1;
          margin-left: .1em;
          width:100%;
        }

        cc-input-number {
          flex-grow: 1;
          --wrapped: 1;
          --cc-input-number-align: right;
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

        cc-input-number:focus + .unit-char {
          color: #777;
          font-weight: bold;
        }

        .simple-wrapper,.expert-wrapper {
          box-sizing: border-box;
          display: inline-flex;
          overflow: visible;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 0;
          border-radius: 0.25em;
          --hide-ring: 1;
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
