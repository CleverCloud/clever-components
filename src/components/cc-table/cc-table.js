import '@lit-labs/virtualizer';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  iconRemixExpandUpDownFill as iconSort,
  iconRemixArrowUpSFill as iconSortAsc,
  iconRemixArrowDownSFill as iconSortDesc,
} from '../../assets/cc-remix.icons.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { clampNumber } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-icon/cc-icon.js';
import { CcTableSortEvent } from './cc-table.events.js';

/**
 * @typedef {import('./cc-table.types.js').CcTableColumnWidthPolicy} CcTableColumnWidthPolicy
 * @typedef {import('./cc-table.types.js').CcTableColumnWidthPolicyFlex} CcTableColumnWidthPolicyFlex
 * @typedef {import('./cc-table.types.js').CcTableColumnWidthPolicyAuto} CcTableColumnWidthPolicyAuto
 * @typedef {import('./cc-table.types.js').CcTableColumnCells} CcTableColumnCells
 * @typedef {import('./cc-table.types.js').CcTableColumnCells<CcTableColumnWidthPolicyFlex>} CcTableFlexColumnCells
 * @typedef {import('./cc-table.types.js').CcTableColumnCells<CcTableColumnWidthPolicyAuto>} CcTableAutoColumnCells
 * @typedef {import('lit').TemplateResult<1> | import('lit').TemplateResult<2>} TemplateResult
 * @typedef {import('lit').PropertyValues<CcTable>} PropertyValues
 * @typedef {import('@lit-labs/virtualizer/events.js').VisibilityChangedEvent} VisibilityChangedEvent
 * @typedef {import('@lit-labs/virtualizer/LitVirtualizer.js').LitVirtualizer} Virtualizer
 * @typedef {import('lit/directives/style-map.js').StyleInfo} StyleInfo
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 * @typedef {import('lit/directives/ref.js').Ref<Virtualizer>} VirtualizerRef
 */

/** @type {number} offset around the visible range for that will be taken into account when computing the column width with the `auto` width policy` */
const AUTO_WIDTH_POLICY_VISIBLE_RANGE_OFFSET = 2;

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
      hideHeader: { type: Boolean, attribute: 'hide-header' },
      items: { type: Array },
      _columns: { type: Array, state: true },
      _internalItems: { type: Array, state: true },
      _internalSortState: { type: Object, state: true },
    };
  }

  /**
   * @typedef {import('./cc-table.types.js').CcTableColumnDefinition<T>} CcTableColumnDefinition
   */

  constructor() {
    super();

    /** @type {Array<CcTableColumnDefinition>} */
    this.columns = [];

    /** @type {boolean} */
    this.hideHeader = false;

    /** @type {Array<T>} */
    this.items = [];

    /** @type {HTMLElementRef} A reference to the table header container. */
    this._tableHeaderRef = createRef();

    /** @type {VirtualizerRef} A reference to the table body container. */
    this._tableBodyRef = createRef();

    /** @type {null|{first: number, last: number}} The visible range of the table body that will be used to compute the column width with the `auto` width policy.*/
    this._visibleRange = null;

    new ResizeController(this, { callback: () => this._updateColumnWidths(this._visibleRange) });
  }

  /**
   * @param {VisibilityChangedEvent} e
   */
  _onTableBodyVisibilityChanged(e) {
    const visibleRange = { first: e.first, last: e.last };
    const min = 0;
    const max = this.items.length - 1;
    this._visibleRange = {
      first: clampNumber(visibleRange.first - AUTO_WIDTH_POLICY_VISIBLE_RANGE_OFFSET, min, max),
      last: clampNumber(visibleRange.last + AUTO_WIDTH_POLICY_VISIBLE_RANGE_OFFSET, min, max),
    };
    this._updateColumnWidths(this._visibleRange);
  }

  /**
   * @param {number} columnIndex
   */
  _onSortButtonClick(columnIndex) {
    const currentDirection = this.columns[columnIndex].sort?.direction;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    this.dispatchEvent(new CcTableSortEvent({ columnIndex, direction: newDirection }));
  }

  /**
   * @param {PropertyValues} properties
   */
  updated(properties) {
    if (this.columns.length === 0) {
      return;
    }

    // add right padding to the header when in some browser the scroll bar takes place on the right side of the table body
    if (properties.has('hideHeader') || (properties.has('items') && !this.hideHeader && this.items.length > 0)) {
      this.updateComplete
        .then(() => this._tableBodyRef.value.layoutComplete)
        .then(() => {
          /** @type {HTMLElement} */
          const header = this._tableHeaderRef.value;
          const firstVisibleRow = this._tableBodyRef.value.querySelector('.row');
          if (firstVisibleRow != null) {
            const padding = header.clientWidth - firstVisibleRow.clientWidth;
            if (padding > 0) {
              header.style.paddingRight = `${padding}px`;
            } else {
              header.style.paddingRight = '0';
            }
          }
        });
    }

    // adjust column widths
    this._updateColumnWidths();
  }

  render() {
    if (this.columns.length === 0) {
      return html``;
    }

    const renderItem = this._renderRow.bind(this);
    return html`
      <div class="wrapper">
        ${this.items.length === 0 ? html`<slot name="empty">Empty !!</slot>` : ''}
        ${this.items.length > 0
          ? html`
              ${this.hideHeader ? '' : this._renderHeader()}
              <lit-virtualizer
                ${ref(this._tableBodyRef)}
                class="table-body"
                tabindex="0"
                scroller
                .items=${this.items}
                .renderItem=${renderItem}
                @visibilityChanged=${this._onTableBodyVisibilityChanged}
              ></lit-virtualizer>
            `
          : ''}
      </div>
    `;
  }

  _renderHeader() {
    return html`<div class="table-header row" ${ref(this._tableHeaderRef)}>
      ${this.columns.map((column, columnIndex) => {
        /** @type {StyleInfo} */
        const style = {};
        if (column.width?.type === 'fixed') {
          style.width = column.width.value;
          style.minWidth = column.width.value;
          style.maxWidth = column.width.value;
        } else if (column.width?.type === 'flex') {
          style.flex = column.width.value;
        }

        return html`<div class="cell" style=${styleMap(style)} data-col="${columnIndex}">
          <div>${column.header}</div>
          ${this._renderSortButton(column, columnIndex)}
        </div>`;
      })}
    </div>`;
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
   * @param {T} object
   * @param {number} rowIndex
   * @returns {TemplateResult}
   */
  _renderRow(object, rowIndex) {
    return html`<div class="row" data-row="${rowIndex}">
      ${this.columns.map((column, columnIndex) => {
        /** @type {StyleInfo} */
        const style = {};
        if (column.width?.type === 'fixed') {
          style.width = column.width.value;
          style.minWidth = column.width.value;
          style.maxWidth = column.width.value;
        }

        return html`
          <div class="cell" style=${styleMap(style)} data-col="${columnIndex}" data-row="${rowIndex}">
            ${column.renderer(object)}
          </div>
        `;
      })}
    </div>`;
  }

  //-- private methods ------

  /**
   * @param {number} columnIndex
   * @param {{first: number, last: number}} [range]
   * @returns {Array<HTMLElement>}
   */
  _getCells(columnIndex, range) {
    if (range == null) {
      return Array.from(this._tableBodyRef.value.querySelectorAll(`.cell[data-col="${columnIndex}"]`)).filter(
        (el) => el instanceof HTMLElement,
      );
    } else {
      /** @type {Array<HTMLElement>} */
      const elements = [];
      for (let rowIndex = range.first; rowIndex <= range.last; rowIndex++) {
        /** @type {HTMLElement} */
        const item = this._tableBodyRef.value.querySelector(`.cell[data-col="${columnIndex}"][data-row="${rowIndex}"]`);
        if (item != null) {
          elements.push(item);
        }
      }
      return elements;
    }
  }

  /**
   * @param {{first: number, last: number}} [range]
   */
  _updateColumnWidths(range) {
    if (this._tableBodyRef.value == null) {
      return;
    }

    const update = () => {
      // 1. Collect all columns and cells needing manual width handling
      // --------------------------------------------------------------
      /** @type {Array<CcTableColumnCells>} */
      const columns = this.columns
        .map((column, columnIndex) => {
          const widthPolicy = getWidthPolicy(column);
          // `fixed` width policy is already handled in the render phase: the width is set on each cell of the column.
          if (widthPolicy.type === 'fixed') {
            return null;
          }
          return { columnIndex, widthPolicy };
        })
        .filter((column) => column != null)
        .map((column) => {
          /** @type {Array<HTMLElement>} */
          let cells = this._getCells(column.columnIndex, range);
          if (!this.hideHeader) {
            cells.splice(0, 0, this._tableHeaderRef.value.querySelector(`.cell[data-col="${column.columnIndex}"]`));
          }

          return { ...column, cells };
        });

      // -- 2. Handle columns with `auto` width policies
      // -----------------------------------------------
      const autoWidthColumns = /** @type {Array<CcTableAutoColumnCells>} */ (
        columns.filter((column) => column.widthPolicy.type === 'auto')
      );
      // 2.1. compute the width: max of the cell width
      autoWidthColumns.forEach((column) => {
        const widths = column.cells.map((cell) => {
          cell.style.width = 'auto';
          return cell.clientWidth;
        });
        column.width = Math.max(...widths);
      });
      // 2.2. set computed width on cells
      autoWidthColumns.forEach((c) => {
        c.cells.forEach((cell) => {
          cell.style.width = `${c.width}px`;
        });
      });

      // -- 3. Handle columns with `flex` width policies
      // -----------------------------------------------
      const flexWidthColumns = /** @type {Array<CcTableFlexColumnCells>} */ (
        columns.filter((column) => column.widthPolicy.type === 'flex')
      );
      // 3.1. Handle special case when the header is hidden:
      //  - For every column with `flex` width, we set the flex value on the first cell
      //  - This first cell will be used to compute the real width at the next step
      if (this.hideHeader) {
        flexWidthColumns.forEach((column) => {
          const firstCell = column.cells[0];
          if (firstCell) {
            firstCell.style.flex = String(column.widthPolicy.value);
          }
        });
      }
      // 3.2. compute the width
      flexWidthColumns.forEach((column) => {
        const firstCell = column.cells[0];
        if (firstCell) {
          firstCell.style.width = 'auto';
          column.width = firstCell.clientWidth;
        }
      });
      // 3.3. set computed width on cells
      flexWidthColumns.forEach((column) => {
        // we need to roll back what we eventually did on step 3.1.
        if (this.hideHeader) {
          const firstCell = column.cells[0];
          if (firstCell) {
            firstCell.style.flex = 'none';
          }
        }
        column.cells.forEach((cell) => {
          cell.style.width = `${column.width}px`;
        });
      });
    };

    // we need to update the width at every step of the layout process
    update();
    this.updateComplete.then(() => {
      update();
      this._tableBodyRef.value.layoutComplete?.then(update);
    });

    // todo: we need to reset x-scroll position
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          display: block;
          overflow-x: auto;
        }

        .wrapper {
          display: grid;
          grid-auto-rows: auto 1fr;
          height: 100%;
        }

        .table-header {
          box-sizing: border-box;
          background-color: var(--cc-color-bg-neutral-disabled, #ccc);
        }

        .row {
          background-color: var(--cc-color-bg-default, #fff);
          width: 100%;
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #ccc);
        }

        .cell {
          display: flex;
          box-sizing: border-box;
          padding: 0.5em;
          white-space: nowrap;
        }

        .table-header .cell {
          display: flex;
          align-items: center;
          background-color: var(--cc-color-bg-neutral-disabled, #ccc);
          gap: 0.25em;
        }

        .table-body .cell {
          overflow: hidden;
        }

        .table-header button {
          background: none;
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: black;
          cursor: pointer;
          padding: 0.25em;

          --cc-icon-size: 1.4em;
        }

        .table-header button:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `,
    ];
  }
}

window.customElements.define('cc-table', CcTable);

/**
 * @param {import('./cc-table.types.js').CcTableColumnDefinition<any>} column
 * @returns {CcTableColumnWidthPolicy}
 */
function getWidthPolicy(column) {
  if (column.width == null) {
    return { type: 'auto' };
  }
  return column.width;
}
