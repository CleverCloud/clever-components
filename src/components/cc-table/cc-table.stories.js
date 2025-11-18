import { html } from 'lit';
import { iconRemixDeleteBin_5Fill as iconBin } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import './cc-table.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-table>',
  component: 'cc-table',
};

const conf = {
  component: 'cc-table',
  // language=CSS
  css: `
    cc-table {
      height: 400px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-table.js').CcTable>>} */
  items: [
    {
      columns: [
        { header: 'Column1', renderer: (object) => object.col1, width: '1fr' },
        { header: 'Column2', renderer: (object) => object.col2, width: '0.5fr' },
        { header: 'Column3', renderer: (object) => object.col3, width: '10em' },
        {
          header: '',
          renderer: () => html` <cc-button .icon=${iconBin} hide-text danger>Delete</cc-button>`,
          skeleton: () => html` <cc-button .icon=${iconBin} hide-text danger skeleton>Delete</cc-button> `,
          width: 'auto',
        },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
        })),
      ],
    },
    {
      columns: [
        { header: 'Column1', renderer: (object) => object.col1, width: '1fr' },
        { header: 'Column2', renderer: (object) => object.col2, width: '0.5fr' },
        { header: 'Column3', renderer: (object) => object.col3, width: '10em' },
        {
          header: '',
          renderer: () => html` <cc-button .icon=${iconBin} hide-text danger>Delete</cc-button>`,
          skeleton: () => html` <cc-button .icon=${iconBin} hide-text danger skeleton>Delete</cc-button> `,
          width: 'auto',
        },
      ],
      items: [
        ...Array.from({ length: 2 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
        })),
      ],
    },
  ],
});

export const withSkeleton = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-table.js').CcTable>>} */
  items: [
    {
      columns: [
        { header: 'Column1', renderer: (object) => object.col1, width: '1fr' },
        { header: 'Column2', renderer: (object) => object.col2, width: '0.5fr' },
        { header: 'Column3', renderer: (object) => object.col3, width: '10em' },
        {
          header: '',
          renderer: () => html` <cc-button .icon=${iconBin} hide-text danger>Delete</cc-button>`,
          skeleton: () => html` <cc-button .icon=${iconBin} hide-text danger skeleton>Delete</cc-button> `,
          width: 'auto',
        },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
        })),
      ],
      skeleton: true,
    },
  ],
});

export const withSortableColumns = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-table.js').CcTable>>} */
  items: [
    {
      columns: [
        { header: 'Column1', renderer: (object) => object.col1, width: '1fr', sort: {} },
        { header: 'Column2', renderer: (object) => object.col2, width: '0.5fr', sort: {} },
        { header: 'Column3', renderer: (object) => object.col3, width: '10em' },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
        })),
      ],
    },
  ],
});

export const withSortedColumns = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-table.js').CcTable>>} */
  items: [
    {
      columns: [
        { header: 'Column1', renderer: (object) => object.col1, width: '1fr', sort: { direction: 'asc' } },
        { header: 'Column2', renderer: (object) => object.col2, width: '0.5fr', sort: { direction: 'desc' } },
        { header: 'Column3', renderer: (object) => object.col3, width: '10em' },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${50 - i}`,
          col3: `Item${i}`,
        })),
      ],
    },
  ],
});

export const withStyledCell = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-table.js').CcTable>>} */
  items: [
    {
      columns: [
        {
          header: 'Column 1',
          renderer: (object) => html`<span part="cell-col-one">${object.col1}</span>`,
          width: '1fr',
        },
        {
          header: html`<span part="header-col-two">Column 2</span>`,
          renderer: (object) => object.col2,
          width: '0.5fr',
        },
        { header: 'Column 3', renderer: (object) => object.col3, width: '10em' },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${50 - i}`,
          col3: `Item${i}`,
        })),
      ],
    },
  ],
  // language=CSS
  css: `
    cc-table {
      height: 400px;
    }
    ::part(header-col-two) {
      font-weight: bold;
      color: blue;
    }
    ::part(cell-col-one) {
      color: red;  
    }
  `,
});
