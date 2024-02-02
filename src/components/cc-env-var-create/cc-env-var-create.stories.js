import './cc-env-var-create.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Environment variables/<cc-env-var-create>',
  component: 'cc-env-var-create',
};

const conf = {
  component: 'cc-env-var-create',
};

export const defaultStory = makeStory(conf, {
  items: [{}],
});

export const validationWithExistingNames = makeStory(conf, {
  docs: 'In this example `FOO` and `BAR` are already defined and cannot be used as a variable name again.',
  items: [{ variablesNames: ['FOO', 'BAR'] }],
});

export const validationWithStrictMode = makeStory(conf, {
  items: [{ validationMode: 'strict' }],
});

export const disabled = makeStory(conf, {
  items: [{ disabled: true }],
});
