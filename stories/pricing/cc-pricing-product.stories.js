import '../../src/pricing/cc-pricing-product.js';
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

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithNode = makeStory(conf, {
  items: [getFullProductRuntime('node')],
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
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/java-jar.svg" alt="">
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/java-war.svg" alt="">
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/maven.svg" alt="">
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/gradle.svg" alt="">
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/scala.svg" alt="">
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/play1.svg" alt="">
        <img slot="icon" src="https://static-assets.cellar.services.clever-cloud.com/logos/play2.svg" alt="">
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

export const dataLoadedWithElasticsearch = makeStory(conf, {
  items: [getFullProductAddon('es-addon')],
});

export const dataLoadedWithMongodb = makeStory(conf, {
  items: [getFullProductAddon('mongodb-addon')],
});

export const dataLoadedWithMysql = makeStory(conf, {
  items: [getFullProductAddon('mysql-addon')],
});

export const dataLoadedWithPostgresql = makeStory(conf, {
  items: [getFullProductAddon('postgresql-addon')],
});

export const dataLoadedWithPostgresqlDollars = makeStory(conf, {
  items: [
    {
      currency: { code: 'USD', changeRate: 1.1802 },
      ...getFullProductAddon('postgresql-addon'),
    },
  ],
});

export const dataLoadedWithRedis = makeStory(conf, {
  items: [getFullProductAddon('redis-addon')],
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
      component.items = product.items;
      component.features = product.features;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithNode,
  dataLoadedWithCustomDescription,
  dataLoadedWithNoDescription,
  dataLoadedWithCustomIcons,
  dataLoadedWithCustomStyles,
  dataLoadedWithElasticsearch,
  dataLoadedWithMongodb,
  dataLoadedWithMysql,
  dataLoadedWithPostgresql,
  dataLoadedWithPostgresqlDollars,
  dataLoadedWithRedis,
  simulations,
});
