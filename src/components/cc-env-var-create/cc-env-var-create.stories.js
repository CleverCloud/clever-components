import { makeStory } from '../../stories/lib/make-story.js';
import './cc-env-var-create.js';

export default {
  tags: ['autodocs'],
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
  items: [{ variablesNames: ['FOO', 'BAR'], _variableName: 'FOO' }],
});

export const validationWithStrictMode = makeStory(conf, {
  items: [{ validationMode: 'strict' }],
});

export const disabled = makeStory(conf, {
  items: [{ disabled: true }],
});
