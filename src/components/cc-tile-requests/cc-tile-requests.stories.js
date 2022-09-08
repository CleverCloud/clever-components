import './cc-tile-requests.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const REQUESTS_COUNTS_BIG = [
  596600,
  219080,
  165930,
  124350,
  98820,
  89510,
  108320,
  310880,
  97549,
  63093,
  112781,
  120270,
];
const REQUESTS_COUNTS_SMALL = [895, 2, 78, 95, 630, 3966, 2190, 1659, 988, 1127, 1202, 1243];
const REQUESTS_COUNTS_SIMILAR = [
  220024,
  220132,
  220088,
  220248,
  220242,
  220101,
  220092,
  220011,
  220736,
  220521,
  220098,
  220881,
];

const ONE_HOUR = 1000 * 60 * 60;
const HOURS_IN_A_DAY = 24;

function generateData (dataSample) {
  const now = new Date();
  const nowTs = now.getTime();
  const nowRoundedTs = nowTs - (nowTs % ONE_HOUR);
  const startTs = nowRoundedTs - ONE_HOUR * HOURS_IN_A_DAY;

  return Array.from(new Array(HOURS_IN_A_DAY)).map((a, i) => {
    const sampleStartTs = startTs + i * ONE_HOUR;
    const sampleEndTs = startTs + (i + 1) * ONE_HOUR;
    const requestsCount = dataSample[i % dataSample.length];
    return [sampleStartTs, sampleEndTs, requestsCount];
  });
}

const baseItems = [
  { style: 'width: 275px' },
  { style: 'width: 380px' },
  { style: 'width: 540px' },
];

export default {
  title: '🛠 Overview/<cc-tile-requests>',
  component: 'cc-tile-requests',
};

const conf = {
  component: 'cc-tile-requests',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    :host {
      max-width: 100% !important;
    }
    cc-tile-requests {
      width: 275px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ style: 'width: 275px', data: generateData(REQUESTS_COUNTS_SMALL) }],
});

export const skeleton = makeStory(conf, {
  items: baseItems,
});

export const error = makeStory(conf, {
  items: [{ style: 'width: 275px', error: true }],

});

export const empty = makeStory(conf, {
  items: [{ style: 'width: 275px', data: [] }],
});

export const dataLoadedWithBigRequests = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, data: generateData(REQUESTS_COUNTS_BIG) })),
});

export const dataLoadedWithSmallRequests = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, data: generateData(REQUESTS_COUNTS_SMALL) })),
});

export const dataLoadedWithSimilarRequests = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, data: generateData(REQUESTS_COUNTS_SIMILAR) })),
});

export const simulationsWithData = makeStory(conf, {
  items: baseItems,
  simulations: [
    storyWait(2000, ([componentSmall, componentMedium, componentBig]) => {
      componentSmall.data = generateData(REQUESTS_COUNTS_BIG);
      componentMedium.data = generateData(REQUESTS_COUNTS_BIG);
      componentBig.data = generateData(REQUESTS_COUNTS_BIG);
    }),
  ],
});

export const simulationsWithError = makeStory(conf, {
  items: baseItems,
  simulations: [
    storyWait(2000, ([componentSmall, componentMedium, componentBig]) => {
      componentSmall.error = true;
      componentMedium.error = true;
      componentBig.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  empty,
  dataLoadedWithBigRequests,
  dataLoadedWithSmallRequests,
  dataLoadedWithSimilarRequests,
  simulationsWithData,
  simulationsWithError,
});
