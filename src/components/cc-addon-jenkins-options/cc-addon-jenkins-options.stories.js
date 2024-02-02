import './cc-addon-jenkins-options.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Addon/<cc-addon-jenkins-options>',
  component: 'cc-addon-jenkins-options',
};

const conf = {
  component: 'cc-addon-jenkins-options',
};

export const defaultStory = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: false }] }],
});

export const encryptionEnabled = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: true }] }],
});

// This component isn't used when there are no options => no story for this case.
