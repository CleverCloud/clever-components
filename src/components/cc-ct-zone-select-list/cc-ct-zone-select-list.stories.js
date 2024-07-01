
// Don't forget to import the component you're presenting!
import './cc-ct-zone-select-list.js';
import {
  iconCleverOracle as iconOracle,
  iconCleverCleverCloud as iconCleverCloud,
  iconCleverOvh as iconOvh,
  iconCleverOvhHds as iconOvhHds,
  iconCleverScaleway as iconScaleway,
} from '../../assets/cc-clever.icons.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

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
  { name: 'par', infra: iconCleverCloud, city: 'Paris', countryCode: 'FR' },
  { name: 'scw', infra: iconScaleway, city: 'Paris', countryCode: 'FR', tags: ['green'] },
  { name: 'mtl', infra: iconOvh, city: 'Montreal', countryCode: 'CA' },
  { name: 'jed', infra: iconOracle, city: 'Jeddah', countryCode: 'SA' },
  { name: 'fr-north-hds', infra: iconOvhHds, city: 'North', countryCode: 'FR', tags: ['hds'] },
];

export const defaultStory = makeStory(conf, {
  items: [{
    state: {
      type: 'loaded',
      zoneItems: DEFAULT_ITEMS,
    },
  }],
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
