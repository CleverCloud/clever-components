import { LitElement, html, css } from 'lit';
import { iconRemixServerFill as labelIcon } from '../../src/assets/cc-remix.icons.js';

export class CtSummaryPlan extends LitElement {
  static get properties () {
    return {
      detailsVisible: { type: Boolean, attribute: 'details-visible' },
      plan: { type: Object },
      _sortedFeatures: { type: Array, state: true },
    };
  };

  constructor () {
    super();

    this.detailsVisible = false;
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('plan')) {
      this._sortedFeatures = [...this.plan.features];
      this._sortedFeatures.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  render () {
    return this.plan
      ? html`
        <cc-icon class="icon" .icon='${labelIcon}' size="lg"></cc-icon>
        <div class="infos">
          <div class="name">
            <span class="label">${this.plan.name}</span>
            ${
              this.detailsVisible ? html`<span class="slug">(${this.plan.slug})</span>` : ``
            }
          </div>
          ${
            this.detailsVisible
            ? html`<div class="features">
            ${
              this._sortedFeatures.map((feature) => {
                return html`<span class="feature">
                  <span class="feature--name">${feature.name}</span>&nbsp;<span class="feature--value">${feature.value}</span>
                </span>`;
              })
            }
            </div>`
            : ``
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
      `,
    ];
  }
}

customElements.define('ct-summary-plan', CtSummaryPlan);
