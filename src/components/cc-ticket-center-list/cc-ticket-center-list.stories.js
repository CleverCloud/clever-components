import './cc-ticket-center-list.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Console/<cc-ticket-center-list>',
  component: 'cc-ticket-center-list',
};

const conf = {
  component: 'cc-ticket-center-list',
};

const orga = {
  id: 'orga_xxx',
};

const tickets = [
  {
    title: 'Je viens de le créer, avec un titre très long, très très long, genre presque aussi long qu’un tweet sans twitter blue. Environ 200 caractères c’est vachement long. On pourrait bloquer à 50.',
    id: '#TI82SH',
    state: 'pending',
  },
  {
    title: 'G Besoin d’aide',
    id: '#FO08AR',
    state: 'unresolved',
  },
  {
    title: 'Ça marche pas 😭',
    id: '#F18TZ0',
    state: 'resolved',
  },
];

export const defaultStory = makeStory(conf, {
  items: [{
    orga,
    tickets,
  }],
});

enhanceStoriesNames({
  defaultStory,
});
