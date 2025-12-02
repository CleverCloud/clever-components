import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-features.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-features>',
  component: 'cc-addon-features',
};

const conf = {
  component: 'cc-addon-features',
};

/**
 * @import { CcAddonFeatures } from './cc-addon-features.js'
 * @import { AddonFeaturesStateLoaded, AddonFeaturesStateLoading, AddonFeaturesStateError, AddonFeature } from './cc-addon-features.types.js'
 */

/** @type {AddonFeature[]} */
const defaultFeatures = [
  { name: 'DISK', value: '40 GB' },
  { name: 'MEMORY', value: '4 GB' },
  { name: 'CPUs', value: '2' },
  { name: 'Foo feature', value: 'No' },
  { name: 'Bar feature', value: 'Yes' },
];

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoaded} */
      state: {
        type: 'loaded',
        features: defaultFeatures,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateError} */
      state: { type: 'error' },
    },
  ],
});

export const dataLoadedWithElasticSearch = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoaded} */
      state: {
        type: 'loaded',
        features: [
          { name: 'DISK', value: '40 GB' },
          { name: 'NODES', value: '1' },
          { name: 'MEMORY', value: '4 GB' },
          { name: 'CPUs', value: '2' },
          { name: 'KIBANA', value: 'Yes' },
          { name: 'API', value: 'No' },
        ],
      },
    },
  ],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoaded} */
      state: {
        type: 'loaded',
        features: [
          { name: 'Connection limit', value: '250' },
          { name: 'Type', value: 'Dedicated' },
          { name: 'Isolation', value: 'Dedicated' },
          { name: 'Databases', value: '100' },
          { name: 'Size', value: '250mb' },
        ],
      },
    },
  ],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoaded} */
      state: {
        type: 'loaded',
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
      },
    },
  ],
});

export const dataLoadedWithCellar = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoaded} */
      state: {
        type: 'loaded',
        features: [
          { name: 'Outbound traffic < 10TB', value: '100MB free, 0.09€/GB/Mo' },
          { name: 'Storage < 1TB', value: '100 MB free, 20.48€/TB/Mo' },
          { name: 'Outbound traffic < 40TB', value: '0.07€/GB/Mo' },
          { name: 'Storage < 25TB', value: '15.36€/TB/Mo' },
          { name: 'Storage < 50TB', value: '10.24€/TB/Mo' },
        ],
      },
    },
  ],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [
    {
      /** @type {AddonFeaturesStateLoaded} */
      state: {
        type: 'loaded',
        features: [
          { name: 'Backups', value: 'Daily - 7 Retained' },
          { name: 'vCPUS', value: '2' },
          { name: 'Memory', value: '2 GB' },
          { name: 'Max db size', value: '10 GB' },
          { name: 'Max connection limit', value: '125' },
          { name: 'TYPE', value: 'Dedicated' },
        ],
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonFeatures[]} components */
      ([component, componentError]) => {
        component.state = {
          type: 'loaded',
          features: defaultFeatures,
        };
        componentError.state = { type: 'error' };
      },
    ),
  ],
});
