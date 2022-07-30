import './cc-pricing-page.js';
import '../cc-pricing-product/cc-pricing-product.js';
// Load smart definition so we can use it in the Markdown docs
import './cc-pricing-page.smart.js';
import { createStoryItem, makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import { ZONES } from '../cc-zone-input/cc-zone-input.stories.js';
import {
  defaultStory as cellarStory,
  skeletonWithCellar as cellarSkeletonStory,
  dataLoadedWithHeptapod as heptapodStory,
} from '../cc-pricing-product-consumption/cc-pricing-product-consumption.stories.js';
import {
  dataLoadedWithAddonMongodb as mongoStory,
  dataLoadedWithRuntimeNode as nodeStory,
  dataLoadedWithAddonPostgresql as postgresqlStory,
} from '../cc-pricing-product/cc-pricing-product.stories.js';

export default {
  title: '🛠 pricing/<cc-pricing-page>',
  component: 'cc-pricing-page',
};

const conf = {
  component: 'cc-pricing-page',
};

const CURRENCY_USD = { code: 'USD', changeRate: 1.2091 };

const defaultItem = {
  currencies: [
    { code: 'EUR', changeRate: 1 },
    { code: 'GBP', changeRate: 0.88603 },
    CURRENCY_USD,
  ],
  zones: ZONES,
  zoneId: 'par',
  children: () => [
    `
      <div slot="resources">
        <h2>Resources you need, including all features.</h2>
        <div class="description">Some contents between the header and the products, bla bla...</div>
      </div>
    `,
    '<h2>Runtimes</h2>',
    createStoryItem(nodeStory),
    '<h2>Add-ons</h2>',
    createStoryItem(postgresqlStory),
    createStoryItem(mongoStory),
    '<h2>Object Storage</h2>',
    createStoryItem(cellarStory),
    createStoryItem(heptapodStory),
    `
      <div slot="estimation-header">
        <h2>Cost estimation</h2>
        <div class="description">Some content between the products and the estimation block.</div>
      </div>
    `,
  ],
};

export const defaultStory = makeStory(conf, {
  items: [defaultItem],
});

export const loading = makeStory(conf, {
  items: [{
    children: () => [
      `
        <div slot="resources">
          <h2>Resources you need, including all features.</h2>
          <div class="description">Some contents between the header and the products, bla bla...</div>
        </div>
      `,
      '<h2>Runtimes</h2>',
      createStoryItem(nodeStory, { plans: null, features: null }),
      '<h2>Add-ons</h2>',
      createStoryItem(postgresqlStory, { plans: null, features: null }),
      createStoryItem(mongoStory, { plans: null, features: null }),
      '<h2>Object Storage</h2>',
      createStoryItem(cellarSkeletonStory),
      `
        <div slot="estimation-header">
          <h2>Cost estimation</h2>
          <div class="description">Some content between the products and the estimation block.</div>
        </div>
      `,
    ],
  }],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  // language=CSS
  css: `
    cc-pricing-page {
      --cc-pricing-estimation-recap-bg-color: #3a3771;
    }

    cc-pricing-page::part(header) {
      border-radius: 5px;
      box-shadow: 0 0 0.5em #aaa;
      padding: 1em;
    }

    cc-pricing-page::part(estimation-selected-plans) {
      border-radius: 5px;
      box-shadow: 0 0 0.5em #aaa;
    }

    cc-pricing-page::part(estimation-recap) {
      box-shadow: 0 0 0.5em #aaa;
      overflow: hidden;
    }

    cc-pricing-product,
    cc-pricing-product-consumption {
      border-radius: 5px;
      box-shadow: 0 0 5px #aaa;
      overflow: hidden;
    }

    cc-pricing-product-consumption {
      overflow: hidden;
    }

    h2 {
      font-size: 1.5em;
      font-weight: bold;
    }
  `,
  items: [defaultItem],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...defaultItem,
    currency: CURRENCY_USD,
    zoneId: 'nyc',
    children: () => [
      `
        <div slot="resources">
          <h2>Resources you need, including all features.</h2>
          <div class="description">Some contents between the header and the products, bla bla...</div>
        </div>
      `,
      '<h2>Runtimes</h2>',
      createStoryItem(nodeStory, { currency: CURRENCY_USD }),
      '<h2>Add-ons</h2>',
      createStoryItem(postgresqlStory, { currency: CURRENCY_USD }),
      createStoryItem(mongoStory, { currency: CURRENCY_USD }),
      '<h2>Object Storage</h2>',
      createStoryItem(cellarStory, { currency: CURRENCY_USD }),
      `
        <div slot="estimation-header">
          <h2>Cost estimation</h2>
          <div class="description">Some content between the products and the estimation block.</div>
        </div>
      `,
    ],
  }],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * empty state
// * error state

enhanceStoriesNames({
  defaultStory,
  loading,
  dataLoadedWithCustomStyles,
  dataLoadedWithDollars,
});
