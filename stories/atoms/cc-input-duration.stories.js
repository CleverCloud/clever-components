import '../../src/atoms/cc-input-duration.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const baseItems = [
  {},
  { value: 'P5Y' },
  { value: 'P3Y', disabled: true },
  { value: 'P2Y2M28D', readonly: true },
  { value: 'P1Y1W5D', skeleton: true },
  { value: 'P8Y', expert: true },
];

export default {
  title: '🧬 Atoms/<cc-input-duration>',
  component: 'cc-input-duration',
};

const conf = {
  component: 'cc-input-duration',
  css: `
    cc-input-duration {
      margin: 0.5rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: baseItems,
});

enhanceStoriesNames({
  defaultStory,
});

