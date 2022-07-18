import '../atoms/cc-button.js';
import '../atoms/cc-flex-gap.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import '../atoms/cc-loader.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { waitingStyles } from '../styles/waiting.js';

const noRedirectionSvg = new URL('../assets/redirection-off.svg', import.meta.url).href;
const redirectionSvg = new URL('../assets/redirection-on.svg', import.meta.url).href;

/**
 * @typedef {import('./types.js').RedirectionNamespace} RedirectionNamespace
 * @typedef {import('./types.js').Redirection} Redirection
 */

/**
 * A small form to create or delete a TCP redirection.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<RedirectionNamespace>} cc-tcp-redirection:create - Fires a redirection namespace whenever the create button is clicked.
 * @event {CustomEvent<Redirection>} cc-tcp-redirection:delete - Fires a redirection whenever the delete button is clicked.
 */
export class CcTcpRedirection extends LitElement {

  static get properties () {
    return {
      namespace: { type: String },
      private: { type: Boolean },
      skeleton: { type: Boolean },
      sourcePort: { type: Number, attribute: 'source-port' },
      waiting: { type: Boolean },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Sets the name of the namespace. */
    this.namespace = null;

    /** @type {boolean} Set if this namespace is dedicated to the customer. */
    this.private = false;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {number|null} Sets the source of the redirection if any. */
    this.sourcePort = null;

    /** @type {boolean} Sets the waiting state. You should set this to true while an action is in progress. */
    this.waiting = false;
  }

  _getButtonText () {
    return this._isRedirectionDefined()
      ? i18n('cc-tcp-redirection.delete-button')
      : i18n('cc-tcp-redirection.create-button');
  }

  _getHelpText () {
    const { namespace, sourcePort } = this;
    return this._isRedirectionDefined()
      ? i18n('cc-tcp-redirection.redirection-defined', { namespace, sourcePort })
      : i18n('cc-tcp-redirection.redirection-not-defined', { namespace });
  }

  _getHelpTextAddendum () {
    if (this.private) {
      return i18n('cc-tcp-redirection.namespace-private');
    }
    switch (this.namespace) {
      case 'default':
        return i18n('cc-tcp-redirection.namespace-additionaldescription-default');
      case 'cleverapps':
        return i18n('cc-tcp-redirection.namespace-additionaldescription-cleverapps');
      default:
        return null;
    }
  }

  _getIconUrl () {
    if (this._isRedirectionDefined()) {
      return redirectionSvg;
    }
    return noRedirectionSvg;
  }

  _isRedirectionDefined () {
    return this.sourcePort != null;
  }

  _onCreate () {
    dispatchCustomEvent(this, 'create', { namespace: this.namespace });
  }

  _onDelete () {
    dispatchCustomEvent(this, 'delete', { namespace: this.namespace, sourcePort: this.sourcePort });
  }

  render () {
    return html`
      <cc-flex-gap class="wrapper">
        <div class="icon ${classMap({ skeleton: this.skeleton })}">
          ${!this.waiting && !this.skeleton ? html`
            <img src=${this._getIconUrl()} alt="">
          ` : ''}
          ${this.waiting ? html`
            <cc-loader></cc-loader>
          ` : ''}
        </div>
        <cc-flex-gap class="text-button ${classMap({ 'cc-waiting': this.waiting })}">
          <div class="text-wrapper">
            <span class="text ${classMap({ skeleton: this.skeleton })}">${this._getHelpText()}</span>
            ${this._getHelpTextAddendum() != null ? html`
              <br>
              <span class="text-addendum ${classMap({ skeleton: this.skeleton })}">${this._getHelpTextAddendum()}</span>
            ` : ''}
          </div>
          <cc-button
              outlined
              ?skeleton=${this.skeleton}
              ?waiting=${this.waiting}
              ?danger=${this._isRedirectionDefined()}
              delay=${this._isRedirectionDefined() ? 3 : 0}
              ?primary=${!this._isRedirectionDefined()}
              @cc-button:click=${this._isRedirectionDefined() ? this._onDelete : this._onCreate}
          >
            ${this._getButtonText()}
          </cc-button>
        </cc-flex-gap>
      </cc-flex-gap>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      waitingStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          --cc-gap: 0.8rem;
        }

        .icon {
          flex: 0 0 auto;
          height: 1.5rem;
          width: 1.5rem;
        }

        .icon img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .icon cc-loader {
          --cc-loader-color: #999;
        }

        .text-button {
          flex: 1 1 0;
        }

        .text-wrapper {
          flex: 1 1 30rem;
          line-height: 1.6rem;
        }

        .text strong {
          white-space: nowrap;
        }

        .text:not(.skeleton) code {
          background-color: var(--cc-color-bg-neutral);
          border-radius: 0.25rem;
          font-family: var(--cc-ff-monospace);
          padding: 0.15rem 0.3rem;
        }

        .text-addendum:not(.skeleton) {
          color: var(--cc-color-text-weak);
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection', CcTcpRedirection);
