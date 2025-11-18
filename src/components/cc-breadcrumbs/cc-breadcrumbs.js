import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../cc-link/cc-link.js';
import { CcBreadcrumbClickEvent } from './cc-breadcrumbs.events.js';

/**
 * @typedef {import('./cc-breadcrumbs.types.js').CcBreadcrumbsItem} CcBreadcrumbsItem
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A breadcrumb navigation component that displays a hierarchical path of items.
 *
 * Each breadcrumb item is clickable except the last item.
 * Clicking a breadcrumb item dispatches a `CcBreadcrumbClickEvent` with the path to that item.
 *
 * @cssdisplay block
 */
export class CcBreadcrumbs extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {Array<CcBreadcrumbsItem>} Set the items. */
    this.items = [];
  }

  /**
   * @param {Event} event
   * @param {Array<string>} path
   */
  _onItemClick(event, path) {
    event.preventDefault();
    this.dispatchEvent(new CcBreadcrumbClickEvent({ path }));
  }

  render() {
    /** @type {Array<string>} */
    let current = [];
    const parts = this.items ?? [];

    return html`<ul>
      ${parts.map((item, index) => {
        let path = [...current, item.value];
        current = path;
        const isLast = index === parts.length - 1;
        const label = item.label ?? item.value;

        const itemView =
          item.icon != null
            ? html`<span class="item-wrapper"
                ><cc-icon .icon=${item.icon} .a11yName=${item.iconA11yName}></cc-icon>${label}</span
              >`
            : label;

        return html`<li aria-current=${ifDefined(isLast ? 'page' : undefined)}>
          ${isLast ? itemView : ''}
          ${!isLast
            ? html`<cc-link href="#" @click=${/** @param {Event} event */ (event) => this._onItemClick(event, path)}
                >${itemView}</cc-link
              >`
            : ''}
        </li>`;
      })}
    </ul>`;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;

          --gap: 0.5em;
        }

        ul {
          display: flex;
          align-items: end;
          gap: var(--gap);
          flex-wrap: wrap;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          display: flex;
          align-items: center;
          gap: var(--gap);
        }

        .item-wrapper {
          display: flex;
          align-items: center;
          gap: 0.2em;
          min-width: 0;
        }

        cc-icon {
          flex-shrink: 0;
        }

        li + li::before {
          content: '/';
          font-weight: bold;
          font-size: 1.2em;
          color: var(--cc-color-text-disabled, #ccc);
        }
      `,
    ];
  }
}

window.customElements.define('cc-breadcrumbs', CcBreadcrumbs);
