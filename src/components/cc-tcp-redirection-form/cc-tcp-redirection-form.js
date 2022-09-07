import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import '../cc-tcp-redirection/cc-tcp-redirection.js';
import { css, html, LitElement } from 'lit';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import { i18n } from '../../lib/i18n.js';

const SKELETON_REDIRECTIONS = [
  { state: 'loading', namespace: 'default', sourcePort: 1234 },
  { state: 'loading', namespace: 'cleverapps' },
];

/**
 * @typedef {import('./cc-tcp-redirection-form.types.js').RedirectionFormState} RedirectionFormState
 * @typedef {import('./cc-tcp-redirection-form.types.js').RedirectionState} RedirectionState
 * @typedef {import('./cc-tcp-redirection-form.types.js').ContextRedirectionType} ContextRedirectionType
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
      redirections: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {ContextRedirectionType} Defines in which context the form is used so it can show the appropriate description or lack thereof (defaults to user). */
    this.context = 'user';

    /** @type {RedirectionFormState} Sets the list of redirections. */
    this.redirections = { state: 'loading' };
  }

  _getRedirectionCount () {
    if (this.context === 'admin' && this.redirections.state === 'loaded') {
      const howManyRedirections = this.redirections.value.filter(({ sourcePort }) => sourcePort != null).length;
      if (howManyRedirections >= 1) {
        return html`
          <cc-badge circle weight="strong">${howManyRedirections}</cc-badge>
        `;
      }
    }
    return '';
  }

  render () {

    const blockState = (this.context === 'admin') ? 'close' : 'off';

    return html`
      <cc-block state="${blockState}">
        <div slot="title">${i18n('cc-tcp-redirection-form.title')}${this._getRedirectionCount()}</div>

        ${this.context === 'user' ? html`
          <div class="description">${i18n('cc-tcp-redirection-form.description')}</div>
        ` : ''}

        ${this.redirections.state === 'loading' ? html`
          ${SKELETON_REDIRECTIONS.map((redirection) => html`
            <cc-tcp-redirection .redirection=${redirection}></cc-tcp-redirection>
          `)}
        ` : ''}

        ${this.redirections.state === 'loaded' ? html`
          ${this.redirections.value.map((redirection) => html`
            <cc-tcp-redirection .redirection=${redirection}></cc-tcp-redirection>
          `)}
        ` : ''}

        ${this.redirections.state === 'loaded' && this.redirections.value.length === 0 ? html`
          <div class="cc-block_empty-msg">${i18n('cc-tcp-redirection-form.empty')}</div>
        ` : ''}

        ${this.redirections.state === 'error-loading' ? html`
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
          margin-left: 0.5em;
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
          background-color: var(--cc-color-bg-neutral);
          border-radius: 0.25em;
          font-family: var(--cc-ff-monospace);
          padding: 0.15em 0.3em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection-form', CcTcpRedirectionForm);
