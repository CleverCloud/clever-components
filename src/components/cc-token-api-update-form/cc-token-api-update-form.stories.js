import { generateDocsHref } from '../../lib/utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-api-update-form.js';

const CC_TOKEN_API_LIST_STORY_HREF = generateDocsHref(
  '/clever-components/?path=/story/🛠-profile-cc-token-api-list--default-story',
);

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-api-update-form>',
  component: 'cc-token-api-update-form',
};

/**
 * @typedef {import('./cc-token-api-update-form.js').CcTokenApiUpdateForm} CcTokenApiUpdateForm
 * @typedef {import('./cc-token-api-update-form.types.js').TokenApiUpdateFormStateLoaded} TokenApiUpdateFormStateLoaded
 * @typedef {import('./cc-token-api-update-form.types.js').TokenApiUpdateFormStateUpdating} TokenApiUpdateFormStateUpdating
 */

const conf = {
  component: 'cc-token-api-update-form',
};

const baseValues = {
  name: 'CI Pipeline Token',
  description: 'Used for automated deployments from the CI.',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: {
        type: 'loaded',
        values: baseValues,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: { type: 'error' },
    },
  ],
});

export const errorWithEmptyName = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: {
        type: 'loaded',
        values: {
          name: '',
          description: '',
        },
      },
    },
  ],
  /** @param {CcTokenApiUpdateForm} component */
  onUpdateComplete: (component) => {
    component.shadowRoot.querySelector('form').requestSubmit();
  },
});

export const updating = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: {
        type: 'updating',
        values: {
          name: 'Prod CI Pipeline Token',
          description: 'Used for automated deployments from the CI (prod only).',
        },
      },
    },
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          values: baseValues,
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.state = { type: 'error' };
      },
    ),
  ],
});

export const simulationsWithUpdatingSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: {
        type: 'loaded',
        values: baseValues,
      },
    },
  ],
  simulations: [
    storyWait(
      1500,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          values: {
            name: 'Prod CI Pipeline Token',
            description: baseValues.description,
          },
        };
      },
    ),
    storyWait(
      1500,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          values: {
            name: 'Prod CI Pipeline Token',
            description: 'Description for the prod CI Pipeline token',
          },
        };
      },
    ),
    storyWait(
      1500,
      /** @param {Array<CcTokenApiUpdateForm & { state: TokenApiUpdateFormStateUpdating | TokenApiUpdateFormStateLoaded }>} components */
      ([component]) => {
        component.state = {
          ...component.state,
          type: 'updating',
        };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcTokenApiUpdateForm & { state: TokenApiUpdateFormStateUpdating | TokenApiUpdateFormStateLoaded }>} components */
      ([component]) => {
        component.state = {
          ...component.state,
          type: 'loaded',
        };
      },
    ),
  ],
});

export const simulationsWithEmptyError = makeStory(conf, {
  /** @type {Partial<CcTokenApiUpdateForm>[]} */
  items: [
    {
      apiTokenListHref: CC_TOKEN_API_LIST_STORY_HREF,
      state: {
        type: 'loaded',
        values: baseValues,
      },
    },
  ],
  simulations: [
    storyWait(
      1500,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          values: {
            name: '',
            description: '',
          },
        };
      },
    ),
    storyWait(
      1500,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.shadowRoot.querySelector('form').requestSubmit();
      },
    ),
    storyWait(
      1500,
      /** @param {CcTokenApiUpdateForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          values: {
            name: 'My Token Name',
            description: '',
          },
        };
      },
    ),
    storyWait(
      1500,
      /** @param {Array<CcTokenApiUpdateForm & { state: TokenApiUpdateFormStateUpdating | TokenApiUpdateFormStateLoaded }>} components */
      ([component]) => {
        component.shadowRoot.querySelector('form').requestSubmit();
        component.state = {
          ...component.state,
          type: 'updating',
        };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcTokenApiUpdateForm & { state: TokenApiUpdateFormStateUpdating | TokenApiUpdateFormStateLoaded }>} components */
      ([component]) => {
        component.state = {
          ...component.state,
          type: 'loaded',
        };
      },
    ),
  ],
});
