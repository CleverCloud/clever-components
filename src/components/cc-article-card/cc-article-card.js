import '../cc-img/cc-img.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const SKELETON_INFO = {
  date: 'Tue, 22 Mar 2022 08:39:00 +0000',
  description: fakeString(128),
  title: fakeString(45),
};

/**
 * A component displaying information of an external article in a card.
 *
 * @cssdisplay grid
 */
export class CcArticleCard extends LitElement {

  static get properties () {
    return {
      banner: { type: String },
      date: { type: String },
      description: { type: String },
      link: { type: String },
      title: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Sets the article banner image. */
    this.banner = null;

    /** @type {string|null} Sets the article date. */
    this.date = null;

    /** @type {string|null} Sets a short description of the article. */
    this.description = null;

    /** @type {string|null} Sets the link to the article. */
    this.link = null;

    /** @type {string|null} Sets the title of the article. */
    this.title = null;
  }

  render () {

    const skeleton = (this.title == null || this.banner == null || this.link == null || this.date == null);

    const banner = skeleton ? null : this.banner;
    const title = this.title ?? SKELETON_INFO.title;
    const description = this.description ?? SKELETON_INFO.description;
    const date = this.date ?? SKELETON_INFO.date;

    return html`
      <cc-img class="image" src=${banner}></cc-img>
      ${skeleton ? html`
        <div class="title">
          <span class="skeleton">${title}</span>
        </div>
      ` : ''}
      ${!skeleton ? html`
        <div class="title">
          ${ccLink(this.link, title, skeleton)}
        </div>
      ` : ''}
      <div>
        <span class=${classMap({ skeleton })}>${description}</span>
      </div>
      <div class="date">
        <span class=${classMap({ skeleton })}>${i18n('cc-article-card.date', { date })}</span>
      </div>
    `;
  }

  static get styles () {
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
          border: 1px solid #bcc2d1;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: 0.25em;
          gap: 1em;
          grid-template-columns: 1fr;
          grid-template-rows: min-content min-content 1fr min-content;
        }

        .image {
          display: block;
          height: 8em;
          border-bottom: 1px solid #bcc2d1;
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
