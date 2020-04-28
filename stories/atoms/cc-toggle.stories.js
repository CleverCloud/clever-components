import '../../src/atoms/cc-toggle.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🧬 Atoms|<cc-toggle>',
  component: 'cc-toggle',
};

const conf = {
  component: 'cc-toggle',
  css: `
    cc-toggle {
      margin: 0.5rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{
    value: 'PAUL',
    choices: [
      { label: 'John', value: 'JOHN' },
      { label: 'Paul', value: 'PAUL' },
      { label: 'George', value: 'GEORGE' },
      { label: 'Ringo', value: 'RINGO' },
    ],
  }],
});

export const trueFalse = makeStory(conf, {
  items: [{
    value: 'true',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
  }],
});

export const disabled = makeStory(conf, {
  items: [{
    value: 'true',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    disabled: true,
  }],
});

enhanceStoriesNames({ defaultStory, trueFalse, disabled });
