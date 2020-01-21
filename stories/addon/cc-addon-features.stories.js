import '../../components/addon/cc-addon-features.js';
import notes from '../../.components-docs/cc-addon-features.md';
import { enhanceStoriesNames } from '../lib/story-names.js';
import { makeStory, storyWait } from '../lib/make-story.js';

const defaultFeatures = [
  { name: 'DISK', value: '40 GB' },
  { name: 'MEMORY', value: '4 GB' },
  { name: 'CPUs', value: '2' },
  { name: 'Foo feature', value: 'No' },
  { name: 'Bar feature', value: 'Yes' },
];

export default {
  title: '🛠 Addon|<cc-addon-features>',
  component: 'cc-addon-features',
  parameters: { notes },
};

const conf = {
  component: 'cc-addon-features',
  css: `
    cc-addon-features {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ features: defaultFeatures }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithElasticSearch = makeStory(conf, {
  items: [{
    features: [
      { name: 'DISK', value: '40 GB' },
      { name: 'NODES', value: '1' },
      { name: 'MEMORY', value: '4 GB' },
      { name: 'CPUs', value: '2' },
      { name: 'KIBANA', value: 'Yes' },
      { name: 'API', value: 'No' },
    ],
  }],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [{
    features: [
      { name: 'Connection limit', value: '250' },
      { name: 'Type', value: 'Dedicated' },
      { name: 'Isolation', value: 'Dedicated' },
      { name: 'Databases', value: '100' },
      { name: 'Size', value: '250mb' },
    ],
  }],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [{
    features: [
      { name: 'PostGIS', value: 'Yes' },
      { name: 'Logs', value: 'No' },
      { name: 'Metrics', value: 'No' },
      { name: 'Backups', value: 'Daily - 7 Retained' },
      { name: 'Type', value: 'Shared' },
      { name: 'Max connection limit', value: '5' },
      { name: 'Migration Tool', value: 'Yes' },
      { name: 'Max DB size', value: '256 MB' },
      { name: 'vCPUS', value: 'Shared' },
      { name: 'Memory', value: 'Shared' },
    ],
  }],
});

export const dataLoadedWithCellar = makeStory(conf, {
  items: [{
    features: [
      { name: 'Outbound traffic < 10TB', value: '100MB free, 0.09€/GB/Mo' },
      { name: 'Storage < 1TB', value: '100 MB free, 20.48€/TB/Mo' },
      { name: 'Outbound traffic < 40TB', value: '0.07€/GB/Mo' },
      { name: 'Storage < 25TB', value: '15.36€/TB/Mo' },
      { name: 'Storage < 50TB', value: '10.24€/TB/Mo' },
    ],
  }],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [{
    features: [
      { name: 'Backups', value: 'Daily - 7 Retained' },
      { name: 'vCPUS', value: '2' },
      { name: 'Memory', value: '2 GB' },
      { name: 'Max db size', value: '10 GB' },
      { name: 'Max connection limit', value: '125' },
      { name: 'TYPE', value: 'Dedicated' },
    ],
  }],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.features = defaultFeatures;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  dataLoadedWithElasticSearch,
  dataLoadedWithRedis,
  dataLoadedWithPostgresql,
  dataLoadedWithCellar,
  dataLoadedWithMysql,
  simulations,
});
