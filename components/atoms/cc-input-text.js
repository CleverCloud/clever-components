import clipboardSvg from './clipboard.svg';
import copy from 'clipboard-copy';
import tickSvg from './tick.svg';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * An enhanced text input with support for multiline and copy-to-clipboard.
 *
 * ## Details
 *
 * * Uses a native `<input>` element by default and a `<textarea>` element when `multi` is true.
 * * When you use it with `readonly` \+ `clipboard` \+ NOT `multi`, the width of the input auto adapts to the length of the content.
 *
 * @prop {Boolean} clipboard - Adds a copy-to-clipboard button (when not disabled and not skeleton).
 * @prop {Boolean} disabled - Sets `disabled` attribute on inner native `<input>/<textarea>` element.
 * @prop {Boolean} multi - Enables multiline support (with a `<textarea>` instead of an `<input>`).
 * @prop {String} name - Sets `name` attribute on inner native `<input>/<textarea>` element.
 * @prop {String} placeholder - Sets `placeholder` attribute on inner native `<input>/<textarea>` element.
 * @prop {Boolean} readonly - Sets `readonly` attribute on inner native `<input>/<textarea>` element.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {String} value - Sets `value` attribute on inner native input element or textarea's inner content.
 *
 * @event {CustomEvent<String>} cc-input-text:input - Fires the `value` whenever the `value` changes.
 */
export class CcInputText extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      multi: { type: Boolean, reflect: true },
      clipboard: { type: Boolean, reflect: true },
      value: { type: String },
      /** @required */
      name: { type: String, reflect: true },
      placeholder: { type: String },
      _copyOk: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.clipboard = false;
    this.disabled = false;
    this.multi = false;
    this.placeholder = '';
    this.readonly = false;
    this.skeleton = false;
    this.value = '';
    this._copyOk = false;
  }

  /**
   * Triggers focus on the inner `<input>/<textarea>` element.
   */
  focus () {
    this.shadowRoot.querySelector('.input').focus();
  }

  _onInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  _onFocus (e) {
    if (this.readonly) {
      e.target.select();
    }
  }

  _onClickCopy () {
    copy(this.value).then(() => {
      this._copyOk = true;
      setTimeout(() => (this._copyOk = false), 1000);
    });
  }

  // Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
  _stopPropagation (e) {
    e.stopPropagation();
  }

  render () {

    const rows = (this.value || '').split('\n').length;
    const clipboard = (this.clipboard && !this.disabled && !this.skeleton);

    return html`
      <div class="wrapper ${classMap({ skeleton: this.skeleton, clipboard })}"
        @input=${this._onInput}
        @keydown=${this._stopPropagation}
        @keypress=${this._stopPropagation}
      >
      
        ${this.multi ? html`
          <textarea
            class="input"
            style="--rows: ${rows}"
            rows=${rows}
            ?disabled=${this.disabled || this.skeleton}
            ?readonly=${this.readonly}
            .value=${this.value}
            name=${this.name}
            placeholder=${this.placeholder}
            spellcheck="false"
            wrap="off"
            @focus=${this._onFocus}
          ></textarea>
        ` : ''}
        
        ${!this.multi ? html`
          ${clipboard && this.readonly ? html`
            <!--
              This div has the same styles as the input (but it's hidden with height:0)
              this way we can use it to know what width the content is
              and "auto size" the container.
            -->
            <div class="auto-size input">${this.value}</div>
          ` : ''}
          <input type="text"
            class="input"
            ?disabled=${this.disabled || this.skeleton} 
            ?readonly=${this.readonly}
            .value=${this.value}
            name=${this.name}
            placeholder=${this.placeholder}
            spellcheck="false"
            @focus=${this._onFocus}
          >
        ` : ''}
      </div>
      
      ${clipboard ? html`
        <button class="clipboard-btn" ?disabled=${this.disabled || this.skeleton} @click=${this._onClickCopy} title=${i18n('cc-input-text.clipboard')}>
          <img class="clipboard-img" src=${this._copyOk ? tickSvg : clipboardSvg} alt="">
        </button>
    ` : ''}
    `;
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          display: inline-block;
          box-sizing: border-box;
          margin: 0.2rem;
          /* link to position:absolute of clipboard-btn */
          position: relative;
          vertical-align: top;
        }

        :host([multi]) {
          display: block;
        }

        .wrapper {
          border-radius: 0.25rem;
          border: 1px solid #aaa;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          overflow: hidden;
          padding: 0.15rem 0.5rem;
          transition: box-shadow 75ms ease-in-out, height 0ms;
        }

        .wrapper:focus-within {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          border-color: #777;
        }

        .wrapper:hover {
          border-color: #777;
        }

        :host([disabled]) .wrapper {
          background: #eee;
          border-color: #eee;
          cursor: default;
          opacity: .75;
        }

        :host([readonly]) .wrapper {
          background: #eee;
        }

        /* RESET */
        .input {
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: #fff;
          border: 1px solid #000;
          box-sizing: border-box;
          display: block;
          font-family: "SourceCodePro", "monaco", monospace;
          font-size: 14px;
          margin: 0;
          padding: 0;
          resize: none;
          width: 100%;
        }

        /* BASE */
        .input {
          background: none;
          border: none;
          /* multiline behaviour */
          height: calc(var(--rows, 1) * 1.7rem);
          line-height: 1.7rem;
          overflow: hidden;
        }

        /* STATES */
        .input:focus,
        .input:active {
          outline: 0;
        }

        .input[disabled] {
          pointer-events: none;
        }

        /* Hide only height and keep content width */
        .auto-size {
          height: 0;
        }

        /* SKELETON */
        .skeleton,
        .skeleton:hover {
          background-color: #eee;
          border-color: #eee;
          cursor: progress;
        }

        .skeleton .input,
        .skeleton .input::placeholder {
          color: transparent;
        }

        /* CLIPBOARD BUTTON STUFFS */
        .wrapper.clipboard {
          padding-right: 2.2rem;
        }

        /* RESET */
        .clipboard-btn {
          background: transparent;
          border: none;
          display: block;
          font-family: inherit;
          margin: 0;
          padding: 0;
        }

        .clipboard-btn {
          border-radius: 0.1rem;
          cursor: pointer;
          height: 1.6rem;
          position: absolute;
          right: calc(0.2rem + 1px);
          top: calc(0.2rem + 1px);
          width: 1.6rem;
        }

        .clipboard-btn[disabled],
        .clipboard-btn[skeleton] {
          display: none;
        }

        .clipboard-btn:focus {
          box-shadow: 0 0 0 .2rem rgba(50, 115, 220, .25);
          outline: 0;
        }

        .clipboard-btn:active,
        .clipboard-btn:hover {
          box-shadow: none;
          outline: 0;
        }

        .clipboard-btn:hover {
          background-color: #f5f5f5;
        }

        .clipboard-btn:active {
          background-color: #eee;
        }

        :host([readonly]) .clipboard-btn:hover {
          background-color: #e5e5e5;
        }

        :host([readonly]) .clipboard-btn:active {
          background-color: #ddd;
        }

        /* We can do this because we set a visible focus state */
        .clipboard-btn::-moz-focus-inner {
          border: 0;
        }

        .clipboard-img {
          box-sizing: border-box;
          padding: 15%;
          height: 100%;
          width: 100%;
          filter: grayscale(100%);
        }

        .clipboard-img:hover {
          filter: grayscale(0%);
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-text', CcInputText);
