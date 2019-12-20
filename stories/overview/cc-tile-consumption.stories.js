import '../../components/overview/cc-tile-consumption.js';
import notes from '../../.components-docs/cc-tile-consumption.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

export default {
  title: '2. Overview|<cc-tile-consumption>',
  component: 'cc-tile-consumption',
  parameters: { notes },
};

const conf = {
  component: 'cc-tile-consumption',
  css: `cc-tile-consumption {
    display: inline-grid;
    margin-bottom: 1rem;
    margin-right: 1rem;    
    width: 275px;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [{ consumption: { yesterday: 0.72, last30Days: 14.64 } }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [
    { consumption: { yesterday: 0, last30Days: 0 } },
    { consumption: { yesterday: 0.3, last30Days: 6.1 } },
    { consumption: { yesterday: 0.72, last30Days: 14.64 } },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.consumption = { yesterday: 0.72, last30Days: 14.64 };
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({ defaultStory, skeleton, error, dataLoaded, simulations });
