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
    images: [getInfraProviderLogoUrl('scaleway')],
    tags: ['green'],
  },
  {
    code: 'sgp',
    name: 'Singapore',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('SG'),
    tags: [],
  },
  {
    code: 'par',
    name: 'Paris',
    images: [getInfraProviderLogoUrl('clever-cloud')],
    flagUrl: getFlagUrl('FR'),
    tags: ['foo'],
  },
  {
    code: 'grahds',
    name: 'Gravelines',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'mtl',
    name: 'Montreal',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('CA'),
    tags: [],
  },
  {
    code: 'syd',
    name: 'Sydney',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('AU'),
    tags: [],
  },
  {
    code: 'rbx',
    name: 'Roubaix',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'wsw',
    name: 'Warsaw',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('PL'),
    tags: [],
  },
  {
    code: 'rbxhds',
    name: 'Roubaix',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'fr-north-hds',
    name: 'North',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
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
