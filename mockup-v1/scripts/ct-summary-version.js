import { LitElement, html, css } from 'lit';
import { iconRemixStackFill as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  PREFIX: 'Version',
};

export class CtSummaryVersion extends LitElement {
  static get properties () {
    return {
      version: { type: String },
    };
  };

  render () {
    return html`
      <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
      <div class="infos">
        <div class="name">
          <span class="highlighted">${WORDING.PREFIX}&nbsp;${this.version}</span>
        </div>
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
      `,
    ];
  }
}

customElements.define('ct-summary-version', CtSummaryVersion);
