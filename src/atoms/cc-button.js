import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { skeleton } from '../styles/skeleton.js';
import { linkStyles } from '../templates/cc-link.js';

/**
 * Wraps a `<button>` with a skeleton state, some modes and a delay mechanism.
 *
 * ## Details
 *
 * * Attributes `primary`, `success`, `warning` and `danger` define the UI _mode_ of the button.
 * * They are exclusive, you can only set one UI _mode_ at a time.
 * * When you don't use any of these values, the default UI _mode_ is `simple`.
 *
 * ## Link appearance
 *
 * In some cases (to be defined/explained later), you need a button with a click handler that looks like a link.
 * Don't use a `<a>` without an href and use our `<cc-button link>` instead.
 * When `link` is enabled, the following properties won't have any effect: `primary`, `success`, `warning`, `danger`, `outlined`, `delay`.
 *
 * ## Delay mechanism
 *
 * * When `delay` is set, `cc-button:click` events are not fired immediately.
 * * They are fired after the number of seconds set with `delay`.
 * * During this `delay`, the user is presented a "click to cancel" label.
 * * If the user clicks on "click to cancel", the `cc-button:click` event is not fired.
 * * If the button `disabled` mode is set during the delay, the `cc-button:click` event is not fired.
 * * If you set `delay=0`, the button will have the same width as other buttons with delay, but the event will be triggered instantly.
 *
 * @prop {Boolean} danger - Sets button UI _mode_ to danger.
 * @prop {Number} delay - If set, enables delay mechanism and defined the number of seconds before the `cc-button:click` event is actually fired.
 * @prop {Boolean} disabled - Sets `disabled` attribute on inner native `<button>` element.
 * @prop {String} image - If set, enables icon mode and sets the `src` of the inner native `<img>` element.
 * @prop {Boolean} link - If set, the button will look like a link.
 * @prop {Boolean} outlined - Sets button UI as _outlined_ (no background and colored border).
 * @prop {Boolean} primary - Sets button UI _mode_ to primary.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {Boolean} success - Sets button UI _mode_ to success.
 * @prop {Boolean} waiting - If set, shows a waiting/busy indicator and sets `disabled` attribute on inner native `<button>` element.
 * @prop {Boolean} warning - Sets button UI _mode_ to warning.
 *
 * @event {CustomEvent} cc-button:click - Fires whenever the button is clicked.<br>If `delay` is set, fires after the specified `delay` (in seconds).
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 */
export class CcButton extends LitElement {

  static get properties () {
    return {
      danger: { type: Boolean },
      delay: { type: Number },
      disabled: { type: Boolean, reflect: true },
      image: { type: String },
      link: { type: Boolean, reflect: true },
      outlined: { type: Boolean },
      primary: { type: Boolean },
      skeleton: { type: Boolean },
      success: { type: Boolean },
      waiting: { type: Boolean },
      warning: { type: Boolean },
      _cancelMode: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.danger = false;
    this.disabled = false;
    this.link = false;
    this.waiting = false;
    this.outlined = false;
    this.primary = false;
    this.skeleton = false;
    this.success = false;
    this.warning = false;
    this._cancelMode = false;
  }

  set disabled (newVal) {
    const oldVal = this._disabled;
    this._disabled = newVal;
    this.requestUpdate('disabled', oldVal);
    if (newVal === true) {
      this._cancelClick();
    }
  }

  get disabled () {
    return this._disabled;
  }

  focus () {
    this.shadowRoot.querySelector('button').focus();
  }

  _cancelClick () {
    clearTimeout(this._timeoutId);
    this._cancelMode = false;
  }

  // We tried to reuse native clicks from the inner <button>
  // but it's not that simple since adding @click on <cc-button> with lit-html also catches clicks on the custom element itself
  // That's why we emit custom "cc-button:click"
  // It's also easier to handle for the delay mechanism
  _onClick (e) {

    e.stopPropagation();

    // delay=0 is needed in some situations where you want the button to have the same width
    // as buttons with delay > 0 but without any delay
    if (this.delay == null || this.delay === 0 || this.link) {
      return dispatchCustomEvent(this, 'click');
    }

    if (this._cancelMode) {
      this._cancelClick();
    }
    else {
      this._cancelMode = true;
      this._timeoutId = setTimeout(() => {
        dispatchCustomEvent(this, 'click');
        this._cancelMode = false;
      }, this.delay * 1000);
    }
  }

  render () {

    // those are exclusive, only one can be set at a time
    // we chose this over one attribute named "mode" so it would be easier to write/use
    const modes = {
      primary: this.primary && !this.success && !this.warning && !this.danger && !this.link,
      success: !this.primary && this.success && !this.warning && !this.danger && !this.link,
      warning: !this.primary && !this.success && this.warning && !this.danger && !this.link,
      danger: !this.primary && !this.success && !this.warning && this.danger && !this.link,
      skeleton: this.skeleton,
      image: this.image != null,
      btn: !this.link,
      'cc-link': this.link,
    };

    const delay = (this.delay != null && !this.link) ? this.delay : null;

    const waiting = (this.waiting && !this.link);

    // simple mode is default when no value or when there are multiple conflicting values
    modes.simple = !modes.primary && !modes.success && !modes.warning && !modes.danger && !this.link;

    // outlined is not default except in simple mode
    modes.outlined = (this.outlined || modes.simple) && !this.link;

    return html`<button
      type="button"
      class=${classMap(modes)}
      .disabled=${this.disabled || this.skeleton || this.waiting}
      @click=${this._onClick}
    >
      <!--
        When delay mechanism is set, we need a cancel label.
        We don't want the button width to change when the user clicks and toggles between normal and cancel mode.
        That's why (see CSS) we put both labels in a grid, in the same cell and hide (visibility:hidden) the one we don't want.
        This way, when delay is set, the button has a min width of the largest label (normal or cancel).
      -->
      <div class="text-wrapper ${classMap({ 'cancel-mode': this._cancelMode })}">
        ${this.image != null ? html`
          <img src=${this.image} alt="">
        ` : ''}
        <div class="text-normal"><slot></slot></div>
        ${delay != null ? html`
          <div class="text-cancel">${i18n('cc-button.cancel')}</div>
        ` : ''}
      </div>
      ${delay != null ? html`
        <progress class="delay ${classMap({ active: this._cancelMode })}" style="--delay: ${delay}s"></progress>
      ` : ''}
      ${waiting ? html`
        <progress class="waiting"></progress>
      ` : ''}
    </button>`;
  }

  static get styles () {
    return [
      skeleton,
      linkStyles,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          vertical-align: middle;
        }

        /* RESET */
        button {
          background: #fff;
          border: none;
          display: block;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
        }

        /* BASE */
        .btn {
          border-radius: 0.15rem;
          border: 1px solid #000;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          min-height: 2rem;
          overflow: hidden;
          padding: 0 0.5rem;
          /* used to absolutely position the <progress> */
          position: relative;
          text-transform: uppercase;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          width: 100%;
        }

        /* COLORS */
        .simple {
          --btn-color: hsl(210, 23%, 26%);
        }

        .primary {
          --btn-color: hsl(213, 55%, 62%);
        }

        .success {
          --btn-color: hsl(144, 56%, 43%);
        }

        .warning {
          --btn-color: hsl(35, 84%, 37%);
        }

        .danger {
          --btn-color: hsl(351, 70%, 47%);
        }

        /* MODES */
        .btn {
          background-color: var(--btn-color);
          border-color: var(--btn-color);
          color: #fff;
        }

        .outlined {
          background-color: #fff;
          color: var(--btn-color);
        }

        /* special case: we want to keep simple buttons subtle */
        .simple {
          border-color: #aaa;
        }

        /* STATES */
        .btn:enabled:focus {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        .btn:enabled:hover {
          box-shadow: 0 1px 3px #888;
        }

        .btn:enabled:active {
          box-shadow: none;
          outline: 0;
        }

        button:disabled {
          cursor: inherit;
          opacity: .5;
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }

        /* TRANSITIONS */
        .btn {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          transition: box-shadow 75ms ease-in-out;
        }

        /* DELAY CANCEL MODE SUPERPOSITION WITH GRID */
        .text-wrapper {
          display: grid;
        }

        .text-normal,
        .text-cancel {
          grid-area: 1 / 1 / 2 / 2;
        }

        .text-wrapper.cancel-mode .text-normal,
        .text-wrapper:not(.cancel-mode) .text-cancel {
          visibility: hidden;
        }

        /* progress bar for delay, see https://css-tricks.com/html5-progress-element */
        progress,
        progress:-webkit-progress-bar {
          background-color: #fff;
        }

        .outlined progress,
        .outlined progress::-webkit-progress-bar {
          background-color: var(--btn-color);
        }

        progress::-webkit-progress-value,
        progress::-moz-progress-bar {
          background-color: transparent;
        }

        progress.delay {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border: none;
          bottom: 0;
          height: 0.2rem;
          left: 0;
          position: absolute;
          width: 0;
        }

        progress.delay.active {
          transition: width var(--delay) linear;
          width: 100%;
        }

        @keyframes waiting {
          from {
            left: -52%;
          }
          to {
            left: 52%;
          }
        }

        progress.waiting {
          --width: 25%;
          animation: 1s ease-in-out 0s infinite alternate waiting;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          border: none;
          bottom: 0;
          height: 0.2rem;
          margin-left: calc(50% - calc(var(--width) / 2));
          position: absolute;
          width: var(--width);
        }

        /* We can do this because we set a visible focus state */
        button::-moz-focus-inner {
          border: 0;
        }

        .image {
          min-height: 0;
          padding: 0.2rem;
          height: 1.6rem;
          width: 1.6rem;
        }

        .image img {
          display: block;
          height: 100%;
          width: 100%;
        }

        /* button that looks like a cc-link */
        .cc-link {
          cursor: pointer;
          text-decoration: underline;
        }
      `,
    ];
  }
}

window.customElements.define('cc-button', CcButton);
