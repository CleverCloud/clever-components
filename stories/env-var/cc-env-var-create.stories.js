import '../../src/env-var/cc-env-var-create.js';
import notes from '../../.components-docs/cc-env-var-create.md';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Environment variables|<cc-env-var-create>',
  component: 'cc-env-var-create',
  parameters: { notes },
};

const conf = {
  component: 'cc-env-var-create',
  events: ['cc-env-var-create:create'],
};

export const defaultStory = makeStory(conf, {
  items: [{}],
});

export const validationWithExistingNames = makeStory(conf, {
  docs: 'In this example `FOO` and `BAR` are already defined and cannot be used as a variable name again.',
  items: [{ variablesNames: ['FOO', 'BAR'] }],
});

export const disabled = makeStory(conf, {
  items: [{ disabled: true }],
});

enhanceStoriesNames({ defaultStory, validationWithExistingNames, disabled });
