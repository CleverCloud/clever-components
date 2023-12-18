import './cc-ticket-center-message.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Console/<cc-ticket-center-message>',
  component: 'cc-ticket-center-message',
};

const conf = {
  component: 'cc-ticket-center-message',
};

export const defaultStory = makeStory(conf, {
  items: [{
    authorName: 'Julien',
    authorPicture: 'http://placekitten.com/200/200',
    message: 'Bonjour, j’ai un problème avec ma DB',
    messageOrigin: 'customer',
    messageDate: new Date(),
  }],
});

enhanceStoriesNames({
  defaultStory,
});
