import '../../src/zones/cc-zone.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Zones/<cc-zone>',
  component: 'cc-zone',
};

const conf = {
  component: 'cc-zone',
  // language=CSS
  css: `cc-zone {
    margin-bottom: 1rem;
  }`,
};

const zoneDefault = {
  name: 'par',
  country: 'France',
  countryCode: 'fr',
  city: 'Paris',
  lat: 48.87,
  lon: 2.33,
  tags: ['region:eu', 'infra:clever-cloud'],
};

const zoneWithInfra = {
  name: 'war',
  country: 'Poland',
  countryCode: 'pl',
  city: 'Warsaw',
  lat: 52.23,
  lon: 21.01,
  tags: ['region:eu', 'infra:ovh'],
};

const zonePrivate = {
  name: 'acme-corp',
  displayName: 'ACME Corp',
  country: 'Germany',
  countryCode: 'de',
  city: 'Berlin',
  lat: 52.52,
  lon: 13.39,
  tags: ['region:eu', 'scope:private'],
};

const zoneWithoutTags = {
  name: 'nyc',
  country: 'United States',
  countryCode: 'us',
  city: 'New York City',
  lat: 40.71,
  lon: -74.01,
  tags: [],
};

const zoneWithManyTags = {
  name: 'war',
  country: 'Poland',
  countryCode: 'pl',
  city: 'Warsaw',
  lat: 52.23,
  lon: 21.01,
  tags: ['region:eu', 'infra:ovh', 'foobar:one', 'foobar:two', 'foobar:three', 'foobar:four', 'foobar:five', 'foobar:six'],
};

export const defaultStory = makeStory(conf, {
  items: [{ zone: zoneDefault }, { zone: zoneDefault, mode: 'small' }],
});

export const skeleton = makeStory(conf, {
  items: [{}, { mode: 'small' }],
});

// NOTE: We don't need an error state for now

export const dataLoadedWithInfra = makeStory(conf, {
  items: [{ zone: zoneWithInfra }, { zone: zoneWithInfra, mode: 'small' }],
});

export const dataLoadedWithPrivate = makeStory(conf, {
  items: [{ zone: zonePrivate }, { zone: zonePrivate, mode: 'small' }],
});

export const dataLoadedWithNoTags = makeStory(conf, {
  items: [{ zone: zoneWithoutTags }, { zone: zoneWithoutTags, mode: 'small' }],
});

export const dataLoadedWithManyTags = makeStory(conf, {
  items: [{ zone: zoneWithManyTags }, { zone: zoneWithManyTags, mode: 'small' }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentWithInfra]) => {
      component.zone = zoneDefault;
      componentWithInfra.zone = zoneWithInfra;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithInfra,
  dataLoadedWithPrivate,
  dataLoadedWithNoTags,
  dataLoadedWithManyTags,
  simulations,
});
