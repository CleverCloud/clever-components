import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../cc-link/cc-link.js';
import { CcBreadcrumbClickEvent } from './cc-breadcrumbs.events.js';

/**
 * @import { CcBreadcrumbsItem } from './cc-breadcrumbs.types.js'
 */

/**
 * A breadcrumb navigation component that displays a hierarchical path of items.
 *
 * Each breadcrumb item is clickable except the last item.
 * Clicking a breadcrumb item dispatches a `CcBreadcrumbClickEvent` with the path to that item.
 *
 * WARNING: When a breadcrumb item's `label` is an empty string, you MUST set the `iconA11yName` value to provide accessible text for the icon.
 * Otherwise, the link will have no discernible text, which is a serious accessibility issue (WCAG: Links must have discernible text).
 *
 * @cssdisplay block
 */
export class CcBreadcrumbs extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean },
      items: { type: Array },
    };
  }

  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

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
    event.stopPropagation();
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
          align-items: end;
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        li {
          align-items: center;
          display: flex;
          gap: var(--gap);
        }

        .item-wrapper {
          align-items: center;
          display: flex;
          gap: 0.2em;
          min-width: 0;
        }

        cc-icon {
          flex-shrink: 0;
        }

        li + li::before {
          color: var(--cc-color-text-disabled, #ccc);
          content: '/';
          font-size: 1.2em;
          font-weight: bold;
        }
      `,
    ];
  }
}

window.customElements.define('cc-breadcrumbs', CcBreadcrumbs);
