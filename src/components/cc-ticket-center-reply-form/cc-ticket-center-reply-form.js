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
export class CcTicketCenterEdit extends LitElement {

  static get properties () {
    return {
      orga: { type: Object },
      user: { type: Object },
      ticket: { type: Object },
      messages: { type: Array },
      error: { type: String },
      saving: { type: Boolean },
      _name: { type: String, state: true },
      _skeleton: { type: Boolean, state: true },
      _tags: { type: Array, state: true },
    };
  }

  constructor () {
    super();

    /** @type {Organisation|null} Sets the orga details. */
    this.orga = null;

    this.user = null;

    this.ticket = null;

    this.messages = null;

    /** @type {ErrorType} Sets the error state on the component. */
    this.error = false;

    /** @type {boolean} Enables the saving state (form is disabled and blurred). */
    this.saving = false;

    /** @type {string} */
    this._name = '';

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {string[]} */
    this._tags = [];
  }

  _onDismissError () {
    this.error = false;
  }

  willUpdate (changedProperties) {

    if (changedProperties.has('addon')) {
      this._skeleton = (this.addon == null);
      this._name = this._skeleton ? '' : this.addon.name;
      this._tags = this._skeleton ? [] : this.addon.tags;
    }
  }

  _getState (ticketState) {
    switch (ticketState) {
      case 'pending':
        return i18n('cc-ticket-center.state.unread');
      case 'unresolved':
        return i18n('cc-ticket-center.state.open');
      case 'resolved':
        return i18n('cc-ticket-center.state.closed');
      default:
        return i18n('cc-ticket-center.state.closed');
    }
  }

  _getStateIntent (ticketState) {
    switch (ticketState) {
      case 'pending':
        return 'danger';
      case 'unresolved':
        return 'info';
      case 'resolved':
        return 'neutral';
      default:
        return 'danger';
    }
  }

  _renderButtons () {
    if (!this.ticket) {
      return html`
        <cc-button primary class="open-ticket">${i18n('cc-ticket-center.button.open-ticket')}</cc-button>
      `;
    }
    else if (this.ticket.state === 'resolved') {
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

  _renderUploadForm () {
    return html`
    `;
  }

  _renderMessageAuthor (msg) {
    // FIXME: ensure "user" is the current user email or fix below to get the email
    // Also: we need to add the avatar and stuff in here.
    if (msg.author?.email === this.user?.email) {
      return html`
        <img class="author-avatar" src="${msg.author?.avatarUrl}" alt="${i18n('cc-ticket-center.author-avatar', { authorName: msg.author.name })}" />
        <span class="author-name">
          ${i18n('cc-ticket-center.author.you')}
        </span>
      `;
    }
    else {
      return html`
        <img class="author-avatar" src="${msg.author?.avatarUrl}" alt="${i18n('cc-ticket-center.author-avatar', { authorName: msg.author.name })}" />
        <span class="author-name">
          ${msg.author.name ?? msg.author.email}
        </span>
      `;
    }
  }

  _renderTicket () {
    return html`
    <div class="wrapper">
      ${this._renderBackButton()}
      <h1 class="subject">
        ${this.ticket.meta.subject}
      </h1>
      <div class="context">
        <cc-badge intent="${this._getStateIntent(this.ticket.state)}" weight="dimmed">${this._getState(this.ticket.state)}</cc-badge>
        <span class="ticket-id">${i18n('cc-ticket-center.ticket-id', { ticketId: this.ticket.meta.id })}</span>
        <span class="ticket-creation">
          ${i18n('cc-ticket-center.ticket.opened-at', { date: this.ticket.createdAt })}
        </span>
      </div>
      <div>
        <form class="ticket-form">
          <div class="ta-wrapper">
            <textarea class="input" rows="10" name="message" id="message" required></textarea>
            <div class="ring"></div>
          </div>
          <div class="form-buttons">
            ${this._renderButtons()}
          </div>
        </form>
        ${this._renderUploadForm()}
        <div class="messages">
          ${this.messages.sort((a, b) => a.sentAt < b.sentAt).map((msg) => html`
          <div class="message ${classMap({ 'msg-in': msg.direction === 'in', 'msg-out': msg.direction === 'out' })}">
            <div class="message-header">
              <span class="message-date">${i18n('cc-ticket-center.message.sent-at', { date: msg.sentAt })}</span>
            </div>
            <div class="message-content"><p>${msg.message}</p></div>
            <div class="message-footer">
              <div class="message-author cap-font-sans-semibold">
                ${this._renderMessageAuthor(msg)}
              </div>
            </div>
          </div>
          `)}
        </div>
      </div>
    </div>
    `;
  }

  _renderBackButton () {
    return html`
      <cc-button>
        <svg height="10" width="14" viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg">
          <path d="m13.092139 17.4557862 6.2308071-6.2304865c.3003996-.3003996.7877074-.3003996 1.088107 0l.7267939.7267939c.300079.300079.3003996.7861044.0012824 1.0868246l-4.9381591 4.9609215 4.9378385 4.9612421c.2994378.3007202.2987966.7867456-.0012824 1.0868246l-.7267939.7267939c-.3003996.3003996-.7877074.3003996-1.088107 0l-6.2304865-6.2308071c-.3003996-.3003996-.3003996-.7877074 0-1.088107z" transform="translate(-12 -11)"/>
        </svg>
      </cc-button>
    `;
  }

  _categoryOptions () {
    return [
      'emergency',
      'question',
      'invoicing',
      'feedback',
      'troubleshooting',
      'upgrade',
    ].map((value) => ({ value, label: i18n(`cc-ticket-center.category.${value}`) }));
  }

  _renderNewTicketForm () {
    return html`
    <div class="wrapper">
      ${this._renderBackButton()}
      <div>
        <form class="new-ticket-form">
          <cc-select class="input-category" label=${i18n('cc-ticket-center.input.category')}></cc-select>
          <cc-input-text class="input-ids" label=${i18n('cc-ticket-center.input.ids')}></cc-input-text>
          <!-- TODO: how do I implement the ring and stuff? -->
          <div class="ta-wrapper">
            <textarea class="input" rows="10" name="message" id="message" required></textarea>
            <div class="ring"></div>
          </div>
          <div class="form-buttons">
            ${this._renderButtons()}
          </div>
        </form>
        ${this._renderUploadForm()}
      </div>
</div>
    `;
  }

  render () {
    if (this.ticket) {
      return this._renderTicket();
    } else {
      return this._renderNewTicketForm();
    }
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

window.customElements.define('cc-ticket-center-edit', CcTicketCenterEdit);
