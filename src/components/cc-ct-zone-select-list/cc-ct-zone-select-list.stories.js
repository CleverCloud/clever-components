import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-ct-zone-select-list.js';

export default {
  // this makes storybook generate a doc from the custom elements manifest
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select-list>',
  // This component name is used by Storybook's docs page for the API table.
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
    name: 'scw',
    city: 'Paris',
    flagUrl: getFlagUrl('FR'),
    images: [getInfraProviderLogoUrl('scaleway')],
    tags: ['green'],
  },
  {
    name: 'sgp',
    city: 'Singapore',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('SG'),
    tags: [],
  },
  {
    name: 'par',
    city: 'Paris',
    images: [getInfraProviderLogoUrl('clever-cloud')],
    flagUrl: getFlagUrl('FR'),
    tags: ['foo'],
  },
  {
    name: 'grahds',
    city: 'Gravelines',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    name: 'mtl',
    city: 'Montreal',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('CA'),
    tags: [],
  },
  {
    name: 'syd',
    city: 'Sydney',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('AU'),
    tags: [],
  },
  {
    name: 'rbx',
    city: 'Roubaix',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    name: 'wsw',
    city: 'Warsaw',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('PL'),
    tags: [],
  },
  {
    name: 'rbxhds',
    city: 'Roubaix',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
  {
    name: 'fr-north-hds',
    city: 'North',
    images: [getInfraProviderLogoUrl('ovh')],
    flagUrl: getFlagUrl('FR'),
    tags: [],
  },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        zoneItems: DEFAULT_ITEMS,
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const simulations = makeStory(conf, {
  items: [{ state: { type: 'loading' } }, { state: { type: 'loading' } }],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state.zoneItems = DEFAULT_ITEMS;
      component.state.type = 'loaded';
      componentError.state.type = 'error';
    }),
  ],
});
