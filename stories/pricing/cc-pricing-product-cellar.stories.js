import '../../src/pricing/cc-pricing-product-cellar.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-product-cellar>',
  component: 'cc-pricing-product-cellar',
};

const conf = {
  component: 'cc-pricing-product-cellar',
  // language=CSS
  css: `cc-pricing-product-cellar {
    margin-bottom: 1rem;
  }`,
};

const baseIntervals = {
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

export const defaultStory = makeStory(conf, {
  items: [{ intervals: baseIntervals }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoadedWithCustomHead = makeStory(conf, {
  items: [{
    intervals: baseIntervals,
    innerHTML: `<div slot="head" style="padding: 1rem; background-color: lime;">The whole head section can be overriden with the head slot...</div>`,
  }],
});

export const dataLoadedWithEmptyHead = makeStory(conf, {
  items: [{
    intervals: baseIntervals,
    innerHTML: `<div slot="head"></div>`,
  }],
});

export const dataLoadedWithCustomDescription = makeStory(conf, {
  items: [{
    intervals: baseIntervals,
    innerHTML: 'Description can be overriden with default slot...',
  }],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-product-cellar {
      border-radius: 5px;
      box-shadow:  0 0 5px #aaa;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
    }
  `,
  items: [{
    intervals: baseIntervals,
    innerHTML: 'Description can be overriden with default slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris.',
  }],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  items: [
    {
      intervals: baseIntervals,
      action: 'none',
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    intervals: baseIntervals,
    currency: { code: 'USD', changeRate: 1.25 },
  }],
});

export const simulations = makeStory(conf, {
  items: [
    { innerHTML: 'Cellar is an awesome object storage service!' },
    { innerHTML: 'Cellar is an awesome object storage service!' },
  ],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.intervals = baseIntervals;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  dataLoadedWithCustomHead,
  dataLoadedWithEmptyHead,
  dataLoadedWithCustomDescription,
  dataLoadedWithCustomStyles,
  dataLoadedWithNoAction,
  dataLoadedWithDollars,
  simulations,
});
