import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-ct-zone-select.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select>',
  component: 'cc-ct-zone-select',
};

const conf = {
  component: 'cc-ct-zone-select',
  // language=CSS
  css: `
    cc-ct-zone-select {
        --width: 13em;
        --height:  12em;
    }
  `,
};

const DEFAULT_ITEMS = [
  {
    code: 'scw',
    name: 'Paris',
    flagUrl: getFlagUrl('FR'),
    images: [getInfraProviderLogoUrl('scaleway')],
    disabled: true,
    tags: ['green'],
  },
  {
    code: 'sgp',
    name: 'Singapore',
    selected: true,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('SG'),
    tags: [],
  },
  {
    code: 'par',
    name: 'Paris',
    selected: false,
    images: [getInfraProviderLogoUrl('clever-cloud')],
    flagUrl: getFlagUrl('FR'),
    tags: ['foo'],
  },
  {
    code: 'grahds',
    name: 'Gravelines',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'mtl',
    name: 'Montreal',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('CA'),
    tags: [],
  },
  {
    code: 'syd',
    selected: false,
    name: 'Sydney',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('AU'),
    tags: [],
  },
  {
    code: 'rbx',
    name: 'Roubaix',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'wsw',
    name: 'Warsaw',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('PL'),
    tags: [],
  },
  {
    code: 'rbxhds',
    name: 'Roubaix',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    code: 'fr-north-hds',
    name: 'North',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
];

export const defaultStory = makeStory(conf, {
  items: DEFAULT_ITEMS,
});

export const longCode = makeStory(conf, {
  items: [
    {
      code: 'very-very-very-very-very-very-very-long-code',
      name: 'Zone',
      selected: false,
      images: [getInfraProviderLogoUrl('ovh')],
      flagUrl: getFlagUrl('FR'),
      tags: [],
    },
  ],
});

export const longName = makeStory(conf, {
  items: [
    {
      code: 'code',
      name: 'very-very-very-very-very-very-very-long-name',
      selected: false,
      images: [getInfraProviderLogoUrl('ovh')],
      flagUrl: getFlagUrl('FR'),
      tags: [],
    },
  ],
});

export const privateZone = makeStory(conf, {
  items: [
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
  ],
});
