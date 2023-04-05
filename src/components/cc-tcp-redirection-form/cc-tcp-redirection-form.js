import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import '../cc-tcp-redirection/cc-tcp-redirection.js';
import { css, html, LitElement } from 'lit';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

const SKELETON_REDIRECTIONS = [
  { state: 'loading' },
  { state: 'loading' },
];

/**
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormContextType} TcpRedirectionFormContextType
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormState} TcpRedirectionFormState
 */

/**
 * An interface to create / delete TCP redirections in the context of an application.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<CreateTcpRedirection>} cc-tcp-redirection:create - Fires a redirection namespace whenever the create button is clicked.
 * @event {CustomEvent<DeleteTcpRedirection>} cc-tcp-redirection:delete - Fires a redirection whenever the delete button is clicked.
 */
export class CcTcpRedirectionForm extends LitElement {

  static get properties () {
    return {
      context: { type: String },
      redirections: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {TcpRedirectionFormContextType} Defines in which context the form is used so it can show the appropriate description or lack thereof (defaults to user). */
    this.context = 'user';

    /** @type {TcpRedirectionFormState} Sets the list of redirections. */
    this.redirections = { state: 'loading' };
  }

  render () {

    const state = this.redirections.state;
    const blockState = (this.context === 'admin') ? 'close' : 'off';

    return html`
      <cc-block state="${blockState}">

        <div slot="title">
          ${i18n('cc-tcp-redirection-form.title')}
          ${this._renderRedirectionCountBadge()}
        </div>

        ${this.context === 'user' ? html`
          <div class="description">${i18n('cc-tcp-redirection-form.description')}</div>
        ` : ''}

        ${state === 'loading' ? html`
          ${SKELETON_REDIRECTIONS.map((redirection) => html`
            <cc-tcp-redirection .redirection=${redirection}></cc-tcp-redirection>
          `)}
        ` : ''}

        ${state === 'loaded' ? html`
          ${this.redirections.value.map((redirection) => html`
            <cc-tcp-redirection .redirection=${redirection}></cc-tcp-redirection>
          `)}
          ${this.redirections.value.length === 0 ? html`
            <div class="cc-block_empty-msg">${i18n('cc-tcp-redirection-form.empty')}</div>
          ` : ''}
        ` : ''}

        ${state === 'error' ? html`
          <cc-error>${i18n('cc-tcp-redirection-form.error')}</cc-error>
        ` : ''}

      </cc-block>
    `;
  }

  _renderRedirectionCountBadge () {
    if (this.context === 'admin' && this.redirections.state === 'loaded') {
      const redirectionCount = this.redirections.value.filter(({ sourcePort }) => sourcePort != null).length;
      if (redirectionCount >= 1) {
        return html`
          <cc-badge circle weight="strong">${redirectionCount}</cc-badge>
        `;
      }
    }
    return '';
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-badge {
          margin-left: 0.5em;
          /* cc-block title changes the font-size to 1.2em, which makes our badge way too big */
          font-size: 0.8em;
          vertical-align: middle;
        }

        .description {
          line-height: 1.6;
        }

        .description p {
          margin: 0;
          margin-bottom: 1em;
        }

        .description code {
          padding: 0.15em 0.3em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection-form', CcTcpRedirectionForm);
