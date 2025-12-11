import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-loading-progress.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs/<cc-logs-loading-progress-beta>',
  component: 'cc-logs-loading-progress-beta',
};

/**
 * @import { CcLogsLoadingProgress } from './cc-logs-loading-progress.js'
 */

const conf = {
  component: 'cc-logs-loading-progress-beta',
  beta: true,
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-logs-loading-progress-beta {
      width: 100%;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'running',
        value: 500,
        percent: 5,
        overflowing: false,
      },
      limit: 1000,
    },
    {
      state: {
        type: 'running',
        value: 500,
        overflowing: false,
      },
      limit: 1000,
    },
  ],
});

export const zeroProgress = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'running',
        value: 0,
        percent: 0,
        overflowing: false,
      },
      limit: 1000,
    },
    {
      state: {
        type: 'running',
        value: 0,
        overflowing: false,
      },
      limit: 1000,
    },
  ],
});

export const paused = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'paused',
        value: 580,
        percent: 5.8,
        overflowing: false,
      },
      limit: 1000,
    },
    {
      state: {
        type: 'paused',
        value: 580,
        overflowing: false,
      },
      limit: 1000,
    },
  ],
});

export const overflowLimitReached = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'overflowLimitReached',
        value: 990,
        percent: 9.9,
      },
      limit: 1000,
    },
    {
      state: {
        type: 'overflowLimitReached',
        value: 990,
      },
      limit: 1000,
    },
  ],
});

export const runningAfterOverflowing = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'running',
        value: 1500,
        percent: 15,
        overflowing: true,
      },
      limit: 1000,
    },
    {
      state: {
        type: 'running',
        value: 1500,
        overflowing: true,
      },
      limit: 1000,
    },
  ],
});

export const pausedAfterOverflowing = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'paused',
        value: 1500,
        percent: 15,
        overflowing: true,
      },
      limit: 1000,
    },
    {
      state: {
        type: 'paused',
        value: 1500,
        overflowing: true,
      },
      limit: 1000,
    },
  ],
});

export const completed = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'completed',
        value: 100,
        overflowing: false,
      },
      limit: 1000,
    },
  ],
});

export const completedWithOverflowing = makeStory(conf, {
  /** @type {Array<Partial<CcLogsLoadingProgress>>} */
  items: [
    {
      state: {
        type: 'completed',
        value: 10000,
        overflowing: true,
      },
      limit: 1000,
    },
  ],
});
