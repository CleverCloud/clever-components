import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-clipboard/cc-clipboard.js';
import { CcTabClickEvent } from './cc-console-headbar.events.js';

/**
 * @import { Tab } from './cc-console-headbar.types.js'
 */

/**
 * A component displaying the console headbar with product info and navigation tabs.
 * Can be used for applications, addons, or any other product type.
 *
 * @cssdisplay block
 */
export class CcConsoleHeadbar extends LitElement {
  static get properties() {
    return {
      productType: { type: String, attribute: 'product-type' },
      productId: { type: String, attribute: 'product-id' },
      tabs: { type: Array },
      skeleton: { type: Boolean },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Product type label (e.g., "Node", "PostgreSQL", "MongoDB") */
    this.productType = null;

    /** @type {string|null} Product ID (application or addon ID) */
    this.productId = null;

    /** @type {Tab[]|null} Navigation tabs */
    this.tabs = null;

    /** @type {boolean} Enable skeleton loading state */
    this.skeleton = false;
  }

  render() {
    return html`
      <div class="container">
        ${this._renderTopSection()} ${this._renderTabs()}
      </div>
    `;
  }

  _renderTopSection() {
    return html`
      <div class="top-section">
        <div class="product-info">
          ${this.productType != null
            ? html`<span class="product-type-badge ${classMap({ skeleton: this.skeleton })}">${this.productType}</span>`
            : ''}
          ${this.productId != null
            ? html`
                <div class="product-id-container">
                  <span class="product-id ${classMap({ skeleton: this.skeleton })}">${this.productId}</span>
                  ${!this.skeleton ? html`<cc-clipboard value="${this.productId}"></cc-clipboard>` : ''}
                </div>
              `
            : ''}
        </div>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }

  _renderTabs() {
    if (this.tabs == null || this.tabs.length === 0) {
      return '';
    }

    return html`
      <nav class="tabs-section" role="navigation" aria-label="${i18n('cc-console-headbar.tabs.label')}">
        ${this.tabs.map((tab) => this._renderTab(tab))}
      </nav>
    `;
  }

  _renderTab(tab) {
    return html`
      <a
        class="tab ${classMap({ 'tab--selected': tab.selected === true, skeleton: this.skeleton })}"
        href="${tab.path}"
        aria-current="${ifDefined(tab.selected === true ? 'page' : undefined)}"
        @click="${(e) => this._onTabClick(e, tab)}"
      >
        ${tab.name}
      </a>
    `;
  }

  _onTabClick(event, tab) {
    this.dispatchEvent(new CcTabClickEvent({ path: tab.path, name: tab.name }));
  }

  static get styles() {
    return [
      accessibilityStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          background-color: #283250;
          color: #fff;
          display: block;
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* TOP SECTION */
        .top-section {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: space-between;
          padding: 1em 1.5em;
        }

        .product-info {
          align-items: center;
          display: flex;
          flex: 1 1 auto;
          gap: 1em;
          min-width: 0;
        }

        .product-type-badge {
          color: #fff;
          font-size: 1em;
          font-weight: 600;
          white-space: nowrap;
        }

        .product-id-container {
          align-items: center;
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral-strong, #8c8c8c);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          gap: 0;
          min-width: 0;
          overflow: hidden;
        }

        .product-id {
          color: var(--cc-color-text-default, #262626);
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.9em;
          overflow: hidden;
          padding: 0.4em 0.6em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-id-container cc-clipboard {
          border-left: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
          flex-shrink: 0;
        }

        .actions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        /* BOTTOM SECTION - TABS */
        .tabs-section {
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          gap: 0;
          padding: 0 1.5em;
        }

        .tab {
          border-bottom: 2px solid transparent;
          color: #99a1af;
          font-size: 0.9em;
          font-weight: 400;
          margin-bottom: -1px;
          padding: 0.75em 1.25em;
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .tab:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .tab--selected {
          border-bottom-color: var(--color-blue-20, #ccd4dc);
          color: #fff;
          font-weight: 500;
        }

        .tab:focus {
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .top-section {
            align-items: flex-start;
            flex-direction: column;
          }

          .tabs-section {
            -webkit-overflow-scrolling: touch;
            overflow-x: auto;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-console-headbar', CcConsoleHeadbar);
