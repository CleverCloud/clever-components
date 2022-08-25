import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import '../cc-tcp-redirection/cc-tcp-redirection.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

const SKELETON_REDIRECTIONS = [
  { namespace: 'default', sourcePort: 1234 },
  { namespace: 'cleverapps' },
];

/**
 * @typedef {import('./cc-tcp-redirection-form.types.js').ContextRedirectionType} ContextRedirectionType
 * @typedef {import('./cc-tcp-redirection-form.types.js').Redirection} Redirection
 * @typedef {import('./cc-tcp-redirection-form.types.js').RedirectionNamespace} RedirectionNamespace
 */

/**
 * An interface to create / delete TCP redirections in the context of an application.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<RedirectionNamespace>} cc-tcp-redirection:create - Fires a redirection namespace whenever the create button is clicked.
 * @event {CustomEvent<Redirection>} cc-tcp-redirection:delete - Fires a redirection whenever the delete button is clicked.
 */
export class CcTcpRedirectionForm extends LitElement {

  static get properties () {
    return {
      context: { type: String },
      error: { type: Boolean },
      redirections: { type: Array },
    };
  }

  constructor () {
    super();

    /** @type {ContextRedirectionType} Defines in which context the form is used so it can show the appropriate description or lack thereof (defaults to user). */
    this.context = 'user';

    /** @type {boolean} Sets a loading error state. */
    this.error = false;

    /** @type {Redirection[]|null} Sets the list of redirections. */
    this.redirections = null;
  }

  _getRedirectionCount () {
    if (this.context === 'admin' && this.redirections != null) {
      const howManyRedirections = this.redirections.filter(({ sourcePort }) => sourcePort != null).length;
      if (howManyRedirections >= 1) {
        return html`<cc-badge circle weight="strong">${howManyRedirections}</cc-badge>`;
      }
    }
    return '';
  }

  render () {
    const skeleton = (this.redirections == null);
    const redirections = skeleton ? SKELETON_REDIRECTIONS : this.redirections;
    const blockState = (this.context === 'admin') ? 'close' : 'off';

    return html`
      <cc-block state="${blockState}">
        <div slot="title">${i18n('cc-tcp-redirection-form.title')}${this._getRedirectionCount()}</div>
        ${this.context === 'user' ? html`
          <div class="description">${i18n('cc-tcp-redirection-form.description')}</div>
        ` : ''}
        ${!this.error && redirections.length > 0 ? html`
          ${redirections.map((redirection) => html`
            <cc-tcp-redirection
              namespace=${redirection.namespace}
              .sourcePort=${redirection.sourcePort}
              ?skeleton=${skeleton}
              ?waiting=${redirection.waiting}
              ?private=${redirection.private}
            ></cc-tcp-redirection>
          `)}
        ` : ''}
        ${!this.error && redirections.length === 0 ? html`
          <div class="cc-block_empty-msg">${i18n('cc-tcp-redirection-form.empty')}</div>
        ` : ''}
        ${this.error ? html`
          <cc-error>${i18n('cc-tcp-redirection-form.error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
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
          /* cc-block title changes the font-size to 1.2em, which makes our badge way too big */
          font-size: 0.8em;
          margin-left: 0.5rem;
          vertical-align: middle;
        }

        .description {
          line-height: 1.6;
        }

        .description p {
          margin: 0;
          margin-bottom: 1rem;
        }

        .description code {
          background-color: var(--cc-color-bg-neutral);
          border-radius: 0.25rem;
          font-family: var(--cc-ff-monospace);
          padding: 0.15rem 0.3rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection-form', CcTcpRedirectionForm);
