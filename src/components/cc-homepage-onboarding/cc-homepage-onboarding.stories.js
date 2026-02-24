import { makeStory } from '../../stories/lib/make-story.js';
import './cc-homepage-onboarding.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Homepage/<cc-homepage-onboarding>',
  component: 'cc-homepage-onboarding',
};

const conf = {
  component: 'cc-homepage-onboarding',
  css: `
    :host {
      max-width: 92em !important;
    }
  `,
};

/**
 * @import { HomepageOnboardingStateLoaded, HomepageOnboardingStateLoading, HomepageOnboardingStateError } from './cc-homepage-onboarding.types.js'
 */

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {HomepageOnboardingStateLoaded} */
      state: {
        type: 'loaded',
        userType: 'already-user',
        cardIds: ['newResource', 'sshKeys', 'cli', 'support'],
        organisationOptions: [
          { label: 'Orga1', value: 'orga1' },
          { label: 'Orga2', value: 'orga2' },
          { label: 'Orga3', value: 'orga3' },
        ],
      },
    },
  ],
});

export const newUserStory = makeStory(conf, {
  items: [
    {
      /** @type {HomepageOnboardingStateLoaded} */
      state: {
        type: 'loaded',
        userType: 'new-user',
        cardIds: ['newProject', 'secure', 'configPayment', 'support'],
        organisationOptions: [],
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {HomepageOnboardingStateLoading} */
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {HomepageOnboardingStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});
