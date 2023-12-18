
import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { withResizeObserver } from '../../mixins/with-resize-observer/with-resize-observer.js';

import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';

/**
 * A component handling the ticket-center interface for Crisp
 *
 * ## Details
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-ticket-center-list:enter-ticket - Fires when the delete button is clicked.
 */
export class CcTicketCenterList extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      tickets: { type: Array },
      error: { type: String },
      filter: { type: String },
      _skeleton: { type: Boolean, state: true },
      _width: { type: Number, state: true },
    };
  }

  constructor () {
    super();

    this.tickets = null;

    /** @type {ErrorType} Sets the error state on the component. */
    this.error = false;

    this.filter = 'all';

    /** @type {boolean} */
    this._skeleton = false;

    /** @type {string[]} */
    this._width = null;

  }

  onResize ({ width }) {
    this._width = width;
  }

  _onFilterChange (e) {
    this.filter = e.target.value;
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

  _filterTickets () {
    switch (this.filter) {
      case 'open':
        return this.tickets.filter((t) => t.state !== 'resolved');
      case 'closed':
        return this.tickets.filter((t) => t.state === 'resolved');
      default:
        return this.tickets;
    }
  }

  _openTicket (e) {
    dispatchCustomEvent(this, 'open', e.target.dataset.sessionId);
  }

  render () {
    // NOTE: This value is arbitrary, we don't have a better solution for now
    // It's a bit more than the width of the table in french (which is the largest) and with both links (download and pay)
    // The table width is mostly stable since the with of the amount is fixed and the rest is almost always the same number of characters
    const bigMode = (this._width > 500);

    const filteredTickets = this._filterTickets();

    return html`
      <div class="main">
        <cc-toggle
          choices='[{"label":"All","value":"all"},{"label":"Open","value":"open"},{"label":"Closed","value":"closed"}]'
          value=${this.filter}
          @cc-toggle:input=${this._onFilterChange}
        ></cc-toggle>

        <div class="tickets">
          ${bigMode ? html`
          <div class="legend">
            <span class="ticket-part ticket-subject">${i18n('cc-ticket-center.list.titles.subject')}</span>
            <span class="ticket-part ticket-status">${i18n('cc-ticket-center.list.titles.status')}</span>
            <span class="ticket-part ticket-actions"></span>
          </div>
          ` : html``}
          
         ${filteredTickets.map((t) => html`
          <div class="ticket">
            <div class="ticket-part ticket-subject">
              <p class="ticket-title">
                ${t.meta.subject}
              </p>
              <p class="ticket-id">${i18n('cc-ticket-center.ticket-id', { ticketId: t.meta.id })}</p>
            </div>

            <div class="ticket-part ticket-status">
              <cc-badge intent="${this._getStateIntent(t.state)}" weight="dimmed">${this._getState(t.state)}</span>
            </div>

            <div class="ticket-part ticket-actions">
              <cc-button
                data-session-id="${t.session_id}"
                @cc-button:click=${this._openTicket}
              >
                <svg class="ticket-action-open" height="18" width="18" viewBox="-2 -4 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="m18.1021091 10.7833947.5945765-.5945765c.2517577-.2517576.6588551-.2517576.9079344 0l5.2065618 5.2038835c.2517576.2517576.2517576.658855 0 .9079344l-5.2065618 5.2065618c-.2517576.2517576-.658855.2517576-.9079344 0l-.5945765-.5945765c-.2544358-.2544359-.2490793-.6695682.0107131-.9186475l3.2273184-3.0746569h-7.6973552c-.3562102 0-.6427854-.2865751-.6427854-.6427854v-.8570472c0-.3562102.2865752-.6427854.6427854-.6427854h7.6973552l-3.2273184-3.0746568c-.2624707-.2490794-.2678272-.6642116-.0107131-.9186475z" transform="translate(-13 -10)"/>
                </svg>
              </cc-button>
            </div>
          </div>
          `)}
        </div>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          color: var(--cc-color-text-default);
        }
        .main {
          display: flex;
          flex-direction: column;
        }

        .tickets {
          display: flex;
          flex-direction: column;
          justify-content: start;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 1px;
          margin-top: .5em;
        }

        .ticket:nth-child(odd) {
          background-color: var(--cc-color-bg-neutral);
        }

        .ticket, .legend {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: start;
          gap: .5em;
          padding: .8em 1em .8em 1.5em;
        }

        .ticket-action-open {
          display: block;
        }

        .legend {
          font-weight: bold;
          border-bottom: 1px solid rgba(0,0,0,0.08);

        }
        .ticket {
          border-radius: 2px;
          flex-wrap: wrap;
          box-sizing: border-box;
        }

        .ticket:not(:nth-child(2)) {
          border-top: 1px solid var(--cc-color-border-neutral-weak, #8c8c8c);
        }

        .ticket:hover {
          background-color: var(--cc-color-bg-neutral-disabled, #fefefe);
        }

        .ticket-title {
          margin: 0;
          margin-bottom: .3em;
          font-weight: 150;
        }

        .ticket-id {
          font-style: italic;
          font-size: .8em;
          margin: 0;
          color: var(--cc-color-text-weak);
        }

        .ticket-subject {
          flex: 2 1 300px;
        }
        .ticket-status {
          flex: .1 0 90px;
        }
        .ticket-actions {
          flex: 0 0 40px;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ticket-center-list', CcTicketCenterList);
