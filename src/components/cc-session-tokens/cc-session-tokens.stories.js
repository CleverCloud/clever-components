import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-session-tokens.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-session-tokens>',
  component: 'cc-session-tokens',
};

/**
 * @typedef {import('./cc-session-tokens.js').CcSessionTokens} CcSessionTokens
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateIdle} SessionTokenStateIdle
 * @typedef {import('./cc-session-tokens.types.js').SessionTokenStateCurrent} SessionTokenStateCurrent
 */

const conf = {
  component: 'cc-session-tokens',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {Array<SessionTokenStateIdle|SessionTokenStateCurrent>} */
const baseTokens = [
  {
    type: 'idle',
    id: '1',
    creationDate: new Date(Date.now() - 180 * ONE_DAY).toISOString(), // long-lived token (180 days old)
    expirationDate: new Date(Date.now() + 32 * ONE_DAY).toISOString(), // does not expire soon (32 days)
    lastUsedDate: new Date(Date.now() - 30 * ONE_DAY).toISOString(), // 30 days ago
    isCleverTeam: false,
  },
  {
    type: 'current',
    id: '2',
    creationDate: new Date(Date.now() - 89 * ONE_DAY).toISOString(), // medium-aged token (90 days old)
    expirationDate: new Date(Date.now() + 32 * ONE_DAY).toISOString(), // does not expire soon (32 days)
    lastUsedDate: new Date(Date.now() - 7 * ONE_DAY).toISOString(), // recent use (7 days ago)
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '3',
    creationDate: new Date(Date.now() - 240 * ONE_DAY).toISOString(), // very old token (240 days old)
    expirationDate: new Date(Date.now() + 6 * ONE_DAY).toISOString(), // expires soon (6 days)
    lastUsedDate: new Date(Date.now() - 10 * ONE_DAY).toISOString(), // 10 days ago
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '4',
    creationDate: new Date(Date.now() - 350 * ONE_DAY).toISOString(), // extremely old token (350 days old)
    expirationDate: new Date(Date.now() + 2 * ONE_DAY).toISOString(), // expires soon (2 days)
    lastUsedDate: new Date(Date.now() - 2 * ONE_DAY).toISOString(), // very recent use (2 days ago)
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '5',
    creationDate: new Date(Date.now() - 70 * ONE_DAY).toISOString(), // newer token (70 days old)
    expirationDate: new Date(Date.now() + 45 * ONE_DAY).toISOString(), // does not expire soon (45 days)
    lastUsedDate: new Date(Date.now() - 1 * ONE_DAY).toISOString(), // very recent use (1 day ago)
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '6',
    creationDate: new Date(Date.now() - 80 * ONE_DAY).toISOString(), // medium-aged token (80 days old)
    expirationDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // expires soon (0.25 days)
    lastUsedDate: new Date(Date.now() - 5 * ONE_DAY).toISOString(), // recent use (5 days ago)
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
        type: 'revoking-all',
        tokens: baseTokens.map((token) => ({
          ...token,
          type: token.type === 'current' ? 'current' : 'revoking',
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
        tokens: baseTokens.filter((token) => token.type === 'current'),
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
        tokens: baseTokens.map((token) => ({ ...token, isCleverTeam: token.type === 'current' })),
      },
    },
  ],
});

export const simulationsWithLoading = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [{ state: { type: 'loading' } }, { state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcSessionTokens[]} components */
      ([componentSuccess, componentError]) => {
        componentSuccess.state = {
          type: 'loaded',
          tokens: baseTokens,
        };
        componentError.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithRevokingToken = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcSessionTokens[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.map((token, index) => {
            if (index === 3) {
              return {
                ...token,
                type: 'revoking',
              };
            }
            return token;
          }),
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcSessionTokens[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.filter((_, index) => index !== 3),
        };
      },
    ),
  ],
});

export const simulationsWithRevokingAllTokens = makeStory(conf, {
  /** @type {Partial<CcSessionTokens>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcSessionTokens[]} components */
      ([component]) => {
        component.state = {
          type: 'revoking-all',
          tokens: baseTokens.map((token) => ({
            ...token,
            type: token.type === 'current' ? 'current' : 'revoking',
          })),
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcSessionTokens[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.filter((token) => token.type === 'current'),
        };
      },
    ),
  ],
});
