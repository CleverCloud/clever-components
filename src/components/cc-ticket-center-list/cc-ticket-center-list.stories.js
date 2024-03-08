import './cc-ticket-center-list.js';
import { makeStory } from '../../stories/lib/make-story.js';

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
    state: 'pending',
    session_id: 'session_b787266a-797f-4d69-be79-4acafa8c442f',
    website_id: 'website_067a243a-5e3b-453c-bfc5-cbb632bb2ecb',
    people_id: 'people_e1e52345-d21d-4141-bbdd-bfaa2dc39a08',
    last_message: 'Bonjour, j’ai un problème',
    created_at: '2023-08-15T00:15:00.000Z',
    updated_at: null,
    meta: {
      subject: 'Je viens de le créer, avec un titre très long, très très long, genre presque aussi long qu’un tweet sans twitter blue. Environ 200 caractères c’est vachement long. On pourrait bloquer à 50.',
      id: '#TI82SH',
    },
  },
  {
    state: 'unresolved',
    session_id: 'session_1dc5846f-d301-4d27-86e9-1b9af0bc32e3',
    website_id: 'website_067a243a-5e3b-453c-bfc5-cbb632bb2ecb',
    people_id: 'people_e1e52345-d21d-4141-bbdd-bfaa2dc39a08',
    last_message: 'C’était bien ça, merci !',
    created_at: '2023-08-12T00:15:00.000Z',
    updated_at: '2023-08-14T00:15:00.000Z',
    meta: {
      subject: 'G Besoin d’aide',
      id: '#FO08AR',
    },
  },
  {
    state: 'resolved',
    session_id: 'session_1dc5846f-d301-4d27-86e9-1b9af0bc32e3',
    website_id: 'website_067a243a-5e3b-453c-bfc5-cbb632bb2ecb',
    people_id: 'people_e1e52345-d21d-4141-bbdd-bfaa2dc39a08',
    last_message: 'De rien, bonne journée.',
    created_at: '2023-08-12T00:15:00.000Z',
    updated_at: '2023-08-14T00:15:00.000Z',
    meta: {
      subject: 'Ça marche pas 😭',
      id: '#F18TZ0',
    },
  },
];

export const defaultStory = makeStory(conf, {
  items: [{
    orga,
    tickets,
  }],
});
