import '../../src/pricing/cc-pricing-product.js';
// Load smart definition so we can use it in the Markdown docs
import '../../src/pricing/cc-pricing-product.smart-runtime.js';
import '../../src/pricing/cc-pricing-product.smart-addon.js';
import { getFullProductAddon } from '../assets/addon-plans.js';
import { getFullProductRuntime } from '../assets/runtime-plans.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-product>',
  component: 'cc-pricing-product',
};

const conf = {
  component: 'cc-pricing-product',
  // language=CSS
  css: `
    cc-pricing-product {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    getFullProductRuntime('ruby'),
    getFullProductAddon('postgresql-addon'),
  ],
});

export const loading = makeStory(conf, {
  items: [
    {},
    {
      innerHTML: `
        <div slot="name">Custom name</div>
        Description can be overriden with default slot...
      `,
    },
  ],
});

export const dataLoadedWithCustomProductFeatures = makeStory(conf, {
  items: [
    {
      name: 'Gitlab',
      icon: 'https://about.gitlab.com/images/press/press-kit-icon.svg',
      features: [
        {
          code: 'disk-size',
          type: 'bytes',
        },
        {
          code: 'Logs',
          type: 'boolean',
        },
        {
          code: 'Backup frequency (seconds)',
          type: 'number',
        },
        {
          code: 'Backup retention (seconds)',
          type: 'number',
        },
        {
          code: 'memory',
          type: 'bytes',
        },
        {
          code: 'Migration',
          type: 'boolean',
        },
        {
          code: 'cpu',
          type: 'number',
        },
        {
          code: 'Dedicated',
          type: 'string',
        },
      ],
      plans: [
        {
          name: 'XS Big Space',
          price: 0.0243055555555556,
          features: [
            {
              code: 'Dedicated',
              type: 'string',
              value: 'dedicated',
            },
            {
              code: 'disk-size',
              type: 'bytes',
              value: '8358709120',
            },
            {
              code: 'Backup frequency (seconds)',
              type: 'number',
              value: '54200',
            },
            {
              code: 'Backup retention (seconds)',
              type: 'number',
              value: '803601',
            },
            {
              code: 'cpu',
              type: 'number',
              value: '3',
            },
            {
              code: 'memory',
              type: 'bytes',
              value: '5013741824',
            },
            {
              code: 'Logs',
              type: 'boolean',
              value: 'true',
            },
            {
              code: 'Migration',
              type: 'boolean',
              value: 'true',
            },
          ],
        },
        {
          name: 'XS Medium Space',
          price: 0.0243055555555556,
          features: [
            {
              code: 'Dedicated',
              type: 'string',
              value: 'dedicated',
            },
            {
              code: 'disk-size',
              type: 'bytes',
              value: '5368709120',
            },
            {
              code: 'Backup frequency (seconds)',
              type: 'number',
              value: '86400',
            },
            {
              code: 'Backup retention (seconds)',
              type: 'number',
              value: '604800',
            },
            {
              code: 'cpu',
              type: 'number',
              value: '2',
            },
            {
              code: 'memory',
              type: 'bytes',
              value: '1073741824',
            },
            {
              code: 'Logs',
              type: 'boolean',
              value: 'true',
            },
            {
              code: 'Migration',
              type: 'boolean',
              value: 'true',
            },
          ],
        },
        {
          name: 'XS Small Space',
          price: 0.032541658,
          features: [
            {
              code: 'Dedicated',
              type: 'string',
              value: 'shared',
            },
            {
              code: 'disk-size',
              type: 'bytes',
              value: '54779821',
            },
            {
              code: 'Backup frequency (seconds)',
              type: 'number',
              value: '587740',
            },
            {
              code: 'Backup retention (seconds)',
              type: 'number',
              value: '368514',
            },
            {
              code: 'cpu',
              type: 'number',
              value: '1',
            },
            {
              code: 'memory',
              type: 'bytes',
              value: '20047872',
            },
            {
              code: 'Logs',
              type: 'boolean',
              value: 'false',
            },
            {
              code: 'Migration',
              type: 'boolean',
              value: 'false',
            },
          ],
        },
      ],
    },
  ],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithRuntimeNode = makeStory(conf, {
  items: [getFullProductRuntime('node')],
});

export const dataLoadedWithAddonElasticsearch = makeStory(conf, {
  items: [getFullProductAddon('es-addon')],
});

export const dataLoadedWithAddonMongodb = makeStory(conf, {
  items: [getFullProductAddon('mongodb-addon')],
});

export const dataLoadedWithAddonMysql = makeStory(conf, {
  items: [getFullProductAddon('mysql-addon')],
});

export const dataLoadedWithAddonPostgresql = makeStory(conf, {
  items: [getFullProductAddon('postgresql-addon')],
});

export const dataLoadedWithAddonRedis = makeStory(conf, {
  items: [getFullProductAddon('redis-addon')],
});

export const dataLoadedWithCustomHead = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    innerHTML: `<div slot="head" style="padding: 1rem; background-color: lime;">The whole head section can be overriden with the head slot...</div>`,
  }],
});

export const dataLoadedWithEmptyHead = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    innerHTML: `<div slot="head"></div>`,
  }],
});

export const dataLoadedWithCustomDescription = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    innerHTML: 'Description can be overriden with default slot...',
  }],
});

export const dataLoadedWithNoDescription = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    description: null,
  }],
});

export const dataLoadedWithCustomIcons = makeStory(conf, {
  items: [
    {
      ...getFullProductRuntime('jar'),
      name: 'JVM: Java, Scala...',
      innerHTML: `
        <img slot="icon" src="https://assets.clever-cloud.com/logos/java-jar.svg" alt="">
        <img slot="icon" src="https://assets.clever-cloud.com/logos/java-war.svg" alt="">
        <img slot="icon" src="https://assets.clever-cloud.com/logos/maven.svg" alt="">
        <img slot="icon" src="https://assets.clever-cloud.com/logos/gradle.svg" alt="">
        <img slot="icon" src="https://assets.clever-cloud.com/logos/scala.svg" alt="">
        <img slot="icon" src="https://assets.clever-cloud.com/logos/play1.svg" alt="">
        <img slot="icon" src="https://assets.clever-cloud.com/logos/play2.svg" alt="">
        <div>
          On top of customizing the description with the default slot, you can also customize the icon with <code>slot[icon]</code>.
          <br>
          You can even define multiple icons, it's quiet handy when you want to talk about multiple flavors...
        </div>
      `,
    },
  ],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-product {
      border-radius: 5px;
      box-shadow:  0 0 5px #aaa;
      margin: 1rem;
      overflow: hidden;
    }
  `,
  items: [getFullProductRuntime('node')],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  items: [{
    ...getFullProductAddon('postgresql-addon'),
    action: 'none',
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      currency: { code: 'USD', changeRate: 1.1802 },
      ...getFullProductAddon('postgresql-addon'),
    },
  ],
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    temporality: [
      { type: 'second', digits: 7 },
    ],
  }],
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    temporality: [
      { type: 'minute', digits: 5 },
    ],
  }],
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    temporality: [
      { type: 'hour', digits: 3 },
    ],
  }],
});

export const dataLoadedWithTemporality1000Minutes2Digits = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    temporality: [
      { type: '1000-minutes' },
    ],
  }],
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    temporality: [
      { type: 'day', digits: 2 },
    ],
  }],
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
    temporality: [
      { type: '30-days', digits: 1 },
    ],
  }],
});

export const dataLoadedWithTemporalityAll = makeStory(conf, {
  items: [{
    ...getFullProductRuntime('node'),
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

export const simulations = makeStory(conf, {
  css: `
    cc-pricing-product {
      border-radius: 5px;
      box-shadow:  0 0 5px #aaa;
      margin: 1rem;
      overflow: hidden;
    }
  `,
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      const product = getFullProductRuntime('node');
      component.name = product.name;
      component.icon = product.icon;
      component.description = product.description;
      component.plans = product.plans;
      component.features = product.features;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithCustomProductFeatures,
  dataLoadedWithRuntimeNode,
  dataLoadedWithAddonElasticsearch,
  dataLoadedWithAddonMongodb,
  dataLoadedWithAddonMysql,
  dataLoadedWithAddonPostgresql,
  dataLoadedWithAddonRedis,
  dataLoadedWithCustomHead,
  dataLoadedWithEmptyHead,
  dataLoadedWithCustomDescription,
  dataLoadedWithNoDescription,
  dataLoadedWithCustomIcons,
  dataLoadedWithCustomStyles,
  dataLoadedWithNoAction,
  dataLoadedWithDollars,
  dataLoadedWithTemporalitySecond7Digits,
  dataLoadedWithTemporalityMinute5Digits,
  dataLoadedWithTemporalityHour3Digits,
  dataLoadedWithTemporality1000Minutes2Digits,
  dataLoadedWithTemporalityDay2Digits,
  dataLoadedWithTemporality30Days1Digit,
  dataLoadedWithTemporalityAll,
  simulations,
});
