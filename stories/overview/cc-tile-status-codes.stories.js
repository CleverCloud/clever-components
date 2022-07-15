import '../../src/overview/cc-tile-status-codes.js';
import '../../src/overview/cc-tile-status-codes.smart.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const DATA = [
  { 200: 47640, 206: 2011, 302: 11045, 303: 457, 304: 12076, 500: 16 },
  { 200: 1000, 201: 10, 302: 100, 401: 150, 404: 300, 500: 200 },
  { 101: 75, 200: 800, 201: 50, 302: 80, 401: 200, 404: 100, 500: 100 },
];

export default {
  title: '🛠 Overview/<cc-tile-status-codes>',
  component: 'cc-tile-status-codes',
};

const conf = {
  component: 'cc-tile-status-codes',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-tile-status-codes {
      width: 275px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ statusCodes: DATA[0] }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const empty = makeStory(conf, {
  items: [{ statusCodes: [] }],
});

export const dataLoaded = makeStory(conf, {
  items: [
    { statusCodes: DATA[0] },
    { statusCodes: DATA[1] },
    { statusCodes: DATA[2] },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.statusCodes = DATA[0];
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({ defaultStory, skeleton, error, empty, dataLoaded, simulations });
