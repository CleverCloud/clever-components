import './cc-pricing-product.js';
import { getFullProductAddon } from '../../stories/fixtures/addon-plans.js';
import { getFullProductRuntime } from '../../stories/fixtures/runtime-plans.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

// Feature order is not the same between plans
// Some features will be ignored because they cannot be translated
// Some features will be ignored because they are not listed
// Some features are missing for some plans
const fakeProductPlans = [
  {
    name: 'ONE',
    features: [
      { code: 'connection-limit', type: 'number', value: '20' },
      { code: 'disk-size', type: 'bytes', value: String(5 * 1024 ** 3) },
      { code: 'version', type: 'string', value: '1.2.3' },
      { code: 'gpu', type: 'number', value: '2' },
      { code: 'cpu', type: 'number', value: '1' },
      { code: 'ignored-because-not-listed', type: 'string', value: 'ignore this' },
      { code: 'has-metrics', type: 'boolean', value: 'false' },
      { code: 'memory', type: 'bytes', value: String(256 * 1024 ** 2) },
      { code: 'has-logs', type: 'boolean', value: 'true' },
      { code: 'ignored-because-not-translated', type: 'string', value: 'ignore this' },
    ],
    price: 0,
  },
  {
    name: 'TWO',
    features: [
      { code: 'databases', type: 'number', value: '20' },
      { code: 'ignored-because-not-listed', type: 'string', value: 'ignore this' },
      { code: 'cpu', type: 'number', value: '2' },
      { code: 'disk-size', type: 'bytes', value: String(15 * 1024 ** 3) },
      { code: 'gpu', type: 'number', value: '4' },
      { code: 'memory', type: 'bytes', value: String(512 * 1024 ** 2) },
      { code: 'has-metrics', type: 'boolean', value: 'true' },
      { code: 'ignored-because-not-translated', type: 'string', value: 'ignore this' },
      { code: 'version', type: 'string', value: '1.2.3' },
      { code: 'has-logs', type: 'boolean', value: 'true' },
    ],
    price: 1.2345,
  },
  {
    name: 'THREE',
    features: [
      { code: 'cpu', type: 'number', value: '4' },
      { code: 'disk-size', type: 'bytes', value: String(2000 * 1024 ** 3) },
      { code: 'databases', type: 'number', value: '200' },
      { code: 'connection-limit', type: 'number', value: '100' },
      { code: 'gpu', type: 'number', value: '8' },
      { code: 'has-logs', type: 'boolean', value: 'true' },
      { code: 'ignored-because-not-translated', type: 'string', value: 'ignore this' },
      { code: 'memory', type: 'bytes', value: String(5 * 1024 ** 2) },
      { code: 'version', type: 'string', value: '1.2.3' },
    ],
    price: 5.6789,
  },
];

export default {
  title: '🛠 pricing/<cc-pricing-product>',
  component: 'cc-pricing-product',
};

const conf = {
  component: 'cc-pricing-product',
};

export const defaultStory = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('ruby'),
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{ product: { state: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{
    product: { state: 'error' },
  }],
});

export const dataLoadedWithFakeProduct = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      name: 'fake database',
      plans: fakeProductPlans,
      productFeatures: [
        { code: 'connection-limit', type: 'number' },
        { code: 'cpu', type: 'number' },
        { code: 'databases', type: 'number' },
        { code: 'disk-size', type: 'bytes' },
        { code: 'gpu', type: 'number' },
        { code: 'has-logs', type: 'boolean' },
        { code: 'has-metrics', type: 'boolean' },
        { code: 'memory', type: 'bytes' },
        { code: 'version', type: 'string' },
        { code: 'ignored-because-not-translated', type: 'number' },
      ],
    },
  },
  {
    product: {
      state: 'loaded',
      name: 'fake runtime',
      plans: fakeProductPlans,
      productFeatures: [
        { code: 'cpu', type: 'number' },
        { code: 'gpu', type: 'number' },
        { code: 'memory', type: 'bytes' },
        { code: 'disk-size', type: 'bytes' },
        { code: 'connection-limit', type: 'number' },
        { code: 'databases', type: 'number' },
        { code: 'version', type: 'string' },
        { code: 'has-logs', type: 'boolean' },
        { code: 'has-metrics', type: 'boolean' },
        { code: 'ignored-because-not-translated', type: 'number' },
      ],
    },
  }],
});

export const dataLoadedWithRuntimePhp = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('php'),
    },
  }],
});

export const dataLoadedWithRuntimePythonAndMl = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('ml_python'),
    },
  }],
});

export const dataLoadedWithRuntimeNode = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
  }],
});

export const dataLoadedWithAddonElasticsearch = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductAddon('es-addon'),
    },
  }],
});

export const dataLoadedWithAddonMongodb = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductAddon('mongodb-addon'),
    },
  }],
});

export const dataLoadedWithAddonMysql = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductAddon('mysql-addon'),
    },
  }],
});

export const dataLoadedWithAddonPostgresql = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductAddon('postgresql-addon'),
    },
  }],
});

export const dataLoadedWithAddonRedis = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductAddon('redis-addon'),
    },
  }],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  items: [{
    action: 'none',
    product: {
      state: 'loaded',
      ...getFullProductAddon('postgresql-addon'),
    },
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      currency: { code: 'USD', changeRate: 1.1802 },
      product: {
        state: 'loaded',
        ...getFullProductAddon('postgresql-addon'),
      },
    },
  ],
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: 'second', digits: 7 },
    ],
  }],
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: 'minute', digits: 5 },
    ],
  }],
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: 'hour', digits: 3 },
    ],
  }],
});

export const dataLoadedWithTemporality1000Minutes2Digits = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: '1000-minutes' },
    ],
  }],
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: 'day', digits: 2 },
    ],
  }],
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: '30-days', digits: 1 },
    ],
  }],
});

export const dataLoadedWithTemporalityAll = makeStory(conf, {
  items: [{
    product: {
      state: 'loaded',
      ...getFullProductRuntime('node'),
    },
    temporalities: [
      { type: 'second', digits: 7 },
      { type: 'minute', digits: 5 },
      { type: 'hour', digits: 3 },
      { type: '1000-minutes' },
      { type: 'day' },
      { type: '30-days' },
    ],
  }],
});

export const simulationWithLoaded = makeStory(conf, {
  items: [{
    product: { state: 'loading' },
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.product = {
        state: 'loaded',
        ...getFullProductRuntime('node'),
      };
    }),
  ],
});

export const simulationWithError = makeStory(conf, {
  items: [{
    product: { state: 'loading' },
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.product = {
        state: 'error',
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithFakeProduct,
  dataLoadedWithRuntimePhp,
  dataLoadedWithRuntimePythonAndMl,
  dataLoadedWithRuntimeNode,
  dataLoadedWithAddonElasticsearch,
  dataLoadedWithAddonMongodb,
  dataLoadedWithAddonMysql,
  dataLoadedWithAddonPostgresql,
  dataLoadedWithAddonRedis,
  dataLoadedWithNoAction,
  dataLoadedWithDollars,
  dataLoadedWithTemporalitySecond7Digits,
  dataLoadedWithTemporalityMinute5Digits,
  dataLoadedWithTemporalityHour3Digits,
  dataLoadedWithTemporality1000Minutes2Digits,
  dataLoadedWithTemporalityDay2Digits,
  dataLoadedWithTemporality30Days1Digit,
  dataLoadedWithTemporalityAll,
  simulationWithLoaded,
  simulationWithError,
});
