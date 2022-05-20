import '../atoms/cc-img.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { linkStyles } from '../templates/cc-link.js';

const SKELETON_INFO = {
  title: fakeString(6),
  description: fakeString(110),
};

/**
 * A component displaying basic information of a product with a link to redirect to its documentation in a card.
 *
 * @cssdisplay grid
 */
export class CcDocCard extends LitElement {

  static get properties () {
    return {
      description: { type: String },
      icons: { type: Array },
      link: { type: String },
      title: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {string|null} Sets the description of the documentation card. */
    this.description = null;

    /** @type {string[]} Sets the icon of the documentation card. */
    this.icons = null;

    /** @type {string|null} Sets the link of the documentation card. */
    this.link = null;

    /** @type {string|null} Sets the title of the documentation card.  */
    this.title = null;
  }

  render () {

    const skeleton = (this.icons == null || this.title == null || this.description == null || this.link == null);
    const title = this.title ?? SKELETON_INFO.title;
    const description = this.description ?? SKELETON_INFO.description;

    return html`
        <div class="images">
          ${skeleton ? html`
            <cc-img></cc-img>
          ` : ''}
          ${!skeleton ? html`
            ${this.icons.map((icon) => html`
              <cc-img src=${icon}></cc-img>
            `)}
          ` : ''}
        </div>
        <div class="title">
          <span class="${classMap({ skeleton })}">${title}</span>
        </div>
        <div class="desc">
          <span class="${classMap({ skeleton })}">${description}</span>
        </div>
        <div class="link ${classMap({ skeleton })}">
          ${!skeleton
            ? i18n('cc-doc-card.link', { link: this.link, product: this.title })
            : i18n('cc-doc-card.skeleton-link-title')}
        </div>
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          background: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25em;
          box-sizing: border-box;
          display: grid;
          gap: 1em;
          grid-template-areas:
                  "img title"
                  "desc desc"
                  "link link";
          grid-template-columns: min-content 1fr;
          grid-template-rows: min-content 1fr min-content;
          padding: 1rem;
        }
        
        .images {
          display: flex;
          gap: 0.5em;
          grid-area: img;
        }

        cc-img {
          border-radius: 0.25em;
          height: 2em;
          width: 2em;
        }

        .title {
          align-self: center;
          font-size: 1.2em;
          font-weight: bold;
          grid-area: title;
          justify-self: start;
        }

        .desc {
          grid-area: desc;
        }

        .link {
          align-self: end;
          grid-area: link;
          justify-self: end;
        }
        
        .skeleton {
          background-color: #bbb;
        }
        
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-doc-card', CcDocCard);
