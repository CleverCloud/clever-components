// Don't forget to import the component you're presenting!
import '../../src/pricing/cc-pricing-product-cellar.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-product-cellar>',
  // This component name is used by Storybook's docs page for the API table.
  // It will use `custom-elements.json` documentation file.
  // Run `npm run components:docs-json` to generate this JSON file.
  component: 'cc-pricing-product-cellar',
};

const conf = {
  component: 'cc-pricing-product-cellar',
  // You may need to add some CSS just for your stories.
  // It's often needed to add some margin around your component.
  // language=CSS
  css: `cc-pricing-product-cellar {
    margin-bottom: 1rem;
  }`,
};

const baseItems = {
  storage: [
    {
      minRange: 0,
      maxRange: 1000000,
      minRangeDisplay: 0,
      maxRangeDisplay: 1e12,
      price: 0.02,
      highlighted: true,
      totalPrice: {
        price: 0,
        visible: true,
      },
    },
    {
      minRange: 1000000,
      maxRange: 25000000,
      minRangeDisplay: 10 * 1e12,
      maxRangeDisplay: 25 * 1e12,
      price: 0.015,
      highlighted: false,
      totalPrice: {
        price: 0,
        visible: false,
      },
    },
    {
      minRange: 25000000,
      // -1 to represent infinity
      maxRange: -1,
      minRangeDisplay: 25 * 1e12,
      maxRangeDisplay: '∞',
      price: 0.01,
      highlighted: false,
      totalPrice: {
        price: 0,
        hidden: false,
      },
    },
  ],
  traffic: [
    {
      minRange: 0,
      maxRange: 10000000,
      minRangeDisplay: 0,
      maxRangeDisplay: 10 * 1e12,
      price: 0.09,
      highlighted: true,
      totalPrice: {
        price: 0,
        visible: true,
      },
    },
    {
      minRange: 10000000,
      // -1 to represent infinity
      maxRange: -1,
      minRangeDisplay: 10 * 1e12,
      maxRangeDisplay: '∞',
      price: 0.07,
      highlighted: false,
      totalPrice: {
        price: 0,
        visible: false,
      },
    },
  ],
};

// The first story in the file will appear before the API table in Storybook's docs page.
// We call it the "default story" and it's used as the main presentation of your component.
// You can set several instances/items to show different situations
// but no need to get exhaustive or too detailed ;-)
export const defaultStory = makeStory(conf, {
  items: [
    { cellarInfos: baseItems },
  ],
});

export const noAction = makeStory(conf, {
  items: [
    {
      cellarInfos: baseItems,
      action: 'none',
    },
  ],
});

// If your component contains remote data,
// you'll need a "skeleton screen" while the user's waiting for the data.
export const skeleton = makeStory(conf, {
  items: [{}],
});

// If your component contains remote data,
// don't forget the case where there is no data (ex: empty lists...).
export const empty = makeStory(conf, {
  items: [{ three: [] }],
});

// If your component contains remote data,
// don't forget the case where you have loading errors.
// If you have other kind of errors (ex: saving errors...).
// You need to name your stories with the `errorWith` prefix.
export const error = makeStory(conf, {
  items: [{ error: true }],
});

// If your component contains remote data,
// try to present all the possible data combination.
// You need to name your stories with the `dataLoadedWith` prefix.
// Don't forget edge cases (ex: small/huge strings, small/huge lists...).
export const dataLoadedWithFoo = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }] },
  ],
});

// If your component can trigger updates/deletes remote data,
// don't forget the case where the user's waiting for an operation to complete.
export const waiting = makeStory(conf, {
  items: [
    { one: 'Foo', three: [{ foo: 42 }], waiting: true },
  ],
});

// If your component contains remote data,
// it will have several state transitions (ex: loading => error, loading => loaded, loaded => saving...).
// When transitioning from one state to another, we try to prevent the display from "jumping" or "blinking" too much.
// Using "simulations", you can simulate several steps in time to present how your component behaves when it goes through different states.
export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.three = [{ foo: 42 }];
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.three = [{ foo: 42 }, { foo: 43 }];
    }),
  ],
});

// This seems a bit cumbersome but to benefit from the automatic naming of stories (with emojis, casing...),
// you need to call `enhanceStoriesNames()` with all your stories.
enhanceStoriesNames({
  defaultStory,
  noAction,
  skeleton,
  empty,
  error,
  dataLoadedWithFoo,
  waiting,
  simulations,
});
