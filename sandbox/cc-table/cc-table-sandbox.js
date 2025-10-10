import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixAddFill as addIcon, iconRemixDeleteBin_2Fill as clearIcon } from '../../src/assets/cc-remix.icons.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-select/cc-select.js';
import '../../src/components/cc-table/cc-table.js';
import '../../src/components/cc-toggle/cc-toggle.js';
import { random, randomString } from '../../src/lib/utils.js';
import { sandboxStyles } from '../sandbox-styles.js';

/**
 * @typedef {Array<string>} Item
 *
 * @typedef {import('../../src/components/cc-table/cc-table.js').CcTable<Item>} CcTable
 * @typedef {import('../../src/components/cc-table/cc-table.types.js').CcTableColumnDefinition<Item>} CcTableColumnDefinition
 * @typedef {import('../../src/components/cc-table/cc-table.types.js').CcTableColumnWidthPolicy} CcTableColumnWidthPolicy
 * @typedef {import('../../src/components/cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('../../src/components/cc-input-number/cc-input-number.js').CcInputNumber} CcInputNumber
 * @typedef {import('lit/directives/ref.js').Ref<CcTable>} CcTableRef
 * @typedef {import('lit').PropertyValues<CcTableSandbox>} PropertyValues
 */

class CcTableSandbox extends LitElement {
  static get properties() {
    return {
      _columns: { type: Array, state: true },
      _hideHeader: { type: Boolean, state: true },
      _items: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {Array<CcTableColumnDefinition>} */
    this._columns = [
      {
        header: 'Column 1',
        renderer: (row) => row[0],
        width: { type: 'flex', value: 1 },
      },
      {
        header: 'Column 2',
        renderer: (row) => row[1],
        width: { type: 'auto' },
      },
      {
        header: 'Column 3',
        renderer: (row) => row[2],
        width: { type: 'auto' },
      },
    ];

    /** @type {boolean} */
    this._hideHeader = false;

    /** @type {Array<Item>} */
    this._items = this._generateItems(10);

    /** @type {CcTableRef} */
    this._tableRef = createRef();
  }

  _clearItems() {
    this._items = [];
  }

  _generateCell() {
    return randomString(random(8, 20));
  }

  /**
   * @param {number} count
   * @returns {Array<Item>}
   * @private
   */
  _generateItems(count) {
    return Array.from({ length: count }, () => this._generateItem());
  }

  /**
   * @returns {Item}
   */
  _generateItem() {
    return Array.from({ length: this._columns.length }, () => this._generateCell());
  }

  _onColumnAdd() {
    const colIndex = this._columns.length;
    this._columns.push({
      header: `Column ${colIndex + 1}`,
      renderer: (row) => row[colIndex],
      width: { type: 'auto' },
    });
    this._items = this._items.map((item) => item.concat(this._generateCell()));
  }

  _onHideHeaderSwitched() {
    this._hideHeader = !this._hideHeader;
  }

  _onAddItemClick() {
    /** @type {CcInputText} */
    const e = this.shadowRoot.querySelector('.ctrl-top .row');
    const value = e.value;

    if (value.trim() === '') {
      this._items = [...this._items, this._generateItem()];
      return;
    }

    let row = value.split(',').map((d) => d.trim());

    if (row.length < this._columns.length) {
      row = row.concat(Array.from({ length: this._columns.length - row.length }, () => this._generateCell()));
    } else if (row.length > this._columns.length) {
      row = row.slice(0, this._columns.length);
    }
    this._items = [...this._items, row];
  }

  _onAddItemsClick() {
    /** @type {CcInputNumber} */
    const e = this.shadowRoot.querySelector('.ctrl-top .row-count');
    const count = e == null || isNaN(e.value) ? 1 : e.value;
    this._items = [...this._items, ...this._generateItems(count)];
  }

  _onClearItemsClick() {
    this._clearItems();
  }

  render() {
    return html`
      <div class="ctrl-top">
        <cc-input-number
          class="row-count"
          inline
          label="Number of rows"
          value="10"
          style="width: 11em;"
        ></cc-input-number>
        <cc-button @cc-click=${this._onAddItemsClick} primary outlined .icon=${addIcon}>Add rows</cc-button>
        <div style="width: 2em;"></div>
        <cc-input-text class="row" value="" inline label="Row" style="flex: 1"></cc-input-text>
        <cc-button @cc-click=${this._onAddItemClick} primary outlined .icon=${addIcon}>Add one row </cc-button>
        <div style="width: 2em;"></div>
        <cc-button @cc-click=${this._onClearItemsClick} danger outlined .icon=${clearIcon}>Clear </cc-button>
      </div>

      <div class="main">
        <cc-table
          id="cc-table"
          ?hide-header=${this._hideHeader}
          .columns=${this._columns}
          .items=${this._items}
          ${ref(this._tableRef)}
        ></cc-table>
      </div>

      <div class="ctrl-right">
        <label for="hideHeader">
          <input id="hideHeader" type="checkbox" @change=${this._onHideHeaderSwitched} .checked=${this._hideHeader} />
          Hide header
        </label>

        <cc-button @cc-click=${this._onColumnAdd} ?primary=${true} ?outlined=${true}>Add column</cc-button>

        <div class="columns">${this._columns.map((col, i) => this._renderColumn(col, i))}</div>
      </div>
    `;
  }

  /**
   *
   * @param {CcTableColumnDefinition} column
   * @param {number} colIndex
   */
  _renderColumn(column, colIndex) {
    /** @param {CcInputEvent} e */
    const onColumnNameChanged = (e) => {
      this._columns = this._columns.map((column, i) => {
        if (i === colIndex) {
          return { ...column, header: e.detail };
        }
        return column;
      });
    };

    const onRemoveClicked = () => {
      this._columns = this._columns
        .filter((_, i) => i !== colIndex)
        .map((column, i) => ({ ...column, renderer: (row) => row[i] }));
      this._items = this._items.map((item) => item.filter((_, i) => i !== colIndex));
    };

    const onSortableSwitched = () => {
      this._columns = this._columns.map((column, i) => {
        if (i === colIndex) {
          return { ...column, sort: column.sort == null ? {} : null };
        }
        return column;
      });
    };

    /** @param {CcSelectEvent<'none'|'asc'|'desc'>} e */
    const onSortableSelected = (e) => {
      this._columns = this._columns.map((column, i) => {
        if (i === colIndex) {
          return { ...column, sort: { direction: e.detail === 'none' ? null : e.detail } };
        }
        return column;
      });
    };

    /** @param {CcSelectEvent<'auto'|'fixed'|'flex'>} e */
    const onWidthSelected = (e) => {
      /** @type {CcTableColumnWidthPolicy} */
      let width = { type: 'auto' };
      if (e.detail === 'fixed') {
        width = { type: 'fixed', value: '200px' };
      } else if (e.detail === 'flex') {
        width = { type: 'flex', value: 1 };
      }

      this._columns = this._columns.map((column, i) => {
        if (i === colIndex) {
          return { ...column, width };
        }
        return column;
      });
    };

    /** @param {CcInputEvent} e */
    const onWidthValueChanged = (e) => {
      this._columns = this._columns.map((column, i) => {
        if (i === colIndex) {
          return { ...column, width: { ...column.width, value: e.detail } };
        }
        return column;
      });
    };

    return html`
      <div class="column">
        <div class="column-line">
          <div class="column-name">Column ${colIndex + 1}</div>
          <cc-button @cc-click=${onRemoveClicked} data-index=${colIndex} danger outlined hide-text .icon=${clearIcon}
            >Remove</cc-button
          >
        </div>

        <cc-input-text label="Name" inline value=${column.header} @cc-input=${onColumnNameChanged}></cc-input-text>

        <div class="column-line">
          <label for="sort-column-${colIndex}">
            <input
              id="sort-column-${colIndex}"
              type="checkbox"
              @change=${onSortableSwitched}
              .checked=${column.sort != null}
            />
            Sortable
          </label>

          <cc-select
            .options=${[
              { label: 'none', value: 'none' },
              { label: 'asc', value: 'asc' },
              { label: 'desc', value: 'desc' },
            ]}
            .value=${column.sort?.direction == null ? 'none' : column.sort.direction}
            .disabled=${column.sort == null}
            @cc-select=${onSortableSelected}
          ></cc-select>
        </div>

        <div class="column-line">
          <cc-select
            .options=${[
              { label: 'auto', value: 'auto' },
              { label: 'fixed', value: 'fixed' },
              { label: 'flex', value: 'flex' },
            ]}
            .value=${column.width == null ? 'content' : column.width.type}
            @cc-select=${onWidthSelected}
          ></cc-select>

          <cc-input-text
            .value=${column.width == null || column.width.type === 'auto' ? '' : String(column.width.value)}
            .disabled=${column.width == null || column.width.type === 'auto'}
            @cc-input=${onWidthValueChanged}
          ></cc-input-text>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      sandboxStyles,
      css`
        .spacer {
          flex: 1;
        }

        #cc-table {
          border: 1px solid #ddd;
          border-radius: 0.2em;
          height: 600px;
          width: 800px;
        }

        .columns {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 0.25em;
        }

        .column-line {
          display: flex;
          align-items: center;
          gap: 1em;
        }

        .column-name {
          flex: 1;
          font-weight: bold;
        }
      `,
    ];
  }
}

window.customElements.define('cc-table-sandbox', CcTableSandbox);
