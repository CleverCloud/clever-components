import { LitElement, html, css } from 'lit';
import { iconRemixEarthFill as labelIcon } from '../../src/assets/cc-remix.icons.js';

export class CtSummaryZone extends LitElement {
  static get properties () {
    return {
      zone: { type: Object },
    };
  };

  render () {
    return this.zone
      ? html`
        <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
        <div class="infos">
          <div class="name">
            <span class="city">${this.zone.city}</span>
            <span class="dc">&#91;${this.zone.name}&#93;</span>
          </div>
          ${
            html`<div class="tags">
            ${
              this.zone.tags.map((tag) => {
                return html`<span class="tag">${tag}</span>`;
              })
            }
            </div>`
          }
        </div>
      `
      : html``
    ;
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
          word-break: break-word;
        }
        .name .city {
          font-size: 1.25em;
        }
        .name .dc {
          color: var(--cc-color-text-weak);
          font-family: "Source Sans 3", sans-serif;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25em 0.5em;
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

customElements.define('ct-summary-zone', CtSummaryZone);
