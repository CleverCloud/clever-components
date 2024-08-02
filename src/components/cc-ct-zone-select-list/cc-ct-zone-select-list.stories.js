import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-ct-zone-select-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select-list>',
  component: 'cc-ct-zone-select-list',
};

const conf = {
  component: 'cc-ct-zone-select-list',
  // language=CSS
  css: ``,
};

/** @type {ZoneItem[]} */
const DEFAULT_ITEMS = [
  {
    code: 'scw',
    name: 'Paris',
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    images: [{ url: getInfraProviderLogoUrl('scaleway'), alt: 'infra' }],
    disabled: true,
    tags: ['green'],
  },
  {
    code: 'sgp',
    name: 'Singapore',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('SG'),
    countryCode: 'SG',
    country: 'Singapore',
    tags: [],
  },
  {
    code: 'par',
    name: 'Paris',
    images: [{ url: getInfraProviderLogoUrl('clever-cloud'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: ['foo'],
  },
  {
    code: 'grahds',
    name: 'Gravelines',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
  {
    code: 'mtl',
    name: 'Montreal',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('CA'),
    countryCode: 'CA',
    country: 'Canada',
    tags: [],
  },
  {
    code: 'syd',
    name: 'Sydney',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('AU'),
    countryCode: 'AU',
    country: 'Australia',
    tags: [],
  },
  {
    code: 'rbx',
    name: 'Roubaix',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
  {
    code: 'wsw',
    name: 'Warsaw',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('PL'),
    countryCode: 'PL',
    country: 'Poland',
    tags: [],
  },
  {
    code: 'rbxhds',
    name: 'Roubaix',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
  {
    code: 'fr-north-hds',
    name: 'North',
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
];

/** @type {ZoneItem[]} */
const PRIVATE_ZONES = [
  {
    code: 'foo-foobars',
    name: 'Private MySQL Cluster',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'Foo',
    name: 'City Member Lab',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'foo5',
    name: 'testing environment',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'foobarz',
    name: 'Foobarz',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'foozbar',
    name: 'Clever Edge Faume Paris',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'foobazbabarzone',
    name: 'Sleep Edge Abroad Bird Random',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'champion',
    name: 'Private MongoDB Cluster',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'clevercloud-postgresql-internal',
    name: 'Private PostgreSQL Cluster',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
  {
    code: 'mainstream',
    name: 'Sleep Edge Abroad Bird Matrix',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
    tags: [],
  },
];

/**
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneItem} ZoneItem
 */
export const defaultStory = makeStory(conf, {
  items: [
    {
      zones: DEFAULT_ITEMS,
      value: 'par',
    },
  ],
});

export const privateZones = makeStory(conf, {
  items: [
    {
      zones: PRIVATE_ZONES,
    },
  ],
});
export const allZones = makeStory(conf, {
  items: [
    {
      zones: [...PRIVATE_ZONES, ...DEFAULT_ITEMS],
    },
  ],
});
