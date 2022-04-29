import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import './cc-article-card.js';
import '../molecules/cc-error.js';

const ARTICLE_SKELETON_NUMBER = 9;

/**
 * @typedef {import('./types.js').Article} Article
 */

/**
 * A component displaying a list of article cards.
 *
 * @cssdisplay block
 */
export class CcArticleList extends LitElement {

  static get properties () {
    return {
      articles: { type: Array },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();

    /** @type {Article[]} Sets an array that contains for each element an object with the content of a card article. */
    this.articles = null;

    /** @type {boolean} Displays an error message. */
    this.error = false;
  }

  render () {

    const skeleton = (this.articles == null);

    return html`
      <div class="article-container">
        ${this.error ? html`
          <cc-error>${i18n('cc-article-list.error')}</cc-error>
        ` : ''}
        ${skeleton && !this.error ? html`
          ${new Array(ARTICLE_SKELETON_NUMBER).fill(html`
            <cc-article-card></cc-article-card>
          `)}
        ` : ''}
        ${!skeleton && !this.error ? html`
          ${this.articles.map((article) => html`
            <cc-article-card
              banner=${article.banner}
              title=${article.title ?? ''}
              link=${article.link ?? ''}
              description=${article.description ?? ''}
              date=${article.date ?? new Date().toDateString()}
            ></cc-article-card>
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

        .article-container {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat( auto-fit, minmax(20em, 1fr) );
        }

        cc-error {
          border: 1px solid #bcc2d1;
          border-radius: 0.25em;
          padding: 1em;
          text-align: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-article-list', CcArticleList);
