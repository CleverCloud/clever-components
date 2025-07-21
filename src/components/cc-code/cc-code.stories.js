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

export const longLine = makeStory(conf, {
  items: [
    {
      innerHTML: `GET /api/orders/checkout?session_id=cs_test_a1B2c3D4E5f6G7h8I9J0kLmNoPqRsTuVwXyZ1234567890abcdef1234567890abcdef HTTP/1.1`,
    },
  ],
});
