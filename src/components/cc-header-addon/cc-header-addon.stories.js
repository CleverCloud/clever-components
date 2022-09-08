import './cc-header-addon.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const zoneParis = {
  name: 'par',
  country: 'France',
  countryCode: 'fr',
  city: 'Paris',
  tags: ['region:eu', 'infra:clever-cloud'],
};

const addon = {
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
};

const addonConfig = {
  id: 'addon_5fe90fe5-e63e-424e-a5f6-3f008fb5f456',
  realId: 'config_28a90c96-0a6e-49b8-b4d5-aeb3b8d70df3',
  name: 'My config add-on',
  provider: {
    name: 'Configuration provider',
    logoUrl: 'https://static-assets.cellar.services.clever-cloud.com/logos/configprovider.svg',
  },
  plan: {
    name: 'Standard',
  },
  creationDate: 1538990538754,
};

const version = '11.2';

export default {
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

export const defaultStory = makeStory(conf, {
  items: [{ addon, version, zone: zoneParis }],
});

export const skeleton = makeStory(conf, {
  items: [
    {},
    { addon },
  ],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const noVersion = makeStory(conf, {
  items: [{ addon: addonConfig, noVersion: true, zone: zoneParis }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([componentLazy, componentFull, componentError]) => {
      componentLazy.addon = addon;
      componentFull.addon = addon;
      componentFull.version = version;
      componentError.error = true;
    }),
    storyWait(2000, ([componentLazy, componentFull]) => {
      componentLazy.zone = zoneParis;
      componentFull.zone = zoneParis;
    }),
    storyWait(4000, ([componentLazy]) => {
      componentLazy.version = version;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  noVersion,
  simulations,
});
