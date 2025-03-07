import { makeStory } from '../../stories/lib/make-story.js';
import './cc-session-tokens.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-session-tokens>',
  component: 'cc-session-tokens',
};

/**
 * @typedef {import('./cc-session-tokens.js').CcSessionTokens} CcSessionTokens
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateIdle} SessionTokenStateIdle
 */

const conf = {
  component: 'cc-session-tokens',
};

/** @type {Array<SessionTokenStateIdle>} */
const baseTokens = [
  {
    type: 'idle',
    id: '1',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 180 days ago
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(), // 180 days in future
    lastUsedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    isCurrentSession: false,
  },
  {
    type: 'idle',
    id: '2',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 29).toISOString(), // 29 days in future (expires soon for tokens > 90 days)
    lastUsedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    isCurrentSession: true,
  },
  {
    type: 'idle',
    id: '3',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 240).toISOString(), // 240 days ago
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days in future (expires soon for tokens <= 30 days)
    lastUsedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    isCurrentSession: false,
  },
  {
    type: 'idle',
    id: '4',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 350).toISOString(), // 350 days ago
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days in future (expires soon for any token)
    lastUsedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isCurrentSession: false,
  },
  {
    type: 'idle',
    id: '5',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(), // 70 days ago
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9).toISOString(), // 9 days in future (expires soon for tokens <= 60 days)
    lastUsedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    isCurrentSession: false,
  },
  {
    type: 'idle',
    id: '6',
    creationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 80).toISOString(), // 80 days ago
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 19).toISOString(), // 19 days in future (expires soon for tokens <= 90 days)
    lastUsedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isCurrentSession: false,
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const waitingWithRevokingOneToken = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens.map((token, index) => {
          if (index === 5) {
            return {
              ...token,
              type: 'revoking',
            };
          }

          return token;
        }),
      },
    },
  ],
});

export const waitingWithRevokingAllTokens = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens.map((token) => ({
          ...token,
          type: 'revoking',
        })),
      },
    },
  ],
});

export const dataLoadedWithOnlyCurrentSession = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens.filter((token) => token.isCurrentSession),
      },
    },
  ],
});
