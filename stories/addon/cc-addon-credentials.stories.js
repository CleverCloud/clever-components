import '../../components/addon/cc-addon-credentials.js';
import notes from '../../.components-docs/cc-addon-credentials.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

const credentials = [
  { type: 'host', value: 'my-host.services.clever-cloud.com', secret: false },
  { type: 'user', value: 'my-super-user', secret: false },
  { type: 'password', value: 'my-super-password', secret: true },
];

const credentialsSkeleton = credentials.map((p) => ({ ...p, value: null }));

export default {
  title: '🛠 Addon|<cc-addon-credentials>',
  component: 'cc-addon-credentials',
  parameters: { notes },
};

const conf = {
  component: 'cc-addon-credentials',
  css: `
    cc-addon-credentials {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
    credentials,
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
    credentials: credentialsSkeleton,
  }],
});

export const error = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
    error: true,
  }],
});

export const dataLoadedWithKibana = makeStory(conf, {
  items: [{
    type: 'kibana',
    name: 'Kibana',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg',
    toggleState: 'close',
    credentials: [
      { type: 'host', value: 'my-host.services.clever-cloud.com', secret: false },
      { type: 'user', value: 'my-super-user', secret: false },
      { type: 'password', value: 'my-super-password', secret: true },
    ],
  }],
});

export const dataLoadedWithApm = makeStory(conf, {
  items: [{
    type: 'apm',
    name: 'APM',
    toggleState: 'open',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg',
    credentials: [
      { type: 'user', value: 'my-super-user', secret: false },
      { type: 'password', value: 'my-super-password', secret: true },
      { type: 'auth-token', value: 'my-awesome-token', secret: true },
    ],
  }],
});

export const simulations = makeStory(conf, {
  items: [
    {
      type: 'elasticsearch',
      name: 'Elasticsearch',
      icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
      credentials: credentialsSkeleton,
    },
    {
      type: 'apm',
      name: 'APM',
      icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg',
      credentials: [
        { type: 'user', secret: false },
        { type: 'password', secret: true },
        { type: 'auth-token', secret: true },
      ],
    },
  ],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.credentials = credentials;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  dataLoadedWithKibana,
  dataLoadedWithApm,
  simulations,
});
