import './cc-ticket-center-reply-form.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Console/<cc-ticket-center-reply-form>',
  component: 'cc-ticket-center-reply-form',
};

const conf = {
  component: 'cc-ticket-center-reply-form',
};

export const defaultStory = makeStory(conf, {
  items: [{
    ticketState: 'pending',
  }, {
    ticketState: 'resolved',
  }],
});
