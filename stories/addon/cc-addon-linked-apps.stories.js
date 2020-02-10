import '../../components/addon/cc-addon-linked-apps.js';
import notes from '../../.components-docs/cc-addon-linked-apps.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

const applications = [
  {
    name: 'My Node JS Prod Application',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'Node', logo: 'https://static-assets.cellar.services.clever-cloud.com/logos/nodejs.svg',
      },
    },
    zone: 'par',
  },
  {
    name: 'My Awesome Java app for my API',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'Java + Maven', logo: 'https://static-assets.cellar.services.clever-cloud.com/logos/maven.svg',
      },
    },
    zone: 'par',
  },
  {
    name: 'My Dev PHP frontend',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'PHP', logo: 'https://static-assets.cellar.services.clever-cloud.com/logos/php.svg',
      },
    },
    zone: 'mtl',
  },
  {
    name: 'My Awesome Scala API',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'Scala + SBT', logo: 'https://static-assets.cellar.services.clever-cloud.com/logos/scala.svg',
      },
    },
    zone: 'mtl',
  },
];

export default {
  title: '🛠 Addon|<cc-addon-linked-apps>',
  component: 'cc-addon-linked-apps',
  parameters: { notes },
};

const conf = {
  component: 'cc-addon-linked-apps',
  css: `
    cc-addon-linked-apps {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ applications }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const empty = makeStory(conf, {
  items: [{ applications: [] }],
});

export const dataLoaded = makeStory(conf, {
  items: [{ applications }],
});

export const dataLoadedWithLongName = makeStory(conf, {
  items: [{
    applications: applications.map((app) => {
      return {
        ...app,
        name: app.name + ' very very very very very long',
      };
    }),
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}, {}],
  simulations: [
    storyWait(2000, ([component, componentNone, componentError]) => {
      component.applications = applications;
      componentNone.applications = [];
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  empty,
  dataLoaded,
  dataLoadedWithLongName,
  simulations,
});
