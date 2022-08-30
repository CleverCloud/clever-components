import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import '../cc-block-section/cc-block-section.js';
import { css, html, LitElement } from 'lit';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

/**
 * @typedef {import('./cc-action-dispatcher.types.js').Response} Response
 */

/**
 * A component to ping VMs and display their pong status.
 *
 * Action Dispatcher is an executable running on each Virtual Machine (VM) on Clever Cloud.
 * The Action Dispatcher instance talks with the world through Pulsar, to fullfil a number of purposes (broadcasting wireguard configuration, receiving SSH keys...).
 * The simplest action of Action Dispatcher is to respond to a Ping with a Pong.
 *
 * This clever component's ping button sends a request to the CC Admin API that itself pings all instances of Action Dispatcher.
 *
 * The CC Admin waits a bit and responds with:
 *
 * * how many VMs were pinged (numberOfPings)
 * * how many Action Dispatcher responded with "pong" (numberOfPongs)
 * * the ids of the silent instances (an array of strings)
 *
 * @event {CustomEvent} cc-action-dispatcher:send-ping - Ask the CCAdmin to ping all VMs
 */
export class CcActionDispatcher extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      response: { type: Object },
      waiting: { type: Boolean },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Wether the API responded with an error. */
    this.error = false;

    /** @type {Response | null} The response we receive from the CC Admin. */
    this.response = null;

    /** @type {boolean} Wether the component is waiting for an API response. */
    this.waiting = false;
  }

  _onClickSendPings () {
    dispatchCustomEvent(this, 'send-ping');
  }

  render () {
    return html`
      <cc-block>

        <div slot="title">Action Dispatcher</div>

        <div class="text">
          <p>${i18n('cc-action-dispatcher.context')}</p>
          <cc-button
            primary
            ?waiting=${this.waiting}
            @cc-button:click=${this._onClickSendPings}
          >
            ${i18n('cc-action-dispatcher.ping-button-content')}
          </cc-button>
        </div>

        ${this.response != null ? html`
          <div class="number-block-list">
            <div class="number-block">
              <div class="number-block-title">${i18n('cc-action-dispatcher.number-of-pings')}</div>
              <div class="number-block-number">${this.response.numberOfPings}</div>
            </div>
            <div class="number-block">
              <div class="number-block-title">${i18n('cc-action-dispatcher.number-of-pongs')}</div>
              <div class="number-block-number">${this.response.numberOfPongs}</div>
            </div>
          </div>
          <div>
            <div class="instance-list-label">${i18n('cc-action-dispatcher.unresponsive-instances')}</div>
            <div class="instance-list">
              ${this.response.unresponsiveInstances.map((vm) => html`
                <div>${vm}</div>
              `)}
            </div>
          </div>
        ` : ''}

        ${this.error ? html`
          <cc-error>
            ${i18n('cc-action-dispatcher.error-message')}
          </cc-error>
        ` : ''}

      </cc-block>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        p {
          margin: 0;
        }

        .text {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .number-block-list {
          display: flex;
          gap: 1em;
        }

        .number-block {
          background-color: var(--cc-color-bg-neutral);
          border-radius: 0.25em;
          padding: 1em;
          text-align: center;
        }

        .number-block-title {
          font-weight: bold;
        }

        .number-block-number {
          color: var(--cc-color-text-primary-highlight);
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.5em;
        }

        .instance-list-label {
          font-weight: bold;
        }

        .instance-list {
          font-family: var(--cc-ff-monospace, monospace);
          line-height: 1.6;
          margin-top: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-action-dispatcher', CcActionDispatcher);
