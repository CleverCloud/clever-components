import { getFlagUrl } from '../../lib/remote-assets.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-zone-picker.js';

const cleverIcon = new URL('../../stories/assets/clevercloud.svg', import.meta.url);
const cloudTempleIcon = new URL('../../stories/assets/cloudtemple.svg', import.meta.url);
const oracleIcon = new URL('../../stories/assets/oracle.svg', import.meta.url);
const ovhIcon = new URL('../../stories/assets/ovh.svg', import.meta.url);
const scalewayIcon = new URL('../../stories/assets/scaleway.svg', import.meta.url);

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-zone-picker>',
  component: 'cc-zone-picker',
};

const conf = {
  component: 'cc-zone-picker',
  // language=CSS
  css: ``,
};

/**
 * @typedef {import('./cc-zone-picker.js').CcZonePicker} CcZonePicker
 * @typedef {import('./cc-zone-picker.types.js').ZoneItem} ZoneItem
 * @typedef {import('./cc-zone-picker.types.js').ZoneSection} ZoneSection
 */

/** @type {ZoneItem[]} */
const PUBLIC_ZONES = [
  {
    code: 'scw',
    name: 'Paris',
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
    images: [{ url: scalewayIcon, alt: 'infra' }],
    disabled: false,
  },
  {
    code: 'sgp',
    name: 'Singapore',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('SG'),
    countryCode: 'SG',
    country: 'Singapore',
  },
  {
    code: 'par',
    name: 'Paris',
    images: [{ url: cleverIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
  },
  {
    code: 'grahds',
    name: 'Gravelines',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
  },
  {
    code: 'mtl',
    name: 'Montreal',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('CA'),
    countryCode: 'CA',
    country: 'Canada',
  },
  {
    code: 'syd',
    name: 'Sydney',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('AU'),
    countryCode: 'AU',
    country: 'Australia',
  },
  {
    code: 'rbx',
    name: 'Roubaix',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
  },
  {
    code: 'wsw',
    name: 'Warsaw',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('PL'),
    countryCode: 'PL',
    country: 'Poland',
  },
  {
    code: 'rbxhds',
    name: 'Roubaix',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
  },
  {
    code: 'fr-north-hds',
    name: 'North',
    images: [{ url: ovhIcon, alt: 'infra' }],
    flagUrl: getFlagUrl('FR'),
    countryCode: 'FR',
    country: 'France',
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
  },
  {
    code: 'Foo',
    name: 'City Member Lab',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'foo5',
    name: 'testing environment',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'foobarz',
    name: 'Foobarz',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'foozbar',
    name: 'Chips Dale Sound City',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'foobazbabarzone',
    name: 'Sleep Edge Abroad Bird Random',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'champion',
    name: 'Private MongoDB Cluster',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'ichipsndales-postgresql-internal',
    name: 'Private PostgreSQL Cluster',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
  {
    code: 'mainstream',
    name: 'Sleep Edge Abroad Bird Matrix',
    images: [],
    flagUrl: getFlagUrl('FR'),
    country: 'France',
    countryCode: 'FR',
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcZonePicker>>} */
  items: [
    {
      zonesSections: [
        {
          zones: PUBLIC_ZONES,
        },
      ],
      value: 'par',
    },
  ],
});

export const publicAndPrivateZones = makeStory(conf, {
  /** @type {Array<Partial<CcZonePicker>>} */
  items: [
    {
      zonesSections: [
        {
          title: 'Private zones',
          zones: PRIVATE_ZONES,
        },
        {
          title: 'Public zones',
          zones: PUBLIC_ZONES,
        },
      ],
    },
  ],
});

export const multipleSections = makeStory(conf, {
  /** @type {Array<Partial<CcZonePicker>>} */
  items: [
    {
      zonesSections: [
        {
          title: 'Private zones',
          zones: PRIVATE_ZONES,
        },
        {
          title: 'Public zones',
          zones: PUBLIC_ZONES,
        },
        {
          title: 'Other section',
          zones: [
            {
              code: 'other-zone',
              name: 'Other Zone',
              images: [{ url: oracleIcon, alt: 'infra' }],
              flagUrl: getFlagUrl('FR'),
              country: 'France',
              countryCode: 'FR',
            },
            {
              code: 'other-zone-two',
              name: 'Other Zone 2',
              images: [{ url: cloudTempleIcon, alt: 'infra' }],
              flagUrl: getFlagUrl('FR'),
              country: 'France',
              countryCode: 'FR',
            },
          ],
        },
      ],
    },
  ],
});
