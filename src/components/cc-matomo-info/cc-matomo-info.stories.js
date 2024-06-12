import './cc-matomo-info.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-matomo-info>',
  component: 'cc-matomo-info',
};

const conf = {
  component: 'cc-matomo-info',
};

/**
 * @typedef {import('./cc-matomo-info.js').CcMatomoInfo} CcMatomoInfo
 * @typedef {import('./cc-matomo-info.types.js').MatomoInfoStateLoaded} MatomoInfoStateLoaded
 * @typedef {import('./cc-matomo-info.types.js').MatomoInfoStateLoading} MatomoInfoStateLoading
 * @typedef {import('./cc-matomo-info.types.js').MatomoInfoStateError} MatomoInfoStateError
 */

const matomoUrl = 'https://my-matomo.example.com';
const phpUrl = '/php';
const mysqlUrl = '/mysql';
const redisUrl = '/redis';

export const defaultStory = makeStory(conf, {
  items: [{
    /** @type {MatomoInfoStateLoaded} */
    state: {
      type: 'loaded',
      matomoUrl,
      phpUrl,
      mysqlUrl,
      redisUrl,
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {MatomoInfoStateLoading} */
    state: { type: 'loading' },
  }],
});

export const errorStory = makeStory(conf, {
  items: [{
    /** @type {MatomoInfoStateError} */
    state: { type: 'error' },
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000,
      /** @param {CcMatomoInfo[]} components */
      ([component, componentError]) => {
        component.state = {
          type: 'loaded',
          matomoUrl,
          phpUrl,
          mysqlUrl,
          redisUrl,
        };

        componentError.state = {
          type: 'error',
        };
      }),
  ],
});
