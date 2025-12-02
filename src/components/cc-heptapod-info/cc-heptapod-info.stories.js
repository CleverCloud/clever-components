import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-heptapod-info.js';

export default {
  tags: ['autodocs'],
  title: '🛠 SaaS/<cc-heptapod-info>',
  component: 'cc-heptapod-info',
};

const conf = {
  component: 'cc-heptapod-info',
  // language=CSS
  css: `
    cc-heptapod-info {
      max-width: 40em;
    }
  `,
};

/**
 * @import { CcHeptapodInfo } from './cc-heptapod-info.js'
 * @import { HeptapodInfoStateLoaded, HeptapodInfoStateLoading, HeptapodInfoStateError, HeptapodInfoStateNotUsed, Statistics } from './cc-heptapod-info.types.js'
 */

/** @type {Statistics} */
const statistics = {
  privateActiveUsers: 12,
  publicActiveUsers: 120,
  // 666.6 MB
  storage: 698980762,
  price: 17.5,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {HeptapodInfoStateLoaded} */
      state: {
        type: 'loaded',
        statistics: statistics,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {HeptapodInfoStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const notUsed = makeStory(conf, {
  items: [
    {
      /** @type {HeptapodInfoStateNotUsed} */
      state: { type: 'not-used' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {HeptapodInfoStateError} */
      state: { type: 'error' },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcHeptapodInfo[]} components */
      ([component, componentNotUsed, componentError]) => {
        component.state = {
          type: 'loaded',
          statistics: statistics,
        };
        componentNotUsed.state = { type: 'not-used' };
        componentError.state = { type: 'error' };
      },
    ),
  ],
});
