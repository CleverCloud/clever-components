import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import './cc-tcp-redirection.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';

/**
 * An interface to create / delete TCP redirections in the context of an application.
 *
 * ## Type definitions
 *
 * ```js
 * interface Redirection {
 *   error?: boolean,
 *   namespace: string,
 *   private?: boolean,
 *   sourcePort?: number,
 *   waiting?: boolean,
 * }
 * ```
 *
 * @prop {"user"|"admin"} context - Defines in which context the form is used so it can show the appropriate description or lack thereof (defaults to user).
 * @prop {Boolean} error - Sets a loading error state.
 * @prop {Redirection[]} redirections - Sets the list of redirections.
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
    this.error = false;
    this.context = 'user';
  }

  static get skeletonRedirections () {
    return [
      { namespace: 'default', sourcePort: 1234 },
      { namespace: 'cleverapps' },
    ];
  }

  render () {
    const skeleton = (this.redirections == null);
    const redirections = skeleton ? CcTcpRedirectionForm.skeletonRedirections : this.redirections;

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-tcp-redirection-form.title')}</div>
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
              ?error=${redirection.error}
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
      // language=CSS
      css`
        :host {
          display: block;
        }

        .description {
          line-height: 1.6;
        }

        .description p {
          margin: 0;
          margin-bottom: 1rem;
        }

        .description code {
          background-color: #f3f3f3;
          border-radius: 0.25rem;
          font-family: "SourceCodePro", "monaco", monospace;
          padding: 0.15rem 0.3rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection-form', CcTcpRedirectionForm);
