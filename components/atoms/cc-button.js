import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * Wraps a `<button>` with a skeleton state and some modes
 *
 * ## Details
 *
 * * Attributes `primary`, `success` and `danger` define the _mode_ of the button.
 * * They are exclusive, you can only set one _mode_ at a time.
 * * When you don't use any of these values, the defaults _mode_ is `simple`.
 *
 * @fires cc-button:click - Fired when button is clicked
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {Boolean} primary - set button UI _mode_ to primary
 * @attr {Boolean} success - set button UI _mode_ to success
 * @attr {Boolean} danger - set button UI _mode_ to danger
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} outlined - set button UI as outlined (no background and colored border)
 * @attr {Boolean} skeleton - enable skeleton screen UI pattern (loading hint)
 */
export class CcButton extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      primary: { type: Boolean },
      success: { type: Boolean },
      danger: { type: Boolean },
      outlined: { type: Boolean },
      skeleton: { type: Boolean },
    };
  }

  // We tried to reuse native clicks from the inner <button>
  // but it's not that simple since adding @click on <cc-button> with lit-html also catches clicks on the custom element itself
  // That's why we emit custom "cc-button:click"
  _onClick () {
    dispatchCustomEvent(this, 'click');
  }

  render () {

    // those are exclusive, only one can be set at a time
    // we chose this over one attribute named "mode" so it would be easier to write/use
    const modes = {
      danger: this.danger && !this.success && !this.primary,
      success: !this.danger && this.success && !this.primary,
      primary: !this.danger && !this.success && this.primary,
      skeleton: this.skeleton,
    };

    // simple mode is default when no value or when there are multiple conflicting values
    modes.simple = !modes.danger && !modes.success && !modes.primary;

    // outlined is not default except in simple mode
    modes.outlined = this.outlined || modes.simple;

    return html`<button
      type="button"
      class=${classMap(modes)}
      .disabled=${this.disabled || this.skeleton}
      @click=${this._onClick}
    >
      <slot></slot>
    </button>`;
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          margin: 0.2rem;
          vertical-align: top;
        }

        /* RESET */
        button {
          background: #fff;
          border: 1px solid #000;
          display: block;
          font-size: 14px;
          font-family: inherit;
          margin: 0;
          padding: 0;
        }

        /* BASE */
        button {
          border-radius: 0.15rem;
          cursor: pointer;
          font-weight: bold;
          min-height: 2rem;
          padding: 0 0.5rem;
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

        .danger {
          --btn-color: hsl(351, 70%, 47%);
        }

        /* MODES */
        button {
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
        button:enabled:focus {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        button:enabled:hover {
          box-shadow: 0 1px 3px #888;
        }

        button:enabled:active {
          box-shadow: none;
          outline: 0;
        }

        button:disabled {
          cursor: default;
          opacity: .5;
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }

        /* TRANSITIONS */
        button {
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          transition: all 75ms ease-in-out;
        }

        /* We can do this because we set a visible focus state */
        button::-moz-focus-inner {
          border: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-button', CcButton);
