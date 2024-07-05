import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-img/cc-img.js';

/** @type {ArticleCard} */
const SKELETON_INFO = {
  date: 'Tue, 22 Mar 2022 08:39:00 +0000',
  description: fakeString(128),
  title: fakeString(45),
  link: null,
  banner: null,
};

/**
 * @typedef {import('./cc-article-card.types.js').ArticleCardState} ArticleCardState
 * @typedef {import('./cc-article-card.types.js').ArticleCard} ArticleCard
 */

/**
 * A component displaying information of an external article in a card.
 *
 * @cssdisplay grid
 */
export class CcArticleCard extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {ArticleCardState} Sets the state of the component */
    this.state = { type: 'loading' };
  }

  render() {
    const skeleton = this.state.type === 'loading';
    const data = this.state.type === 'loaded' ? this.state : SKELETON_INFO;

    return html`
      <cc-img class="image" src=${ifDefined(data.banner)}></cc-img>
      ${skeleton
        ? html`
            <div class="title">
              <span class="skeleton">${data.title}</span>
            </div>
          `
        : ''}
      ${this.state.type === 'loaded' ? html` <div class="title">${ccLink(data.link, data.title)}</div> ` : ''}
      <div>
        <span class=${classMap({ skeleton })}>${data.description}</span>
      </div>
      <div class="date">
        <span class=${classMap({ skeleton })}>${i18n('cc-article-card.date', { date: data.date })}</span>
      </div>
    `;
  }

  static get styles() {
    return [
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: grid;
          overflow: hidden;
          box-sizing: border-box;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 1em;
          grid-template-columns: 1fr;
          grid-template-rows: min-content min-content 1fr min-content;
        }

        .image {
          display: block;
          height: 8em;
          border-bottom: 1px solid var(--cc-color-border-neutral, #aaa);
          margin: -1em -1em 0;
          justify-self: stretch;
        }

        .title {
          font-size: 1.2em;
          font-weight: bold;
        }

        .title a {
          color: inherit;
          text-decoration: none;
        }

        .title a:hover {
          text-decoration: underline;
        }

        .title a:visited {
          color: inherit;
        }

        .date {
          font-size: 0.85em;
          font-style: italic;
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-article-card', CcArticleCard);
