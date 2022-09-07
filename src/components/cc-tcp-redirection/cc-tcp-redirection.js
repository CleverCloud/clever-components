import '../cc-button/cc-button.js';
import '../cc-flex-gap/cc-flex-gap.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import '../cc-loader/cc-loader.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { waitingStyles } from '../../styles/waiting.js';

const noRedirectionSvg = new URL('../../assets/redirection-off.svg', import.meta.url).href;
const redirectionSvg = new URL('../../assets/redirection-on.svg', import.meta.url).href;

/**
 * @typedef {import('./cc-tcp-redirection.types.js').RedirectionState} RedirectionState
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
      redirection: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {RedirectionState} */
    this.redirection = { state: 'loading' };
  }

  _getButtonText () {
    return this._isRedirectionDefined()
      ? i18n('cc-tcp-redirection.delete-button')
      : i18n('cc-tcp-redirection.create-button');
  }

  _getHelpText () {
    const { namespace, sourcePort } = this.redirection;
    return this._isRedirectionDefined()
      ? i18n('cc-tcp-redirection.redirection-defined', { namespace, sourcePort })
      : i18n('cc-tcp-redirection.redirection-not-defined', { namespace });
  }

  _getHelpTextAddendum () {
    if (this.redirection.private) {
      return i18n('cc-tcp-redirection.namespace-private');
    }
    switch (this.redirection.namespace) {
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
    return this.redirection.sourcePort != null;
  }

  _onCreate () {
    const { namespace } = this.redirection;
    dispatchCustomEvent(this, 'create', { namespace });
  }

  _onDelete () {
    const { namespace, sourcePort } = this.redirection;
    dispatchCustomEvent(this, 'delete', { namespace, sourcePort });
  }

  render () {
    const state = this.redirection.state;
    return html`
      <cc-flex-gap class="wrapper">
        <div class="icon ${classMap({ skeleton: state === 'loading' })}">
          ${state === 'loaded' ? html`
            <img src=${this._getIconUrl()} alt="">
          ` : ''}
          ${state === 'waiting' ? html`
            <cc-loader></cc-loader>
          ` : ''}
        </div>
        <cc-flex-gap class="text-button ${classMap({ 'cc-waiting': state === 'waiting' })}">
          <div class="text-wrapper">
            <span class="text ${classMap({ skeleton: state === 'loading' })}">${this._getHelpText()}</span>
            ${this._getHelpTextAddendum() != null ? html`
              <br>
              <span class="text-addendum ${classMap({ skeleton: state === 'loading' })}">${this._getHelpTextAddendum()}</span>
            ` : ''}
          </div>
          <cc-button
            outlined
            ?skeleton=${state === 'loading'}
            ?waiting=${state === 'waiting'}
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
          --cc-gap: 0.8em;
        }

        .icon {
          flex: 0 0 auto;
          height: 1.5em;
          width: 1.5em;
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
          flex: 1 1 30em;
          line-height: 1.6em;
        }

        .text strong {
          white-space: nowrap;
        }

        .text:not(.skeleton) code {
          background-color: var(--cc-color-bg-neutral);
          border-radius: 0.25em;
          font-family: var(--cc-ff-monospace);
          padding: 0.15em 0.3em;
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
