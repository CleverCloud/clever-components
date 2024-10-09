import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-pricing-product-consumption.js';

export default {
  tags: ['autodocs'],
  title: '🛠 pricing/<cc-pricing-product-consumption>',
  component: 'cc-pricing-product-consumption',
};

const conf = {
  component: 'cc-pricing-product-consumption',
};

/**
 * @typedef {import('./cc-pricing-product-consumption.js').CcPricingProductConsumption} CcPricingProductConsumption
 * @typedef {import('./cc-pricing-product-consumption.types.js').PricingProductConsumptionStateLoaded} PricingProductConsumptionStateLoaded
 */

const THIRTY_DAYS_IN_HOURS = 24 * 30;
const ONE_GIGABYTE = 1e9;

/** @type {Omit<PricingProductConsumptionStateLoaded, 'type'>} */
const baseCellar = {
  name: 'Cellar',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 100 * 1e6,
          price: (0 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 100 * 1e6,
          maxRange: 1e12,
          price: (0.00002844444444444444 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 1e12,
          maxRange: 25 * 1e12,
          price: (0.00002133333333333333 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 25 * 1e12,
          price: (0.00001422222222222222 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'outbound-traffic',
      intervals: [
        {
          minRange: 0,
          maxRange: 10 * 1e12,
          price: 0.09 / ONE_GIGABYTE,
        },
        {
          minRange: 10 * 1e12,
          price: 0.07 / ONE_GIGABYTE,
        },
      ],
    },
  ],
};

/** @type {Omit<PricingProductConsumptionStateLoaded, 'type'>} */
const baseFsBucket = {
  name: 'FS Bucket',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 100 * 1e6,
          price: (0 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 100 * 1e6,
          price: (0.0020833333333333333 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
      ],
    },
  ],
};

/** @type {Omit<PricingProductConsumptionStateLoaded, 'type'>} */
const basePulsar = {
  name: 'Pulsar',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 256000000,
          price: (0 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 256000000,
          maxRange: 50000000000,
          price: (0.00027777777777777778 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 50000000000,
          maxRange: 250000000000,
          price: (0.0002083333333333333 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 250000000000,
          maxRange: 1000000000000,
          price: (0.0001666666666666666 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 1000000000000,
          price: (0.00013888888888888889 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'inbound-traffic',
      intervals: [
        {
          minRange: 0,
          maxRange: 500000000,
          price: 0 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000,
          maxRange: 100000000000,
          price: 0.8 / ONE_GIGABYTE,
        },
        {
          minRange: 100000000000,
          maxRange: 500000000000,
          price: 0.5 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000000,
          maxRange: 5000000000000,
          price: 0.4 / ONE_GIGABYTE,
        },
        {
          minRange: 5000000000000,
          price: 0.3 / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'outbound-traffic',
      intervals: [
        {
          minRange: 0,
          maxRange: 500000000,
          price: 0 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000,
          maxRange: 100000000000,
          price: 0.8 / ONE_GIGABYTE,
        },
        {
          minRange: 100000000000,
          maxRange: 500000000000,
          price: 0.5 / ONE_GIGABYTE,
        },
        {
          minRange: 500000000000,
          maxRange: 5000000000000,
          price: 0.4 / ONE_GIGABYTE,
        },
        {
          minRange: 5000000000000,
          price: 0.3 / ONE_GIGABYTE,
        },
      ],
    },
  ],
};

/** @type {Omit<PricingProductConsumptionStateLoaded, 'type'>} */
const baseHeptapod = {
  name: 'Heptapod',
  sections: [
    {
      type: 'storage',
      intervals: [
        {
          minRange: 0,
          maxRange: 1 * 1e9,
          price: (0 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
        {
          minRange: 1 * 1e9,
          price: (0.00002777777777777778 * THIRTY_DAYS_IN_HOURS) / ONE_GIGABYTE,
        },
      ],
    },
    {
      type: 'private-users',
      progressive: true,
      intervals: [
        {
          minRange: 0,
          price: 7,
        },
      ],
    },
    {
      type: 'public-users',
      progressive: true,
      secability: 100,
      intervals: [
        {
          minRange: 0,
          maxRange: 101,
          price: 0,
        },
        {
          minRange: 101,
          price: 0.07,
        },
      ],
    },
  ],
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...baseCellar,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const dataLoadedWithFsBucket = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...baseFsBucket,
      },
    },
  ],
});

export const dataLoadedWithPulsar = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...basePulsar,
      },
    },
  ],
});

export const dataLoadedWithHeptapod = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...baseHeptapod,
      },
    },
  ],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      action: 'none',
      state: {
        type: 'loaded',
        ...baseCellar,
      },
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      currency: 'USD',
      state: {
        type: 'loaded',
        ...baseCellar,
      },
    },
  ],
});

export const simulationsWithCellar = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...baseCellar,
        };
      },
    ),
  ],
});

export const simulationsWithFsBucket = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...baseFsBucket,
        };
      },
    ),
  ],
});

export const simulationsWithPulsar = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...basePulsar,
        };
      },
    ),
  ],
});

export const simulationsWithError = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});
