import '../../src/pricing/cc-pricing-estimation.js';
import { getProductAddon } from '../assets/addon-plans.js';
import { getProductRuntime } from '../assets/runtime-plans.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-estimation>',
  component: 'cc-pricing-estimation',
};

const conf = {
  component: 'cc-pricing-estimation',
  css: `
    cc-pricing-estimation {
      margin-bottom: 1rem;
    }
  `,
};

const pgExample = {
  name: 'Postgresql',
  item: getProductAddon('postgresql-addon').items.find((item) => item.name === 'XS Small Space'),
  quantity: 2,
};

const cellarExample = {
  name: 'Cellar',
  item: {
    name: 'Storage: 1.5 TB, Traffic: 500 GB',
    price: 0.09449999999999999,
  },
  quantity: 1,
};

const nodeExample = {
  name: 'Node.js',
  item: getProductRuntime('node').items.find((item) => item.name === 'S'),
  quantity: 3,
};

const selectedProducts = [pgExample, cellarExample, nodeExample];

const totalPrice = selectedProducts
  .map((product) => product.item.price * product.quantity * 24 * 30)
  .reduce((a, b) => a + b, 0);

const defaultItem = { selectedProducts, totalPrice };

export const defaultStory = makeStory(conf, {
  items: [defaultItem],
});

export const empty = makeStory(conf, {
  items: [{}],
});

export const dataLoaded = makeStory(conf, {
  items: [defaultItem],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-estimation {
    }
  `,
  items: [defaultItem],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...defaultItem,
    currency: { code: 'USD', changeRate: 1.1802 },
  }],
});

// Right now, because of how we're using this component, we don't need:
// * error state

enhanceStoriesNames({
  defaultStory,
  empty,
  dataLoaded,
  dataLoadedWithDollars,
  dataLoadedWithCustomStyles,
});
