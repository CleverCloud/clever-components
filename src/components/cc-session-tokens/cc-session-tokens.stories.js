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
    creationDate: '2023-01-01T12:00:00Z',
    expirationDate: '2024-01-01T12:00:00Z',
    lastUsedDate: '2023-06-15T15:45:30Z',
  },
  {
    type: 'idle',
    id: '2',
    creationDate: '2023-02-15T09:30:00Z',
    expirationDate: '2024-02-15T09:30:00Z',
    lastUsedDate: '2023-07-01T10:22:15Z',
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
          if (index === 1) {
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
