import '../../src/pricing/cc-pricing-page.js';
import '../../src/pricing/cc-pricing-product.js';
import { getFullProductAddon } from '../assets/addon-plans.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { getFullProductRuntime } from '../assets/runtime-plans.js';

export default {
  title: '🛠 pricing/<cc-pricing-page>',
  component: 'cc-pricing-page',
};

const conf = {
  component: 'cc-pricing-page',
  // language=CSS
  css: `cc-pricing-page {
      margin-bottom: 1rem;
  }`,
};

const SHORT_DESC = `Hey i'm a description of the addon`;

const RUBY_RUNTIME = getFullProductRuntime('ruby');
const NODE_RUNTIME = getFullProductRuntime('node');
const MONGO_ADDON = getFullProductAddon('mongodb-addon');
const PSQL_ADDON = getFullProductAddon('postgresql-addon');
const CELLAR_INFOS = {
  storage: [
    {
      minRange: 0,
      maxRange: 100 * 1e6,
      price: 0,
    },
    {
      /* Bytes */
      minRange: 100 * 1e6,
      maxRange: 1e12,
      /* Price for 1GB per hour */
      price: 0.00002844444444444444,
    },
    {
      minRange: 1e12,
      maxRange: 25 * 1e12,
      price: 0.00002133333333333333,
    },
    {
      minRange: 25 * 1e12,
      price: 0.00001422222222222222,
    },
  ],
  traffic: [
    {
      minRange: 0,
      maxRange: 10 * 1e12,
      price: 0.09,
    },
    {
      minRange: 10 * 1e12,
      price: 0.07,
    },
  ],
};
const ZONES = [
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
];

export const defaultStory = makeStory(conf, {
  items: [{
    currencies: [
      { code: 'EUR', displayValue: '€ EUR', changeRate: 1 },
      { code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603 },
      { code: 'USD', displayValue: '$ USD', changeRate: 1.2091 },
    ],
    zones: ZONES,
    innerHTML: `
    <h1>Runtimes</h1>
    <cc-pricing-product 
        name='${RUBY_RUNTIME.name}'
        icon='${RUBY_RUNTIME.icon}'
        description='${RUBY_RUNTIME.description}'
        features='${JSON.stringify(RUBY_RUNTIME.features)}'
        items='${JSON.stringify(RUBY_RUNTIME.items)}'
        currency='${JSON.stringify(RUBY_RUNTIME.currency)}'
    >
    </cc-pricing-product>   
    <cc-pricing-product
        name='${NODE_RUNTIME.name}'
        icon='${NODE_RUNTIME.icon}'
        description='${NODE_RUNTIME.description}'
        features='${JSON.stringify(NODE_RUNTIME.features)}'
        items='${JSON.stringify(NODE_RUNTIME.items)}'
        currency='${JSON.stringify(NODE_RUNTIME.currency)}'
    >
    </cc-pricing-product>
    <h1>Addons</h1>
    <cc-pricing-product 
        name='${PSQL_ADDON.name}'
        icon='${PSQL_ADDON.icon}'
        description='${PSQL_ADDON.description}'
        features='${JSON.stringify(PSQL_ADDON.features)}'
        items='${JSON.stringify(PSQL_ADDON.items)}'
        currency='${JSON.stringify(PSQL_ADDON.currency)}'
    >
    </cc-pricing-product>   
    <cc-pricing-product
        name='${MONGO_ADDON.name}'
        icon='${MONGO_ADDON.icon}'
        description='${MONGO_ADDON.description}'
        features='${JSON.stringify(MONGO_ADDON.features)}'
        items='${JSON.stringify(MONGO_ADDON.items)}'
        currency='${JSON.stringify(MONGO_ADDON.currency)}'
    >
    </cc-pricing-product>
    <br> <br>
    <cc-pricing-product-cellar
      intervals=${JSON.stringify(CELLAR_INFOS)}
    >
    </cc-pricing-product-cellar>
    <br>
`,
  }],
});

export const dataLoadedWithRuntimes = makeStory(conf, {
  items: [{
    currencies: [
      { code: 'EUR', displayValue: '€ EUR', changeRate: 1 },
      { code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603 },
      { code: 'USD', displayValue: '$ USD', changeRate: 1.2091 },
    ],
    zones: ZONES,
    innerHTML: `
     <h1>Runtimes</h1>
    <cc-pricing-product 
        name='${RUBY_RUNTIME.name}'
        icon='${RUBY_RUNTIME.icon}'
        description='${RUBY_RUNTIME.description}'
        features='${JSON.stringify(RUBY_RUNTIME.features)}'
        items='${JSON.stringify(RUBY_RUNTIME.items)}'
        currency='${JSON.stringify(RUBY_RUNTIME.currency)}'
    >
    </cc-pricing-product>   
    <cc-pricing-product
        name='${NODE_RUNTIME.name}'
        icon='${NODE_RUNTIME.icon}'
        description='${NODE_RUNTIME.description}'
        features='${JSON.stringify(NODE_RUNTIME.features)}'
        items='${JSON.stringify(NODE_RUNTIME.items)}'
        currency='${JSON.stringify(NODE_RUNTIME.currency)}'
    > 
    </cc-pricing-product>
    `,
  }],
});

export const dataLoadedWithAddons = makeStory(conf, {
  items: [{
    currencies: [
      { code: 'EUR', displayValue: '€ EUR', changeRate: 1 },
      { code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603 },
      { code: 'USD', displayValue: '$ USD', changeRate: 1.2091 },
    ],
    zones: ZONES,
    innerHTML: `
    <h1>Addons</h1>
    <cc-pricing-product 
        name='${PSQL_ADDON.name}'
        icon='${PSQL_ADDON.icon}'
        description='${PSQL_ADDON.description}'
        features='${JSON.stringify(PSQL_ADDON.features)}'
        items='${JSON.stringify(PSQL_ADDON.items)}'
        currency='${JSON.stringify(PSQL_ADDON.currency)}'
    >   
    </cc-pricing-product>   
    <cc-pricing-product
        name='${MONGO_ADDON.name}'
        icon='${MONGO_ADDON.icon}'
        description='${MONGO_ADDON.description}'
        features='${JSON.stringify(MONGO_ADDON.features)}'
        items='${JSON.stringify(MONGO_ADDON.items)}'
        currency='${JSON.stringify(MONGO_ADDON.currency)}'
    >
    </cc-pricing-product>`,
  }],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithAddons,
  dataLoadedWithRuntimes,
});
