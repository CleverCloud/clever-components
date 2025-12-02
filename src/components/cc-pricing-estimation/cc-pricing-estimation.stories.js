import { formatEstimationPrices } from '../../lib/product.js';
import { getProductAddon } from '../../stories/fixtures/addon-plans.js';
import { baseCellar } from '../../stories/fixtures/consumption-plans.js';
import { rawPriceSystemDollars, rawPriceSystemEuro } from '../../stories/fixtures/price-system.js';
import { getProductRuntime } from '../../stories/fixtures/runtime-plans.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-pricing-estimation.js';

export default {
  tags: ['autodocs'],
  title: '🛠 pricing/<cc-pricing-estimation>',
  component: 'cc-pricing-estimation',
};

const conf = {
  component: 'cc-pricing-estimation',
};

/**
 * @import { CcPricingEstimation } from './cc-pricing-estimation.js'
 * @import { PricingEstimationStateLoaded, RuntimePlanWithQuantity, CountablePlanWithQuantity } from './cc-pricing-estimation.types.js'
 */

const pricesInEuro = formatEstimationPrices(rawPriceSystemEuro);
const pricesInDollars = formatEstimationPrices(rawPriceSystemDollars);

/** @type {PricingEstimationStateLoaded} */
const defaultState = {
  type: 'loaded',
  runtimePrices: pricesInEuro.runtimePrices,
  countablePrices: pricesInEuro.countablePrices,
};

/** @type {RuntimePlanWithQuantity} */
const pgExample = {
  productName: 'Postgresql',
  ...getProductAddon('postgresql-addon').plans.find((p) => p.name === 'XS Small Space'),
  quantity: 2,
};

/** @type {CountablePlanWithQuantity} */
const cellarExample = {
  ...baseCellar,
  name: 'Storage: 1.5 TB, Outbound traffic: 500 GB',
  productName: 'Cellar',
  price: 0,
  quantity: 1,
};

/** @type {RuntimePlanWithQuantity} */
const nodeExample = {
  productName: 'Node.js',
  ...getProductRuntime('node').plans.find((p) => p.name === 'S'),
  quantity: 3,
};

/** @type {Array<RuntimePlanWithQuantity|CountablePlanWithQuantity>} */
const selectedPlans = [pgExample, cellarExample, nodeExample];

/** @type {Partial<CcPricingEstimation>} */
const defaultItem = {
  currencies: ['EUR', 'GBP', 'USD'],
  temporalities: [
    {
      type: 'second',
      digits: 7,
    },
    {
      type: 'minute',
      digits: 5,
    },
    {
      type: 'hour',
      digits: 3,
    },
    {
      type: 'day',
      digits: 2,
    },
    {
      type: '30-days',
      digits: 2,
    },
  ],
  selectedPlans,
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      state: defaultState,
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      selectedPlans: defaultItem.selectedPlans,
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      currencies: ['EUR', 'GBP', 'USD'],
      temporalities: [
        {
          type: 'second',
          digits: 7,
        },
        {
          type: 'minute',
          digits: 5,
        },
        {
          type: 'hour',
          digits: 3,
        },
        {
          type: 'day',
          digits: 2,
        },
        {
          type: '30-days',
          digits: 2,
        },
      ],
      state: defaultState,
    },
  ],
});

export const dataLoaded = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      state: defaultState,
    },
  ],
});

export const dataLoadedWithToggle = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      isToggleEnabled: true,
      state: defaultState,
    },
  ],
});

export const dataLoadedWithCustomFooter = makeStory(conf, {
  // language=CSS
  css: `
    p[slot=footer] {
      margin-top: 2em;
      margin-bottom: 0;
    }

    a {
      color: var(--cc-color-text-primary-highlight);
    }
  `,
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      state: defaultState,
      innerHTML:
        '<p slot="footer">Here is my custom footer with a great link leading to <a href="https://www.clever-cloud.com/">Clever Cloud</a>.</p>',
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      selectedCurrency: 'USD',
      state: defaultState,
    },
  ],
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      selectedTemporality: { type: 'second', digits: 7 },
      state: defaultState,
    },
  ],
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      selectedTemporality: { type: 'minute', digits: 5 },
      state: defaultState,
    },
  ],
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      selectedTemporality: { type: 'hour', digits: 3 },
      state: defaultState,
    },
  ],
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      selectedTemporality: { type: 'day', digits: 2 },
      state: defaultState,
    },
  ],
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  /** @type {Partial<CcPricingEstimation>[]} */
  items: [
    {
      ...defaultItem,
      selectedTemporality: { type: '30-days', digits: 1 },
      state: defaultState,
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [
    {
      currencies: defaultItem.currencies,
      temporalities: defaultItem.temporalities,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcPricingEstimation[]} components */
      ([component]) => {
        component.state = defaultState;
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingEstimation[]} components */
      ([component]) => {
        component.selectedPlans = defaultItem.selectedPlans.slice(0, 1);
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingEstimation[]} components */
      ([component]) => {
        component.selectedPlans = defaultItem.selectedPlans;
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingEstimation[]} components */
      ([component]) => {
        component.selectedTemporality = defaultItem.temporalities[3];
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingEstimation[]} components */
      ([component]) => {
        component.selectedCurrency = defaultItem.currencies[1];
        component.state = { type: 'loading' };
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingEstimation[]} components */
      ([component]) => {
        component.selectedCurrency = defaultItem.currencies[1];
        component.state = {
          ...defaultState,
          runtimePrices: pricesInDollars.runtimePrices,
          countablePrices: pricesInEuro.countablePrices,
        };
      },
    ),
  ],
});
