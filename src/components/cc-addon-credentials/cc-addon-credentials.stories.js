import './cc-addon-credentials.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

const credentials = [
  { type: 'host', value: 'my-host.services.clever-cloud.com', secret: false },
  { type: 'user', value: 'my-super-user', secret: false },
  { type: 'password', value: 'my-super-password', secret: true },
];

const credentialsSkeleton = credentials.map((p) => ({ ...p, value: null }));

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-credentials>',
  component: 'cc-addon-credentials',
};

const conf = {
  component: 'cc-addon-credentials',
};

export const defaultStory = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    image: 'https://assets.clever-cloud.com/logos/elastic.svg',
    credentials,
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    image: 'https://assets.clever-cloud.com/logos/elastic.svg',
    credentials: credentialsSkeleton,
  }],
});

export const error = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    image: 'https://assets.clever-cloud.com/logos/elastic.svg',
    error: true,
  }],
});

export const dataLoadedWithKibana = makeStory(conf, {
  items: [{
    type: 'kibana',
    name: 'Kibana',
    image: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
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
    toggleState: 'close',
    image: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
    credentials: [
      { type: 'user', value: 'my-super-user', secret: false },
      { type: 'password', value: 'my-super-password', secret: true },
      { type: 'auth-token', value: 'my-awesome-token', secret: true },
    ],
  }],
});

export const dataLoadedWithPulsar = makeStory(conf, {
  items: [{
    type: 'pulsar',
    name: 'Pulsar',
    toggleState: 'open',
    image: 'https://assets.clever-cloud.com/logos/pulsar.svg',
    credentials: [
      { type: 'url', value: 'pulsar+ssl://url:port', secret: false },
      { type: 'auth-token', value: 'my-awesome-token', secret: true },
    ],
  }],
});

export const simulations = makeStory(conf, {
  items: [
    {
      type: 'elasticsearch',
      name: 'Elasticsearch',
      image: 'https://assets.clever-cloud.com/logos/elastic.svg',
      credentials: credentialsSkeleton,
    },
    {
      type: 'apm',
      name: 'APM',
      image: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
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
