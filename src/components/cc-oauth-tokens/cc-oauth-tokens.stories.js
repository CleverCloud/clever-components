import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-oauth-tokens.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-oauth-tokens>',
  component: 'cc-oauth-tokens',
};

/**
 * @typedef {import('./cc-oauth-tokens.js').CcOauthTokens} CcOauthTokens
 * @typedef {import('./cc-oauth-tokens.types.js').OauthTokenState} OauthTokenState
 */

const conf = {
  component: 'cc-oauth-tokens',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {Array<OauthTokenState>} */
const baseTokens = [
  {
    type: 'idle',
    id: '1',
    consumerName: 'Github integration',
    creationDate: new Date(Date.now() - 180 * ONE_DAY).toISOString(),
    lastUsedDate: new Date(Date.now() - 30 * ONE_DAY).toISOString(),
  },
  {
    type: 'idle',
    id: '2',
    consumerName: 'CI pipeline',
    creationDate: new Date(Date.now() - 90 * ONE_DAY).toISOString(),
    lastUsedDate: new Date(Date.now() - 7 * ONE_DAY).toISOString(),
  },
  {
    type: 'idle',
    id: '3',
    consumerName: 'Monitoring tool',
    creationDate: new Date(Date.now() - 240 * ONE_DAY).toISOString(),
    lastUsedDate: new Date(Date.now() - 10 * ONE_DAY).toISOString(),
  },
  {
    type: 'idle',
    id: '4',
    consumerName: 'Deployment script',
    creationDate: new Date(Date.now() - 30 * ONE_DAY).toISOString(),
    lastUsedDate: new Date(Date.now() - 2 * ONE_DAY).toISOString(),
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcOauthTokens>[]} */
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
  /** @type {Partial<CcOauthTokens>[]} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcOauthTokens>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcOauthTokens>[]} */
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
  /** @type {Partial<CcOauthTokens>[]} */
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
  /** @type {Partial<CcOauthTokens>[]} */
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

export const simulationsWithLoading = makeStory(conf, {
  /** @type {Partial<CcOauthTokens>[]} */
  items: [{ state: { type: 'loading' } }, { state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcOauthTokens[]} components */
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
  /** @type {Partial<CcOauthTokens>[]} */
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
      /** @param {CcOauthTokens[]} components */
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
      /** @param {CcOauthTokens[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tokens: baseTokens.filter((_, index) => index !== 1),
        };
      },
    ),
  ],
});
