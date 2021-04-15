import '../../src/pricing/cc-pricing-table.js';
import { getProductAddon } from '../assets/addon-plans.js';
import { getProductRuntime } from '../assets/runtime-plans.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

// Feature order is not the same between plans
// Some features will be ignored because they cannot be translated
// Some features will be ignored because they are not listed
// Some features are missing for some items
const fakeProductItems = [
  {
    name: 'ONE',
    features: [
      { code: 'connection-limit', type: 'number', value: '20' },
      { code: 'disk-size', type: 'bytes', value: String(5 * 1024 ** 3) },
      { code: 'version', type: 'string', value: '1.2.3' },
      { code: 'gpu', type: 'number', value: '2' },
      { code: 'cpu', type: 'number', value: '1' },
      { code: 'ignored-because-not-listed', type: 'string', value: 'ingore this' },
      { code: 'has-metrics', type: 'boolean', value: 'false' },
      { code: 'memory', type: 'bytes', value: String(256 * 1024 ** 2) },
      { code: 'has-logs', type: 'boolean', value: 'true' },
      { code: 'ignored-because-not-translated', type: 'string', value: 'ingore this' },
    ],
    price: { daily: 0, monthly: 0 },
  },
  {
    name: 'TWO',
    features: [
      { code: 'databases', type: 'number', value: '20' },
      { code: 'ignored-because-not-listed', type: 'string', value: 'ingore this' },
      { code: 'cpu', type: 'number', value: '2' },
      { code: 'disk-size', type: 'bytes', value: String(15 * 1024 ** 3) },
      { code: 'gpu', type: 'number', value: '4' },
      { code: 'memory', type: 'bytes', value: String(512 * 1024 ** 2) },
      { code: 'has-metrics', type: 'boolean', value: 'true' },
      { code: 'ignored-because-not-translated', type: 'string', value: 'ingore this' },
      { code: 'version', type: 'string', value: '1.2.3' },
      { code: 'has-logs', type: 'boolean', value: 'true' },
    ],
    price: { daily: 20.1234, monthly: 20.1234 * 30 },
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
      { code: 'ignored-because-not-translated', type: 'string', value: 'ingore this' },
      { code: 'memory', type: 'bytes', value: String(5 * 1024 ** 2) },
      { code: 'version', type: 'string', value: '1.2.3' },
    ],
    price: { daily: 50.6786, monthly: 50.6786 * 30 },
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

export const dataLoadedWithFake = makeStory(conf, {
  items: [
    {
      items: fakeProductItems,
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
      items: fakeProductItems,
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

export const dataLoadedWithNode = makeStory(conf, {
  items: [getProductRuntime('node')],
});

export const dataLoadedWithPhp = makeStory(conf, {
  items: [getProductRuntime('php')],
});

export const dataLoadedWithPythonAndMl = makeStory(conf, {
  items: [getProductRuntime('ml_python')],
});

export const dataLoadedWithElasticsearch = makeStory(conf, {
  items: [getProductAddon('es-addon')],
});

export const dataLoadedWithMongodb = makeStory(conf, {
  items: [getProductAddon('mongodb-addon')],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [getProductAddon('mysql-addon')],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [getProductAddon('postgresql-addon')],
});

export const dataLoadedWithPostgresqlDollars = makeStory(conf, {
  items: [
    {
      currency: { code: 'USD', changeRate: 1.1802 },
      ...getProductAddon('postgresql-addon'),
    },
  ],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [getProductAddon('redis-addon')],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithFake,
  dataLoadedWithNode,
  dataLoadedWithPhp,
  dataLoadedWithPythonAndMl,
  dataLoadedWithElasticsearch,
  dataLoadedWithMongodb,
  dataLoadedWithMysql,
  dataLoadedWithPostgresql,
  dataLoadedWithPostgresqlDollars,
  dataLoadedWithRedis,
});
