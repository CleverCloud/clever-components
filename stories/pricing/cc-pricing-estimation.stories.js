import '../../src/pricing/cc-pricing-estimation.js';
import { getFullProductRuntime } from '../assets/runtime-plans.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-estimation>',
  component: 'cc-pricing-estimation',
};

const conf = {
  component: 'cc-pricing-estimation',
  css: `cc-pricing-estimation {
        margin-bottom: 1rem;
    }`,
};
const pgExample = {
  name: 'Postgresql',
  item: {
    name: 'XS Small Space',
    price: 7.5 / 30,
    features: [{ name: 'Backups', value: 'Daily - 7 Retained' }, {
      name: 'Max DB size',
      value: '5 GB',
    }, { name: 'Metrics', value: 'Yes' }, { name: 'PostGIS', value: 'Yes' }, {
      name: 'Type',
      value: 'Dedicated',
    }, { name: 'vCPUS', value: '1' }, { name: 'Logs', value: 'Yes' }, {
      name: 'Max connection limit',
      value: '75',
    }, { name: 'Memory', value: '1 GB' }, { name: 'Migration Tool', value: 'Yes' }],
  },
  quantity: 2,
};

const cellarExample = {
  name: 'Cellar',
  item: {
    name: 'Storage: 1000GB, Traffic: 1TB',
    price: 15 / 30,
  },
  quantity: 1,
};

// TODO: Node to have runtime example

export const defaultStory = makeStory(conf, {
  items: [
    {
      selectedProducts: [pgExample, cellarExample],
      totalPrice: 720,
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      selectedProducts: [pgExample, cellarExample],
      currency: { code: 'USD', changeRate: 1.1802 },
      totalPrice: 720,
    },
  ],
});


export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-estimation {
      border-radius: 5px;
      --shadow: 0 0 5px #aaa;
      margin: 1rem;
      overflow: hidden;
    }
  `,
  items: [
    { selectedProducts: [pgExample, cellarExample] },
  ],
});

export const dataLoadedWithCellar = makeStory(conf, {
  items: [
    { selectedProducts: [cellarExample] },
  ],
});

export const dataLoadedWithPostgres = makeStory(conf, {
  items: [
    { selectedProducts: [pgExample] },
  ],
});

export const dataLoadedWithMultiple = makeStory(conf, {
  items: [
    { selectedProducts: [pgExample, cellarExample] },
  ],
});

// TODO : Dollars story

export const empty = makeStory(conf, {
  items: [
    { selectedProducts: [] },
  ],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * error state

enhanceStoriesNames({
  defaultStory,
  empty,
  dataLoadedWithDollars,
  dataLoadedWithCellar,
  dataLoadedWithCustomStyles,
  dataLoadedWithPostgres,
  dataLoadedWithMultiple,
});
