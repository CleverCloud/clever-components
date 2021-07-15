import '../../src/pricing/cc-pricing-product-storage.smart.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-product-storage>',
  component: 'cc-pricing-product-storage',
};

const conf = {
  component: 'cc-pricing-product-storage',
  // language=CSS
  css: `cc-pricing-product-storage {
    margin-bottom: 1rem;
  }`,
};

const baseCellarIntervals = {
  storage: [
    {
      minRange: 0,
      maxRange: 100 * 1e6,
      price: 0,
    },
    {
      /* Bytes */
      minRange: 100 * 1e6,
      maxRange: 1e12,
      /* Price for 1GB per hour */
      price: 0.00002844444444444444,
    },
    {
      minRange: 1e12,
      maxRange: 25 * 1e12,
      price: 0.00002133333333333333,
    },
    {
      minRange: 25 * 1e12,
      price: 0.00001422222222222222,
    },
  ],
  traffic: [
    {
      minRange: 0,
      maxRange: 10 * 1e12,
      price: 0.09,
    },
    {
      minRange: 10 * 1e12,
      price: 0.07,
    },
  ],
};

const baseCellar = {
  name: 'Cellar',
  icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/cellar.svg',
  intervals: baseCellarIntervals,
};

const baseFsBucket = {
  name: 'FS Bucket',
  icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/fsbucket.svg',
  noTraffic: true,
  intervals: {
    storage: [
      {
        minRange: 0,
        maxRange: 100 * 1e6,
        price: 0,
      },
      {
        /* Bytes */
        minRange: 100 * 1e6,
        /* Price for 1GB per hour */
        price: 0.0020833333333333333,
      },
    ],
  },
};

export const defaultStory = makeStory(conf, {
  items: [baseCellar],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const skeletonWithNoTraffic = makeStory(conf, {
  items: [{ noTraffic: true }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithFsBucket = makeStory(conf, {
  items: [baseFsBucket],
});

export const dataLoadedWithCustomHead = makeStory(conf, {
  items: [{
    ...baseCellar,
    innerHTML: `<div slot="head" style="padding: 1rem; background-color: lime;">The whole head section can be overriden with the head slot...</div>`,
  }],
});

export const dataLoadedWithEmptyHead = makeStory(conf, {
  items: [{
    ...baseCellar,
    innerHTML: `<div slot="head"></div>`,
  }],
});

export const dataLoadedWithCustomDescription = makeStory(conf, {
  items: [{
    ...baseCellar,
    innerHTML: 'Description can be overriden with default slot...',
  }],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-product-storage {
      border-radius: 5px;
      box-shadow:  0 0 5px #aaa;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
    }
  `,
  items: [{
    ...baseCellar,
    innerHTML: 'Description can be overriden with default slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris.',
  }],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  items: [{
    ...baseCellar,
    action: 'none',
  }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...baseCellar,
    currency: { code: 'USD', changeRate: 1.25 },
  }],
});

export const simulations = makeStory(conf, {
  items: [
    { innerHTML: 'Cellar is an awesome object storage service!' },
    { innerHTML: 'FS bucket is an awesome service!', noTraffic: true },
    { innerHTML: 'This is an awesome service!' },
  ],
  simulations: [
    storyWait(1000, ([componentCellar, componentFsBucket]) => {
      componentCellar.icon = baseCellar.icon;
      componentCellar.name = baseCellar.name;
      componentCellar.intervals = baseCellar.intervals;
      componentFsBucket.icon = baseFsBucket.icon;
      componentFsBucket.name = baseFsBucket.name;
      componentFsBucket.intervals = baseFsBucket.intervals;
    }),
    storyWait(2000, ([componentCellar, componentFsBucket, componentError]) => {
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithNoTraffic,
  error,
  dataLoadedWithFsBucket,
  dataLoadedWithCustomHead,
  dataLoadedWithEmptyHead,
  dataLoadedWithCustomDescription,
  dataLoadedWithCustomStyles,
  dataLoadedWithNoAction,
  dataLoadedWithDollars,
  simulations,
});
