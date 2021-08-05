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

const totalPrice = selectedPlans
  .map((plan) => plan.price * plan.quantity * 24 * 30)
  .reduce((a, b) => a + b, 0);

const defaultItem = { selectedPlans, totalPrice };

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
  // language=CSS
  css: `
    cc-pricing-estimation::part(selected-plans) {
      border-radius: 5px;
      box-shadow: 0 0 0.5em #aaa;
      margin: 1em 0;
      overflow: hidden;
    }

    cc-pricing-estimation::part(recap) {
      box-shadow: 0 0 0.5em #aaa;
      margin: 1em 0;
      overflow: hidden;
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
