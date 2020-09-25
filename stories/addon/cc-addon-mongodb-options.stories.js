import '../../src/addon/cc-addon-mongodb-options.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-addon-mongodb-options>',
  component: 'cc-addon-mongodb-options',
};

const conf = {
  component: 'cc-addon-mongodb-options',
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
