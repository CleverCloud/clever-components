import '../../src/pricing/cc-pricing-header.js';
import { makeStory, storyWait } from '../lib/make-story.js';
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

const defaultItem = {
  currencies: [
    { code: 'EUR', changeRate: 1 },
    { code: 'GBP', changeRate: 0.88603 },
    { code: 'USD', changeRate: 1.2091 },
  ],
  zones: [
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
    {
      name: 'nyc',
      country: 'United States',
      countryCode: 'US',
      city: 'New York City',
      lat: 40.71,
      lon: -74.01,
      tags: ['infra:bso'],
    },
    {
      name: 'acme-corp',
      displayName: 'ACME Corp',
      country: 'Germany',
      countryCode: 'DE',
      city: 'Berlin',
      lat: 52.52,
      lon: 13.39,
      tags: ['region:eu', 'scope:private'],
    },
    {
      name: 'acme-corp2',
      displayName: 'ACME Corp',
      country: 'Germany',
      countryCode: 'DE',
      city: 'Berlin',
      lat: 52.52,
      lon: 13.39,
      tags: ['region:eu', 'scope:private'],
    },
    {
      name: 'acme-corp3',
      displayName: 'ACME Corp',
      country: 'Germany',
      countryCode: 'DE',
      city: 'Berlin',
      lat: 52.52,
      lon: 13.39,
      tags: ['region:eu', 'scope:private'],
    },
  ],
  zoneId: 'par',
  totalPrice: 720,
};

export const defaultStory = makeStory(conf, {
  items: [defaultItem],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-header {
      border-radius: 5px;
      box-shadow: 0 0 0.5rem #aaa;
      margin: 1rem;
      padding: 1rem;
    }
  `,
  items: [defaultItem],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...defaultItem,
    currency: { code: 'USD', changeRate: 1.21 },
    zoneId: 'nyc',
  }],
});

export const simulations = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.currencies = defaultItem.currencies;
      component.zones = defaultItem.zones;
      component.zoneId = defaultItem.zones[0].name;
    }),
  ],
});

// Right now, because of how we're using this component, we don't need:
// * empty state
// * error state

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithCustomStyles,
  dataLoadedWithDollars,
  simulations,
});
