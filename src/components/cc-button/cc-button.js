import '../cc-icon/cc-icon.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

/**
 * @typedef {import('../common.types.js').IconModel} IconModel
 */

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
 * * In some cases (to be defined/explained later), you need a button with a click handler that looks like a link.
 * * Don't use a `<a>` without an href and use our `<cc-button link>` instead.
 * * When `link` is enabled, the following properties won't have any effect: `primary`, `success`, `warning`, `danger`, `outlined`, `delay`.
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
 * @cssdisplay inline-block
 *
 * @event {CustomEvent} cc-button:click - Fires whenever the button is clicked.<br>If `delay` is set, fires after the specified `delay` (in seconds).
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 * @cssprop {BorderRadius} --cc-button-border-radius - Sets the value of the border radius CSS property (defaults: `0.15em`).
 * @cssprop {FontWeight} --cc-button-font-weight - Sets the value of the font weight CSS property (defaults: `bold`).
 * @cssprop {TextTransform} --cc-button-text-transform - Sets the value of the text transform CSS property (defaults: `uppercase`).
 */
export class CcButton extends LitElement {

  static get properties () {
    return {
      accessibleName: { type: String, attribute: 'accessible-name' },
      a11yExpanded: { type: Boolean, attribute: 'a11y-expanded', reflect: true },
      a11yName: { type: String, attribute: 'a11y-name' },
      a11yPressed: { type: Boolean, attribute: 'a11y-pressed', reflect: true },
      circle: { type: Boolean },
      danger: { type: Boolean },
      delay: { type: Number },
      disabled: { type: Boolean, reflect: true },
      hideText: { type: Boolean, attribute: 'hide-text' },
      icon: { type: Object },
      image: { type: String },
      link: { type: Boolean, reflect: true },
      outlined: { type: Boolean },
      primary: { type: Boolean },
      skeleton: { type: Boolean },
      success: { type: Boolean },
      waiting: { type: Boolean, reflect: true },
      warning: { type: Boolean },
      _cancelMode: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {null|boolean} Sets aria-expanded on the inner `button` element. */
    this.a11yExpanded = null;

    /** @type {string|null} Forces the values of the `aria-label` and `title` attributes on the `button` element. CAUTION: The a11y name should always start with the visible text if there is one. For instance "add to estimation - NodeJS XS" */
    this.a11yName = null;

    /** @type {null|boolean} Sets aria-pressed on the inner `button` element. */
    this.a11yPressed = null;

    /** @type {boolean} Sets button UI to a circle form when in `hide-text` and `image` mode. */
    this.circle = false;

    /** @type {boolean} Sets button UI _mode_ to danger. */
    this.danger = false;

    /** @type {number|null} If set, enables delay mechanism and defined the number of seconds before the `cc-button:click` event is actually fired. */
    this.delay = null;

    /** @type {boolean} Sets `disabled` attribute on inner native `<button>` element. */
    this.disabled = false;

    /** @type {boolean} If set, the button will look like a link. */
    this.link = false;

    /** @type {boolean} Hides the text and only displays the image specified with `image`. The slotted text will be added as `title` and `aria-label` on the inner `<button>`. */
    this.hideText = false;

    /** @type {IconModel|null} If set, enables icon mode and displays the required icon in the <cc-icon> component. */
    this.icon = null;

    /** @type {string|null} If set, enables icon mode and sets the `src` of the inner native `<img>` element. */
    this.image = null;

    /** @type {boolean} Sets button UI as _outlined_ (no background and colored border). */
    this.outlined = false;

    /** @type {boolean} Sets button UI _mode_ to primary. */
    this.primary = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {boolean} Sets button UI _mode_ to success. */
    this.success = false;

    /** @type {boolean} If set, shows a waiting/busy indicator and sets `disabled` attribute on inner native `<button>` element. */
    this.waiting = false;

    /** @type {boolean} Sets button UI _mode_ to warning. */
    this.warning = false;

    /** @type {boolean} */
    this._cancelMode = false;
  }

  get accessibleName () {
    return this.a11yName;
  }

  /**
   * Deprecated property. Use `a11yName` property or `a11y-name` attribute instead.
   * @deprecated
   */
  set accessibleName (value) {
    this.a11yName = value;
  }

  focus () {
    this.shadowRoot.querySelector('button').focus();
  }

  _cancelClick () {
    clearTimeout(this._timeoutId);
    this._cancelMode = false;
  }

  /**
   * The `aria-label` attribute should only be set if the `a11yName` prop is set or if the button only shows an image with no text.
   *
   * @returns {string|undefined} the value of the `aria-label` attribute or `undefined` if the attribute should not be set.
   */
  _getAriaLabel () {
    if (this.a11yName != null) {
      return this.a11yName.trim() ?? '';
    }

    if (this.hideText && (this.image != null || this.icon != null)) {
      return this.textContent?.trim() ?? '';
    }

    return undefined;
  }

  /**
   * The `title` attribute should only be set if the `a11yName` prop is set or if the button only shows an image with no text.
   *
   * @returns {string|undefined} the value of the `title` attribute or `undefined` if the attribute should not be set.
   */
  _getTitle () {
    if (this.a11yName != null) {
      return this.a11yName.trim() ?? '';
    }

    if (this.hideText && (this.image != null || this.icon != null)) {
      return this.textContent.trim() ?? '';
    }

    return undefined;
  }

  // We tried to reuse native clicks from the inner <button>
  // but it's not that simple since adding @click on <cc-button> with lit-html also catches clicks on the custom element itself
  // That's why we emit custom "cc-button:click"
  // It's also easier to handle for the delay mechanism
  _onClick (e) {

    e.stopPropagation();

    // we need to check that because we use aria-disabled which doesn't prevent the onclick event to be fired.
    if (this.disabled) {
      return;
    }

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

  willUpdate (changedProperties) {
    if (changedProperties.has('disabled')) {
      if (this.disabled === true) {
        this._cancelClick();
      }
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
      'img-only': (this.image != null || this.icon != null) && this.hideText,
      'txt-only': this.image == null && this.icon == null,
      btn: !this.link,
      'cc-link': this.link,
    };

    const delay = (this.delay != null && !this.link) ? this.delay : null;

    const waiting = (this.waiting);

    // simple mode is default when no value or when there are multiple conflicting values
    modes.simple = !modes.primary && !modes.success && !modes.warning && !modes.danger && !this.link;

    // outlined is not default except in simple mode
    modes.outlined = (this.outlined || modes.simple) && !this.link;

    // circle mode should only appear in hide-text mode if we have an image
    modes.circle = this.circle && this.hideText && (this.image || this.icon);

    const tabIndex = this.skeleton ? -1 : null;

    return html`
      <button
        type="button"
        tabindex="${ifDefined(tabIndex)}"
        class=${classMap(modes)}
        aria-disabled="${this.disabled || this.skeleton || this.waiting}"
        @click=${this._onClick}
        title="${ifDefined(this._getTitle())}"
        aria-label="${ifDefined(this._getAriaLabel())}"
        aria-expanded="${ifDefined(this.a11yExpanded ?? undefined)}"
        aria-pressed="${ifDefined(this.a11yPressed ?? undefined)}"
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
          ${this.icon != null ? html`
            <cc-icon .icon="${this.icon}"></cc-icon>
          ` : ''}
          <div class="text-normal">
            <slot></slot>
          </div>
          ${delay != null ? html`
            <div class="text-cancel">${i18n('cc-button.cancel')}</div>
          ` : ''}
        </div>
        ${delay != null ? html`
          <progress class="delay ${classMap({ active: this._cancelMode })}" style="--delay: ${delay}s"></progress>
        ` : ''}
        ${waiting && !modes.circle ? html`
          <progress class="waiting"></progress>
        ` : ''}
        ${waiting && modes.circle ? html`
          <svg class="circle-loader" viewBox="25 25 50 50" stroke-width="4" aria-hidden="true">
            <circle fill="none" cx="50" cy="50" r="15" />
          </svg>
        ` : ''}
      </button>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          display: inline-block;
          box-sizing: border-box;
          vertical-align: middle;
        }

        /* RESET */

        button {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: unset;
          font-family: inherit;
          font-size: unset;
        }

        /* BASE */

        .btn {
          /* used to absolutely position the <progress> */
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 2em;
          padding: 0 0.5em;
          border: 1px solid #000;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-button-border-radius, 0.15em);
          cursor: pointer;
          font-weight: var(--cc-button-font-weight, bold);
          text-transform: var(--cc-button-text-transform, uppercase);
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* COLORS */

        .simple {
          --btn-color: var(--cc-color-text-primary-strongest);
        }

        .primary {
          --btn-color: var(--cc-color-bg-primary);
        }

        .success {
          --btn-color: var(--cc-color-bg-success);
        }

        .warning {
          --btn-color: var(--cc-color-bg-warning);
        }

        .danger {
          --btn-color: var(--cc-color-bg-danger);
        }

        /* MODES */

        .btn {
          border-color: var(--btn-color);
          background-color: var(--btn-color);
          color: var(--cc-color-text-inverted);
        }

        .outlined {
          background-color: var(--cc-color-bg-default, #fff);
          color: var(--btn-color);
        }

        .circle {
          border-radius: 50%;
        }

        /* special case: we want to keep simple buttons subtle */

        .simple {
          border-color: var(--color-grey-medium);
        }

        .img-only {
          width: 1.75em;
          height: 1.75em;
          min-height: 0;
          padding: 0;
        }

        /* STATES */

        .btn:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .btn:not([aria-disabled='true']):hover {
          box-shadow: 0 1px 3px rgb(0 0 0 / 40%);
        }

        .btn:not([aria-disabled='true']):active {
          box-shadow: none;
          outline: 0;
        }
        
        button[aria-disabled='true'] {
          cursor: inherit;
          opacity: 0.5;
        }

        .skeleton {
          border-color: #777;
          background-color: #bbb;
          color: transparent;
        }

        .skeleton cc-icon,
        .skeleton img {
          visibility: hidden;
        }

        /* TRANSITIONS */

        .btn {
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
          transition: box-shadow 75ms ease-in-out;
        }

        /* Grid to place image + text and superpose "cancel mode text" */

        .text-wrapper {
          display: grid;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          grid-template-columns: min-content 1fr;
        }

        .txt-only .text-wrapper {
          gap: 0;
          grid-template-columns: auto;
        }

        .img-only .text-wrapper {
          gap: 0;
          grid-template-columns: min-content;
        }

        img {
          display: block;
          width: 1.25em;
          height: 1.25em;
        }

        .img-only .text-normal {
          display: none;
        }

        cc-icon,
        img,
        .text-normal,
        .text-cancel {
          grid-row: 1 / 2;
        }

        .text-normal,
        .text-cancel {
          /* Setting font-size here is easier than on .btn because of how "em" works */
          font-size: 0.85em;
        }

        cc-icon,
        img {
          grid-column: 1 / 2;
        }

        .text-normal {
          grid-column: -1 / -2;
        }

        .text-cancel {
          grid-column: 1 / -1;
        }

        .text-wrapper.cancel-mode cc-icon,
        .text-wrapper.cancel-mode img,
        .text-wrapper.cancel-mode .text-normal,
        .text-wrapper:not(.cancel-mode) .text-cancel {
          visibility: hidden;
        }

        /* progress bar for delay, see https://css-tricks.com/html5-progress-element */

        progress,
        progress::-webkit-progress-bar {
          background-color: #fff;
        }

        .outlined progress,
        .outlined progress::-webkit-progress-bar {
          background-color: var(--btn-color);
        }

        .cc-link progress,
        .cc-link progress::-webkit-progress-bar {
          background-color: var(--cc-color-bg-strong);
        }

        progress::-webkit-progress-value,
        progress::-moz-progress-bar {
          background-color: transparent;
        }

        progress.delay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0.2em;
          border: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        progress.delay.active {
          width: 100%;
          transition: width var(--delay) linear;
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

          position: absolute;
          bottom: 0;
          width: var(--width);
          height: 0.2em;
          border: none;
          margin-left: calc(50% - calc(var(--width) / 2));
          animation: 1s ease-in-out 0s infinite alternate waiting;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        /* circle waiting mode - keyframes */
        @keyframes rotate {

          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes stretch {

          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }

          50% {
            stroke-dasharray: 90, 200;
            stroke-dashoffset: -35px;
          }

          100% {
            stroke-dashoffset: -124px;
          }
        }

        /* circle waiting mode - partial opacity */

        :host([waiting]) button.circle {
          opacity: 1;
        }

        :host([waiting]) button.circle .text-wrapper cc-icon,
        :host([waiting]) button.circle .text-wrapper img {
          opacity: 0.25;
        }

        /* circle waiting mode - core animation */

        .circle-loader {
          --bcw-speed: 2s;

          position: absolute;
          animation: rotate var(--bcw-speed) linear infinite;
          inset: 0;
          transform-origin: center;
          vertical-align: middle;
        }

        .circle-loader circle {
          animation: stretch calc(var(--bcw-speed) * 0.75) ease-in-out infinite;
          stroke: currentcolor;
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
          stroke-linecap: round;
        }

        /* We can do this because we set a visible focus state */

        button::-moz-focus-inner {
          border: 0;
        }

        /* button that looks like a cc-link */

        .cc-link {
          --btn-color: var(--color-text-strong);

          position: relative;
          overflow: hidden;
          min-height: 2em;
          cursor: pointer;
          text-decoration: underline;
        }

        .cc-link .text-normal {
          font-size: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-button', CcButton);
