import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-redis-options.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-redis-options>',
  component: 'cc-addon-redis-options',
};

const conf = {
  component: 'cc-addon-redis-options',
};

export const defaultStory = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: false }] }],
});

export const encryptionEnabled = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: true }] }],
});

// This component isn't used when there are no options => no story for this case.
