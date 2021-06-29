import copy from 'clipboard-copy';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';

const clipboardSvg = new URL('../assets/clipboard.svg', import.meta.url).href;
const eyeClosedSvg = new URL('../assets/eye-closed.svg', import.meta.url).href;
const eyeOpenSvg = new URL('../assets/eye-open.svg', import.meta.url).href;
const tickSvg = new URL('../assets/tick.svg', import.meta.url).href;

const TAG_SEPARATOR = ' ';

function arrayEquals (a, b) {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  if (b.length !== a.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

/**
 * An enhanced text input with support for multiline, copy-to-clipboard, show/hide secret and highlighted tags.
 *
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/atoms/cc-input-text.js)
 *
 * ## Technical details
 *
 * * Uses a native `<input>` element by default and a `<textarea>` element when `multi` is true.
 * * When you use it with `readonly` \+ `clipboard` \+ NOT `multi`, the width of the input auto adapts to the length of the content.
 * * The `secret` feature only works for simple line mode (when `multi` is false).
 * * The `tags` feature enables a space-separated-value input wrapped on several lines where line breaks are not allowed. Don't use it with `multi` or `secret`.
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="assets/clipboard.svg" style="height: 1.5rem; vertical-align: middle"> | <code>clipboard.svg</code>
 * | <img src="assets/eye-closed.svg" style="height: 1.5rem; vertical-align: middle"> | <code>eye-closed.svg</code>
 * | <img src="assets/eye-open.svg" style="height: 1.5rem; vertical-align: middle"> | <code>eye-open.svg</code>
 * | <img src="assets/tick.svg" style="height: 1.5rem; vertical-align: middle"> | <code>tick.svg</code>
 *
 * @cssdisplay inline-block / block (with `[multi]`)
 *
 * @prop {Boolean} clipboard - Adds a copy-to-clipboard button (when not disabled and not skeleton).
 * @prop {Boolean} disabled - Sets `disabled` attribute on inner native `<input>/<textarea>` element.
 * @prop {String} label - Sets label for the input.
 * @prop {Boolean} multi - Enables multiline support (with a `<textarea>` instead of an `<input>`).
 * @prop {String} name - Sets `name` attribute on inner native `<input>/<textarea>` element.
 * @prop {String} placeholder - Sets `placeholder` attribute on inner native `<input>/<textarea>` element.
 * @prop {Boolean} readonly - Sets `readonly` attribute on inner native `<input>/<textarea>` element.
 * @prop {Boolean} secret - Enables show/hide secret feature with an eye icon.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {String[]} tags - Sets list of tags and enables tags mode (if not null).
 * @prop {String} value - Sets `value` attribute on inner native input element or textarea's inner content.
 *
 * @event {CustomEvent<String>} cc-input-text:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent<String[]>} cc-input-text:tags - Fires an array of tags whenever the `value` changes (separated by spaces).
 * @event {CustomEvent} cc-input-text:requestimplicitsubmit - Fires when enter key is pressed in simple mode, in tags mode or when ctrl+enter is pressed in multi mode.
 */
export class CcInputText extends LitElement {

  static get properties () {
    return {
      clipboard: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      label: { type: String },
      multi: { type: Boolean, reflect: true },
      name: { type: String, reflect: true },
      placeholder: { type: String },
      readonly: { type: Boolean, reflect: true },
      secret: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      tags: { type: Array },
      _tagsEnabled: { type: Boolean, attribute: false },
      value: { type: String },
      _showSecret: { type: Boolean, attribute: false },
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
    this.secret = false;
    this.skeleton = false;
    this.tags = null;
    this.value = '';
    this._copyOk = false;
    this._showSecret = false;
    this._tagsEnabled = false;
    // use this unique name for isolation (Safari seems to have a bug)
    this._uniqueName = Math.random().toString(36).slice(2);
  }

  // In general, we try to use LitELement's update() lifecycle callback but in this situation,
  // overriding get/set makes more sense
  get tags () {
    return this._tagsEnabled
      ? this.value.split(TAG_SEPARATOR).filter((tag) => tag !== '')
      : null;
  }

  set tags (newVal) {
    this._tagsEnabled = newVal != null;
    if (this._tagsEnabled) {
      const oldVal = this.tags;
      // The cc-input-text:tags event fires with a filtered list of tags.
      // This means if you type "hello " with a trailing space, the event would be fired with ['hello'].
      // Then if a parent component sets input.tags = ['hello'], the space would be removed.
      // This if only sets the value if the new tags are different
      if (!arrayEquals(oldVal, newVal)) {
        this.value = newVal.join(TAG_SEPARATOR);
        this.requestUpdate('tags', oldVal);
      }
    }
  }

  /**
   * Triggers focus on the inner `<input>/<textarea>` element.
   */
  focus () {
    this.shadowRoot.querySelector('.input').focus();
  }

  _onInput (e) {
    // If tags mode is enabled, we want to prevent/remove line breaks
    // and preserve caret position in case of a line break entry (keypress, DnD, copy/paste...)
    if (this._tagsEnabled) {
      if (e.target.value.includes('\n')) {
        const { selectionStart, selectionEnd } = e.target;
        const oldValue = e.target.value;
        const newValue = e.target.value.replace(/\n/g, '');
        const diff = oldValue.length - newValue.length;
        e.target.value = newValue;
        e.target.setSelectionRange(selectionStart - diff, selectionEnd - diff);
      }
    }
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
    if (this._tagsEnabled) {
      dispatchCustomEvent(this, 'tags', this.tags);
    }
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

  _onClickSecret () {
    this._showSecret = !this._showSecret;
  }

  // Stop propagation of keydown and keypress events (to prevent conflicts with shortcuts)
  _onKeyEvent (e) {
    if (e.type === 'keydown' || e.type === 'keypress') {
      e.stopPropagation();
    }
    // Here we prevent keydown on enter key from modifying the value
    if (this._tagsEnabled && e.type === 'keydown' && e.keyCode === 13) {
      e.preventDefault();
      dispatchCustomEvent(this, 'requestimplicitsubmit');
    }
    // Request implicit submit with keypress on enter key
    if (!this.readonly && e.type === 'keypress' && e.keyCode === 13) {
      if ((!this.multi) || (this.multi && e.ctrlKey)) {
        dispatchCustomEvent(this, 'requestimplicitsubmit');
      }
    }
  }

  render () {

    const value = this.value || '';
    const rows = value.split('\n').length;
    const clipboard = (this.clipboard && !this.disabled && !this.skeleton);
    // NOTE: For now, we don't support secret when multi is activated
    const secret = (this.secret && !this.multi && !this.disabled && !this.skeleton);
    const isTextarea = (this.multi || this._tagsEnabled);

    const tags = value
      .split(TAG_SEPARATOR)
      .map((tag, i, all) => html`<span class="tag">${tag}</span>${i !== (all.length - 1) ? TAG_SEPARATOR : ''}`);

    return html`

      ${this.label != null ? html`
        <label for=${this._uniqueName}>${this.label}</label>
      ` : ''}
      
      <div class="meta-input">
        <div class="wrapper ${classMap({ skeleton: this.skeleton })}"
          @input=${this._onInput}
          @keydown=${this._onKeyEvent}
          @keypress=${this._onKeyEvent}>
          
          ${isTextarea ? html`
            ${this._tagsEnabled && !this.skeleton ? html`
              <!--
                We use this to display colored background rectangles behind space separated values. 
                This needs to be on the same line and the 2 level parent is important to keep scroll behaviour.
              -->
              <div class="input input-underlayer" style="--rows: ${rows}"><div class="all-tags">${tags}</div></div>
            ` : ''}
            <textarea
              id=${this._uniqueName}
              class="input ${classMap({ 'input-tags': this._tagsEnabled })}"
              style="--rows: ${rows}"
              rows=${rows}
              ?disabled=${this.disabled || this.skeleton}
              ?readonly=${this.readonly}
              .value=${value}
              name=${this.name}
              placeholder=${this.placeholder}
              spellcheck="false"
              wrap="${ifDefined(this._tagsEnabled ? 'soft' : undefined)}"
              @focus=${this._onFocus}
            ></textarea>
          ` : ''}
            
          ${!isTextarea ? html`
            ${clipboard && this.readonly ? html`
              <!--
                This div has the same styles as the input (but it's hidden with height:0)
                this way we can use it to know what width the content is
                and "auto size" the container.
              -->
              <div class="input input-mirror">${value}</div>
            ` : ''}
            <input
              id=${this._uniqueName}
              type=${this.secret && !this._showSecret ? 'password' : 'text'}
              class="input"
              ?disabled=${this.disabled || this.skeleton} 
              ?readonly=${this.readonly}
              .value=${value}
              name=${this.name}
              placeholder=${this.placeholder}
              spellcheck="false"
              @focus=${this._onFocus}
            >
          ` : ''}
        
          <div class="ring"></div>
        </div>
        
        ${secret ? html`
          <button class="btn" @click=${this._onClickSecret} 
            title=${this._showSecret ? i18n('cc-input-text.secret.hide') : i18n('cc-input-text.secret.show')}>
            <img class="btn-img" src=${this._showSecret ? eyeClosedSvg : eyeOpenSvg} alt="">
          </button>
        ` : ''}
        
        ${clipboard ? html`
          <button class="btn" @click=${this._onClickCopy} title=${i18n('cc-input-text.clipboard')}>
            <img class="btn-img" src=${this._copyOk ? tickSvg : clipboardSvg} alt="">
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

        :host([multi]) {
          display: block;
        }

        label {
          cursor: pointer;
          display: block;
          padding-bottom: 0.35rem;
        }

        .meta-input {
          box-sizing: border-box;
          display: inline-flex;
          /* link to position:absolute of .ring */
          position: relative;
          vertical-align: top;
          width: 100%;
        }

        :host([multi]) .meta-input {
          display: flex;
        }

        .wrapper {
          display: grid;
          flex: 1 1 0;
          margin: 0.15rem 0.5rem;
          min-width: 0;
          overflow: hidden;
        }

        /* RESET */
        .input {
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

        /* BASE */
        .input {
          background: none;
          border: none;
          grid-area: 1 / 1 / 1 / 1;
          /* multiline behaviour */
          height: calc(var(--rows, 1) * 1.7rem);
          line-height: 1.7rem;
          overflow: hidden;
          z-index: 2;
        }

        .input::placeholder {
          font-style: italic;
        }

        textarea:not([wrap]) {
          white-space: pre;
        }

        /* STATES */
        .input:focus,
        .input:active {
          outline: 0;
        }

        .input[disabled] {
          opacity: .75;
          pointer-events: none;
        }

        /* Hide only height and keep content width */
        .input-mirror {
          height: 0;
        }

        /* TAGS UNDERLAYER */
        .input-tags,
        .input-underlayer {
          height: auto;
          padding: 0 3px;
          word-break: break-all;
        }

        .input-underlayer {
          color: transparent;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          white-space: pre-wrap;
          z-index: 1;
        }

        .input-underlayer .tag:not(:empty) {
          --color: rgba(50, 50, 255, 0.15);
          background-color: var(--color);
          border-radius: 3px;
          box-shadow: 0 0 0 2px var(--color);
          padding: 1px 0;
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

        .input:focus + .ring {
          border-color: #777;
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
        }

        .input:hover + .ring {
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
        .skeleton .input:hover + .ring {
          background-color: #eee;
          border-color: #eee;
          cursor: progress;
        }

        .skeleton .input,
        .skeleton .input::placeholder {
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
          flex-shrink: 0;
          height: 1.6rem;
          margin: 0.2rem 0.2rem 0.2rem 0;
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

window.customElements.define('cc-input-text', CcInputText);
