import '../../src/pricing/cc-pricing-page.js';
import '../../src/pricing/cc-pricing-product.js';
// Load smart definition so we can use it in the Markdown docs
import '../../src/pricing/cc-pricing-page.smart.js';
import { getFullProductAddon } from '../assets/addon-plans.js';
import { getFullProductRuntime } from '../assets/runtime-plans.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-page>',
  component: 'cc-pricing-page',
};

const conf = {
  component: 'cc-pricing-page',
};

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
    name: 'par',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    lat: 48.87,
    lon: 2.33,
    tags: ['infra:clever-cloud', 'region:eu'],
  },
  {
    name: 'rbx',
    country: 'France',
    countryCode: 'FR',
    city: 'Roubaix',
    lat: 50.69,
    lon: 3.17,
    tags: ['region:eu', 'infra:ovh'],
  },
  {
    name: 'war',
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
      <h1>Object Storage</h1>
      <cc-pricing-product-cellar
        intervals=${JSON.stringify(CELLAR_INFOS)}
      >
      </cc-pricing-product-cellar>
    `,
  }],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  // language=CSS
  css: `
    cc-pricing-page::part(header) {
      border-radius: 5px;
      box-shadow: 0 0 0.5em #aaa;
      margin: 0 1em;
      padding: 1em;
    }

    cc-pricing-page::part(estimation-selected-products) {
      border-radius: 5px;
      box-shadow: 0 0 0.5em #aaa;
      margin: 1em;
    }

    cc-pricing-page::part(estimation-recap) {
      box-shadow: 0 0 0.5em #aaa;
      margin: 1em;
      overflow: hidden;
    }

    cc-pricing-product,
    cc-pricing-product-storage {
      border-radius: 5px;
      box-shadow: 0 0 5px #aaa;
      margin: 1em;
      overflow: hidden;
    }

    cc-pricing-product-storage {
      overflow: hidden;
      padding: 1em;
    }

    .title {
      font-size: 1.5em;
      font-weight: bold;
      padding: 1rem;
    }

    .description {
      padding: 1em;
    }
  `,
  items: [{
    currencies: [
      { code: 'EUR', displayValue: '€ EUR', changeRate: 1 },
      { code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603 },
      { code: 'USD', displayValue: '$ USD', changeRate: 1.2091 },
    ],
    zones: ZONES,
    innerHTML: `
    <div class="title">Runtimes</div>
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
    <div class="title">Addons</div>
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
    <div class="title">Object Storage</div>
    <cc-pricing-product-storage
      name="Cellar"
      icon="https://static-assets.cellar.services.clever-cloud.com/logos/cellar.svg"
      intervals=${JSON.stringify(CELLAR_INFOS)}
    ></cc-pricing-product-storage>
    <br>
    <div slot="estimation-header">
      <div class="title">Cost estimation slot</div>
      <div class="description">
        You can simulate the cost of your architecture here.
      </div>
    </div>
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
// * empty state
// * error state

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithCustomStyles,
  dataLoadedWithAddons,
  dataLoadedWithRuntimes,
});
