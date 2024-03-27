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

export const dataLoadedWithMateriaDbKv = makeStory(conf, {
  items: [{
    type: 'materiadb-kv',
    name: 'MateriaDB KV',
    toggleState: 'off',
    image: 'https://assets.clever-cloud.com/logos/materia-db-kv.png',
    credentials: [
      { type: 'host', value: 'example.com', secret: false },
      { type: 'port', value: '6379', secret: false },
      { type: 'auth-token', value: 'fake-SbKm9sHFaP2uCuQSLZbsQXhwelHxahs4tLV9IOwCc1RBBAtLNF1aM444DJxCtySpEst5zFlaIMbNM3s3koEYTT9PVkGHSwvb36wbSf9QRq8owFMnyx0mEseU1cHkMpzfo2KIFrjfx8laTYYNXh3ji8T8BI5v5dHHbOwpF0tegIYOXpwY8vc0EYTL43jq7DhRPWTyipW4me8W0dfaOjXf6ODLOFK8', secret: true },
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
