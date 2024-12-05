import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-linked-apps.smart.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-linked-apps>',
  component: 'cc-addon-linked-apps',
};

const conf = {
  component: 'cc-addon-linked-apps',
};

/**
 * @typedef {import('./cc-addon-linked-apps.js').CcAddonLinkedApps} CcAddonLinkedApps
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsStateLoaded} AddonLinkedAppsStateLoaded
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsStateLoading} AddonLinkedAppsStateLoading
 * @typedef {import('./cc-addon-linked-apps.types.js').AddonLinkedAppsStateError} AddonLinkedAppsStateError
 * @typedef {import('./cc-addon-linked-apps.types.js').LinkedApplication} LinkedApplication
 * @typedef {import('../cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 */

/** @type {ZoneStateLoaded} */
const ZONE_PAR = {
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
const ZONE_MTL = {
  type: 'loaded',
  name: 'mtl',
  country: 'Canada',
  countryCode: 'CA',
  city: 'Montreal',
  lat: 45.5,
  lon: -73.61,
  tags: ['infra:ovh'],
};

/** @type {LinkedApplication[]} */
const linkedApplications = [
  {
    name: 'My Node JS Prod Application',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    variantName: 'Node',
    variantLogoUrl: 'https://assets.clever-cloud.com/logos/nodejs.svg',
    zone: ZONE_PAR,
  },
  {
    name: 'My Awesome Java app for my API',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    variantName: 'Java + Maven',
    variantLogoUrl: 'https://assets.clever-cloud.com/logos/maven.svg',
    zone: ZONE_PAR,
  },
  {
    name: 'My Dev PHP frontend',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    variantName: 'PHP',
    variantLogoUrl: 'https://assets.clever-cloud.com/logos/php.svg',
    zone: ZONE_MTL,
  },
  {
    name: 'My Awesome Scala API',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    variantName: 'Scala + SBT',
    variantLogoUrl: 'https://assets.clever-cloud.com/logos/scala.svg',
    zone: ZONE_MTL,
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {AddonLinkedAppsStateLoaded} */
      state: { type: 'loaded', linkedApplications },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {AddonLinkedAppsStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {AddonLinkedAppsStateError} */
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      /** @type {AddonLinkedAppsStateLoaded} */
      state: { type: 'loaded', linkedApplications: [] },
    },
  ],
});

export const dataLoaded = makeStory(conf, {
  items: [
    {
      /** @type {AddonLinkedAppsStateLoaded} */
      state: { type: 'loaded', linkedApplications },
    },
  ],
});

export const dataLoadedWithLongName = makeStory(conf, {
  items: [
    {
      /** @type {AddonLinkedAppsStateLoaded} */
      state: {
        type: 'loaded',
        linkedApplications: linkedApplications.map((app) => {
          return {
            ...app,
            name: app.name + ' very very very very very long',
          };
        }),
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{ state: { type: 'loading' } }, { state: { type: 'loading' } }, { state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonLinkedApps[]} components */
      ([component, componentNone, componentError]) => {
        component.state = { type: 'loaded', linkedApplications };
        componentNone.state = { type: 'loaded', linkedApplications: [] };
        componentError.state = { type: 'error' };
      },
    ),
  ],
});
