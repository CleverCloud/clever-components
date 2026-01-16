import { html, render } from 'lit';
import {
  iconRemixHeartLine as iconHeart,
  iconRemixExternalLinkFill as iconLink,
  iconRemixMoreFill as iconMore,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import './cc-grid.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-grid>',
  component: 'cc-grid',
};

/**
 * @import { CcGrid } from './cc-grid.js'
 * @import { CcGridColumnDefinition, CcGridCell } from './cc-grid.types.js'
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
const simpleCellAt = (_, row, col) => {
  if (col === 0) {
    return {
      type: 'link',
      value: `item ${row + 1} col ${col + 1}`,
      icon: iconLink,
      onClick: () => {},
    };
  }
  if (col === 1) {
    return {
      type: 'link',
      value: `item ${row + 1} col ${col + 1}`,
      onClick: () => {},
      enableCopyToClipboard: true,
    };
  }
  return {
    type: 'text',
    value: `item ${row + 1} col ${col + 1}`,
    icon: col === 0 ? iconHeart : null,
    enableCopyToClipboard: col === 3,
  };
};

/**
 * @returns {CcGridCell}
 */
const buttonCellAt = () => ({ type: 'button', value: 'More', icon: iconMore, onClick: () => {} });

const items = (count = 50) => Array.from({ length: count }, () => ({}));

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column4', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: items(),
    },
  ],
});

export const withSmallNumberOfItems = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column4', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: items(5),
    },
  ],
});

export const withFullySkeleton = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column4', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: items(),
      skeleton: true,
    },
  ],
});

export const withPartiallySkeleton = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
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
        {
          header: 'Column4',
          cellAt: (o, row, col) => ({ ...simpleCellAt(o, row, col), skeleton: row > 2 }),
          width: 'max-content',
        },
        { header: '', cellAt: (_, row) => ({ ...buttonCellAt(), skeleton: row > 2 }) },
      ],
      items: items(5),
    },
  ],
});

export const withSortableColumns = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)', sort: 'none' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content' },
        { header: 'Column4', cellAt: simpleCellAt, width: 'max-content' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: items(),
    },
  ],
});

export const withSortedColumns = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)', sort: 'asc' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content', sort: 'desc' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: 'Column4', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: items(),
    },
  ],
});

export const withDisabled = makeStory(conf, {
  /** @type {Array<Partial<CcGrid>>} */
  items: [
    {
      a11yName: 'Example grid',
      columns: [
        { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)', sort: 'asc' },
        { header: 'Column2', cellAt: simpleCellAt, width: 'max-content', sort: 'desc' },
        { header: 'Column3', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: 'Column4', cellAt: simpleCellAt, width: 'max-content', sort: 'none' },
        { header: '', cellAt: buttonCellAt },
      ],
      items: items(),
      disabled: true,
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

    /** @type {Array<CcGridColumnDefinition<any>>} */
    const columns = [
      { header: 'Column1', cellAt: simpleCellAt, width: 'minmax(max-content, 1fr)' },
      { header: 'Column2(v)', cellAt: simpleCellAt, width: 'max-content', volatile: true },
      { header: 'Column3(v)', cellAt: simpleCellAt, width: 'max-content', volatile: true },
      { header: 'Column4', cellAt: simpleCellAt, width: 'max-content' },
      { header: 'Column5(v)', cellAt: simpleCellAt, width: 'max-content', volatile: true },
      { header: '', cellAt: buttonCellAt },
    ];

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
            <cc-grid
              a11y-name="Example grid"
              .columns=${columns}
              .items=${items()}
              style="width:${widthPercent}%"
            ></cc-grid>
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
