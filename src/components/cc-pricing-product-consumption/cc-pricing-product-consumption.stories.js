import { baseCellar, baseFsBucket, baseHeptapod, basePulsar } from '../../stories/fixtures/consumption-plans.js';
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
 */

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
