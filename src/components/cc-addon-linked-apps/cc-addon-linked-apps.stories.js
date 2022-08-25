import './cc-addon-linked-apps.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const ZONE_PAR = {
  name: 'par',
  country: 'France',
  countryCode: 'FR',
  city: 'Paris',
  lat: 48.87,
  lon: 2.33,
  tags: ['region:eu', 'infra:clever-cloud'],
};

const ZONE_MTL = {
  name: 'mtl',
  country: 'Canada',
  countryCode: 'CA',
  city: 'Montreal',
  lat: 45.50,
  lon: -73.61,
  tags: ['infra:ovh'],
};

const applications = [
  {
    name: 'My Node JS Prod Application',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'Node', logo: 'https://assets.clever-cloud.com/logos/nodejs.svg',
      },
    },
    zone: ZONE_PAR,
  },
  {
    name: 'My Awesome Java app for my API',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'Java + Maven', logo: 'https://assets.clever-cloud.com/logos/maven.svg',
      },
    },
    zone: ZONE_PAR,
  },
  {
    name: 'My Dev PHP frontend',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'PHP', logo: 'https://assets.clever-cloud.com/logos/php.svg',
      },
    },
    zone: ZONE_MTL,
  },
  {
    name: 'My Awesome Scala API',
    link: '/organisations/uuid_foo/applications/uuid_bar',
    instance: {
      variant: {
        name: 'Scala + SBT', logo: 'https://assets.clever-cloud.com/logos/scala.svg',
      },
    },
    zone: ZONE_MTL,
  },
];

export default {
  title: '🛠 Addon/<cc-addon-linked-apps>',
  component: 'cc-addon-linked-apps',
};

const conf = {
  component: 'cc-addon-linked-apps',
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
