import './cc-pricing-estimation.js';
import { getProductAddon } from '../../stories/fixtures/addon-plans.js';
import { getProductRuntime } from '../../stories/fixtures/runtime-plans.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🛠 pricing/<cc-pricing-estimation>',
  component: 'cc-pricing-estimation',
};

const conf = {
  component: 'cc-pricing-estimation',
};

const pgExample = {
  productName: 'Postgresql',
  ...getProductAddon('postgresql-addon').plans.find((p) => p.name === 'XS Small Space'),
  quantity: 2,
};

const cellarExample = {
  productName: 'Cellar',
  name: 'Storage: 1.5 TB, Outbound traffic: 500 GB',
  price: 0.09449999999999999,
  quantity: 1,
};

const nodeExample = {
  productName: 'Node.js',
  ...getProductRuntime('node').plans.find((p) => p.name === 'S'),
  quantity: 3,
};

const selectedPlans = [pgExample, cellarExample, nodeExample];

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
  selectedPlans,
};

export const defaultStory = makeStory(conf, {
  items: [defaultItem],
});

export const empty = makeStory(conf, {
  items: [{
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
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [defaultItem],
});

export const dataLoadedWithToggle = makeStory(conf, {
  items: [{
    ...defaultItem,
    isToggleEnabled: true,
  }],
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
  items: [{
    ...defaultItem,
    innerHTML: '<p slot="footer">Here is my custom footer with a great link leading to <a href="https://www.clever-cloud.com/">Clever Cloud</a>.</p>',
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedCurrency: { code: 'USD', changeRate: 1.1717 },
  }],
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedTemporality: { type: 'second', digits: 7 },
  }],
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedTemporality: { type: 'minute', digits: 5 },
  }],
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedTemporality: { type: 'hour', digits: 3 },
  }],
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedTemporality: { type: 'day', digits: 2 },
  }],
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedTemporality: { type: '30-days', digits: 1 },
  }],
});

// Right now, because of how we're using this component, we don't need:
// * error state
