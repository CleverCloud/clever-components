import { classMap } from 'lit-html/directives/class-map.js';
import { LitElement, css, html } from 'lit-element';
import { pulse } from '../styles/animations.js';

/**
 * A button
 *
 * ## Details
 *
 * * attributes `primary`, `success` and `danger` define the mode of the button and are exclusive.
 * * You can only set one mode at a time.
 * * When you don't use any of these values, the mode defaults to `simple`.
 *
 * @fires click - Native click event from inner button element
 *
 * @slot - The content of the button (text or HTML)
 *
 * @attr {Boolean} primary - set button UI mode to primary
 * @attr {Boolean} success - set button UI mode to success
 * @attr {Boolean} danger - set button UI mode to danger
 * @attr {Boolean} disabled - same as native button element `disabled` attribute
 * @attr {Boolean} outlined - set button UI as outlined (white background instead of filled color)
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
    >
      <slot></slot>
    </button>`;
  }

  static get styles () {
    return [
      pulse,
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
        button.simple {
          --btn-color: hsl(210, 23%, 26%);
        }

        button.primary {
          --btn-color: hsl(213, 55%, 62%);
        }

        button.success {
          --btn-color: hsl(144, 56%, 43%);
        }

        button.danger {
          --btn-color: hsl(351, 70%, 47%);
        }

        /* MODES */
        button {
          background-color: var(--btn-color);
          border-color: var(--btn-color);
          color: #fff;
        }

        button.outlined {
          background-color: #fff;
          color: var(--btn-color);
        }

        /* special case: we want to keep simple buttons subtle */
        button.simple {
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

        button.skeleton {
          animation-direction: alternate;
          animation-duration: 500ms;
          animation-iteration-count: infinite;
          animation-name: pulse;
          background-color: #aaa;
          border-color: #777;
          color: transparent;
          cursor: progress;
        }

        @keyframes pulse {
          from {
            opacity: 0.75;
          }

          to {
            opacity: 0.5;
          }
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
