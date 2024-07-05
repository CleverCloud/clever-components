import './cc-ct-zone-select.js';
import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  // this makes storybook generate a doc from the custom elements manifest
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-zone-select>',
  // This component name is used by Storybook's docs page for the API table.
  // It will use `custom-elements.json` documentation file.
  // Run `npm run components:docs-json` to generate this JSON file.
  component: 'cc-ct-zone-select',
};

const conf = {
  component: 'cc-ct-zone-select',
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
    disabled: true,
    tags: [
      'green',
    ],
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

// The first story in the file will appear before the API table in Storybook's docs page.
// We call it the "default story" and it's used as the main presentation of your component.
// You can set several instances/items to show different situations
// but no need to get exhaustive or too detailed ;-)
export const defaultStory = makeStory(conf, {
  items: DEFAULT_ITEMS.map((item) => ({ state: { type: 'loaded', ...item } })),
});

// If your component contains remote data,
// you'll need a "skeleton screen" while the user's waiting for the data.
export const skeleton = makeStory(conf, {
  items: [{}],
});

// If your component contains remote data,
// don't forget the case where there is no data (ex: empty lists...).
export const empty = makeStory(conf, {
  items: [{ three: [] }],
});

// If your component contains remote data,
// don't forget the case where you have loading errors.
// If you have other kind of errors (ex: saving errors...).
// You need to name your stories with the `errorWith` prefix.
export const error = makeStory(conf, {
  items: [{ error: true }],
});

// If your component contains remote data,
// try to present all the possible data combination.
// You need to name your stories with the `dataLoadedWith` prefix.
// Don't forget edge cases (ex: small/huge strings, small/huge lists...).
export const dataLoadedWithFoo = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }] },
  ],
});

// If your component can trigger updates/deletes remote data,
// don't forget the case where the user's waiting for an operation to complete.
export const waiting = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }], waiting: true },
  ],
});

// If your component contains remote data,
// it will have several state transitions (ex: loading => error, loading => loaded, loaded => saving...).
// When transitioning from one state to another, we try to prevent the display from "jumping" or "blinking" too much.
// Using "simulations", you can simulate several steps in time to present how your component behaves when it goes through different states.
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
