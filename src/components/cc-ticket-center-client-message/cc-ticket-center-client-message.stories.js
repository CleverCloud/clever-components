import './cc-ticket-center-client-message.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 Console/<cc-ticket-center-client-message>',
  component: 'cc-ticket-center-client-message',
};

const conf = {
  component: 'cc-ticket-center-client-message',
};

const orga = {
  id: 'orga_xxx',
};

const user = {
  email: 'julien@cc.com',
};

const ticket = {
  state: 'pending',
  session_id: 'session_b787266a-797f-4d69-be79-4acafa8c442f',
  websiteId: 'website_067a243a-5e3b-453c-bfc5-cbb632bb2ecb',
  peopleId: 'people_e1e52345-d21d-4141-bbdd-bfaa2dc39a08',
  lastMessage: 'Bonjour, j’ai un problème',
  createdAt: new Date('2023-08-15T00:15:00.000Z'),
  updatedAt: new Date('2023-08-15T00:15:00.000Z'),
  meta: {
    /* subject: 'Je viens de le créer, avec un titre très long, très très long, genre presque aussi long qu’un tweet sans twitter blue. Environ 200 caractères c’est vachement long. On pourrait bloquer à 50.', */
    subject: 'Pas traduit mais c’est normal',
    id: '#TI82SH',
  },
};

const messages = [
  {
    author: {
      email: 'something@uenuast.com',
      name: 'Some Thing',
    },
    message: '[User Input, pas traduit] Bonjour, j’ai un problème',
    sentAt: new Date('2023-08-16T00:15:00.000Z'),
    direction: 'out',
  },
  {
    author: {
      email: 'aline.dussuport@app.crisp.com',
      name: 'Aline Dusupport',
    },
    message: '[User Input, pas traduit] Bonjour,<br>Voilà la réponse: ➡',
    sentAt: new Date('2023-08-17T00:15:00.000Z'),
    direction: 'in',
  },
  {
    author: {
      email: 'something@uenuast.com',
      name: 'Some Thing',
    },
    message: '[User Input, pas traduit] Bonjour, j’ai un problème',
    sentAt: new Date('2023-08-15T00:15:00.000Z'),
    direction: 'out',
  },
  {
    author: {
      email: 'manu.dusupport@app.crisp.com',
      name: 'Manu Dusupport',
    },
    message: '[User Input, pas traduit] Bonjour,<br>Voilà la réponse: ➡',
    sentAt: new Date('2023-08-16T00:15:00.000Z'),
    direction: 'in',
  },
  {
    author: {
      email: 'something@uenuast.com',
      name: 'Some Thing',
    },
    message: '[User Input, pas traduit] Bonjour, j’ai un problème',
    sentAt: new Date('2023-08-15T00:15:00.000Z'),
    direction: 'out',
  },
  {
    author: {
      email: 'aline.dusupport@app.crisp.com',
      name: 'Aline Dusupport',
    },
    message: '[User Input, pas traduit] Bonjour,<br>Voilà la réponse: ➡',
    sentAt: new Date('2023-08-16T00:15:00.000Z'),
    direction: 'in',
  },
];

export const defaultStory = makeStory(conf, {
  items: [{
    orga,
    user,
  }, {
    orga,
    user,
    ticket,
    messages,
  }],
});
