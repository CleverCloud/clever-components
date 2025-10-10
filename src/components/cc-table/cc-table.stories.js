import { makeStory } from '../../stories/lib/make-story.js';
import './cc-table.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-table>',
  component: 'cc-table',
};

const conf = {
  component: 'cc-table',
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<import('./cc-table.js').CcTable>>} */
  items: [
    {
      hideHeader: true,
      columns: [
        {
          header: 'Col1 flex:1',
          renderer: (object) => object.col1,
          width: { type: 'flex', value: 1 },
          sort: { direction: 'asc' },
        },
        {
          header: 'Col2 flex:0.5',
          renderer: (object) => object.col2,
          width: { type: 'flex', value: 0.5 },
          sort: {},
        },
        { header: 'Col3 fixed:10em', renderer: (object) => object.col3, width: { type: 'fixed', value: '10em' } },
        { header: 'Col4 auto', renderer: (object) => object.col4, width: { type: 'flex', value: 0.5 } },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `ItemItemItemItem${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `ItemItemItemItemItem${i}`,
          col3: `Item${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `ItemItemItemItemItem${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
          col4: `ItemItemItemItemItem${i}`,
        })),
      ],
    },
    {
      hideHeader: false,
      columns: [
        {
          header: 'Col1 flex:1',
          renderer: (object) => object.col1,
          width: { type: 'flex', value: 1 },
          sort: { direction: 'asc' },
        },
        {
          header: 'Col2 flex:0.5',
          renderer: (object) => object.col2,
          width: { type: 'flex', value: 0.5 },
          sort: {},
        },
        { header: 'Col3 fixed:10em', renderer: (object) => object.col3, width: { type: 'fixed', value: '10em' } },
        { header: 'Col4 auto', renderer: (object) => object.col4, width: { type: 'flex', value: 0.5 } },
      ],
      items: [
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `ItemItemItemItem${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `ItemItemItemItemItem${i}`,
          col3: `Item${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `ItemItemItemItemItem${i}`,
          col4: `Item${i}`,
        })),
        ...Array.from({ length: 50 }, (_, i) => ({
          col1: `Item${i}`,
          col2: `Item${i}`,
          col3: `Item${i}`,
          col4: `ItemItemItemItemItem${i}`,
        })),
      ],
    },

    // {
    //   columns: [
    //     { header: 'Col1', renderer: (object) => object.col1 },
    //     { header: 'Col2Col2Col2Col22', renderer: (object) => object.col2 },
    //     { header: 'Col3', renderer: (object) => object.col3 },
    //   ],
    //   items: [...Array.from({ length: 2 }, (_, i) => ({ col1: `Item${i}`, col2: `Item${i}`, col3: `Item${i}` }))],
    // },
  ],
  // language=CSS
  css: `
    cc-table {
      height: 400px;
    }
  `,
});
