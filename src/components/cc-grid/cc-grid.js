import '@lit-labs/virtualizer';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import { CcGridSortEvent } from './cc-grid.events.js';

/**
 * @typedef {import('./cc-grid.types.d.ts').CcGridCell} CcGridCell
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<MouseEvent, HTMLElement>} HTMLElementMouseEvent
 * @typedef {import('lit').HTMLTemplateResult} HTMLTemplateResult
 * @typedef {import('lit').PropertyValues<CcGrid>} PropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLTableElement>} HTMLTableElementRef
 */

/**
 * A data grid component that displays items in a table with column headers, sorting capabilities, and keyboard navigation.
 *
 * The grid supports responsive column hiding (volatile columns), sortable columns, and full keyboard navigation using arrow keys.
 * It implements the ARIA grid role for accessibility and provides skeleton loading states.
 *
 * ## Features
 *
 * - **Column definitions**: Define columns with custom headers, widths, alignments, and cell renderers
 * - **Sorting**: Sortable columns with ascending/descending indicators
 * - **Responsive**: Automatically hides volatile columns when space is limited
 * - **Keyboard navigation**: Navigate cells using arrow keys, Home, and End keys
 * - **Cell types**: Supports text, link, and button cells with icons
 * - **Skeleton state**: Shows loading skeletons while data is being fetched
 * - **Empty state**: Customizable empty state via the `empty` slot
 *
 * @cssdisplay block
 * @slot empty - Custom content to display when the grid has no items
 * @template [T=unknown]
 */
export class CcGrid extends LitElement {
  static get properties() {
    return {
      columns: { type: Array },
      disabled: { type: Boolean, reflect: true },
      items: { type: Array },
      skeleton: { type: Boolean, reflect: true },
      _cursor: { type: Object, state: true },
      _hiddenColumns: { type: Array, state: true },
      _isHeaderSortable: { type: Boolean, state: true },
    };
  }

  /**
   * @typedef {import('./cc-grid.types.d.ts').CcGridColumnDefinition<T>} CcGridColumnDefinition
   */

  constructor() {
    super();

    /** @type {Array<CcGridColumnDefinition>} */
    this.columns = [];

    /** @type {boolean} */
    this.disabled = false;

    /** @type {Array<T>} */
    this.items = [];

    /** @type {boolean} */
    this.skeleton = false;

    /** @type {{col: number, row: number}} */
    this._cursor = { col: 0, row: 0 };

    /** @type {Array<number>} */
    this._hiddenColumns = [];

    /** @type {HTMLTableElementRef} */
    this._tableRef = createRef();

    new ResizeController(this, {
      callback: () => {
        const table = this._tableRef.value;
        const doesTableOverflow = () => table.clientWidth < table.scrollWidth;

        // reset hidden columns
        table.querySelectorAll(`th.hidden, td.hidden`).forEach((cell) => {
          cell.classList.remove('hidden');
        });
        table.style.gridTemplateColumns = this._getGridTemplateStyle([]);

        // iterate over volatile columns by descending order and hide those that don't fit
        /** @type {Array<number>} */
        const hiddenColumns = [];
        for (let i = this.columns.length - 1; i >= 0; i--) {
          const column = this.columns[i];
          if (column.volatile !== true) {
            continue;
          }
          if (hiddenColumns.length >= this.columns.length - 1) {
            break;
          }
          if (!doesTableOverflow()) {
            break;
          }

          // hide column
          hiddenColumns.push(i);
          table.querySelectorAll(`th[data-col="${i}"], td[data-col="${i}"]`).forEach((cell) => {
            cell.classList.add('hidden');
          });
          table.style.gridTemplateColumns = this._getGridTemplateStyle(hiddenColumns);
        }

        this._hiddenColumns = hiddenColumns;

        // adjust focus if necessary
        if (this._hiddenColumns.includes(this._cursor.col)) {
          this._moveFocus(-1, 0);
        }
      },
    });
  }

  /**
   * @param {number} columnIndex
   */
  _onSortButtonClick(columnIndex) {
    const currentDirection = this.columns[columnIndex].sort;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    this.dispatchEvent(new CcGridSortEvent({ columnIndex, direction: newDirection }));
  }

  /**
   * @param {KeyboardEvent} event
   */
  _onTableKeydown(event) {
    if (event.key === 'ArrowUp') {
      return this._moveFocus(0, -1, event);
    }
    if (event.key === 'ArrowDown') {
      return this._moveFocus(0, 1, event);
    }
    if (event.key === 'ArrowLeft') {
      return this._moveFocus(-1, 0, event);
    }
    if (event.key === 'ArrowRight') {
      return this._moveFocus(1, 0, event);
    }
    if (event.key === 'Home') {
      if (event.ctrlKey || event.metaKey) {
        return this._moveFocus(-Infinity, -Infinity, event);
      }
      return this._moveFocus(-Infinity, 0, event);
    }
    if (event.key === 'End') {
      if (event.ctrlKey || event.metaKey) {
        return this._moveFocus(Infinity, Infinity, event);
      }
      return this._moveFocus(Infinity, 0, event);
    }
  }

  /**
   * @param {HTMLElementMouseEvent} event
   */
  _onTableClick(event) {
    const cell = /** @type {HTMLTableCellElement} */ (event.target.closest('th,td'));
    if (cell == null) {
      return;
    }
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    this._cursor = { row, col };
    this._getElementAtCursor()?.focus();
  }

  /**
   * @param {PropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('items') || changedProperties.has('columns')) {
      this._isHeaderSortable = this.columns.some((column) => column.sort != null);
    }

    // move the cursor to the right place if necessary
    let newCursor;
    if (changedProperties.has('items')) {
      newCursor = { col: 0, row: 0 };
    }
    if (changedProperties.has('columns')) {
      if (this._cursor.col >= this.columns.length) {
        newCursor = { col: 0, row: this._cursor.row };
      }
    }
    if (newCursor != null) {
      this._cursor = newCursor;
      if (this._tableRef.value?.querySelector(':focus') != null) {
        this._setFocusAtCursor();
      }
    }
  }

  render() {
    if (this.columns.length === 0) {
      return html``;
    }

    return html`<div class="wrapper">
      ${this.items.length === 0 ? html`<slot name="empty">Empty !!<!-- todo: i18n --></slot>` : ''}
      ${this.items.length > 0 ? this._renderGrid() : ''}
    </div>`;
  }

  _renderGrid() {
    return html`
      <table
        ${ref(this._tableRef)}
        role="grid"
        style=${styleMap({ 'grid-template-columns': this._getGridTemplateStyle(this._hiddenColumns) })}
        aria-colcount=${this.columns.length}
        @keydown=${this._onTableKeydown}
        @click=${this._onTableClick}
      >
        <thead>
          ${this._renderHeader()}
        </thead>
        <tbody>
          ${this.items.map((item, index) => this._renderRow(item, index))}
        </tbody>
      </table>
      <div><!-- spacer to make the above <table> shrink properly --></div>
    `;
  }

  /**
   * @returns {HTMLTemplateResult}
   */
  _renderHeader() {
    return html`<tr>
      ${this.columns.map((column, columnIndex) => {
        const hasFocus = this._isHeaderSortable && this._cursor.row === 0 && this._cursor.col === columnIndex;
        const renderedItem = {
          focusable: column.sort != null,
          template: html`
            <div>${column.header}</div>
            ${this._renderSortButton(column, columnIndex, hasFocus)}
          `,
        };

        let ariaSort;
        if (column.sort === 'asc') {
          ariaSort = 'ascending';
        } else if (column.sort === 'desc') {
          ariaSort = 'descending';
        } else if (column.sort === 'none') {
          ariaSort = 'none';
        }

        return html`<th
          data-col="${columnIndex}"
          data-row=${ifDefined(this._isHeaderSortable ? '0' : null)}
          tabindex=${hasFocus && !renderedItem.focusable ? '0' : '-1'}
          data-focusable=${!this._isHeaderSortable || renderedItem.focusable ? 'false' : 'true'}
          aria-colindex="${columnIndex + 1}"
          aria-sort=${ifDefined(ariaSort)}
        >
          <div>${column.header}</div>
          ${this._renderSortButton(column, columnIndex, hasFocus)}
        </th>`;
      })}
    </tr>`;
  }

  /**
   * @param {CcGridColumnDefinition} column
   * @param {number} columnIndex
   * @param {boolean} hasFocus
   * @returns {HTMLTemplateResult}
   */
  _renderSortButton(column, columnIndex, hasFocus) {
    if (column.sort == null) {
      return html``;
    }

    const direction = column.sort;
    let icon = iconSort;
    if (direction === 'asc') {
      icon = iconSortAsc;
    } else if (direction === 'desc') {
      icon = iconSortDesc;
    }

    return html`
      <button
        tabindex=${hasFocus ? '0' : '-1'}
        data-focusable="true"
        ?disabled=${this.disabled}
        @click=${() => this._onSortButtonClick(columnIndex)}
      >
        <span class="visually-hidden">Sort<!-- todo: i18n--></span>
        <cc-icon .icon=${icon}></cc-icon>
      </button>
    `;
  }

  /**
   * @param {T} item
   * @param {number} rowIndex
   * @returns {HTMLTemplateResult}
   */
  _renderRow(item, rowIndex) {
    const rowOffset = this._isHeaderSortable ? 1 : 0;
    return html`<tr>
      ${this.columns.map((column, columnIndex) => {
        const hasFocus =
          this._cursor.row === rowIndex + (this._isHeaderSortable ? 1 : 0) && this._cursor.col === columnIndex;
        const renderedItem = this._prepareCellRender(column.cellAt(item, rowIndex, columnIndex), hasFocus);

        return html`
          <td
            class=${classMap({ 'align-end': column.align === 'end' })}
            tabindex=${hasFocus && !renderedItem.focusable ? '0' : '-1'}
            data-focusable=${renderedItem.focusable ? 'false' : 'true'}
            data-col="${columnIndex}"
            data-row="${rowIndex + rowOffset}"
            aria-colindex="${columnIndex + 1}"
          >
            ${renderedItem.template}
          </td>
        `;
      })}
    </tr>`;
  }

  /**
   * @param {CcGridCell} cell
   * @param {boolean} hasFocus
   * @returns {{focusable: boolean, template: HTMLTemplateResult}}
   */
  _prepareCellRender(cell, hasFocus) {
    if (cell == null) {
      return { focusable: false, template: html`` };
    }

    const skeleton = this.skeleton || cell.skeleton;

    if (cell.type === 'text') {
      return {
        focusable: false,
        template: html`<div class="icon-label">
          ${cell.icon != null ? html`<cc-icon .icon=${cell.icon} ?skeleton=${skeleton}></cc-icon>` : ''}
          <span class=${classMap({ skeleton })}>${cell.value}</span>
        </div>`,
      };
    }

    if (cell.type === 'link') {
      return {
        focusable: true,
        template: html`<cc-button
          tabindex=${hasFocus ? '0' : '-1'}
          data-focusable="true"
          link
          .icon=${cell.icon}
          ?skeleton=${skeleton}
          ?disabled=${this.disabled}
          @cc-click=${cell.onClick}
          >${cell.value}</cc-button
        >`,
      };
    }

    if (cell.type === 'button') {
      return {
        focusable: true,
        template: html`<cc-button
          tabindex=${hasFocus ? '0' : '-1'}
          data-focusable="true"
          .icon=${cell.icon}
          ?skeleton=${skeleton}
          ?waiting=${cell.waiting}
          ?disabled=${this.disabled && !cell.waiting}
          hide-text
          @cc-click=${cell.onClick}
          >${cell.value}</cc-button
        >`,
      };
    }

    return { focusable: false, template: html`` };
  }

  //-- private methods ------

  /**
   * @param {Array<number>} hiddenColumns
   * @returns {string}
   */
  _getGridTemplateStyle(hiddenColumns) {
    return this.columns
      .filter((_, index) => !hiddenColumns.includes(index))
      .map((column) => column.width ?? 'auto')
      .join(' ');
  }

  /**
   * @param {number} horizontalOffset
   * @param {number} verticalOffset
   * @returns {{col: number, row: number}}
   */
  _getNextVisibleCursor(horizontalOffset, verticalOffset) {
    // horizontal movement
    const direction = horizontalOffset < 0 ? -1 : 1;
    const maxMoves = Math.abs(horizontalOffset);
    let moves = 0;
    let nextCol = this._cursor.col;

    while (moves < maxMoves) {
      const candidate = nextCol + direction;
      // we've reached the bounds
      if (candidate < 0 || candidate >= this.columns.length) {
        break;
      }
      nextCol = candidate;
      if (!this._hiddenColumns.includes(nextCol)) {
        moves++;
      }
    }

    // vertical movement
    let nextRow = clampNumber(
      this._cursor.row + verticalOffset,
      0,
      this.items.length - 1 + (this._isHeaderSortable ? 1 : 0),
    );

    return { col: nextCol, row: nextRow };
  }

  /**
   * @returns {HTMLElement|null}
   */
  _getElementAtCursor() {
    return this.shadowRoot.querySelector(
      [
        `[data-row="${this._cursor.row}"][data-col="${this._cursor.col}"][data-focusable="true"]`,
        `[data-row="${this._cursor.row}"][data-col="${this._cursor.col}"] > [data-focusable="true"]`,
      ].join(','),
    );
  }

  /**
   * @param {number} horizontalOffset
   * @param {number} verticalOffset
   * @param {Event} [eventToPreventDefault]
   */
  _moveFocus(horizontalOffset, verticalOffset, eventToPreventDefault) {
    eventToPreventDefault?.preventDefault();
    this._cursor = this._getNextVisibleCursor(horizontalOffset, verticalOffset);
    this._setFocusAtCursor();
  }

  _setFocusAtCursor() {
    this._getElementAtCursor()?.focus();
    // force scroll to top if we're at the top of the grid because in some situation, the scroll position will make the
    // first row fully or partially behind the header while a cell in this first row is focused.
    if (this._cursor.row <= (this._isHeaderSortable ? 1 : 0) && this._tableRef.value != null) {
      this._tableRef.value.scrollTop = 0;
    }
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
          white-space: nowrap;
        }

        td.align-end {
          justify-content: end;
        }

        th.hidden,
        td.hidden {
          display: none;
        }

        :focus[data-focusable='true'] {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: -2px;
        }

        .icon-label {
          display: flex;
          min-width: 0;
          gap: 0.5em;
        }

        .icon-label cc-icon {
          min-width: 1em;
        }

        .icon-label span {
          overflow: hidden;
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

window.customElements.define('cc-grid', CcGrid);
