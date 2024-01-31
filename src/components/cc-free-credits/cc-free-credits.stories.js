import './cc-free-credits.js';
import { ConsumptionFaker } from '../../lib/consumption-faker.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const today = new Date(Date.now());
const defaultConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 15), 9545.5);

export default {
  title: '🛠 Consumption/<cc-free-credits>',
  component: 'cc-free-credits',
};

const conf = {
  component: 'cc-free-credits',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      totalCredits: 25,
      remainingCredits: 21,
      coupons: [
        {
          amount: 20,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      totalCredits: 0,
      remainingCredits: 0,
      coupons: [],
      skeleton: true,
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      totalCredits: 0,
      remainingCredits: 0,
      coupons: [],
    },
  ],
});

export const dataLoadedWithNoCreditsRemaining = makeStory(conf, {
  items: [
    {
      totalCredits: 25,
      remainingCredits: 0,
      coupons: [
        {
          amount: 20,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const dataLoadedWithFullCreditsRemaining = makeStory(conf, {
  items: [
    {
      totalCredits: 25,
      remainingCredits: 25,
      coupons: [
        {
          amount: 20,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const dataLoadedWithHighAmount = makeStory(conf, {
  items: [
    {
      totalCredits: 10546.144,
      remainingCredits: 7849.20,
      coupons: [
        {
          amount: 10541.144,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const dataLoadedWithManyCoupons = makeStory(conf, {
  items: [
    {
      consumption: 7054,
      totalCredits: 10626.144,
      remainingCredits: 8937.49,
      coupons: [
        {
          amount: 10541.144,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      currency: 'USD',
      totalCredits: 25,
      remainingCredits: 20,
      coupons: [
        {
          amount: 20,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const dataLoadedWithNoDigits = makeStory(conf, {
  items: [
    {
      totalCredits: 25,
      remainingCredits: 20,
      coupons: [
        {
          amount: 20,
          reason: 'account-creation',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 2, 12),
          expiration: new Date(defaultConsumptionData.year + 1, defaultConsumptionData.month - 1, 0),
        },
        {
          amount: 5,
          reason: 'conference',
          activation: new Date(defaultConsumptionData.year, defaultConsumptionData.month - 1, 23),
          expiration: new Date(defaultConsumptionData.year, defaultConsumptionData.month + 4, 0),
        },
      ],
    },
  ],
});

export const simulation = makeStory(conf, {
  items: [{
    ...skeleton.items[0],
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.totalCredits = defaultStory.items[0].totalCredits;
      component.remainingCredits = defaultStory.items[0].remainingCredits;
      component.coupons = defaultStory.items[0].coupons;
      component.skeleton = false;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  empty,
  dataLoadedWithNoCreditsRemaining,
  dataLoadedWithFullCreditsRemaining,
  dataLoadedWithHighAmount,
  dataLoadedWithManyCoupons,
  dataLoadedWithDollars,
  dataLoadedWithNoDigits,
  simulation,
});
