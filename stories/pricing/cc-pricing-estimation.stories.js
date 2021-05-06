import '../../src/pricing/cc-pricing-estimation.js';
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
  productName: 'Postgresql',
  item: {
    name: 'XS Small Space',
    price: {
      daily: 7.5,
      monthly: 17.5,
    },
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
const mySQLExample = {
  productName: 'MySQL',
  item: {
    name: 'XXS Small Space',
    price: {
      daily: 7.5,
      monthly: 17.5,
    },
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
  quantity: 5,
};

export const defaultStory = makeStory(conf, {
  items: [
    { selectedProducts: [pgExample, mySQLExample] },
  ],
});

export const dataLoadedWithPostgres = makeStory(conf, {
  items: [
    { selectedProducts: [pgExample] },
  ],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [
    { selectedProducts: [mySQLExample] },
  ],
});

export const dataLoadedWithMultiple = makeStory(conf, {
  items: [
    { selectedProducts: [pgExample, mySQLExample] },
  ],
}); ;

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
  dataLoadedWithPostgres,
  dataLoadedWithMysql,
  dataLoadedWithMultiple,
});
