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
    countryCode: 'FR',
    country: 'France',
    images: [{ url: getInfraProviderLogoUrl('scaleway'), alt: 'infra' }],
    disabled: true,
    tags: ['green'],
  },
  {
    code: 'sgp',
    name: 'Singapore',
    selected: true,
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
export const defaultStory = makeStory(conf, {
  items: DEFAULT_ITEMS,
});

export const longCode = makeStory(conf, {
  items: [
    {
      code: 'very-very-very-very-very-very-very-long-code',
      name: 'Zone',
      selected: false,
      images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
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
      images: [{ url: getInfraProviderLogoUrl('ovh'), alt: 'infra' }],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
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
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'Foo',
      name: 'City Member Lab',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'foo5',
      name: 'testing environment',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'foobarz',
      name: 'Foobarz',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'foozbar',
      name: 'Clever Edge Faume Paris',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'foobazbabarzone',
      name: 'Sleep Edge Abroad Bird Random',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'champion',
      name: 'Private MongoDB Cluster',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'clevercloud-postgresql-internal',
      name: 'Private PostgreSQL Cluster',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
    {
      code: 'mainstream',
      name: 'Sleep Edge Abroad Bird Matrix',
      selected: false,
      images: [],
      flagUrl: getFlagUrl('FR'),
      countryCode: 'FR',
      country: 'France',
      tags: [],
    },
  ],
});
