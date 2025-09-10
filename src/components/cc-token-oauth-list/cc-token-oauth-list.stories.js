import { getAssetUrl } from '../../lib/assets-url.js';
import { shiftDateField } from '../../lib/date/date-utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-oauth-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-oauth-list>',
  component: 'cc-token-oauth-list',
};

/**
 * @typedef {import('./cc-token-oauth-list.js').CcTokenOauthList} CcTokenOauthList
 * @typedef {import('./cc-token-oauth-list.types.js').OauthTokenState} OauthTokenState
 */

const conf = {
  component: 'cc-token-oauth-list',
};

const NOW = new Date();

/** @type {Array<OauthTokenState>} */
const baseTokens = [
  {
    type: 'idle',
    id: 'token-1',
    consumerName: 'clever-tools',
    creationDate: shiftDateField(NOW, 'D', -180),
    expirationDate: shiftDateField(NOW, 'D', 32), // does not expire soon (32 days)
    lastUsedDate: shiftDateField(NOW, 'D', -30),
    imageUrl: getAssetUrl('/logos/clever-tools.svg'),
  },
  {
    type: 'idle',
    id: 'token-2',
    consumerName: 'Matomo',
    creationDate: shiftDateField(NOW, 'D', -90),
    expirationDate: shiftDateField(NOW, 'D', 45), // does not expire soon (45 days)
    lastUsedDate: shiftDateField(NOW, 'D', -7),
    imageUrl: getAssetUrl('/logos/matomo.svg'),
  },
  {
    type: 'idle',
    id: 'token-3',
    consumerName: 'Grafana',
    creationDate: shiftDateField(NOW, 'D', -240),
    expirationDate: shiftDateField(NOW, 'D', 6), // expires soon (6 days)
    lastUsedDate: shiftDateField(NOW, 'D', -10),
    imageUrl: getAssetUrl('/logos/grafana.svg'),
  },
  {
    type: 'idle',
    id: 'token-4',
    consumerName: 'Console - Staging',
    creationDate: shiftDateField(NOW, 'D', -30),
    expirationDate: shiftDateField(NOW, 'D', 2), // expires soon (2 days)
    lastUsedDate: shiftDateField(NOW, 'D', -2),
    imageUrl: getAssetUrl('/login-assets/img/logo.svg'),
  },
  {
    type: 'idle',
    id: 'token-5',
    consumerName: 'clever-tools',
    creationDate: shiftDateField(NOW, 'D', -30),
    expirationDate: shiftDateField(NOW, 'D', 2), // expires soon (2 days)
    lastUsedDate: shiftDateField(NOW, 'D', -2),
    imageUrl: getAssetUrl('/logos/clever-tools.svg'),
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
