import '../atoms/cc-button.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import warningSvg from '../assets/warning.svg';
import '../atoms/cc-loader.js';
import { skeleton } from '../styles/skeleton.js';
import { waitingStyles } from '../styles/waiting.js';
import noRedirectionSvg from '../assets/redirection-off.svg';
import redirectionSvg from '../assets/redirection-on.svg';

/**
 * A small form to create or delete a TCP redirection
 *
 * ## Type definitions
 *
 * ```js
 * interface RedirectionNamespace {
 *   namespace: string,
 * }
 * ```
 *
 * ```js
 * interface Redirection {
 *   namespace: string,
 *   sourcePort: number,
 * }
 * ```
 *
 * @prop {Boolean} error - Set if there was an error during creation / deletion.
 * @prop {String} namespace - Sets the name of the namespace.
 * @prop {Boolean} private - Set if this namespace is dedicated to the customer.
 * @prop {Boolean} skeleton - Enables skeleton screen UI pattern (loading hint).
 * @prop {Number} sourcePort - Sets the source of the redirection if any.
 * @prop {Boolean} waiting - Sets the waiting state. You should set this to true while an action is in progress.
 *
 * @event {CustomEvent<RedirectionNamespace>} cc-tcp-redirection:create - Fires a redirection namespace whenever the create button is clicked.
 * @event {CustomEvent<Redirection>} cc-tcp-redirection:delete - Fires a redirection whenever the delete button is clicked.
 */
export class CcTcpRedirection extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      namespace: { type: String },
      private: { type: Boolean },
      skeleton: { type: Boolean },
      sourcePort: { type: Number },
      waiting: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.error = false;
    this.private = false;
    this.skeleton = false;
    this.waiting = false;
  }

  _getButtonText () {
    if (this.error) {
      return i18n('cc-tcp-redirection.retry-button');
    }
    return this._isRedirectionDefined()
      ? i18n('cc-tcp-redirection.delete-button')
      : i18n('cc-tcp-redirection.create-button');
  }

  _getHelpText () {
    const { namespace, sourcePort } = this;
    if (this.error) {
      return this._isRedirectionDefined()
        ? i18n('cc-tcp-redirection.error.redirection-defined', { namespace, sourcePort })
        : i18n('cc-tcp-redirection.error.redirection-not-defined', { namespace });
    }
    return this._isRedirectionDefined()
      ? i18n('cc-tcp-redirection.redirection-defined', { namespace, sourcePort })
      : i18n('cc-tcp-redirection.redirection-not-defined', { namespace });
  }

  _getHelpTextAddendum () {
    if (this.error) {
      return null;
    }
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
    if (this.skeleton) {
      return null;
    }
    if (this.error) {
      return warningSvg;
    }
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
      <span class="icon ${classMap({ skeleton: this.skeleton })}">
        ${!this.waiting ? html`
          <img src=${ifDefined(this._getIconUrl())} alt="">
        ` : ''}
        ${this.waiting ? html`
      <cc-loader></cc-loader>
    ` : ''}
      </span>
      <div class="text-button ${classMap({ 'cc-waiting': this.waiting })}">
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
      </div>
    `;
  }

  static get styles () {
    return [
      skeleton,
      waitingStyles,
      // language=CSS
      css`
        :host {
          align-items: flex-start;
          display: flex;
        }

        .icon {
          flex: 0 0 auto;
          height: 1.5rem;
          margin-right: 0.8rem;
          width: 1.5rem;
        }

        .icon img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .skeleton img {
          display: none;
        }

        .icon cc-loader {
          --cc-loader-color: #999;
        }

        .text-button {
          align-items: flex-start;
          display: flex;
          flex: 1 1 0;
          flex-wrap: wrap;
          margin: -0.25rem;
        }

        .text-wrapper,
        cc-button {
          margin: 0.25rem;
        }

        .text-wrapper {
          flex: 1 1 17rem;
          line-height: 1.6rem;
        }

        .text strong {
          white-space: nowrap;
        }

        .text:not(.skeleton) code {
          background-color: #f3f3f3;
          border-radius: 0.25rem;
          font-family: "SourceCodePro", "monaco", monospace;
          padding: 0.15rem 0.3rem;
        }

        .text-addendum:not(.skeleton) {
          color: #555;
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection', CcTcpRedirection);
