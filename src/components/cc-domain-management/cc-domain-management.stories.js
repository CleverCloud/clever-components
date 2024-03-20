import { randomString } from '../../lib/utils.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-domain-management.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠️ <cc-domain-management-beta>',
  component: 'cc-domain-management-beta',
};

const conf = {
  component: 'cc-domain-management-beta',
};

const baseDomains = [
  { name: 'example.com' },
  { name: 'blog.example.com' },
  { name: 'www.example.com', isPrimary: true },
  { name: 'toto.example.com' },
  { name: 'example.com/api' },
  { name: 'example.org' },
  { name: 'www.example.org' },
  { name: 'blog.example.org' },
  { name: 'perso.example.org' },
  { name: `${randomString(7).toLowerCase()}.cleverapps.io` },
];

export const defaultStory = makeStory(conf, {
  items: [{
    domainListState: {
      type: 'loaded',
      domains: baseDomains,
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{
    domainListState: {
      type: 'loading',
    },
  }],
});
