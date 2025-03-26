import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-api-token-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-api-token-list>',
  component: 'cc-api-token-list',
};

/**
 * @typedef {import('./cc-api-token-list.js').CcApiTokenList} CcApiTokenList
 * @typedef {import('./cc-api-token-list.types.js').ApiTokenState} ApiTokenState
 */

const conf = {
  component: 'cc-api-token-list',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {Array<ApiTokenState>} */
const baseTokens = [
  {
    type: 'idle',
    id: '1',
    name: 'CI Pipeline',
    description: 'Used for automated deployments',
    creationDate: new Date(Date.now() - 30 * ONE_DAY).toISOString(),
    expirationDate: new Date(Date.now() + 60 * ONE_DAY).toISOString(),
  },
  {
    type: 'idle',
    id: '2',
    name: 'Monitoring Script',
    description: 'For status checks and alerts',
    creationDate: new Date(Date.now() - 15 * ONE_DAY).toISOString(),
    expirationDate: new Date(Date.now() + 5 * ONE_DAY).toISOString(), // expires soon (5 days)
  },
  {
    type: 'idle',
    id: '3',
    name: 'Backup Service',
    creationDate: new Date(Date.now() - 60 * ONE_DAY).toISOString(),
    expirationDate: new Date(Date.now() + 30 * ONE_DAY).toISOString(),
  },
  {
    type: 'idle',
    id: '4',
    name: 'Dev Environment',
    description: 'Local development testing',
    creationDate: new Date(Date.now() - 10 * ONE_DAY).toISOString(),
    expirationDate: new Date(Date.now() + 2 * ONE_DAY).toISOString(), // expires very soon (2 days)
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcApiTokenList>[]} */
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
  /** @type {Partial<CcApiTokenList>[]} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcApiTokenList>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcApiTokenList>[]} */
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
  /** @type {Partial<CcApiTokenList>[]} */
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

export const simulationsWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcApiTokenList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcApiTokenList[]} components */
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
  /** @type {Partial<CcApiTokenList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcApiTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithRevokingToken = makeStory(conf, {
  /** @type {Partial<CcApiTokenList>[]} */
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
      /** @param {CcApiTokenList[]} components */
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
      /** @param {CcApiTokenList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.filter((_, index) => index !== 1),
        };
      },
    ),
  ],
});
