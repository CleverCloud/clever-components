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
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { ResizeController } from '../../controllers/resize-controller.js';
import { clampNumber } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-icon/cc-icon.js';
import { CcFocusRestorationFailEvent } from '../common.events.js';
import { CcGridSortEvent } from './cc-grid.events.js';

/**
 * @import { CcGridColumnDefinition } from './cc-grid.types.js'
 * @import { GenericEventWithTarget } from '../../lib/events.types.js'
 * @import { TemplateResult, PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
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
 *
 * @cssdisplay block
 * @template [T=unknown]
 */
export class CcGrid extends LitElement {
  static get properties() {
    return {
      a11yName: { type: String, attribute: 'a11y-name' },
      columns: { type: Array },
      disabled: { type: Boolean, reflect: true },
      items: { type: Array },
      skeleton: { type: Boolean, reflect: true },
      _cursor: { type: Object, state: true },
      _hiddenColumns: { type: Array, state: true },
      _isHeaderSortable: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string} The grid name which is mandatory for accessibility purpose.*/
    this.a11yName = null;

    /** @type {Array<CcGridColumnDefinition<T>>} The grid columns. */
    this.columns = [];

    /** @type {boolean} Whether the grid is disabled. When `true`, buttons and links in cells are disabled. Sort buttons are also disabled. */
    this.disabled = false;

    /** @type {Array<T>} The items to represent into the grid. */
    this.items = [];

    /** @type {boolean} Whether the grid is in skeleton state. When `true`, cells are rendered with skeleton loading states. */
    this.skeleton = false;

    /**
     * @type {{row: number, col: number}} The focus cursor position in the grid.
     *
     * It corresponds to `<th>` and `<td>` elements with `data-row` and `data-col` attributes.
     * The header row is indexed as `-1` when focusable (i.e., when there is at least one sortable column).
     */
    this._cursor = { row: 0, col: 0 };

    /** @type {Array<number>} The volatile columns that have been hidden to make the table fit without overflowing.*/
    this._hiddenColumns = [];

    /** @type {Ref<HTMLTableElement>} */
    this._tableRef = createRef();

    new ResizeController(this, { callback: this._refreshColumnsVisibility.bind(this) });

    new LostFocusController(this, '[data-focusable="true"]', () => {
      this.focus();
    });
  }

  //#region Public methods

  /**
   * @param {FocusOptions} [options]
   */
  focus(options) {
    const clampedCursor = this._clampCursor();
    if (clampedCursor != null) {
      this._cursor = clampedCursor;
      this._setFocusAtCursor(options);
    } else {
      this.dispatchEvent(new CcFocusRestorationFailEvent(null));
    }
  }

  /**
   * @param {FocusOptions} [options]
   */
  focusFirstCell(options) {
    if (this.columns.length === 0) {
      return;
    }
    if (this.items.length === 0) {
      if (this._getFirstRowIndex() === -1) {
        this._cursor = { row: -1, col: 0 };
      } else {
        return;
      }
    } else {
      this._cursor = { row: 0, col: 0 };
    }
    this.focus(options);
  }

  /**
   * @param {T} item
   */
  scrollToItem(item) {
    const index = this.items.findIndex((it) => it === item);
    if (index !== -1) {
      this.scrollToIndex(index);
    }
  }

  /**
   * @param {number} index
   */
  scrollToIndex(index) {
    const idx = clampNumber(index, 0, this.items.length - 1);
    this._tableRef.value.querySelector(`[data-row="${idx}"]`).scrollIntoView({ block: 'center' });
  }

  //#endregion

  //#region Private methods

  _refreshColumnsVisibility() {
    const table = this._tableRef.value;
    const doesTableOverflow = () => table.clientWidth < table.scrollWidth;

    // reset hidden columns
    table.querySelectorAll(`th.hidden, td.hidden`).forEach((cell) => {
      cell.classList.remove('hidden');
    });
    table.style.gridTemplateColumns = this._getGridTemplateStyle([]);

    // iterate over volatile columns by descending order and hide them until the table fits
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
  }

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
    let nextRow = clampNumber(this._cursor.row + verticalOffset, this._getFirstRowIndex(), this.items.length - 1);

    return { row: nextRow, col: nextCol };
  }

  /**
   * @returns {HTMLElement|null}
   */
  _getElementAtCursor() {
    return this.shadowRoot.querySelector(
      [
        `[data-row="${this._cursor.row}"][data-col="${this._cursor.col}"][data-focusable="true"]`,
        `[data-row="${this._cursor.row}"][data-col="${this._cursor.col}"] [data-focusable="true"]`,
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

  /**
   * @param {FocusOptions} [options]
   */
  _setFocusAtCursor(options) {
    this._getElementAtCursor()?.focus(options);

    // scroll policy with a sticky header is tricky:
    // The focused element can be partially under the sticky header, in which case we need to adjust the scroll position to make it visible.

    // If we are very near the top of the table, let's scroll to the top
    if (this._cursor.row <= this._getFirstRowIndex() + 1) {
      this._tableRef.value.scrollTop = 0;
    }
    // otherwise, let's scroll to make the row where the focus stands to be fully visible
    else {
      const row = this._tableRef.value?.querySelector(`td[data-row="${this._cursor.row}"][data-col="0"]`);
      const header = this._tableRef.value?.querySelector(`th[data-col="0"]`);
      const rowTop = row.getBoundingClientRect().top;
      const headerBottom = header.getBoundingClientRect().bottom;
      if (rowTop < headerBottom) {
        this._tableRef.value.scrollTop -= headerBottom - rowTop;
      }
    }
  }

  _clampCursor() {
    const clampedCursor = {
      col: clampNumber(this._cursor.col, 0, this.columns.length - 1),
      row: clampNumber(this._cursor.row, this._getFirstRowIndex(), this.items.length - 1),
    };

    if (clampedCursor.col < 0 || clampedCursor.row < this._getFirstRowIndex()) {
      return null;
    }
    return clampedCursor;
  }

  _getFirstRowIndex() {
    return this._isHeaderSortable ? -1 : 0;
  }

  /**
   * @param {CcGridColumnDefinition<T>} column
   * @returns {string|null}
   */
  _getAriaSort(column) {
    if (column.sort == null) {
      return null;
    }
    switch (column.sort) {
      case 'asc':
        return 'ascending';
      case 'desc':
        return 'descending';
      case 'none':
        return 'none';
    }
  }

  //#endregion

  //#region Event handlers

  /**
   * @param {number} columnIndex
   */
  _onSortButtonClick(columnIndex) {
    if (this.disabled) {
      return;
    }
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
   * @param {GenericEventWithTarget<MouseEvent, HTMLElement>} event
   */
  _onTableClick(event) {
    if (!(event.target instanceof HTMLTableCellElement)) {
      return;
    }

    // in case the click makes a text selection, we don't want to lose this selection, so we don't force focus on the cell
    if (document.getSelection().toString() !== '') {
      return;
    }

    const row = Number(event.target.dataset.row);
    const col = Number(event.target.dataset.col);
    this._cursor = { row, col };
    this._getElementAtCursor()?.focus();
  }

  /**
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @param {() => void} cellClickHandler
   */
  _onCellClick(rowIndex, columnIndex, cellClickHandler) {
    this._cursor = { row: rowIndex, col: columnIndex };
    cellClickHandler();
  }

  //#endregion

  //#region Lit lifecycle methods

  /**
   * @param {PropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('items') || changedProperties.has('columns')) {
      this._isHeaderSortable = this.columns.some((column) => column.sort != null);
    }

    // move the cursor to the right place if necessary
    let newCursor;
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

  firstUpdated() {
    this._cursor = { row: this._getFirstRowIndex(), col: 0 };
  }

  //#endregion

  //#region Rendering methods

  render() {
    return html`<table
      ${ref(this._tableRef)}
      role="grid"
      style=${styleMap({ 'grid-template-columns': this._getGridTemplateStyle(this._hiddenColumns) })}
      @keydown=${this._onTableKeydown}
      @click=${this._onTableClick}
    >
      <caption class="visually-hidden">
        ${this.a11yName}
      </caption>
      <thead>
        ${this._renderHeader()}
      </thead>
      <tbody>
        ${this.items.map((item, index) => this._renderRow(item, index))}
      </tbody>
    </table>`;
  }

  /**
   * @returns {TemplateResult}
   */
  _renderHeader() {
    return html`<tr>
      ${this.columns.map((column, columnIndex) => {
        const hasFocus = this._isHeaderSortable && this._cursor.row === -1 && this._cursor.col === columnIndex;
        const renderedItem = {
          focusable: column.sort != null,
          template: html`
            <div>${column.header}</div>
            ${this._renderHeaderCell(column, columnIndex, hasFocus)}
          `,
        };

        const isHidden = this._hiddenColumns.includes(columnIndex);

        return html`<th
          class="${classMap({ hidden: isHidden })}"
          data-col="${columnIndex}"
          data-row=${ifDefined(this._isHeaderSortable ? '-1' : null)}
          tabindex=${hasFocus && !renderedItem.focusable ? '0' : '-1'}
          data-focusable=${!this._isHeaderSortable || renderedItem.focusable ? 'false' : 'true'}
          aria-sort=${ifDefined(this._getAriaSort(column))}
        >
          ${this._renderHeaderCell(column, columnIndex, hasFocus)}
        </th>`;
      })}
    </tr>`;
  }

  /**
   * @param {CcGridColumnDefinition<T>} column
   * @param {number} columnIndex
   * @param {boolean} hasFocus
   * @returns {TemplateResult}
   */
  _renderHeaderCell(column, columnIndex, hasFocus) {
    if (column.sort == null) {
      return html`<div>${column.header}</div>`;
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
        class="sort"
        tabindex=${hasFocus ? '0' : '-1'}
        data-focusable="true"
        aria-disabled=${this.disabled || this.skeleton}
        @click=${() => this._onSortButtonClick(columnIndex)}
      >
        ${column.header}
        <cc-icon .icon=${icon}></cc-icon>
      </button>
    `;
  }

  /**
   * @param {T} item
   * @param {number} rowIndex
   * @returns {TemplateResult}
   */
  _renderRow(item, rowIndex) {
    return html`<tr>
      ${this.columns.map((column, columnIndex) => {
        const hasFocus = this._cursor.row === rowIndex && this._cursor.col === columnIndex;
        const renderedItem = this._prepareCellRender(column, item, rowIndex, columnIndex, hasFocus);

        const isHidden = this._hiddenColumns.includes(columnIndex);

        return html`
          <td
            class=${classMap({ 'align-end': column.align === 'end', hidden: isHidden })}
            tabindex=${hasFocus && !renderedItem.focusable ? '0' : '-1'}
            data-focusable=${renderedItem.focusable ? 'false' : 'true'}
            data-col=${columnIndex}
            data-row=${rowIndex}
          >
            ${renderedItem.template}
          </td>
        `;
      })}
    </tr>`;
  }

  /**
   * @param {CcGridColumnDefinition<T>} column
   * @param {T} item
   * @param {number} rowIndex
   * @param {number} columnIndex
   * @param {boolean} hasFocus
   * @returns {{focusable: boolean, template: TemplateResult}}
   */
  _prepareCellRender(column, item, rowIndex, columnIndex, hasFocus) {
    const cell = column.cellAt(item, rowIndex, columnIndex);
    if (cell == null) {
      return { focusable: false, template: html`` };
    }

    const skeleton = this.skeleton || cell.skeleton === true;

    if (cell.type === 'text') {
      return {
        focusable: cell.enableCopyToClipboard && !skeleton,
        template: html`<div class="icon-label">
          ${cell.icon != null ? html`<cc-icon .icon=${cell.icon} ?skeleton=${skeleton}></cc-icon>` : ''}
          <span class=${classMap({ skeleton })}>${cell.value}</span>
          ${cell.enableCopyToClipboard
            ? html`<cc-clipboard
                tabindex=${hasFocus ? '0' : '-1'}
                data-focusable=${skeleton ? 'false' : 'true'}
                ?skeleton=${skeleton}
                value=${cell.value}
              ></cc-clipboard>`
            : ''}
        </div>`,
      };
    }

    if (cell.type === 'link') {
      return {
        focusable: !skeleton,
        template: html`<div class="icon-label">
          ${cell.icon != null ? html`<cc-icon .icon=${cell.icon} ?skeleton=${skeleton}></cc-icon>` : ''}
          <cc-button
            tabindex=${hasFocus ? '0' : '-1'}
            data-focusable=${skeleton ? 'false' : 'true'}
            link
            ?skeleton=${skeleton}
            ?disabled=${this.disabled}
            @cc-click=${() => this._onCellClick(rowIndex, columnIndex, cell.onClick)}
            >${cell.value}</cc-button
          >
          ${cell.enableCopyToClipboard
            ? html`<cc-clipboard
                tabindex=${hasFocus ? '0' : '-1'}
                data-focusable=${skeleton ? 'false' : 'true'}
                ?skeleton=${skeleton}
                value=${cell.value}
              ></cc-clipboard>`
            : ''}
        </div>`,
      };
    }

    if (cell.type === 'button') {
      return {
        focusable: !skeleton,
        template: html`<cc-button
          tabindex=${hasFocus ? '0' : '-1'}
          data-focusable=${skeleton ? 'false' : 'true'}
          .icon=${cell.icon}
          ?skeleton=${skeleton}
          ?waiting=${cell.waiting}
          ?disabled=${this.disabled && !cell.waiting}
          hide-text
          @cc-click=${() => this._onCellClick(rowIndex, columnIndex, cell.onClick)}
          >${cell.value}</cc-button
        >`,
      };
    }

    return { focusable: false, template: html`` };
  }

  //#endregion

  static get styles() {
    return [
      accessibilityStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;

          --header-height: 3em;
        }

        table {
          align-content: start;
          background-color: var(--cc-color-bg-default, #fff);
          display: grid;
          height: 100%;
          overflow: auto;
        }

        thead,
        tbody,
        tr {
          display: contents;
        }

        th,
        td {
          align-items: center;
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #ccc);
          display: flex;
          min-width: 0;
          padding: 0.75em 1.5em;
        }

        th {
          background-color: var(--cc-color-bg-neutral-disabled, #ccc);
          display: flex;
          font-weight: normal;
          gap: 0.5em;
          padding-bottom: 1em;
          padding-top: 1em;
          position: sticky;
          top: 0;
          white-space: nowrap;
          z-index: 1;
        }

        th > * {
          align-items: center;
          display: flex;
          height: 1.5em;
        }

        td.align-end {
          justify-content: end;
        }

        th.hidden,
        td.hidden {
          display: none;
        }

        td:focus[data-focusable='true'],
        th:focus[data-focusable='true'] {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: -2px;
        }

        .icon-label {
          align-items: center;
          display: flex;
          gap: 0.5em;
          min-width: 0;
        }

        .icon-label cc-icon {
          width: 1em;
        }

        .icon-label span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        button.sort {
          align-items: center;
          background: unset;
          border: none;
          border-radius: var(--cc-border-radius-default, 0.25em);
          cursor: pointer;
          display: flex;
          font-family: inherit;
          font-size: unset;
          gap: 0.5em;
          margin: 0;
          padding: 0;
        }

        button.sort:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        button.sort[aria-disabled='true'] {
          color: unset;
        }

        button.sort[aria-disabled='true'] cc-icon {
          opacity: var(--cc-opacity-when-disabled);
        }

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
          display: inline-block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-grid', CcGrid);
