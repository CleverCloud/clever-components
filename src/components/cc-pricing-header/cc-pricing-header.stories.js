import { ZONES } from '../../stories/fixtures/zones.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-pricing-header.js';

export default {
  tags: ['autodocs'],
  title: '🛠 pricing/<cc-pricing-header>',
  component: 'cc-pricing-header',
};

const conf = {
  component: 'cc-pricing-header',
};

/**
 * @typedef {import('./cc-pricing-header.js').CcPricingHeader} CcPricingHeader
 * @typedef {import('./cc-pricing-header.types.js').PricingHeaderStateLoaded} PricingHeaderStateLoaded
 * @typedef {import('./cc-pricing-header.types.js').PricingHeaderStateLoading} PricingHeaderStateLoading
 * @typedef {import('./cc-pricing-header.types.js').PricingHeaderStateError} PricingHeaderStateError
 * @typedef {import('../common.types.js').Temporality} Temporality
 */

/** @type {Partial<CcPricingHeader>} */
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
  state: {
    type: 'loaded',
    zones: ZONES,
  },
  selectedZoneId: 'par',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcPricingHeader>[]} */
  items: [defaultItem],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcPricingHeader>[]} */
  items: [
    {
      ...defaultItem,
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcPricingHeader>[]} */
  items: [
    {
      ...defaultItem,
      state: { type: 'error' },
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {Partial<CcPricingHeader>[]} */
  items: [
    {
      ...defaultItem,
      selectedCurrency: 'USD',
      selectedZoneId: 'mtl',
    },
  ],
});

export const dataLoadedWithMinute = makeStory(conf, {
  /** @type {Partial<CcPricingHeader>[]} */
  items: [
    {
      ...defaultItem,
      selectedTemporality: { type: 'minute', digits: 2 },
      selectedZoneId: 'war',
    },
  ],
});

export const simulations = makeStory(conf, {
  /** @type {Partial<CcPricingHeader>[]} */
  items: [
    {
      currencies: defaultItem.currencies,
      temporalities: defaultItem.temporalities,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          zones: ZONES,
        };
        component.selectedZoneId = 'par';
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.selectedTemporality = defaultItem.temporalities[3];
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.selectedCurrency = defaultItem.currencies[1];
      },
    ),
    storyWait(
      2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.selectedZoneId = 'mtl';
      },
    ),
  ],
});

// Right now, because of how we're using this component, we don't need:
// * empty state
