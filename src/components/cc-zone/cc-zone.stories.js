import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-zone.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Zones/<cc-zone>',
  component: 'cc-zone',
};

const conf = {
  component: 'cc-zone',
};

/**
 * @typedef {import('./cc-zone.js').CcZone} CcZone
 * @typedef {import('./cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 * @typedef {import('./cc-zone.types.js').ZoneStateLoading} ZoneStateLoading
 * @typedef {import('./cc-zone.types.js').ZoneModeType} ZoneModeType
 */

/** @type {ZoneStateLoaded} */
const zoneDefault = {
  type: 'loaded',
  name: 'par',
  country: 'France',
  countryCode: 'FR',
  city: 'Paris',
  lat: 48.87,
  lon: 2.33,
  tags: ['region:eu', 'infra:clever-cloud'],
};

/** @type {ZoneStateLoaded} */
const zoneWithInfra = {
  type: 'loaded',
  name: 'war',
  country: 'Poland',
  countryCode: 'PL',
  city: 'Warsaw',
  lat: 52.23,
  lon: 21.01,
  tags: ['region:eu', 'infra:ovh'],
};

/** @type {ZoneStateLoaded} */
const zonePrivate = {
  type: 'loaded',
  name: 'acme-corp',
  displayName: 'ACME Corp',
  country: 'Germany',
  countryCode: 'DE',
  city: 'Berlin',
  lat: 52.52,
  lon: 13.39,
  tags: ['region:eu', 'scope:private'],
};

/** @type {ZoneStateLoaded} */
const zoneWithoutTags = {
  type: 'loaded',
  name: 'nyc',
  country: 'United States',
  countryCode: 'US',
  city: 'New York City',
  lat: 40.71,
  lon: -74.01,
  tags: [],
};

/** @type {ZoneStateLoaded} */
const zoneWithManyTags = {
  type: 'loaded',
  name: 'war',
  country: 'Poland',
  countryCode: 'PL',
  city: 'Warsaw',
  lat: 52.23,
  lon: 21.01,
  tags: [
    'region:eu',
    'infra:ovh',
    'foobar:one',
    'foobar:two',
    'foobar:three',
    'foobar:four',
    'foobar:five',
    'foobar:six',
  ],
};

export const defaultStory = makeStory(conf, {
  /** @type {{ state: ZoneStateLoaded, mode?: ZoneModeType }[]} */
  items: [{ state: zoneDefault }, { state: zoneDefault, mode: 'small' }, { state: zoneDefault, mode: 'small-infra' }],
});

export const loading = makeStory(conf, {
  /** @type {{ state: ZoneStateLoading, mode?: ZoneModeType }[]} */
  items: [
    { state: { type: 'loading' } },
    { state: { type: 'loading' }, mode: 'small' },
    { state: { type: 'loading' }, mode: 'small-infra' },
  ],
});

// NOTE: We don't need an error state for now

export const dataLoadedWithInfra = makeStory(conf, {
  /** @type {{ state: ZoneStateLoaded, mode?: ZoneModeType }[]} */
  items: [
    { state: zoneWithInfra },
    { state: zoneWithInfra, mode: 'small' },
    { state: zoneWithInfra, mode: 'small-infra' },
  ],
});

export const dataLoadedWithPrivate = makeStory(conf, {
  /** @type {{ state: ZoneStateLoaded, mode?: ZoneModeType }[]} */
  items: [{ state: zonePrivate }, { state: zonePrivate, mode: 'small' }, { state: zonePrivate, mode: 'small-infra' }],
});

export const dataLoadedWithNoTags = makeStory(conf, {
  /** @type {{ state: ZoneStateLoaded, mode?: ZoneModeType }[]} */
  items: [
    { state: zoneWithoutTags },
    { state: zoneWithoutTags, mode: 'small' },
    { state: zoneWithoutTags, mode: 'small-infra' },
  ],
});

export const dataLoadedWithManyTags = makeStory(conf, {
  /** @type {{ state: ZoneStateLoaded, mode?: ZoneModeType }[]} */
  items: [
    { state: zoneWithManyTags },
    { state: zoneWithManyTags, mode: 'small' },
    { state: zoneWithManyTags, mode: 'small-infra' },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcZone[]} components */
      ([component, componentWithInfra]) => {
        component.state = zoneDefault;
        componentWithInfra.state = zoneWithInfra;
      },
    ),
  ],
});
