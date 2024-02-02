import './cc-tcp-redirection.js';
import { makeStory } from '../../stories/lib/make-story.js';

const baseItems = [
  { redirection: { state: 'loaded', namespace: 'customer-name', isPrivate: true } },
  { redirection: { state: 'loaded', namespace: 'default' } },
  { redirection: { state: 'loaded', namespace: 'cleverapps' } },
  { redirection: { state: 'loaded', namespace: 'alternative' } },
];

const baseItemsWithRedirection = baseItems.map((item, i) => {
  return { redirection: { ...item.redirection, sourcePort: 1000 + i } };
});

export default {
  title: '🛠 TCP Redirections/<cc-tcp-redirection>',
  component: 'cc-tcp-redirection',
};

const conf = {
  component: 'cc-tcp-redirection',
};

export const defaultStory = makeStory(conf, {
  items: [
    { redirection: { state: 'loaded', namespace: 'default', sourcePort: 5220 } },
    { redirection: { state: 'loaded', namespace: 'cleverapps' } },
  ],
});

export const loading = makeStory(conf, {
  items: [
    { redirection: { state: 'loading' } },
    { redirection: { state: 'loading' } },
    { redirection: { state: 'loading' } },
  ],
});

export const dataLoadedWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection,
});

export const dataLoadedWithNoRedirection = makeStory(conf, {
  items: baseItems,
});

export const waitingWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection.map((item) => {
    return { redirection: { ...item.redirection, state: 'waiting' } };
  }),
});

export const waitingWithNoRedirection = makeStory(conf, {
  items: baseItems.map((item) => {
    return { redirection: { ...item.redirection, state: 'waiting' } };
  }),
});
