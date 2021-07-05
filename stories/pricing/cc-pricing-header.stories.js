import '../../src/pricing/cc-pricing-header.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-header>',
  component: 'cc-pricing-header',
};

const conf = {
  component: 'cc-pricing-header',
  css: `cc-pricing-header {
    margin-bottom: 1rem;
  }`,
};

const baseItems = {
  currencies: [
    { code: 'EUR', displayValue: '€ EUR', changeRate: 1 },
    { code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603 },
    { code: 'USD', displayValue: '$ USD', changeRate: 1.2091 },
  ],
  zones: [
    {
      name: 'PAR',
      country: 'France',
      countryCode: 'FR',
      city: 'Paris',
      lat: 48.87,
      lon: 2.33,
      tags: ['infra:clever-cloud', 'region:eu'],
    },
    {
      name: 'RBX',
      country: 'France',
      countryCode: 'FR',
      city: 'Roubaix',
      lat: 50.69,
      lon: 3.17,
      tags: ['region:eu', 'infra:ovh'],
    },
    {
      name: 'WAR',
      country: 'Poland',
      countryCode: 'PL',
      city: 'Warsaw',
      lat: 52.23,
      lon: 21.01,
      tags: ['region:eu', 'infra:ovh'],
    },
  ],
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

export const defaultStory = makeStory(conf, {
  items: [
    { ...baseItems, zone: 'PAR', currency: {code: 'EUR', changeRate: 1}, totalPrice: 720 },
  ],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-header {
      border-radius: 5px;
      box-shadow: 0 0 0.5rem #aaa;
      margin: 1rem;
    }
  `,
  items: [
    { ...baseItems, zone: 'PAR', currency: {code: 'EUR', changeRate: 1}, totalPrice: 720 },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    { ...baseItems, zone: 'RBX', currency: {code: 'USD', changeRate: 1.21}, totalPrice: 360 },
  ],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * empty state
// * error state

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithCustomStyles,
  dataLoadedWithDollars,
});
