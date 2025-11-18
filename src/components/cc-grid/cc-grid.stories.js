import { html, render } from 'lit';
import { iconRemixMoreFill as iconMore } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import './cc-grid.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-grid>',
  component: 'cc-grid',
};

/**
 * @typedef {import('./cc-grid.types.js').CcGridColumnDefinition<any>} CcGridColumnDefinition
 * @typedef {import('./cc-grid.types.js').CcGridCell} CcGridCell
 */

const conf = {
  component: 'cc-grid',
  // language=CSS
  css: `
    cc-grid {
      height: 400px;
    }
  `,
};

/**
 * @param {any} _
 * @param {number} row
 * @param {number} col
 * @returns {CcGridCell}
 */
const simpleCellAt = (_, row, col) => ({
  type: 'text',
  value: `item ${row + 1} col ${col + 1}`,
});

/**
 * @returns {CcGridCell}
 */
const buttonCellAt = () => ({ type: 'button', value: 'More', icon: iconMore, onClick: () => {} });

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-grid.js').CcGrid>>} */
  items: [
    {
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: Array.from({ length: 50 }),
    },
  ],
});

export const withSmallNumberOfItemsStory = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-grid.js').CcGrid>>} */
  items: [
    {
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: Array.from({ length: 5 }),
    },
  ],
});

export const withFullySkeleton = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-grid.js').CcGrid>>} */
  items: [
    {
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: Array.from({ length: 50 }),
      skeleton: true,
    },
  ],
});

export const withPartiallySkeleton = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-grid.js').CcGrid>>} */
  items: [
    {
      columns: [
        {
          header: 'Column1',
          cellAt: (o, row, col) => ({ ...simpleCellAt(o, row, col), skeleton: row > 2 }),
          width: 'minmax(max-content, 1fr)',
        },
        {
          header: 'Column2',
          cellAt: (o, row, col) => ({ ...simpleCellAt(o, row, col), skeleton: row > 2 }),
          width: 'max-content',
        },
        {
          header: 'Column3',
          cellAt: (o, row, col) => ({ ...simpleCellAt(o, row, col), skeleton: row > 2 }),
          width: 'max-content',
        },
        { header: '', cellAt: (_, row) => ({ ...buttonCellAt(), skeleton: row > 2 }) },
      ],
      items: Array.from({ length: 5 }),
    },
  ],
});

export const withSortableColumns = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-grid.js').CcGrid>>} */
  items: [
    {
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)', sort: 'none' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: Array.from({ length: 50 }),
    },
  ],
});

export const withSortedColumns = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-grid.js').CcGrid>>} */
  items: [
    {
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)', sort: 'asc' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content', sort: 'desc' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: Array.from({ length: 50 }),
    },
  ],
});

export const withVolatileColumns = makeStory(conf, {
  dom: /** @param {HTMLElement} container */ (container) => {
    let widthPercent = '100';

    /**
     * @param {Event & { target: { value: string }}} e
     */
    function _onWidthChange(e) {
      widthPercent = e.target.value;
      refresh();
    }

    /** @type {Array<CcGridColumnDefinition>} */
    const columns = [
      { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
      { header: 'Column2(v)', cellAt: simpleCellAt, width: 'max-content', volatile: true },
      { header: 'Column3(v)', cellAt: simpleCellAt, width: 'max-content', volatile: true },
      { header: 'Column4', cellAt: simpleCellAt, width: 'max-content' },
      { header: 'Column5(v)', cellAt: simpleCellAt, width: 'max-content', volatile: true },
      { header: '', cellAt: buttonCellAt },
    ];

    const items = Array.from({ length: 50 });

    function refresh() {
      render(
        html`
          <div class="main">
            <div class="form">
              <label for="width">Width: (${widthPercent}%)</label>
              <input
                type="range"
                id="width"
                .value=${String(widthPercent)}
                min="3"
                max="100"
                @input=${_onWidthChange}
              />
            </div>
            <cc-grid .columns=${columns} .items=${items} style="width:${widthPercent}%"></cc-grid>
          </div>
        `,
        container,
      );
    }

    refresh();
  },
  // language=CSS
  css: `
    cc-grid {
      box-sizing: border-box;
      border: 2px solid #ccc;
      padding: 0.5em;
      height: 400px;
    }
    .main {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
      align-items: start;
    }
  `,
});
