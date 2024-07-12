import { makeStory } from '../../stories/lib/make-story.js';
import './cc-tcp-redirection.js';

/** @type {{state: TcpRedirectionStateLoaded}[]} */
const baseItems = [
  { state: { type: 'loaded', namespace: 'customer-name', isPrivate: true } },
  { state: { type: 'loaded', namespace: 'default', isPrivate: false } },
  { state: { type: 'loaded', namespace: 'cleverapps', isPrivate: false } },
  { state: { type: 'loaded', namespace: 'alternative', isPrivate: false } },
];

/** @type {{state: TcpRedirectionStateLoaded}[]} */
const baseItemsWithRedirection = baseItems.map((item, i) => {
  return { state: { ...item.state, sourcePort: 1000 + i } };
});

export default {
  tags: ['autodocs'],
  title: '🛠 TCP Redirections/<cc-tcp-redirection>',
  component: 'cc-tcp-redirection',
};

const conf = {
  component: 'cc-tcp-redirection',
};

/**
 * @typedef {import('./cc-tcp-redirection.types.js').TcpRedirectionStateLoaded} TcpRedirectionStateLoaded
 * @typedef {import('./cc-tcp-redirection.types.js').TcpRedirectionStateLoading} TcpRedirectionStateLoading
 * @typedef {import('./cc-tcp-redirection.types.js').TcpRedirectionStateWaiting} TcpRedirectionStateWaiting
 */
export const defaultStory = makeStory(conf, {
  /** @type {{state: TcpRedirectionStateLoaded}[]} */
  items: [
    { state: { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 } },
    { state: { type: 'loaded', namespace: 'cleverapps', isPrivate: false } },
  ],
});

export const loading = makeStory(conf, {
  /** @type {{state: TcpRedirectionStateLoading}[]} */
  items: [{ state: { type: 'loading' } }, { state: { type: 'loading' } }, { state: { type: 'loading' } }],
});

export const dataLoadedWithRedirection = makeStory(conf, {
  items: baseItemsWithRedirection,
});

export const dataLoadedWithNoRedirection = makeStory(conf, {
  items: baseItems,
});

export const waitingWithRedirection = makeStory(conf, {
  /** @type {{state: TcpRedirectionStateWaiting}[]} */
  items: baseItemsWithRedirection.map((item) => {
    return { state: { ...item.state, type: 'waiting' } };
  }),
});

export const waitingWithNoRedirection = makeStory(conf, {
  /** @type {{state: TcpRedirectionStateWaiting}[]} */
  items: baseItems.map((item) => {
    return { state: { ...item.state, type: 'waiting' } };
  }),
});
