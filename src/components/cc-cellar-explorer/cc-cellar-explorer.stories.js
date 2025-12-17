import { buckets } from '../../stories/fixtures/cellar.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-cellar-explorer.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Cellar Explorer/<cc-cellar-explorer-beta>',
  component: 'cc-cellar-explorer-beta',
};

/**
 * @import { CcCellarExplorer } from './cc-cellar-explorer.js'
 */

const conf = {
  component: 'cc-cellar-explorer-beta',
  // language=CSS
  css: `cc-cellar-explorer-beta {
    height: 400px;
  }`,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        level: {
          type: 'buckets',
          state: {
            type: 'loaded',
            total: 50,
            buckets: buckets(50),
            sort: { column: 'name', direction: 'asc' },
          },
        },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcCellarExplorer>[]} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});
