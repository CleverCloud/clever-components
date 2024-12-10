import { css, html, LitElement } from 'lit';
import { iconRemixCheckboxCircleFill as selectedIcon } from '../../assets/cc-remix.icons.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('./cc-plan-item.types.js').PlanDetails} PlanDetails
 * @typedef {import('./cc-plan-item.types.js').PlanBadge} PlanBadge
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component displaying a card with relative plan information and details
 *
 * @cssdisplay flex
 */
export class CcPlanItem extends LitElement {
  static get properties() {
    return {
      badge: { type: Object },
      details: { type: Array },
      disabled: { type: Boolean, reflect: true },
      name: { type: String },
      selected: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {PlanBadge} Badge to display next to the plan name */
    this.badge = null;

    /** @type {PlanDetails[]} The details of the plan */
    this.details = [];

    /** @type {boolean} Whether the component should be disabled */
    this.disabled = false;

    /** @type {string} The plan name */
    this.name = null;

    /** @type {boolean} Whether the component should be selected */
    this.selected = false;
  }

  render() {
    return html`
      <div class="title">
        <div class="name">${this.name}</div>
        ${this.badge != null ? html` <cc-badge .intent="${this.badge.intent}">${this.badge.content}</cc-badge> ` : ''}
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      ${this.details?.length > 0
        ? html`<ul class="details">
            ${this.details.map((detail) => this._renderDetail(detail))}
          </ul>`
        : ``}
    `;
  }

  /**
   * @param {PlanDetails} detail
   * @returns TemplateResult
   */
  _renderDetail(detail) {
    return html`
      <li class="detail">
        <span class="detail-icon"><cc-icon .icon="${detail.icon}" size="md"></cc-icon></span>
        <span class="detail-value">${detail.value}</span>
      </li>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          border: 2px solid var(--cc-color-border-neutral, #eee);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: block;
          position: relative;
        }

        .title {
          align-items: center;
          column-gap: 0.375em;
          display: inline-flex;
          flex-wrap: wrap;
          padding: 1em 1em 0.75em;
        }

        .name {
          font-size: 1.25em;
        }

        :host([selected]) .name {
          color: var(--cc-color-text-primary-strongest);
        }

        .icon-selected {
          --cc-icon-color: var(--cc-color-bg-primary);

          display: none;
          position: absolute;
          right: 0.5em;
          top: 0.5em;
        }

        :host([selected]) .icon-selected {
          display: block;
        }

        .details {
          background-color: var(--cc-color-bg-neutral);
          display: flex;
          flex-direction: column;
          gap: 0.25em 0;
          margin: 0;
          padding: 0.75em 1em;
        }

        :host([selected]) .details {
          background-color: var(--cc-color-bg-primary-weak);
        }

        .detail {
          display: inline-flex;
          gap: 0.5em;
        }

        .detail-icon {
          align-self: center;
          color: var(--cc-color-text-weak);
        }

        :host([selected]) .detail-icon {
          color: var(--cc-color-text-primary);
        }

        .detail-value {
          color: var(--cc-color-text-weak);
          font-size: 0.875em;
        }

        :host(:focus-visible) {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: 2px;
        }

        :host([selected]) {
          border-color: var(--cc-color-bg-primary);
        }

        :host([selected]) .detail-value {
          color: var(--cc-color-text-primary-strongest);
        }

        :host([disabled]) {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }

        :host(:hover:not([disabled])) {
          border-color: var(--cc-color-border-neutral-hovered, #777);
        }

        :host(:not([selected], [disabled])) {
          cursor: pointer;
        }
      `,
    ];
  }
}

window.customElements.define('cc-plan-item', CcPlanItem);
