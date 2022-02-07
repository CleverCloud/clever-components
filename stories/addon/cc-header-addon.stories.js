import '../../src/addon/cc-header-addon.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

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

const version = '11.2';

export default {
  title: '🛠 Addon/<cc-header-addon>',
  component: 'cc-header-addon',
};

const conf = {
  component: 'cc-header-addon',
  css: `
    cc-header-addon {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ addon, version }],
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

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([componentLazy, componentFull, componentError]) => {
      componentFull.addon = addon;
      componentFull.version = version;
      componentLazy.addon = addon;
      componentError.error = true;
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
  simulations,
});
