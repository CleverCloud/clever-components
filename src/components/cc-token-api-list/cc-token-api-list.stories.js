import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-api-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-api-list>',
  component: 'cc-token-api-list',
};

/**
 * @typedef {import('./cc-token-api-list.js').CcTokenApiList} CcTokenApiList
 * @typedef {import('./cc-token-api-list.types.js').TokenApiState} TokenApiState
 */

const conf = {
  component: 'cc-token-api-list',
};

const ONE_DAY = 24 * 60 * 60 * 1000;

/** @type {Array<TokenApiState>} */
const baseTokens = [
  {
    type: 'idle',
    id: 'fake_api_token_bd367d99-5e42-4934-9b50-40a4a6d01766',
    name: 'CI Pipeline',
    description: 'Used for automated deployments',
    creationDate: new Date(Date.now() - 30 * ONE_DAY),
    expirationDate: new Date(Date.now() + 60 * ONE_DAY),
  },
  {
    type: 'idle',
    id: 'fake_api_token_a6c89d22-3ef7-49f1-b2dc-5792e478a7c9',
    name: 'Monitoring Script',
    description: 'For status checks and alerts',
    creationDate: new Date(Date.now() - 15 * ONE_DAY),
    expirationDate: new Date(Date.now() + 5 * ONE_DAY), // expires soon (5 days)
  },
  {
    type: 'idle',
    id: 'fake_api_token_c723f1e5-3d8a-4d1b-a8e5-46d6f75c8a32',
    name: 'Backup Service',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus fringilla lectus vel magna pulvinar, in finibus nulla ultricies. Suspendisse potenti. Maecenas nec lacus vel nisl convallis feugiat in sit amet massa.',
    creationDate: new Date(Date.now() - 60 * ONE_DAY),
    expirationDate: new Date(Date.now() + 30 * ONE_DAY),
  },
  {
    type: 'idle',
    id: 'fake_api_token_f8e51b94-8107-4d59-a716-923895d78d04',
    name: 'Dev Environment',
    description: 'Local development testing',
    creationDate: new Date(Date.now() - 10 * ONE_DAY),
    expirationDate: new Date(Date.now() + 2 * ONE_DAY), // expires very soon (2 days)
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        apiTokens: baseTokens,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        apiTokens: [],
      },
    },
  ],
});

export const waitingWithRevokingOneToken = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        apiTokens: baseTokens.map((token, index) => {
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
  /** @type {Partial<CcTokenApiList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          apiTokens: baseTokens,
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiList[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithRevokingToken = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        apiTokens: baseTokens,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcTokenApiList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          apiTokens: baseTokens.map((token, index) => {
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
      /** @param {CcTokenApiList[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          apiTokens: baseTokens.filter((_, index) => index !== 1),
        };
      },
    ),
  ],
});
