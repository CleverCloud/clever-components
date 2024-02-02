import '../cc-article-card/cc-article-card.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { i18n } from '../../lib/i18n.js';

const ARTICLE_SKELETON_NUMBER = 9;

/**
 * @typedef {import('./cc-article-list.types.js').ArticleListState} ArticleListState
 */

/**
 * A component displaying a list of article cards.
 *
 * @cssdisplay block
 */
export class CcArticleList extends LitElement {

  static get properties () {
    return {
      state: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {ArticleListState} Sets the articles list state. */
    this.state = { type: 'loading' };
  }

  render () {

    return html`
      <div class="article-container">
        ${this.state.type === 'error' ? html`
          <cc-notice intent="warning" message="${i18n('cc-article-list.error')}"></cc-notice>
        ` : ''}
        
        ${this.state.type === 'loading' ? html`
          ${new Array(ARTICLE_SKELETON_NUMBER).fill(html`
            <cc-article-card></cc-article-card>
          `)}
        ` : ''}
        
        ${this.state.type === 'loaded' ? html`
          ${this.state.articles.map((article) => html`
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
          grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
        }
      `,
    ];
  }
}

window.customElements.define('cc-article-list', CcArticleList);
