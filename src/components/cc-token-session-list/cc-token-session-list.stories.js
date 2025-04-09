import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-session-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-session-list>',
  component: 'cc-token-session-list',
};

/**
 * @typedef {import('./cc-token-session-list.js').CcTokenSessionList} CcTokenSessionList
 * @typedef {import('./cc-token-session-list.types.js').SessionTokenStateIdle} SessionTokenStateIdle
 * @typedef {import('./cc-token-session-list.types.js').SessionToken} SessionToken
 */

const conf = {
  component: 'cc-token-session-list',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {SessionToken} */
const currentSession = {
  id: '2',
  creationDate: new Date(Date.now() - 89 * ONE_DAY), // medium-aged token (90 days old)
  expirationDate: new Date(Date.now() + 32 * ONE_DAY), // does not expire soon (32 days)
  lastUsedDate: new Date(Date.now() - 7 * ONE_DAY), // recent use (7 days ago)
  isCleverTeam: false,
};

/** @type {Array<SessionTokenStateIdle>} */
const otherSessions = [
  {
    type: 'idle',
    id: '1',
    creationDate: new Date(Date.now() - 180 * ONE_DAY), // long-lived token (180 days old)
    expirationDate: new Date(Date.now() + 32 * ONE_DAY), // does not expire soon (32 days)
    lastUsedDate: new Date(Date.now() - 30 * ONE_DAY), // 30 days ago
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '3',
    creationDate: new Date(Date.now() - 240 * ONE_DAY), // very old token (240 days old)
    expirationDate: new Date(Date.now() + 6 * ONE_DAY), // expires soon (6 days)
    lastUsedDate: new Date(Date.now() - 10 * ONE_DAY), // 10 days ago
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '4',
    creationDate: new Date(Date.now() - 350 * ONE_DAY), // extremely old token (350 days old)
    expirationDate: new Date(Date.now() + 2 * ONE_DAY), // expires soon (2 days)
    lastUsedDate: new Date(Date.now() - 2 * ONE_DAY), // very recent use (2 days ago)
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '5',
    creationDate: new Date(Date.now() - 70 * ONE_DAY), // newer token (70 days old)
    expirationDate: new Date(Date.now() + 45 * ONE_DAY), // does not expire soon (45 days)
    lastUsedDate: new Date(Date.now() - 1 * ONE_DAY), // very recent use (1 day ago)
    isCleverTeam: false,
  },
  {
    type: 'idle',
    id: '6',
    creationDate: new Date(Date.now() - 80 * ONE_DAY), // medium-aged token (80 days old)
    expirationDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // expires soon (0.25 days)
    lastUsedDate: new Date(Date.now() - 5 * ONE_DAY), // recent use (5 days ago)
    isCleverTeam: true,
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: currentSession,
        otherSessionTokens: otherSessions,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [{ state: { type: 'error' } }],
});

export const waitingWithRevokingOneToken = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: currentSession,
        otherSessionTokens: otherSessions.map((token, index) => {
          if (index === 3) {
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
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'revoking-all',
        currentSessionToken: currentSession,
        otherSessionTokens: otherSessions.map((token) => ({
          ...token,
          type: 'revoking',
        })),
      },
    },
  ],
});

export const dataLoadedWithOnlyCurrentSession = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: currentSession,
        otherSessionTokens: [],
      },
    },
  ],
});

export const dataLoadedWithCleverTeamAsCurrentSession = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: {
          ...currentSession,
          isCleverTeam: true,
        },
        otherSessionTokens: otherSessions,
      },
    },
  ],
});

export const dataLoadedWithCleverTeamAndExpirationCloseNoVisibleWarning = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: {
          ...currentSession,
        },
        otherSessionTokens: otherSessions.map((session) => {
          if (session.isCleverTeam) {
            return {
              ...session,
              expirationDate: new Date(Date.now() + 6 * ONE_DAY), // expires soon (6 days)
            };
          }

          return { ...session };
        }),
      },
    },
  ],
});

export const dataLoadedWithCleverTeamAsCurrentSessionAndExpirationCloseNoVisibleWarning = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: {
          ...currentSession,
          isCleverTeam: true,
          expirationDate: new Date(Date.now() + 6 * ONE_DAY), // expires soon (6 days)
        },
        otherSessionTokens: otherSessions,
      },
    },
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenSessionList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          currentSessionToken: currentSession,
          otherSessionTokens: otherSessions,
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenSessionList[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithRevokingToken = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: currentSession,
        otherSessionTokens: otherSessions,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcTokenSessionList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          currentSessionToken: currentSession,
          otherSessionTokens: otherSessions.map((token, index) => {
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
      /** @param {CcTokenSessionList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          currentSessionToken: currentSession,
          otherSessionTokens: otherSessions.filter((_, index) => index !== 3),
        };
      },
    ),
  ],
});

export const simulationsWithRevokingAllTokens = makeStory(conf, {
  /** @type {Partial<CcTokenSessionList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        currentSessionToken: currentSession,
        otherSessionTokens: otherSessions,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcTokenSessionList[]} components */
      ([component]) => {
        component.state = {
          type: 'revoking-all',
          currentSessionToken: currentSession,
          otherSessionTokens: otherSessions.map((token) => ({
            ...token,
            type: 'revoking',
          })),
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcTokenSessionList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          currentSessionToken: currentSession,
          otherSessionTokens: [],
        };
      },
    ),
  ],
});
