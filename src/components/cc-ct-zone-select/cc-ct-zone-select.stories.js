import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-ct-zone-select.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select>',
  component: 'cc-ct-zone-select',
};

const conf = {
  component: 'cc-ct-zone-select',
  // language=CSS
  css: ``,
};

const DEFAULT_ITEMS = [
  {
    name: 'scw',
    city: 'Paris',
    flagUrl: getFlagUrl('FR'),
    images: [getInfraProviderLogoUrl('scaleway')],
    disabled: true,
    tags: ['green'],
  },
  {
    name: 'sgp',
    city: 'Singapore',
    selected: true,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('SG'),
    tags: [],
  },
  {
    name: 'par',
    city: 'Paris',
    selected: false,
    images: [getInfraProviderLogoUrl('clever-cloud')],
    flagUrl: getFlagUrl('FR'),
    tags: ['foo'],
  },
  {
    name: 'grahds',
    city: 'Gravelines',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    name: 'mtl',
    city: 'Montreal',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('CA'),
    tags: [],
  },
  {
    name: 'syd',
    selected: false,
    city: 'Sydney',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('AU'),
    tags: [],
  },
  {
    name: 'rbx',
    city: 'Roubaix',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    name: 'wsw',
    city: 'Warsaw',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('PL'),
    tags: [],
  },
  {
    name: 'rbxhds',
    city: 'Roubaix',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    name: 'fr-north-hds',
    city: 'North',
    selected: false,
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
];

export const defaultStory = makeStory(conf, {
  items: DEFAULT_ITEMS.map((item) => ({ state: { type: 'loaded', ...item } })),
});

export const privateZone = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        name: 'private-zone',
        city: 'Priv-zone',
        selected: false,
        images: [],
        flagUrl: getFlagUrl('FR'),
        tags: ['private'],
      },
    },
    {
      state: {
        type: 'loaded',
        name: 'priv-zone',
        city: 'Private zone',
        selected: false,
        images: [],
        flagUrl: getFlagUrl('FR'),
        tags: ['private'],
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.three = [{ foo: 42 }];
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.three = [{ foo: 42 }, { foo: 43 }];
    }),
  ],
});
