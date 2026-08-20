import { makeStory } from '../../stories/lib/make-story.js';
import './cc-postgresql-notices.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-postgresql-notices>',
  component: 'cc-postgresql-notices',
};

/**
 * @import { CcPostgresqlNotices } from './cc-postgresql-notices.js'
 */

const conf = {
  component: 'cc-postgresql-notices',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcPostgresqlNotices>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        notices: {
          quotaExceeded: false,
          missingCredentials: false,
          endOfLife: { version: '11', eolDate: '2023-11-09' },
        },
      },
    },
  ],
});

export const dataLoadedWithNoNotice = makeStory(conf, {
  /** @type {Partial<CcPostgresqlNotices>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        notices: { quotaExceeded: false, missingCredentials: false },
      },
    },
  ],
});

export const dataLoadedWithAllNotices = makeStory(conf, {
  /** @type {Partial<CcPostgresqlNotices>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        notices: {
          quotaExceeded: true,
          missingCredentials: true,
          endOfLife: { version: '11', eolDate: '2023-11-09' },
        },
      },
    },
  ],
});
