import '../../src/pricing/cc-pricing-table.js';
import { getProductAddon } from '../assets/addon-plans.js';
import { getProductRuntime } from '../assets/runtime-plans.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

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
  title: '🛠 pricing/<cc-pricing-table>',
  component: 'cc-pricing-table',
};

const conf = {
  component: 'cc-pricing-table',
  // language=CSS
  css: `cc-pricing-table {
    margin-bottom: 1rem;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    getProductRuntime('ruby'),
    getProductAddon('postgresql-addon'),
  ],
});

export const dataLoadedWithFakeProduct = makeStory(conf, {
  items: [
    {
      plans: fakeProductPlans,
      features: [
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
    {
      plans: fakeProductPlans,
      features: [
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
  ],
});

export const dataLoadedWithRuntimeNode = makeStory(conf, {
  items: [getProductRuntime('node')],
});

export const dataLoadedWithRuntimePhp = makeStory(conf, {
  items: [getProductRuntime('php')],
});

export const dataLoadedWithRuntimePythonAndMl = makeStory(conf, {
  items: [getProductRuntime('ml_python')],
});

export const dataLoadedWithAddonElasticsearch = makeStory(conf, {
  items: [getProductAddon('es-addon')],
});

export const dataLoadedWithAddonMongodb = makeStory(conf, {
  items: [getProductAddon('mongodb-addon')],
});

export const dataLoadedWithAddonMysql = makeStory(conf, {
  items: [getProductAddon('mysql-addon')],
});

export const dataLoadedWithAddonPostgresql = makeStory(conf, {
  items: [getProductAddon('postgresql-addon')],
});

export const dataLoadedWithAddonRedis = makeStory(conf, {
  items: [getProductAddon('redis-addon')],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  items: [{
    ...getProductAddon('postgresql-addon'),
    action: 'none',
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      currency: { code: 'USD', changeRate: 1.1802 },
      ...getProductAddon('postgresql-addon'),
    },
  ],
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: 'second', digits: 7 },
    ],
  }],
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: 'minute', digits: 5 },
    ],
  }],
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: 'hour', digits: 3 },
    ],
  }],
});

export const dataLoadedWithTemporality1000Minutes2Digits = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: '1000-minutes' },
    ],
  }],
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: 'day', digits: 2 },
    ],
  }],
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: '30-days', digits: 1 },
    ],
  }],
});

export const dataLoadedWithTemporalityAll = makeStory(conf, {
  items: [{
    ...getProductRuntime('node'),
    temporality: [
      { type: 'second', digits: 7 },
      { type: 'minute', digits: 5 },
      { type: 'hour', digits: 3 },
      { type: '1000-minutes' },
      { type: 'day' },
      { type: '30-days' },
    ],
  }],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithFakeProduct,
  dataLoadedWithRuntimeNode,
  dataLoadedWithRuntimePhp,
  dataLoadedWithRuntimePythonAndMl,
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
});
