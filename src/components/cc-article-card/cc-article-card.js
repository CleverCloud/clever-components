import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { fakeString } from '../../lib/fake-strings.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';

/** @type {ArticleCard} */
const SKELETON_INFO = {
  date: 'Tue, 22 Mar 2022 08:39:00 +0000',
  description: fakeString(128),
  title: fakeString(45),
  link: null,
  banner: null,
};

/**
 * @import { ArticleCardState, ArticleCard } from './cc-article-card.types.js'
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
      ${this.state.type === 'loaded'
        ? html`
            <div class="title"><cc-link href="${data.link}" disable-external-link-icon>${data.title}</cc-link></div>
          `
        : ''}
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
      skeletonStyles,
      // language=CSS
      css`
        :host {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-sizing: border-box;
          display: grid;
          gap: 1em;
          grid-template-columns: 1fr;
          grid-template-rows: min-content min-content 1fr min-content;
          overflow: hidden;
          padding: 1em;
        }

        .image {
          border-bottom: 1px solid var(--cc-color-border-neutral, #aaa);
          display: block;
          height: 8em;
          justify-self: stretch;
          margin: -1em -1em 0;
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
