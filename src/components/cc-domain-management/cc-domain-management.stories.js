import './cc-domain-management.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-domain-management>',
  component: 'cc-domain-management',
};

const conf = {
  component: 'cc-domain-management',
};

export const defaultStory = makeStory(conf, {
  items: [{
    dataListOptions: [
      'clever-cloud.com',
      'blog.clever-cloud.com',
      'cleverapps.io',
      'toto.com',
    ],
  }],
});
