import { makeStory } from '../../stories/lib/make-story.js';
import './cc-code.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-code>',
  component: 'cc-code',
};

const conf = {
  component: 'cc-code',
};

export const defaultStory = makeStory(conf, {
  items: [{ innerHTML: `clever help` }],
});

export const multiLines = makeStory(conf, {
  items: [
    {
      innerHTML: `
        {
          "name" : "myApp",
          "version" : "0.1.0",
          "main" : "myApp.js",
        }
      `,
    },
  ],
});
