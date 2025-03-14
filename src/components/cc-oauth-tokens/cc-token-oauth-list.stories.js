import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-oauth-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-oauth-list>',
  component: 'cc-token-oauth-list',
};

/**
 * @typedef {import('./cc-token-oauth-list.js').CcTokenOauthList} CcTokenOauthList
 * @typedef {import('./cc-token-oauth-list.types.js').TokenOauthState} TokenOauthState
 */

const conf = {
  component: 'cc-token-oauth-list',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {Array<TokenOauthState>} */
const baseTokens = [
  {
    type: 'idle',
    id: '1',
    consumerName: 'clever-tools',
    creationDate: new Date(Date.now() - 180 * ONE_DAY),
    expirationDate: new Date(Date.now() + 32 * ONE_DAY), // does not expire soon (32 days)
    lastUsedDate: new Date(Date.now() - 30 * ONE_DAY),
    imageUrl: 'https://assets.clever-cloud.com/logos/clever-tools.svg',
  },
  {
    type: 'idle',
    id: '2',
    consumerName: 'Matomo',
    creationDate: new Date(Date.now() - 90 * ONE_DAY),
    expirationDate: new Date(Date.now() + 45 * ONE_DAY), // does not expire soon (45 days)
    lastUsedDate: new Date(Date.now() - 7 * ONE_DAY),
    imageUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
  },
  {
    type: 'idle',
    id: '3',
    consumerName: 'Grafana',
    creationDate: new Date(Date.now() - 240 * ONE_DAY),
    expirationDate: new Date(Date.now() + 6 * ONE_DAY), // expires soon (6 days)
    lastUsedDate: new Date(Date.now() - 10 * ONE_DAY),
    imageUrl: 'https://assets.clever-cloud.com/logos/grafana.svg',
  },
  {
    type: 'idle',
    id: '4',
    consumerName: 'clever-tools',
    creationDate: new Date(Date.now() - 30 * ONE_DAY),
    expirationDate: new Date(Date.now() + 2 * ONE_DAY), // expires soon (2 days)
    lastUsedDate: new Date(Date.now() - 2 * ONE_DAY),
    imageUrl: 'https://assets.clever-cloud.com/logos/clever-tools.svg',
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        oauthTokens: baseTokens,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        oauthTokens: [],
      },
    },
  ],
});

export const waitingWithRevokingOneToken = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        oauthTokens: baseTokens.map((token, index) => {
          if (index === 2) {
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
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: {
        type: 'revoking-all',
        oauthTokens: baseTokens.map((token) => ({
          ...token,
          type: 'revoking',
        })),
      },
    },
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenOauthList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          oauthTokens: baseTokens,
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenOauthList[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithRevokingToken = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        oauthTokens: baseTokens,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcTokenOauthList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          oauthTokens: baseTokens.map((token, index) => {
            if (index === 1) {
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
      /** @param {CcTokenOauthList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          oauthTokens: baseTokens.filter((_, index) => index !== 1),
        };
      },
    ),
  ],
});

export const simulationsWithRevokingAllTokens = makeStory(conf, {
  /** @type {Partial<CcTokenOauthList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        oauthTokens: baseTokens,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcTokenOauthList[]} components */
      ([component]) => {
        component.state = {
          type: 'revoking-all',
          oauthTokens: baseTokens.map((token) => ({
            ...token,
            type: 'revoking',
          })),
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcTokenOauthList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          oauthTokens: [],
        };
      },
    ),
  ],
});
