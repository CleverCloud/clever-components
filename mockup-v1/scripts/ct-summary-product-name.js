import { LitElement, html, css } from 'lit';
import { iconRemixInstanceFill as labelIcon } from '../../src/assets/cc-remix.icons.js';

export class CtSummaryProductName extends LitElement {
  static get properties () {
    return {
      detailsVisible: { type: Boolean, attribute: 'details-visible' },
      name: { type: String },
      tags: { type: Array },
    };
  };

  render () {
    return html`
      <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
      <div class="infos">
        <div class="name">${this.name}</div>
        ${
          this.detailsVisible && this.tags != null
            ? html`<div class="tags">
              ${
                this.tags.map((tag) => {
                  return html`<span class="tag">${tag}</span>`;
                })
              }
              </div>`
            : ``
        }
        </div>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: inline-flex;
          align-items: baseline;
          column-gap: 0.5em;
        }
        
        :host .icon {
          flex: 0 0 auto;
        }
        :host .name {
          flex: 1 1 auto;
        }
        
        .icon {
          --cc-icon-color: var(--color-grey-50);

          position: relative;
          top: 0.325em;
        }
        
        .name {
          font-size: 1.25em;
          word-break: break-word;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25em 0.5em;
          padding-inline-end: 1em;
          color: var(--cc-color-text-weaker);
          font-family: "Source Sans 3", sans-serif;
        }
        .tags > .tag {
          font-size: 0.875em;
        }
      `,
    ];
  }
}

customElements.define('ct-summary-product-name', CtSummaryProductName);
