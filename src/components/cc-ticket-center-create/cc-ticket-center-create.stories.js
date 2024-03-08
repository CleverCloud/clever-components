import './cc-ticket-center-create.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Console/<cc-ticket-center-create>',
  component: 'cc-ticket-center-create',
};

const conf = {
  component: 'cc-ticket-center-create',
};

const orga = {
  id: 'orga_xxx',
};

const user = {
  email: 'julien@cc.com',
};

export const defaultStory = makeStory(conf, {
  items: [{
    orga,
    user,
  }],
});

enhanceStoriesNames({
  defaultStory,
});
