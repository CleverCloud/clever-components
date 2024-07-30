import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-ct-zone-select-list.js';

export default {
  // this makes storybook generate a doc from the custom elements manifest
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select-list>',
  // This component code is used by Storybook's docs page for the API table.
  // It will use `custom-elements.json` documentation file.
  // Run `npm run components:docs-json` to generate this JSON file.
  component: 'cc-ct-zone-select-list',
};

const conf = {
  component: 'cc-ct-zone-select-list',
  // You may need to add some CSS just for your stories.
  // language=CSS
  css: ``,
};

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
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('SG'),
    countryCode: 'SG',
    country: 'Singapore',
    tags: [],
  },
  {
    code: 'par',
    name: 'Paris',
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('clever-cloud'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: ['foo'],
  },
  {
    code: 'grahds',
    name: 'Gravelines',
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
  {
    code: 'mtl',
    name: 'Montreal',
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('CA'),
    countryCode: 'CA',
    country: 'Canada',
    tags: [],
  },
  {
    code: 'syd',
    selected: false,
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
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
  {
    code: 'wsw',
    name: 'Warsaw',
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('PL'),
    countryCode: 'PL',
    country: 'Poland',
    tags: [],
  },
  {
    code: 'rbxhds',
    name: 'Roubaix',
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
  {
    code: 'fr-north-hds',
    name: 'North',
    selected: false,
    images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    tags: [],
  },
];
const PRIVATE_ZONES = [
  {
    code: 'foo-foobars',
    name: 'Private MySQL Cluster',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'Foo',
    name: 'City Member Lab',
    selected: false,
    images: [],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'foo5',
    name: 'testing environment',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'foobarz',
    name: 'Foobarz',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'foozbar',
    name: 'Clever Edge Faume Paris',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'foobazbabarzone',
    name: 'Sleep Edge Abroad Bird Random',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'champion',
    name: 'Private MongoDB Cluster',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'clevercloud-postgresql-internal',
    name: 'Private PostgreSQL Cluster',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'mainstream',
    name: 'Sleep Edge Abroad Bird Matrix',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      zones: DEFAULT_ITEMS,
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
      zones: [...DEFAULT_ITEMS, ...PRIVATE_ZONES],
    },
  ],
});
