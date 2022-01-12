import '../../src/atoms/cc-input-duration.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const baseItems = [
  { label: 'Empty' },
  { value: 'P5Y', label: 'Simple value' },
  { value: 'P3Y', disabled: true, label: 'Disabled' },
  { value: 'P2Y2M28D', readonly: true, label: 'Read only' },
  { value: 'P1Y1W5D', skeleton: true, label: 'Skeleton' },
  { value: 'P8Y', expert: true, label: 'Start with expert' },
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
