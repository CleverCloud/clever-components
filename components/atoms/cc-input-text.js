import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A text input (with optional multiline support)
 *
 * ## Details
 *
 * * uses a native `<input>` element by default and a `<textarea>` element when `multi` is true
 *
 * @fires cc-input-text:input - mirrors native input/textarea events with the `value` on `detail`
 *
 * @attr {Boolean} disabled - same as native a input/textarea element
 * @attr {Boolean} readonly - same as native a input/textarea element
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 * @attr {Boolean} multi - enable multiline support (with a textarea)
 * @attr {String} value - same as native a input/textarea element
 * @attr {String} name - same as native a input/textarea element
 * @attr {String} placeholder - same as native a input/textarea element
 */
export class CcInputText extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      readonly: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      multi: { type: Boolean, reflect: true },
      value: { type: String },
      name: { type: String, reflect: true },
      placeholder: { type: String },
    };
  }

  constructor () {
    super();
    this.name = '';
    this.value = '';
    this.placeholder = '';
  }

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

  // Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
  _stopPropagation (e) {
    e.stopPropagation();
  }

  render () {

    const rows = (this.value || '').split('\n').length;

    return html`
      <div class="wrapper ${classMap({ skeleton: this.skeleton })}"
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
            @focus=${this._onFocus}
          ></textarea>
        ` : ''}
        
        ${!this.multi ? html`
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
          transition: all 75ms ease-in-out, height 0ms;
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
          height: 1.7rem;
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

        /* MULTILINE BEHAVIOUR */
        .input[rows] {
          height: calc(var(--rows, 1) * 1.7rem);
          white-space: pre;
        }
      `,
    ];
  }
}

window.customElements.define('cc-input-text', CcInputText);
