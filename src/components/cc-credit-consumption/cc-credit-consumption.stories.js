import './cc-credit-consumption.js';
import '../../stories/cc-credit-consumption.sandbox.js';
import { ConsumptionFaker } from '../../lib/consumption-faker.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Consumption/<cc-credit-consumption>',
  component: 'cc-credit-consumption',
};

const conf = {
  component: 'cc-credit-consumption',
};

const today = new Date(Date.now());
const defaultConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 15), 9545.5);
const lowConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 15), 27);
const firstDayOfTheMonthConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 1), 0);
const zeroConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 15), 0);
const hugeConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 25), 939932);

export const defaultStory = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'http://placekitten.com/200/200',
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: true,
            total: 12825.70,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'error',
      },
    },
  ],
});

export const dataLoadedWithPremium = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
          cleverEnterprise: true,
          emergencyNumber: '+33 6 00 00 00 00',
          priceFactor: 1.8,
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: true,
            total: 18825.70,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithDiscount = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
          cleverEnterprise: false,
          discount: 20,
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: true,
            total: 12825.70,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithPremiumAndDiscount = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
          emergencyNumber: '+33 6 00 00 00 00',
          cleverEnterprise: true,
          discount: 20,
          priceFactor: 1.8,
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: true,
            total: 18825.70,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithExtraConsumption = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          currency: 'EUR',
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          prepaidCredits: {
            enabled: true,
            total: 5014.70,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithFirstDayOfBillingCycle = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          currency: 'EUR',
          period: {
            start: firstDayOfTheMonthConsumptionData.firstDayOfTheMonth,
            end: firstDayOfTheMonthConsumptionData.lastDayOfTheMonth,
          },
          prepaidCredits: {
            enabled: true,
            total: 12825.70,
          },
          consumptions: firstDayOfTheMonthConsumptionData.consumptions,
          coupons: [
            {
              amount: 20,
              reason: 'account-creation',
              activation: new Date(firstDayOfTheMonthConsumptionData.year, firstDayOfTheMonthConsumptionData.month - 2, 12),
              expiration: new Date(firstDayOfTheMonthConsumptionData.year + 1, firstDayOfTheMonthConsumptionData.month - 1, 0),
            },
            {
              amount: 5,
              reason: 'conference',
              activation: new Date(firstDayOfTheMonthConsumptionData.year, firstDayOfTheMonthConsumptionData.month - 1, 23),
              expiration: new Date(firstDayOfTheMonthConsumptionData.year, firstDayOfTheMonthConsumptionData.month + 4, 0),
            },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithNoConsumption = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          currency: 'EUR',
          period: {
            start: zeroConsumptionData.firstDayOfTheMonth,
            end: zeroConsumptionData.lastDayOfTheMonth,
          },
          prepaidCredits: {
            enabled: true,
            total: 12825.70,
          },
          consumptions: zeroConsumptionData.consumptions,
          coupons: [
            {
              amount: 20,
              reason: 'account-creation',
              activation: new Date(zeroConsumptionData.year, zeroConsumptionData.month - 2, 12),
              expiration: new Date(zeroConsumptionData.year + 1, zeroConsumptionData.month - 1, 0),
            },
            {
              amount: 5,
              reason: 'conference',
              activation: new Date(zeroConsumptionData.year, zeroConsumptionData.month - 1, 23),
              expiration: new Date(zeroConsumptionData.year, zeroConsumptionData.month + 4, 0),
            },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithNoFreeCredit = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          currency: 'EUR',
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          prepaidCredits: {
            enabled: true,
            total: 12825.70,
          },
          consumptions: defaultConsumptionData.consumptions,
          coupons: [],
        },
      },
    },
  ],
});

export const dataLoadedWithNoPrepaidCredit = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          currency: 'EUR',
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          prepaidCredits: {
            enabled: true,
            total: 0,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithNoCredit = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          currency: 'EUR',
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          prepaidCredits: {
            enabled: true,
            total: 0,
          },
          consumptions: defaultConsumptionData.consumptions,
          coupons: [],
        },
      },
    },
  ],
});

export const dataLoadedWithPrepaidCreditDisabled = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: false,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithSubOrganisation = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
          invoicedOrganization: {
            id: 'toto',
            name: 'ACME BAR',
          },
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: false,
          },
          consumptions: defaultConsumptionData.consumptions,
          coupons: [],
        },
      },
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          period: {
            start: defaultConsumptionData.firstDayOfTheMonth,
            end: defaultConsumptionData.lastDayOfTheMonth,
          },
          currency: 'USD',
          prepaidCredits: {
            enabled: true,
            total: 12825.70,
          },
          consumptions: defaultConsumptionData.consumptions,
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
      },
    },
  ],
});

export const dataLoadedWithHighAmount = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          period: {
            start: hugeConsumptionData.firstDayOfTheMonth,
            end: hugeConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: true,
            total: 254113,
          },
          consumptions: hugeConsumptionData.consumptions,
          coupons: [
            {
              amount: 252451,
              reason: 'account-creation',
              activation: new Date(hugeConsumptionData.year, hugeConsumptionData.month - 2, 12),
              expiration: new Date(hugeConsumptionData.year + 1, hugeConsumptionData.month - 1, 0),
            },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithLowCredits = makeStory(conf, {
  items: [
    {
      creditConsumption: {
        state: 'loaded',
        orgaInfo: {
          state: 'loaded',
          name: 'ACME FOO',
          avatar: 'https://placekitten.com/200/200',
        },
        consumption: {
          period: {
            start: lowConsumptionData.firstDayOfTheMonth,
            end: lowConsumptionData.lastDayOfTheMonth,
          },
          currency: 'EUR',
          prepaidCredits: {
            enabled: true,
            total: 34,
          },
          consumptions: lowConsumptionData.consumptions,
          coupons: [
            {
              amount: 20,
              reason: 'account-creation',
              activation: new Date(lowConsumptionData.year, lowConsumptionData.month - 2, 12),
              expiration: new Date(lowConsumptionData.year + 1, lowConsumptionData.month - 1, 0),
            },
          ],
        },
      },
    },
  ],
});

export const sandboxStory = makeStory(conf, {
  component: 'cc-credit-consumption-sandbox',
});

export const simulation = makeStory(conf, {
  items: [{
    state: 'loading',
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.creditConsumption = defaultStory.items[0].creditConsumption;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithPremium,
  dataLoadedWithDiscount,
  dataLoadedWithPremiumAndDiscount,
  dataLoadedWithExtraConsumption,
  dataLoadedWithFirstDayOfBillingCycle,
  dataLoadedWithNoConsumption,
  dataLoadedWithNoFreeCredit,
  dataLoadedWithNoPrepaidCredit,
  dataLoadedWithPrepaidCreditDisabled,
  dataLoadedWithSubOrganisation,
  dataLoadedWithNoCredit,
  dataLoadedWithHighAmount,
  dataLoadedWithDollars,
  dataLoadedWithLowCredits,
  sandboxStory,
  simulation,
});
