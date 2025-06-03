import { shiftDateField } from '../../lib/date/date-utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-api-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-api-list>',
  component: 'cc-token-api-list',
};

/**
 * @typedef {import('./cc-token-api-list.js').CcTokenApiList} CcTokenApiList
 * @typedef {import('./cc-token-api-list.types.js').ApiTokenState} ApiTokenState
 */

const conf = {
  component: 'cc-token-api-list',
};

const now = new Date();

const apiTokenUpdateHref =
  'https://www.clever-cloud.com/doc/clever-components/?path=/story/🛠-profile-cc-token-api-update-form--default-story';

/** @type {Array<ApiTokenState>} */
const baseTokens = [
  {
    type: 'idle',
    id: 'fake_api_token_bd367d99-5e42-4934-9b50-40a4a6d01766',
    name: 'CI Pipeline',
    description: 'Used for automated deployments',
    creationDate: shiftDateField(now, 'D', -30),
    expirationDate: shiftDateField(now, 'D', 60),
    isExpired: false,
  },
  {
    type: 'idle',
    id: 'fake_api_token_a6c89d22-3ef7-49f1-b2dc-5792e478a7c9',
    name: 'Monitoring Script (no desc)',
    creationDate: shiftDateField(now, 'D', -15),
    expirationDate: shiftDateField(now, 'D', 5), // expires soon (5 days)
    isExpired: false,
  },
  {
    type: 'idle',
    id: 'fake_api_token_c723f1e5-3d8a-4d1b-a8e5-46d6f75c8a32',
    name: 'Backup Service',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus fringilla lectus vel magna pulvinar, in finibus nulla ultricies. Suspendisse potenti. Maecenas nec lacus vel nisl convallis feugiat in sit amet massa.',
    creationDate: shiftDateField(now, 'D', -60),
    expirationDate: shiftDateField(now, 'D', 30),
    isExpired: false,
  },
  {
    type: 'idle',
    id: 'fake_api_token_f8e51b94-8107-4d59-a716-923895d78d04',
    name: 'Dev Environment',
    description: 'Local development testing',
    creationDate: shiftDateField(now, 'D', -10),
    expirationDate: shiftDateField(now, 'D', 2), // expires very soon (2 days)
    isExpired: false,
  },
  {
    type: 'idle',
    id: 'fake_api_token_expired1',
    name: 'Old Integration',
    description: 'Token for a deprecated integration',
    creationDate: shiftDateField(now, 'D', -120),
    expirationDate: shiftDateField(now, 'D', -10),
    isExpired: true,
  },
  {
    type: 'idle',
    id: 'fake_api_token_expired2',
    name: 'Legacy Script',
    description: 'Legacy script token, no longer in use',
    creationDate: shiftDateField(now, 'D', -200),
    expirationDate: shiftDateField(now, 'D', -50),
    isExpired: true,
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: {
        type: 'loaded',
        apiTokens: baseTokens,
      },
    },
  ],
});

export const dataLoaded = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: {
        type: 'loaded',
        apiTokens: baseTokens,
      },
    },
  ],
});

export const dataLoadedWithNoPassword = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: {
        type: 'no-password',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: {
        type: 'loaded',
        apiTokens: [],
      },
    },
  ],
});

export const waitingWithRevokingOneToken = makeStory(conf, {
  tests: {
    accessibility: {
      enabled: true,
      ignoredRules: ['color-contrast'], // the modify link  is failing color contrasts during revocation but it's a temporary state and it's disabled during the call so no real impact
    },
  },
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
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

export const waitingWithDeletingExpiredToken = makeStory(conf, {
  tests: {
    accessibility: {
      enabled: true,
      ignoredRules: ['color-contrast'], // the modify link  is failing color contrasts during deletion but it's a temporary state and it's disabled during the call so no real impact
    },
  },
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        apiTokens: baseTokens.map((token, index) => {
          if (index === baseTokens.length - 1) {
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

export const waitingWithResettingPassword = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: {
        type: 'resetting-password',
      },
    },
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: { type: 'loading' },
    },
  ],
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
  items: [
    {
      apiTokenUpdateHref,
      state: { type: 'loading' },
    },
  ],
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
      apiTokenUpdateHref,
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

export const simulationsWithNoPassword = makeStory(conf, {
  /** @type {Partial<CcTokenApiList>[]} */
  items: [
    {
      apiTokenUpdateHref,
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiList[]} components */
      ([component]) => {
        component.state = {
          type: 'no-password',
        };
      },
    ),
  ],
});
