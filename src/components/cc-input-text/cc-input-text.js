import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const clipboardSvg = new URL('../../assets/clipboard.svg', import.meta.url).href;
const eyeClosedSvg = new URL('../../assets/eye-closed.svg', import.meta.url).href;
const eyeOpenSvg = new URL('../../assets/eye-open.svg', import.meta.url).href;
const tickSvg = new URL('../../assets/tick.svg', import.meta.url).href;

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
 * ## Technical details
 *
 * * Uses a native `<input>` element by default and a `<textarea>` element when `multi` is true.
 * * When you use it with `readonly` \+ `clipboard` \+ NOT `multi`, the width of the input auto adapts to the length of the content.
 * * The `secret` feature only works for simple line mode (when `multi` is false).
 * * The `tags` feature enables a space-separated-value input wrapped on several lines where line breaks are not allowed. Don't use it with `multi` or `secret`.
 * * When an error slot is used, the input is decorated with a red border and a redish focus ring. You have to be aware that it uses the [`slotchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event) event which doesn't fire if the children of a slotted node change.
 *
 * @cssdisplay inline-block / block (with `[multi]`)
 *
 * @event {CustomEvent<string>} cc-input-text:input - Fires the `value` whenever the `value` changes.
 * @event {CustomEvent} cc-input-text:requestimplicitsubmit - Fires when enter key is pressed in simple mode, in tags mode or when ctrl+enter is pressed in multi mode.
 * @event {CustomEvent<string[]>} cc-input-text:tags - Fires an array of tags whenever the `value` changes (separated by spaces).
 *
 * @cssprop {FontFamily} --cc-input-font-family - The font-family for the input content (defaults: `inherit` or `--cc-ff-monospace` when using the tags mode).
 *
 * @slot error - The error message to be displayed below the `<input>` element or below the help text. Please use a `<p>` tag.
 * @slot help - The help message to be displayed right below the `<input>` element. Please use a `<p>` tag.
 */
export class CcInputText extends LitElement {

  static get properties () {
    return {
      clipboard: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      label: { type: String },
      hiddenLabel: { type: Boolean, attribute: 'hidden-label' },
      inline: { type: Boolean, reflect: true },
      multi: { type: Boolean, reflect: true },
      name: { type: String, reflect: true },
      placeholder: { type: String },
      readonly: { type: Boolean, reflect: true },
      required: { type: Boolean },
      secret: { type: Boolean, reflect: true },
      skeleton: { type: Boolean, reflect: true },
      tags: { type: Array },
      value: { type: String },
      _copyOk: { type: Boolean, state: true },
      _showSecret: { type: Boolean, state: true },
      _tagsEnabled: { type: Boolean, state: true },
      _hasError: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Adds a copy-to-clipboard button (when not disabled and not skeleton). */
    this.clipboard = false;

    /** @type {boolean} Sets `disabled` attribute on inner native `<input>/<textarea>` element. */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the `<input>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets label for the input. */
    this.label = null;

    /** @type {boolean} Hides the label visually if `true`. */
    this.hiddenLabel = false;

    /** @type {boolean} Enables multiline support (with a `<textarea>` instead of an `<input>`). */
    this.multi = false;

    /** @type {string|null} Sets `name` attribute on inner native `<input>/<textarea>` element. */
    this.name = null;

    /** @type {string} Sets `placeholder` attribute on inner native `<input>/<textarea>` element. */
    this.placeholder = '';

    /** @type {boolean} Sets `readonly` attribute on inner native `<input>/<textarea>` element. */
    this.readonly = false;

    /** @type {boolean} Sets required mention inside the `<label>` element. */
    this.required = false;

    /** @type {boolean} Enables show/hide secret feature with an eye icon. */
    this.secret = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {string[]} Sets list of tags and enables tags mode (if not null). */
    this.tags = null;

    /** @type {string} Sets `value` attribute on inner native input element or textarea's inner content. */
    this.value = '';

    /** @type {boolean} */
    this._copyOk = false;

    /** @type {boolean} */
    this._showSecret = false;

    /** @type {boolean} */
    this._tagsEnabled = false;

    this._hasError = false;
  }

  // In general, we try to use LitElement's update() lifecycle callback but in this situation,
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
    navigator.clipboard.writeText(this.value).then(() => {
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

  _onErrorSlotChanged (event) {
    this._hasError = event.target.assignedNodes()?.length > 0;
  }

  render () {
    const value = this.value ?? '';
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
        <label class=${classMap({ 'visually-hidden': this.hiddenLabel })} for="input-id">
          <span>${this.label}</span>
          ${this.required ? html`
            <span class="required">${i18n('cc-input-text.required')}</span>
          ` : ''}
        </label>
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
              <div class="input input-underlayer" style="--rows: ${rows}"><!--
                --><div class="all-tags">${tags}</div><!--
              --></div>
            ` : ''}
            <textarea
              id="input-id"
              class="input ${classMap({ 'input-tags': this._tagsEnabled, error: this._hasError })}"
              style="--rows: ${rows}"
              rows=${rows}
              ?disabled=${this.disabled || this.skeleton}
              ?readonly=${this.readonly}
              .value=${value}
              name=${ifDefined(this.name ?? undefined)}
              placeholder=${this.placeholder}
              spellcheck="false"
              wrap="${ifDefined(this._tagsEnabled ? 'soft' : undefined)}"
              aria-describedby="help-id error-id"
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
              id="input-id"
              type=${this.secret && !this._showSecret ? 'password' : 'text'}
              class="input ${classMap({ error: this._hasError })}"
              ?disabled=${this.disabled || this.skeleton}
              ?readonly=${this.readonly}
              .value=${value}
              name=${ifDefined(this.name ?? undefined)}
              placeholder=${this.placeholder}
              spellcheck="false"
              aria-describedby="help-id error-id"
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

      
      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      <div class="error-container" id="error-id" >
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

        :host([multi]) {
          display: block;
        }

        /* region Common to cc-input-* & cc-select (apart from multi) */

        :host([inline]) {
          display: inline-grid;
          gap: 0 1em;
          grid-template-areas: 
            'label input'
            '. help'
            '. error';
          grid-template-columns: auto 1fr;
        }

        :host([inline][multi]) {
          display: grid;
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
        
        :host([inline][multi]) label {
          /* Allows the label text to be aligned with the first line of the input. */
          height: 2em;
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
          width: 100%;
          height: max-content;
          box-sizing: border-box;
          grid-area: input;
          vertical-align: top;
        }

        :host([multi]) .meta-input {
          display: flex;
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
          /* multiline behaviour */
          height: calc(var(--rows, 1) * 2em);
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          line-height: 2em;
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
          color: var(--cc-color-text-weak);
          opacity: 1;
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
          font-family: var(--cc-input-font-family, var(--cc-ff-monospace));
          word-break: break-all;
          word-spacing: 0.5ch;
        }

        .input-underlayer {
          z-index: 1;
          color: transparent;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          white-space: pre-wrap;
        }

        .input-underlayer .tag:not(:empty) {
          --color: var(--cc-color-bg-soft, #eee);

          padding: 1px 0;
          background-color: var(--color);
          border-radius: 3px;
          box-shadow: 0 0 0 2px var(--color);
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
        
        .input.error + .ring {
          border-color: var(--cc-color-border-danger) !important;
        }

        .input:focus + .ring {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
        
        input.error:focus + .ring {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .input:hover + .ring {
          border-color: #777;
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-hovered);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton .input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background-color: var(--cc-color-bg-neutral-disabled);
          cursor: progress;
        }

        .skeleton .input,
        .skeleton .input::placeholder {
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
          margin: 0.2em 0.2em 0.2em 0;
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

window.customElements.define('cc-input-text', CcInputText);
