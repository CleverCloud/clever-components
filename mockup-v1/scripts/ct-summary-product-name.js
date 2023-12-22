import { LitElement, html, css } from 'lit';
import { iconRemixInstanceLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

export class CtSummaryProductName extends LitElement {
  static get properties () {
    return {
      name: { type: String },
    };
  };

  render () {
    return html`
      <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
      <div class="name">${this.name}</div>
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
      `,
    ];
  }
}

customElements.define('ct-summary-product-name', CtSummaryProductName);
