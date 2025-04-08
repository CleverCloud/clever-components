import { makeStory } from '../../stories/lib/make-story.js';
import './cc-token-api-creation-form.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-api-creation-form>',
  component: 'cc-token-api-creation-form',
};

/**
 * @typedef {import('./cc-token-api-creation-form.js').CcTokenApiCreationForm} CcTokenApiCreationForm
 */

const conf = {
  component: 'cc-token-api-creation-form',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

// TODO: we would need to expose values (password & mfa) + rely on private property
export const waitingWithCreatingToken = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'creating',
        isMfaEnabled: true,
      },
    },
  ],
});

export const dataLoadedWithApiTokenCreated = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'created',
        token: 'this-is-my-super-secret-token-that-should-be-copied',
      },
    },
  ],
});
