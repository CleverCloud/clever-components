import { ZONES } from '../../stories/fixtures/zones.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-zone-input.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Zones/<cc-zone-input>',
  component: 'cc-zone-input',
};

const conf = {
  component: 'cc-zone-input',
  // language=CSS
  css: `
    cc-zone-input {
      height: 350px;
    }
  `,
};

/**
 * @import { CcZoneInput } from './cc-zone-input.js'
 * @import { ZoneInputStateLoaded, ZoneInputStateLoading, ZoneInputStateError } from './cc-zone-input.types.js'
 */

export const defaultStory = makeStory(conf, {
  tests: {
    visual: {
      enable: false,
    },
  },
  items: [
    {
      /** @type {ZoneInputStateLoaded} */
      state: {
        type: 'loaded',
        zones: ZONES,
      },
      selected: 'rbx',
    },
  ],
});

export const loading = makeStory(conf, {
  tests: {
    accessibility: {
      enable: true,
      ignoredRules: ['scrollable-region-focusable'],
    },
  },
  items: [
    {
      /** @type {ZoneInputStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const dataLoadedWithNoPrivateZones = makeStory(conf, {
  items: [
    {
      /** @type {ZoneInputStateLoaded} */
      state: {
        type: 'loaded',
        zones: ZONES.filter((z) => !z.tags.includes('scope:private')),
      },
      selected: 'rbx',
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {ZoneInputStateError} */
      state: { type: 'error' },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcZoneInput[]} components */
      ([component, componentError]) => {
        component.state = { type: 'loaded', zones: ZONES };
        component.selected = 'syd';
        componentError.state = { type: 'error' };
      },
    ),
  ],
});
