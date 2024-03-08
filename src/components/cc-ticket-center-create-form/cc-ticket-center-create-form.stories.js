import './cc-ticket-center-create-form.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Console/<cc-ticket-center-create-form>',
  component: 'cc-ticket-center-create-form',
};

const conf = {
  component: 'cc-ticket-center-create-form',
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
