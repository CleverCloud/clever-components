import '../../src/zones/cc-zone-input.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Zones/<cc-zone-input>',
  component: 'cc-zone-input',
};

const conf = {
  component: 'cc-zone-input',
  // language=CSS
  css: `cc-zone-input {
    margin-bottom: 1rem;
    height: 350px;
  }`,
};

const ZONES = [
  {
    name: 'par',
    country: 'France',
    countryCode: 'fr',
    city: 'Paris',
    lat: 48.87,
    lon: 2.33,
    tags: ['infra:clever-cloud', 'region:eu'],
  },
  {
    name: 'war',
    country: 'Poland',
    countryCode: 'pl',
    city: 'Warsaw',
    lat: 52.23,
    lon: 21.01,
    tags: ['region:eu', 'infra:ovh'],
  },
  {
    name: 'rbx',
    country: 'France',
    countryCode: 'fr',
    city: 'Roubaix',
    lat: 50.69,
    lon: 3.17,
    tags: ['region:eu', 'infra:ovh'],
  },
  {
    name: 'sgp',
    country: 'Singapore',
    countryCode: 'sg',
    city: 'Singapore',
    lat: 1.34,
    lon: 103.83,
    tags: ['infra:ovh'],
  },
  {
    name: 'syd',
    country: 'Australia',
    countryCode: 'au',
    city: 'Sydney',
    lat: -33.85,
    lon: 151.22,
    tags: ['infra:ovh'],
  },
  {
    name: 'mtl',
    country: 'Canada',
    countryCode: 'ca',
    city: 'Montreal',
    lat: 45.50,
    lon: -73.61,
    tags: ['infra:ovh'],
  },
  {
    name: 'acme-corp',
    displayName: 'ACME Corp',
    country: 'Germany',
    countryCode: 'de',
    city: 'Berlin',
    lat: 52.52,
    lon: 13.39,
    tags: ['region:eu', 'scope:private'],
  },
  {
    name: 'nyc',
    country: 'United States',
    countryCode: 'us',
    city: 'New York City',
    lat: 40.71,
    lon: -74.01,
    tags: ['infra:clever-cloud'],
  },
];

export const defaultStory = makeStory(conf, {
  items: [{ zones: ZONES, selected: 'rbx' }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.zones = ZONES;
      component.selected = 'syd';
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  simulations,
});
