import { LitElement, html, css } from 'lit';
import {
  iconRemixCheckboxCircleFill as selectedIcon,
} from '../../src/assets/cc-remix.icons.js';

export class CtPlanItem extends LitElement {
  static get properties () {
    return {
      id: { type: String },
      name: { type: String },
      details: { type: Array },
    };
  };

  willUpdate (_changedProperties) {
    this.blur();
  }

  _renderDetail (detail) {
    return html`
      <div class="detail">
        <span class="detail--icon"><cc-icon .icon="${detail.icon}" size="md"></cc-icon></span>
        <span class="detail--value">${detail.data.value}&nbsp;${detail.data.name}</span>
      </div>
    `;
  }

  render () {
    return html`
      <div class="title">
        <div class="name">${this.name}</div>
        <div class="decorator"><slot name="decorator"></slot></div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      ${
        this.details?.length
        ? html`<div class="details">
        ${
          this.details.map((detail) => this._renderDetail(detail))
        }
        </div>`
        : ``
      }
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          position: relative;
          border: 2px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          overflow: hidden;
        }

        :host .title {
          flex: 1 1 auto;
        }
        :host .details {
          flex: 0 0 auto;
        }

        :host(:hover) {
          border-color: var(--cc-color-border-neutral-hovered);
        }
        :host(:not([selected])) {
          cursor: pointer;
        }

        :host(:focus-visible) {
          outline: var(--cc-focus-outline);
          outline-offset: 2px;
        }

        :host([selected]) {
          border-color: var(--cc-color-bg-primary);
        }
        :host([selected]) .icon-selected {
          opacity: 1;
        }
        :host([selected]) .name {
          color: var(--cc-color-text-primary-strongest);
        }
        :host([selected]) .details {
          background-color: var(--cc-color-bg-primary-weak);
        }
        :host([selected]) .detail--icon {
          color: var(--cc-color-text-primary);
        }
        :host([selected]) .detail--value {
          color: var(--cc-color-text-primary-strongest);
        }

        .title {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          column-gap: 0.375em;
          padding: 1em 1em 0.75em 1em;
        }

        .name {
          flex: 0 0 auto;
          font-size: 1.25em;
        }
        .decorator {
          flex: 0 0 auto;
        }

        .icon-selected {
          --cc-icon-color: var(--cc-color-bg-primary);

          position: absolute;
          top: 0.5em;
          right: 0.5em;
          opacity: 0;
        }
        
        .details {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          padding: 0.75em 1.125em;
          background-color: var(--cc-color-bg-neutral);
        }
        
        .detail {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          line-height: 1;
        }
        
        .detail--icon {
          color: var(--cc-color-text-weak);
          flex: 0 0 auto;
        }
        .detail--value {
          color: var(--cc-color-text-weak);
          flex: 1 1 auto;
          font-size: 0.875em;
        }
      `,
    ];
  }
}

customElements.define('ct-plan-item', CtPlanItem);
