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
    { redirection: { state: 'loaded', namespace: 'default', sourcePort: 5220 } },
    { redirection: { state: 'loaded', namespace: 'cleverapps' } },
  ],
});

const baseItems = [
  { redirection: { state: 'loaded', namespace: 'customer-name', private: true } },
  { redirection: { state: 'loaded', namespace: 'default' } },
  { redirection: { state: 'loaded', namespace: 'cleverapps' } },
  { redirection: { state: 'loaded', namespace: 'alternative' } },
];

const baseItemsWithRedirection = baseItems.map((props, i) => {
  return { redirection: { ...props.redirection, sourcePort: 1000 + i } };
});

export const loading = makeStory(conf, {
  items: [
    { redirection: { state: 'loading', namespace: 'customer-name', sourcePort: 1234, private: true } },
    { redirection: { state: 'loading', namespace: 'default' } },
    { redirection: { state: 'loading', namespace: 'cleverapps' } },
  ],
});

export const dataLoadedWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection,
});

export const dataLoadedWithNoRedirection = makeStory(conf, {
  items: baseItems,
});

export const waitingWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection.map((props) => {
    return { redirection: { ...props.redirection, state: 'waiting' } };
  }),
});

export const waitingWithNoRedirection = makeStory(conf, {
  items: baseItems.map((props) => {
    return { redirection: { ...props.redirection, state: 'waiting' } };
  }),
});

enhanceStoriesNames({
  defaultStory,
  loading,
  dataLoadedWithRedirection,
  dataLoadedWithNoRedirection,
  waitingWithRedirection,
  waitingWithNoRedirection,
});
