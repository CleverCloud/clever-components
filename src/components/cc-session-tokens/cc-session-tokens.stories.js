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
    creationDate: new Date('2023-01-15T00:00:00Z').toISOString(), // long-lived token (180 days old)
    expirationDate: new Date('2023-07-15T00:00:00Z').toISOString(), // 180 days in future
    lastUsedDate: new Date('2023-05-15T00:00:00Z').toISOString(), // 30 days ago
    isCurrentSession: false,
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '2',
    creationDate: new Date('2023-03-15T00:00:00Z').toISOString(), // medium-aged token (90 days old)
    expirationDate: new Date('2023-07-15T00:00:00Z').toISOString(), // 29 days in future (expires soon for tokens > 90 days)
    lastUsedDate: new Date('2023-06-08T00:00:00Z').toISOString(), // recent use (7 days ago)
    isCurrentSession: true,
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '3',
    creationDate: new Date('2022-09-15T00:00:00Z').toISOString(), // very old token (240 days old)
    expirationDate: new Date('2023-06-22T00:00:00Z').toISOString(), // 6 days in future (expires soon for tokens <= 30 days)
    lastUsedDate: new Date('2023-06-05T00:00:00Z').toISOString(), // 10 days ago
    isCurrentSession: false,
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '4',
    creationDate: new Date('2022-07-01T00:00:00Z').toISOString(), // extremely old token (350 days old)
    expirationDate: new Date('2023-06-18T00:00:00Z').toISOString(), // 2 days in future (expires soon for any token)
    lastUsedDate: new Date('2023-06-13T00:00:00Z').toISOString(), // very recent use (2 days ago)
    isCurrentSession: false,
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '5',
    creationDate: new Date('2023-04-05T00:00:00Z').toISOString(), // newer token (70 days old)
    expirationDate: new Date('2023-06-25T00:00:00Z').toISOString(), // 9 days in future (expires soon for tokens <= 60 days)
    lastUsedDate: new Date('2023-06-14T00:00:00Z').toISOString(), // very recent use (1 day ago)
    isCurrentSession: false,
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '6',
    creationDate: new Date('2023-03-25T00:00:00Z').toISOString(), // medium-aged token (80 days old)
    expirationDate: new Date('2023-07-05T00:00:00Z').toISOString(), // 19 days in future (expires soon for tokens <= 90 days)
    lastUsedDate: new Date('2023-06-10T00:00:00Z').toISOString(), // recent use (5 days ago)
    isCurrentSession: false,
    isCleverTeam: true,
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

export const dataLoadedWithCleverTeamAsCurrentSession = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens.map((token) => ({ ...token, isCleverTeam: token.isCurrentSession })),
      },
    },
  ],
});
