import './cc-pricing-header.js';
import { ZONES } from '../../stories/fixtures/zones.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

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
 * @typedef {import('../common.types.js').Currency} Currency
 * @typedef {import('../common.types.js').Temporality} Temporality
 */

/** @type {{ currencies: Currency[], temporalities: Temporality[], state: PricingHeaderStateLoaded, selectedZoneId: 'par' }} */
const defaultItem = {
  currencies: [
    { code: 'EUR', changeRate: 1 },
    { code: 'GBP', changeRate: 0.88603 },
    { code: 'USD', changeRate: 1.1717 },
  ],
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
  items: [defaultItem],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {PricingHeaderStateLoading} */
    state: { type: 'loading' },
  }],
});

export const error = makeStory(conf, {
  items: [{
    /** @type {PricingHeaderStateError} */
    state: { type: 'error' },
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {{ state: PricingHeaderStateLoaded, selectedCurrency: Currency, selectedZoneId: 'mtl' }[]} */
  items: [{
    ...defaultItem,
    selectedCurrency: { code: 'USD', changeRate: 1.1717 },
    selectedZoneId: 'mtl',
  }],
});

export const dataLoadedWithMinute = makeStory(conf, {
  /** @type {{ state: PricingHeaderStateLoaded, selectedTemporality: Temporality, selectedZoneId: 'war' }[]} */
  items: [{
    ...defaultItem,
    selectedTemporality: { type: 'minute', digits: 2 },
    selectedZoneId: 'war',
  }],
});

export const simulations = makeStory(conf, {
  items: [{
    currencies: defaultItem.currencies,
    temporalities: defaultItem.temporalities,
  }],
  simulations: [
    storyWait(2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          zones: ZONES,
        };
        component.selectedZoneId = 'par';
      }),
    storyWait(2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.selectedTemporality = defaultItem.temporalities[3];
      }),
    storyWait(2000,
      /** @param {CcPricingHeader[]} components */
      ([component]) => {
        component.selectedCurrency = defaultItem.currencies[1];
      }),
  ],
});

// Right now, because of how we're using this component, we don't need:
// * empty state
