import './cc-credit-balance.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-credit-balance>',
  component: 'cc-credit-balance',
};

const conf = {
  component: 'cc-credit-balance',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      case: 'New user with no consumption - Middle of the month',
      free: {
        consumed: 0,
        total: 20,
      },
      prepaid: {
        consumed: 0,
        total: 0,
      },
      extra: 0,
    },
    {
      case: 'New user - App XS - Middle of the month',
      free: {
        consumed: 7,
        total: 20,
      },
      prepaid: {
        consumed: 0,
        total: 0,
      },
      extra: 0,
    },
    {
      case: 'New user - App M - Middle of the month',
      free: {
        consumed: 20,
        total: 20,
      },
      prepaid: {
        consumed: 0,
        total: 0,
      },
      extra: 16,
    },
    {
      case: 'Returning user with paid invoice - App M - Middle of the month',
      free: {
        consumed: 0,
        total: 0,
      },
      prepaid: {
        consumed: 36,
        total: 72,
      },
      extra: 0,
    },
    {
      case: 'Returning user with paid invoice + adds 10€ of free credit - 1 APP M - Middle of the month',
      free: {
        consumed: 10,
        total: 10,
      },
      prepaid: {
        consumed: 26,
        total: 72,
      },
      extra: 0,
    },
    {
      case: 'Returning user with paid invoice + adds 50€ of free credit - 1 APP M - Middle of the month',
      free: {
        consumed: 36,
        total: 50,
      },
      prepaid: {
        consumed: 0,
        total: 72,
      },
      extra: 0,
    },
    {
      case: 'Returning user with paid invoice - From App M to App XS - Middle of the month',
      free: {
        consumed: 0,
        total: 0,
      },
      prepaid: {
        consumed: 7,
        total: 72,
      },
      extra: 0,
    },
    {
      case: 'Returning user with paid invoice - From 1 App M to 3 App M - Middle of the month',
      free: {
        consumed: 0,
        total: 0,
      },
      prepaid: {
        consumed: 72,
        total: 72,
      },
      extra: 36,
    },
    {
      case: 'Returning user with unpaid invoice - App M - Middle of the month',
      free: {
        consumed: 0,
        total: 0,
      },
      prepaid: {
        consumed: 0,
        total: 0,
      },
      extra: 36,
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
});
