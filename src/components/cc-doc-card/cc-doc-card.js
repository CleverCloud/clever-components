import '../cc-img/cc-img.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

/** @type {DocCard} */
const SKELETON_INFO = {
  heading: fakeString(6),
  description: fakeString(110),
  link: null,
  icons: [],
};

/**
 * @typedef {import('./cc-doc-card.types.js').DocCardState} DocCardState
 * @typedef {import('./cc-doc-card.types.js').DocCard} DocCard
 */

/**
 * A component displaying basic information of a product with a link to redirect to its documentation in a card.
 *
 * @cssdisplay grid
 */
export class CcDocCard extends LitElement {

  static get properties () {
    return {
      state: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {DocCardState} Sets the state of the component */
    this.state = { type: 'loading' };
  }

  render () {
    const skeleton = (this.state.type === 'loading');
    const { heading, description, link } = this.state.type === 'loaded' ? this.state : SKELETON_INFO;

    return html`
      <div class="images">
        ${skeleton ? html`
          <cc-img skeleton></cc-img>
        ` : ''}
        ${this.state.type === 'loaded' ? html`
          ${this.state.icons.map((iconUrl) => html`
            <cc-img src=${iconUrl}></cc-img>
          `)}
        ` : ''}
      </div>
      <div class="title">
        <span class="${classMap({ skeleton })}">${heading}</span>
      </div>
      <div class="desc">
        <span class="${classMap({ skeleton })}">${description}</span>
      </div>
      <div class="link ${classMap({ skeleton })}">
        ${this.state.type === 'loaded'
          ? i18n('cc-doc-card.link', { link, product: heading })
          : i18n('cc-doc-card.skeleton-link-title')}
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
          box-sizing: border-box;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 1em;
          grid-template-areas: 
            'img title'
            'desc desc'
            'link link';
          grid-template-columns: min-content 1fr;
          grid-template-rows: min-content 1fr min-content;
        }
        
        .images {
          display: flex;
          gap: 0.5em;
          grid-area: img;
        }

        cc-img {
          width: 2em;
          height: 2em;
          border-radius: var(--cc-border-radius-default, 0.25em);
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
