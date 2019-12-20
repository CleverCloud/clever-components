import '../../components/env-var/env-var-create.js';
import notes from '../../.components-docs/env-var-create.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory } from '../lib/make-story.js';

export default {
  title: '🛠 Environment variables|<env-var-create>',
  component: 'env-var-create',
  parameters: { notes },
};

const conf = {
  component: 'env-var-create',
  events: ['env-var-create:create'],
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
