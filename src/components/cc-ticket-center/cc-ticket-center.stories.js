import './cc-ticket-center.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Console/<cc-ticket-center>',
  component: 'cc-ticket-center',
};

const conf = {
  component: 'cc-ticket-center',
};

const orga = {
  id: 'orga_xxx',
};

const tickets = [{
  title: 'G Besoin d’aide',
  id: '#FO08AR',
  state: 'unresolved',
}];

export const defaultStory = makeStory(conf, {
  items: [{
    orga,
    tickets,
  }],
});

enhanceStoriesNames({
  defaultStory,
});
