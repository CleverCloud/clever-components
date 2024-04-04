import './cc-header-addon.js';
import { ZONE } from '../../stories/fixtures/zones.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-header-addon>',
  component: 'cc-header-addon',
};

const conf = {
  component: 'cc-header-addon',
  // language=CSS
  css: `
    :host {
      max-width: 82em !important;
    }
  `,
};

/**
 * @typedef {import('./cc-header-addon.js').CcHeaderAddon} CcHeaderAddon
 * @typedef {import('./cc-header-addon.types.js').HeaderAddonStateLoaded} HeaderAddonStateLoaded
 * @typedef {import('./cc-header-addon.types.js').HeaderAddonStateLoadedWithVersion} HeaderAddonStateLoadedWithVersion
 * @typedef {import('./cc-header-addon.types.js').HeaderAddonStateLoading} HeaderAddonStateLoading
 * @typedef {import('./cc-header-addon.types.js').HeaderAddonStateError} HeaderAddonStateError
 */

/** @type {HeaderAddonStateLoadedWithVersion} */
const addonStateLoaded = {
  type: 'loaded',
  id: 'addon_012345678-9012-3456-7890-12345678',
  realId: 'postgresql_90459c4a-4db3-4805-9844-4dac30b0a89d',
  name: 'Awesome addon (PROD)',
  provider: {
    name: 'PostgreSQL Addon',
    logoUrl: 'https://assets.clever-cloud.com/logos/pgsql.svg',
  },
  plan: {
    name: 'XS_SML',
  },
  creationDate: 1538990538754,
  hasVersion: true,
  version: '11.2',
  zone: ZONE,
};

/** @type {HeaderAddonStateLoaded} */
const addonConfigStateLoaded = {
  type: 'loaded',
  id: 'addon_5fe90fe5-e63e-424e-a5f6-3f008fb5f456',
  realId: 'config_28a90c96-0a6e-49b8-b4d5-aeb3b8d70df3',
  name: 'My config add-on',
  provider: {
    name: 'Configuration provider',
    logoUrl: 'https://assets.clever-cloud.com/logos/configprovider.svg',
  },
  plan: {
    name: 'Standard',
  },
  creationDate: 1538990538754,
  hasVersion: false,
  zone: ZONE,
};

export const defaultStory = makeStory(conf, {
  items: [{
    /** @type {HeaderAddonStateLoadedWithVersion} */
    state: addonStateLoaded,
  }],
});

export const loadingWithVersion = makeStory(conf, {
  items: [{
    /** @type {HeaderAddonStateLoading} */
    state: { type: 'loading', hasVersion: true },
  }],
});

export const loadingWithNoVersion = makeStory(conf, {
  items: [{
    /** @type {HeaderAddonStateLoading} */
    state: { type: 'loading', hasVersion: false },
  }],
});

export const error = makeStory(conf, {
  items: [{
    /** @type {HeaderAddonStateError} */
    state: { type: 'error', hasVersion: true },
  }],
});

export const dataLoadedWithNoVersion = makeStory(conf, {
  items: [{
    /** @type {HeaderAddonStateLoaded} */
    state: addonConfigStateLoaded,
  }],
});

export const simulations = makeStory(conf, {
  items: [
    { type: 'loading', hasVersion: false },
    { type: 'loading', hasVersion: true },
    { type: 'loading', hasVersion: true },
  ],
  simulations: [
    storyWait(2000,
      /** @param {CcHeaderAddon[]} components */
      ([componentWithoutVersion, componentWithVersion, componentError]) => {
        componentWithoutVersion.state = addonConfigStateLoaded;
        componentWithVersion.state = addonStateLoaded;
        componentError.state = { type: 'error', hasVersion: true };
      }),
  ],
});
