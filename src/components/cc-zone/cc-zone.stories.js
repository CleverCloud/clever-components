import './cc-zone.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Zones/<cc-zone>',
  component: 'cc-zone',
};

const conf = {
  component: 'cc-zone',
};

const zoneDefault = {
  name: 'par',
  country: 'France',
  countryCode: 'FR',
  city: 'Paris',
  lat: 48.87,
  lon: 2.33,
  tags: ['region:eu', 'infra:clever-cloud'],
};

const zoneWithInfra = {
  name: 'war',
  country: 'Poland',
  countryCode: 'PL',
  city: 'Warsaw',
  lat: 52.23,
  lon: 21.01,
  tags: ['region:eu', 'infra:ovh'],
};

const zonePrivate = {
  name: 'acme-corp',
  displayName: 'ACME Corp',
  country: 'Germany',
  countryCode: 'DE',
  city: 'Berlin',
  lat: 52.52,
  lon: 13.39,
  tags: ['region:eu', 'scope:private'],
};

const zoneWithoutTags = {
  name: 'nyc',
  country: 'United States',
  countryCode: 'US',
  city: 'New York City',
  lat: 40.71,
  lon: -74.01,
  tags: [],
};

const zoneWithManyTags = {
  name: 'war',
  country: 'Poland',
  countryCode: 'PL',
  city: 'Warsaw',
  lat: 52.23,
  lon: 21.01,
  tags: ['region:eu', 'infra:ovh', 'foobar:one', 'foobar:two', 'foobar:three', 'foobar:four', 'foobar:five', 'foobar:six'],
};

export const defaultStory = makeStory(conf, {
  items: [{ zone: zoneDefault }, { zone: zoneDefault, mode: 'small' }, { zone: zoneDefault, mode: 'small-infra' }],
});

export const skeleton = makeStory(conf, {
  items: [{}, { mode: 'small' }, { mode: 'small-infra' }],
});

// NOTE: We don't need an error state for now

export const dataLoadedWithInfra = makeStory(conf, {
  items: [{ zone: zoneWithInfra }, { zone: zoneWithInfra, mode: 'small' }, {
    zone: zoneWithInfra, mode: 'small-infra',
  }],
});

export const dataLoadedWithPrivate = makeStory(conf, {
  items: [{ zone: zonePrivate }, { zone: zonePrivate, mode: 'small' }, { zone: zonePrivate, mode: 'small-infra' }],
});

export const dataLoadedWithNoTags = makeStory(conf, {
  items: [{ zone: zoneWithoutTags }, { zone: zoneWithoutTags, mode: 'small' }, {
    zone: zoneWithoutTags, mode: 'small-infra',
  }],
});

export const dataLoadedWithManyTags = makeStory(conf, {
  items: [{ zone: zoneWithManyTags }, { zone: zoneWithManyTags, mode: 'small' }, {
    zone: zoneWithManyTags, mode: 'small-infra',
  }],
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
