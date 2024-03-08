import './cc-ticket-center-file-upload.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Console/<cc-ticket-center-file-upload>',
  component: 'cc-ticket-center-file-upload',
};

const conf = {
  component: 'cc-ticket-center-file-upload',
};

export const defaultStory = makeStory(conf, {
  items: [{}],
});
