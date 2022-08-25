import './cc-tcp-redirection.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 TCP Redirections/<cc-tcp-redirection>',
  component: 'cc-tcp-redirection',
};

const conf = {
  component: 'cc-tcp-redirection',
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

enhanceStoriesNames({
  defaultStory,
  loading,
  dataLoadedWithRedirection,
  dataLoadedWithNoRedirection,
  waitingWithRedirection,
  waitingWithNoRedirection,
});
