import { LitElement, html, css } from 'lit';
import { iconRemixSwapLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const HUMAN_NUMBER = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
];

export class CtSummaryScalability extends LitElement {
  static get properties () {
    return {
      detailsVisible: { type: Boolean, attribute: 'details-visible' },
      scalability: { type: Object },
    };
  };

  constructor () {
    super();

    this.detailsVisible = false;
  }

  render () {
    if (this.scalability == null) {
      return html``;
    }

    const { isEnabled, flavors, instances } = this.scalability;
    const label = !isEnabled
      ? `${HUMAN_NUMBER[instances.min.value] ?? instances.min.value} ${flavors.min.name} instance${instances.min.value > 1 ? 's' : ''}`
      : `${instances.min.value}-${instances.max.value} instances from ${flavors.min.name} to ${flavors.max.name}`
    ;

    const minDetails = html`${flavors.min.cpus}&nbsp;vCPUs - ${flavors.min.memory.formatted}`;
    const maxDetails = html`${flavors.max.cpus}&nbsp;vCPUs - ${flavors.max.memory.formatted}`;

    return html`
      <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
      <div class="infos">
        <div class="name">
          <div class="label">${label}</div>
        </div>
        ${
          this.detailsVisible
            ? html`<div class="tags">
              ${
                !isEnabled
                ? html`<div class='tag'>${minDetails}</div>`
                : html`<div class='tag'>From ${minDetails}</div><div class="tag">to ${maxDetails}</div>`
              }
            </div>
            `
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
        .name .label {
          font-size: 1.25em;
        }
        .name .slug {
          color: var(--cc-color-text-weak);
          font-family: "Source Sans 3", sans-serif;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25em 0.5em;
          padding-inline-end: 1em;
          font-family: "Source Sans 3", sans-serif;
        }
        .features > .feature {
          font-size: 0.875em;
        }
        
        .feature--name {
          color: var(--cc-color-text-weak);
          font-weight: 500;
        }
        .feature--value {
          color: var(--cc-color-text-weaker);
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

customElements.define('ct-summary-scalability', CtSummaryScalability);
