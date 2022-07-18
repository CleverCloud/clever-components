import './cc-doc-card.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';

const DOC_SKELETON_NUMBER = 9;

/**
 * @typedef {import('./types.js').Documentation} Documentation
 */

/**
 * A component displaying a list of documentation cards.
 *
 * @cssdisplay block
 */
export class CcDocList extends LitElement {

  static get properties () {
    return {
      docs: { type: Array },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();

    /** @type {Documentation[]} Sets the content that will be put into the cards. */
    this.docs = null;

    /** @type {boolean} Displays an error message. */
    this.error = false;
  }

  render () {

    const skeleton = (this.docs == null);

    return html`
      <div class="doc-wrapper">
        ${this.error ? html`
            <cc-error>${i18n('cc-doc-list.error')}</cc-error>
        ` : ''}
        ${skeleton && !this.error ? html`
          ${new Array(DOC_SKELETON_NUMBER).fill(html`
            <cc-doc-card></cc-doc-card>
          `)}
        ` : ''}
        ${!skeleton && !this.error ? html`
          ${this.docs.map((article) => html`
            <cc-doc-card
              description=${article.description ?? ''}
              heading=${article.heading ?? ''}
              .icons=${article.icons ?? []}
              link=${article.link ?? ''}
            ></cc-doc-card>
          `)}
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .doc-wrapper {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat( auto-fit, minmax(20em, 1fr) );
        }

        cc-error {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid #bcc2d1;
          border-radius: 0.25em;
          padding: 1em;
          text-align: center;
        }

      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-doc-list', CcDocList);
