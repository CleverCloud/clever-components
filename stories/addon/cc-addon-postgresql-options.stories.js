import '../../src/addon/cc-addon-postgresql-options.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-addon-postgresql-options>',
  component: 'cc-addon-postgresql-options',
};

const conf = {
  component: 'cc-addon-postgresql-options',
};

export const defaultStory = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: false, price: 10.00 }] }],
});

export const encryptionEnabled = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: true, price: 10.00 }] }],
});

// This component isn't used when there are no options => no story for this case.

enhanceStoriesNames({
  defaultStory,
  encryptionEnabled,
});
