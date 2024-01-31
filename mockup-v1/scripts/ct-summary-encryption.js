import { LitElement, html, css } from 'lit';
import { iconRemixShieldKeyholeFill as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  EAR: 'Encryption at rest',
  KIBANA: 'Kibana enabled',
  APM: 'APM enabled',
};

export class CtSummaryEncryption extends LitElement {
  static get properties () {
    return {
      detailsVisible: { type: Boolean, attribute: 'details-visible' },
      kibana: { type: Boolean },
      apm: { type: Boolean },
    };
  };

  constructor () {
    super();

    this.detailsVisible = false;
  }

  render () {
    return html`
      <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
      <div class="infos">
        <div class="name">
          <span class="highlighted">${WORDING.EAR}</span>
        </div>
        ${
          this.detailsVisible && (this.kibana || this.apm)
          ? html`<div class="tags">
            ${
              this.kibana
              ? html`<span class="tag">${WORDING.KIBANA}</span>`
              : ``
            }
            ${
              this.apm
              ? html`<span class="tag">${WORDING.APM}</span>`
              : ``
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
          word-break: break-word;
        }
        .name .highlighted {
          font-size: 1.25em;
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

customElements.define('ct-summary-encryption', CtSummaryEncryption);
