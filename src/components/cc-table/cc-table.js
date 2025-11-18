import '@lit-labs/virtualizer';
import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import {
  iconRemixExpandUpDownFill as iconSort,
  iconRemixArrowUpSFill as iconSortAsc,
  iconRemixArrowDownSFill as iconSortDesc,
} from '../../assets/cc-remix.icons.js';
import { fakeString } from '../../lib/fake-strings.js';
import { random } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-icon/cc-icon.js';
import { CcTableSortEvent } from './cc-table.events.js';

/**
 * @typedef {import('lit').TemplateResult<1> | import('lit').TemplateResult<2>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcTable>} PropertyValues
 * @typedef {import('@lit-labs/virtualizer/events.js').VisibilityChangedEvent} VisibilityChangedEvent
 * @typedef {import('@lit-labs/virtualizer/LitVirtualizer.js').LitVirtualizer} Virtualizer
 * @typedef {import('lit/directives/style-map.js').StyleInfo} StyleInfo
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('lit/directives/ref.js').Ref<Virtualizer>} VirtualizerRef
 */

/**
 * A component displaying data inside a table
 *
 * @cssdisplay block
 *
 * @template [T=any]
 */
export class CcTable extends LitElement {
  static get properties() {
    return {
      columns: { type: Array },
      items: { type: Array },
      skeleton: { type: Boolean, reflect: true },
      skeletonCount: { type: Boolean, attribute: 'skeleton-count' },
    };
  }

  /**
   * @typedef {import('./cc-table.types.js').CcTableColumnDefinition<T>} CcTableColumnDefinition
   * @typedef {import('./cc-table.types.js').CcTableElement<T>} CcTableElement
   */

  constructor() {
    super();

    /** @type {Array<CcTableColumnDefinition>} */
    this.columns = [];

    /** @type {Array<T>} */
    this.items = [];

    /** @type {boolean} */
    this.skeleton = false;

    /** @type {number} */
    this.skeletonCount = 5;
  }

  /**
   * @param {number} columnIndex
   */
  _onSortButtonClick(columnIndex) {
    const currentDirection = this.columns[columnIndex].sort?.direction;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    this.dispatchEvent(new CcTableSortEvent({ columnIndex, direction: newDirection }));
  }

  render() {
    if (this.columns.length === 0) {
      return html``;
    }

    const elements = this._getElements();

    return html`<div class="wrapper">
      ${elements.length === 0 ? html`<slot name="empty">Empty !!<!-- todo: i18n --></slot>` : ''}
      ${elements.length > 0
        ? html`
            <table style=${styleMap(this._getTableColumnsStyle())}>
              <thead>
                ${this._renderHeader()}
              </thead>
              <tbody>
                ${elements.map(this._renderRow.bind(this))}
              </tbody>
            </table>
            <div></div>
          `
        : ''}
    </div>`;
  }

  _renderHeader() {
    return html`<tr>
      ${this.columns.map((column, columnIndex) => {
        return html`<th class="cell" data-col="${columnIndex}">
          <div>${column.header}</div>
          ${this._renderSortButton(column, columnIndex)}
        </th>`;
      })}
    </tr>`;
  }

  /**
   * @param {CcTableColumnDefinition} column
   * @param {number} columnIndex
   * @returns {TemplateResult}
   */
  _renderSortButton(column, columnIndex) {
    if (column.sort == null) {
      return html``;
    }

    const direction = column.sort.direction;
    let icon = iconSort;
    if (direction === 'asc') {
      icon = iconSortAsc;
    } else if (direction === 'desc') {
      icon = iconSortDesc;
    }

    return html`
      <button @click=${() => this._onSortButtonClick(columnIndex)}>
        <span class="visually-hidden">Sort<!-- todo: i18n--></span>
        <cc-icon .icon="${icon}"></cc-icon>
      </button>
    `;
  }

  /**
   * @param {CcTableElement} element
   * @param {number} rowIndex
   * @returns {TemplateResult}
   */
  _renderRow(element, rowIndex) {
    return html`<tr>
      ${this.columns.map((column, columnIndex) => {
        return html`
          <td data-col="${columnIndex}" data-row="${rowIndex}">
            ${element.type === 'skeleton' ? this._renderSkeletonElement(column, rowIndex, columnIndex) : ''}
            ${element.type === 'item'
              ? html`<div class="item">${column.renderer(element.item, rowIndex, columnIndex)}</div>`
              : ''}
          </td>
        `;
      })}
    </tr>`;
  }

  /**
   * @param {CcTableColumnDefinition} column
   * @param {number} rowIndex
   * @param {number} columnIndex
   */
  _renderSkeletonElement(column, rowIndex, columnIndex) {
    if (column.skeleton != null) {
      return column.skeleton(rowIndex, columnIndex);
    }
    return html`<div class="skeleton">${fakeString(random(5, 10))}</div>`;
  }

  //-- private methods ------

  /**
   * @returns {Array<CcTableElement>}
   */
  _getElements() {
    if (this.skeleton === true) {
      return Array.from({ length: this.skeletonCount }, () => ({ type: 'skeleton' }));
    }

    return this.items?.map((item) => ({ type: 'item', item })) ?? [];
  }

  /**
   * @returns {StyleInfo}
   **/
  _getTableColumnsStyle() {
    /** @type {StyleInfo} */
    const styleInfo = {};

    if (this.columns.length > 0) {
      styleInfo['grid-template-columns'] = this.columns.map((column) => column.width ?? 'auto').join(' ');
    }

    return styleInfo;
  }

  //-- style ------

  static get styles() {
    return [
      accessibilityStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          display: grid;
          grid-template-rows:
            auto
            minmax(max-content, 1fr);
          height: 100%;
          background-color: var(--cc-color-bg-default, #fff);
        }

        table {
          display: grid;
          overflow: auto;
        }

        thead,
        tbody,
        tr {
          display: contents;
        }

        th,
        td {
          padding: 0.75em 1.5em;
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #ccc);
          display: flex;
          align-items: center;
          min-width: 0;
        }

        th {
          position: sticky;
          top: 0;
          background-color: var(--cc-color-bg-neutral-disabled, #ccc);
          font-weight: normal;
          z-index: 1;
        }

        .item {
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /*-------------*/

        th button {
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: black;
          cursor: pointer;
          padding: 0.25em;

          --cc-icon-size: 1.4em;
        }

        th button:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .skeleton {
          display: inline-block;
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }
      `,
    ];
  }
}

window.customElements.define('cc-table', CcTable);
