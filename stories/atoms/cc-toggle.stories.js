import '../../components/atoms/cc-toggle.js';
import notes from '../../.components-docs/cc-toggle.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory } from '../lib/make-story.js';

export default {
  title: '1. Atoms|<cc-toggle>',
  component: 'cc-toggle',
  parameters: { notes },
};

const conf = {
  component: 'cc-toggle',
  events: ['cc-toggle:input'],
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
