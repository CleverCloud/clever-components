import '../../components/tcp-redirections/cc-tcp-redirection.js';
import notes from '../../.components-docs/cc-tcp-redirection.md';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 TCP Redirections|<cc-tcp-redirection>',
  component: 'cc-tcp-redirection',
  parameters: { notes },
};

const conf = {
  component: 'cc-tcp-redirection',
  events: ['cc-tcp-redirection:create', 'cc-tcp-redirection:delete'],
  css: 'cc-tcp-redirection { margin-bottom: 1rem; }',
};

export const defaultStory = makeStory(conf, {
  items: [
    { namespace: 'default', sourcePort: 5220 },
    { namespace: 'cleverapps' },
  ],
});

const baseItems = [
  { namespace: 'customer-name', private: true },
  { namespace: 'default' },
  { namespace: 'cleverapps' },
  { namespace: 'alternative' },
];

const baseItemsWithRedirection = baseItems.map((p, i) => ({ ...p, sourcePort: 1000 + i }));

export const loading = makeStory(conf, {
  items: [
    { skeleton: true, namespace: 'customer-name', sourcePort: 1234, private: true },
    { skeleton: true, namespace: 'default' },
    { skeleton: true, namespace: 'cleverapps' },
  ],
});

export const dataLoadedWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection,
});

export const dataLoadedWithNoRedirection = makeStory(conf, {
  items: baseItems,
});

export const waitingWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection.map((p) => ({ ...p, waiting: true })),
});

export const waitingWithNoRedirection = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, waiting: true })),
});

export const errorWithCreation = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, error: true })),
});

export const errorWithDeletion = makeStory(conf, {
  items: baseItemsWithRedirection.map((p) => ({ ...p, error: true })),
});

enhanceStoriesNames({
  defaultStory,
  loading,
  dataLoadedWithRedirection,
  dataLoadedWithNoRedirection,
  waitingWithRedirection,
  waitingWithNoRedirection,
  errorWithCreation,
  errorWithDeletion,
});
