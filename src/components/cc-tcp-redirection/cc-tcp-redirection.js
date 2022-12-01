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
 * @typedef {import('./cc-tcp-redirection.types.js').TcpRedirectionState} TcpRedirectionState
 */

/**
 * A small form to create or delete a TCP redirection.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<CreateTcpRedirection>} cc-tcp-redirection:create - Fires a redirection namespace whenever the create button is clicked.
 * @event {CustomEvent<DeleteTcpRedirection>} cc-tcp-redirection:delete - Fires a redirection whenever the delete button is clicked.
 */
export class CcTcpRedirection extends LitElement {

  static get properties () {
    return {
      redirection: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {TcpRedirectionState} Sets the name of the namespace. */
    this.redirection = { state: 'loading' };
  }

  _getButtonText (redirection) {
    return (redirection.sourcePort != null)
      ? i18n('cc-tcp-redirection.delete-button')
      : i18n('cc-tcp-redirection.create-button');
  }

  _getHelpText (redirection) {
    const { namespace, sourcePort } = redirection;
    return (sourcePort != null)
      ? i18n('cc-tcp-redirection.redirection-defined', { namespace, sourcePort })
      : i18n('cc-tcp-redirection.redirection-not-defined', { namespace });
  }

  _getHelpTextAddendum (redirection) {
    if (redirection.isPrivate) {
      return i18n('cc-tcp-redirection.namespace-private');
    }
    switch (redirection.namespace) {
      case 'default':
        return i18n('cc-tcp-redirection.namespace-additionaldescription-default');
      case 'cleverapps':
        return i18n('cc-tcp-redirection.namespace-additionaldescription-cleverapps');
      default:
        return null;
    }
  }

  _getIconUrl (redirection) {
    return (redirection.sourcePort != null)
      ? redirectionSvg
      : noRedirectionSvg;
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
    const skeleton = state === 'loading';

    // Use a fake redirection for skeleton mode
    const redirection = skeleton
      ? { namespace: 'default', isPrivate: false }
      : this.redirection;

    const isRedirectionDefined = (redirection.sourcePort != null);
    const helpTextAddendum = this._getHelpTextAddendum(redirection);

    return html`
      <cc-flex-gap class="wrapper">

        ${skeleton ? html`
          <div class="icon skeleton"></div>
        ` : ''}

        ${state === 'loaded' ? html`
          <div class="icon">
            <img src=${this._getIconUrl(redirection)} alt="">
          </div>
        ` : ''}

        ${state === 'waiting' ? html`
          <div class="icon">
            <cc-loader></cc-loader>
          </div>
        ` : ''}

        <cc-flex-gap class="text-button ${classMap({ 'cc-waiting': skeleton })}">
          <div class="text-wrapper">
            <span class="text ${classMap({ skeleton })}">${(this._getHelpText(redirection))}</span>
            ${helpTextAddendum != null ? html`
              <br>
              <span class="text-addendum ${classMap({ skeleton })}">${helpTextAddendum}</span>
            ` : ''}
          </div>

          <cc-button
            outlined
            ?skeleton=${skeleton}
            ?waiting=${state === 'waiting'}
            ?danger=${isRedirectionDefined}
            delay=${isRedirectionDefined ? 3 : 0}
            ?primary=${!isRedirectionDefined}
            @cc-button:click=${isRedirectionDefined ? this._onDelete : this._onCreate}
          >
            ${this._getButtonText(redirection)}
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
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
        }

        .icon img {
          display: block;
          width: 100%;
          height: 100%;
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
          padding: 0.15em 0.3em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: 0.25em;
          font-family: var(--cc-ff-monospace);
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
