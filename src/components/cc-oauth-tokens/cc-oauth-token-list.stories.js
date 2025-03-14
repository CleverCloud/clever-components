import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-oauth-token-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-oauth-token-list>',
  component: 'cc-oauth-token-list',
};

/**
 * @typedef {import('./cc-oauth-token-list.js').CcOauthTokenList} CcOauthTokenList
 * @typedef {import('./cc-oauth-token-list.types.js').OauthTokenState} OauthTokenState
 */

const conf = {
  component: 'cc-oauth-token-list',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {Array<OauthTokenState>} */
const baseTokens = [
  {
    type: 'idle',
    id: '1',
    consumerName: 'Github integration',
    creationDate: new Date(Date.now() - 180 * ONE_DAY),
    expirationDate: new Date(Date.now() + 32 * ONE_DAY), // does not expire soon (32 days)
    lastUsedDate: new Date(Date.now() - 30 * ONE_DAY),
    imageUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/nodejs.svg',
  },
  {
    type: 'idle',
    id: '2',
    consumerName: 'CI pipeline',
    creationDate: new Date(Date.now() - 90 * ONE_DAY),
    expirationDate: new Date(Date.now() + 45 * ONE_DAY), // does not expire soon (45 days)
    lastUsedDate: new Date(Date.now() - 7 * ONE_DAY),
    imageUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/nodejs.svg',
  },
  {
    type: 'idle',
    id: '3',
    consumerName: 'Monitoring tool',
    creationDate: new Date(Date.now() - 240 * ONE_DAY),
    expirationDate: new Date(Date.now() + 6 * ONE_DAY), // expires soon (6 days)
    lastUsedDate: new Date(Date.now() - 10 * ONE_DAY),
    imageUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/nodejs.svg',
  },
  {
    type: 'idle',
    id: '4',
    consumerName: 'Deployment script',
    creationDate: new Date(Date.now() - 30 * ONE_DAY),
    expirationDate: new Date(Date.now() + 2 * ONE_DAY), // expires soon (2 days)
    lastUsedDate: new Date(Date.now() - 2 * ONE_DAY),
    imageUrl: 'https://cdn.clever-cloud.com/uploads/2023/08/nodejs.svg',
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
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
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: [],
      },
    },
  ],
});

export const waitingWithRevokingOneToken = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tokens: baseTokens.map((token, index) => {
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
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [
    {
      state: {
        type: 'revoking-all',
        tokens: baseTokens.map((token) => ({
          ...token,
          type: 'revoking',
        })),
      },
    },
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcOauthTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens,
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcOauthTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithRevokingToken = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
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
      /** @param {CcOauthTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.map((token, index) => {
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
      /** @param {CcOauthTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.filter((_, index) => index !== 1),
        };
      },
    ),
  ],
});

export const simulationsWithRevokingAllTokens = makeStory(conf, {
  /** @type {Partial<CcOauthTokenList>[]} */
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
      /** @param {CcOauthTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'revoking-all',
          tokens: baseTokens.map((token) => ({
            ...token,
            type: 'revoking',
          })),
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcOauthTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: [],
        };
      },
    ),
  ],
});
