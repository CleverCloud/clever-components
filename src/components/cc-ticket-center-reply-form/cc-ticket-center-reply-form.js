import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { i18n } from '../../lib/i18n.js';

import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-select/cc-select.js';

/**
 * A component handling the ticket-center interface for Crisp
 *
 * ## Details
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-addon-admin:delete-addon - Fires when the delete button is clicked.
 * @event {CustomEvent<string>} cc-addon-admin:update-name - Fires the new name of the add-on when update name button is clicked.
 * @event {CustomEvent<string[]>} cc-addon-admin:update-tags - Fires the new list of tags when update tags button is clicked.
 */
export class CcTicketCenterReplyForm extends LitElement {

  static get properties () {
    return {
      ticketState: { type: String },
      error: { type: String },
      saving: { type: Boolean },
      _skeleton: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    /** @type {ErrorType} Sets the error state on the component. */
    this.error = false;

    /** @type {boolean} Enables the saving state (form is disabled and blurred). */
    this.saving = false;

    /** @type {String} Set the state of the surrounding ticket. */
    this.ticketState = null;

    /** @type {boolean} */
    this._skeleton = false;
  }

  _onDismissError () {
    this.error = false;
  }

  _renderButtons () {
    if (this.ticketState === 'resolved') {
      return html`
        <cc-button primary>${i18n('cc-ticket-center.button.reopen-and-send')}</cc-button>
      `;
    }
    else {
      return html`
        <cc-button primary>${i18n('cc-ticket-center.button.send')}</cc-button>
        <cc-button>${i18n('cc-ticket-center.button.close-ticket')}</cc-button>
      `;
    }
  }

  render() {
    return html`
    <div class="wrapper">
      <form class="ticket-form">
        <div class="ta-wrapper">
          <textarea class="input" rows="10" name="message" id="message" required></textarea>
          <div class="ring"></div>
        </div>
        <div class="form-buttons">
          ${this._renderButtons()}
        </div>
      </form>
    </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`

        .context {
          margin-bottom: 20px;
        }

        /* This part was stolen from cc-input-text that I can't use as-is.
         * The other way is to update cc-input-text to make the line-height customizable
         */

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
          resize: vertical;
        }

        /* BASE */

        .ta-wrapper {
          display: grid;
          position: relative;
          width: 100%;
          /* see input to know why 0.15em */
          padding: 4px;
          box-sizing: content-box;
        }

        .input {
          z-index: 2;
          overflow: hidden;
          /* multiline behaviour */
          min-height: 8em;
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          line-height: 1em;
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
          border-color: var(--cc-color-border-neutral-hovered, #777);
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton .input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background-color: var(--cc-color-bg-neutral-disabled);
          cursor: progress;
        }

        .form-buttons {
          margin-top: .8em;
        }

        form {
          margin-bottom: 1em;
        }

        .new-ticket-form {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 1em;
          padding-top: 1em;
        }

        .messages {
          display: flex;
          flex-direction: column;
          justify-content: start;
          gap: 1em;
        }

        .message {
          width: calc(100% - 2em);
          box-sizing: border-box;
          border-radius: 2px;
          padding: .25em 1em;
        }

        .message.msg-in {
          align-self: start;
          border-inline-start: 2px ridge var(--cc-color-bg-success);
          background-color: var(--color-green-10);
          box-shadow: 1px 1px 2px 1px var(--color-green-20);
        }

        .message.msg-out {
          align-self: end;
          border-inline-end: 2px ridge var(--cc-color-border-primary-weak);
          background-color: var(--color-grey-10);
          box-shadow: -1px 1px 2px 1px var(--color-grey-20);
        }

        .message-header, .message-footer {
          font-size: .85em;
          font-style: italic;
          color: var(--cc-color-text-weak);
        }

        .message-footer img {
          font-size: .5em;
          width: 24px;
          height: 24px;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ticket-center-reply-form', CcTicketCenterReplyForm);
