import { html, render } from 'lit';
import { ref } from 'lit/directives/ref.js';
import './cc-pricing-page.js';
import '../cc-pricing-estimation/cc-pricing-estimation.js';
import { createStoryItem, makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import {
  defaultStory as pricingHeaderStory,
} from '../cc-pricing-header/cc-pricing-header.stories.js';
import {
  defaultStory as cellarStory,
  dataLoadedWithHeptapod as heptapodStory,
} from '../cc-pricing-product-consumption/cc-pricing-product-consumption.stories.js';
import {
  dataLoadedWithFakeProduct as fakeProductStory,
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
  // language=CSS
  css: `
    :host {
      max-width: min(100%, 1450px) !important;
    }

    .header {
      margin-inline: auto;
    }

    .main-content {
      display: flex;
      gap: 1em;
      margin-block: 2em;
    }

    cc-pricing-estimation {
      --shadow-color: 45deg 3% 46%;

      position: sticky;
      z-index: 10;
      top: 0;
      height: max-content;
      max-height: 80vh;
      flex: 0 1 25em;
      background-color: #fff;
      box-shadow: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 36%),
        0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 36%),
        2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 36%),
        5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 36%);
      margin-block: 2em;
      scrollbar-gutter: stable;
    }

    .product-list {
      flex: 1 1 auto;
      order: -1;
    }

    @media (max-width:71.875rem) {

      .main-content {
        flex-direction: column;
      }

      .product-list {
        padding-inline: 1em;
      }

      cc-pricing-estimation {
        bottom: 0;
        overflow: auto;
        flex: 0 0 auto;
        order: 2;
        box-shadow: 0px -0.3px 0.3px hsl(var(--shadow-color) / 0.11),
        0px -1px 1.1px -0.8px hsl(var(--shadow-color) / 0.11),
        0px -2.4px 2.7px -1.7px hsl(var(--shadow-color) / 0.11),
        -0.1px -5.9px 6.6px -2.5px hsl(var(--shadow-color) / 0.11);
      }
    }
  `,
};

const websiteStyles = `
  :host {
    --cc-color-text-default: #1c2045;
    --cc-color-text-primary: #3a3871;
    --cc-color-text-weak: #73738e;
    --cc-pricing-hovered-color: #5754aa;

    --cc-color-bg-neutral-hovered: #f1f0fb;
    --cc-color-bg-primary: #3a3871;
    --cc-color-bg-soft: #deddee;

    --cc-color-border-focused: #5754aa;
    --cc-color-border-hovered: #5754aa;
    --cc-color-border-neutral-strong: #deddee;
    --cc-color-border-neutral-weak: #deddee;

    --cc-border-radius-default: 0;
    
    --cc-pricing-estimation-counter-bg: linear-gradient(90deg, #f57461, #cb1c42 50.48%, #a51050);

    --cc-zone-tag-bgcolor: transparent;
    --cc-zone-tag-font-family: sans-serif;
    
    --cc-focus-outline: solid 2px #5754aa;
    --cc-focus-outline-offset: 4px;
  }
`;

const currencies = {
  eur: { code: 'EUR', changeRate: 1 },
  gbp: { code: 'GBP', changeRate: 0.88603 },
  usd: { code: 'USD', changeRate: 1.1717 },
};

const temporalities = {
  second: {
    type: 'second',
    digits: 7,
  },
  minute: {
    type: 'minute',
    digits: 5,
  },
  hour: {
    type: 'hour',
    digits: 3,
  },
  day: {
    type: 'day',
    digits: 2,
  },
  thirtyDays: {
    type: '30-days',
    digits: 2,
  },
};

function renderBaseStory ({
  selectedTemporality = temporalities.thirtyDays,
  selectedCurrency = currencies.eur,
  state = 'loaded',
}, container) {
  let pricingEstimationRef = null;

  const mediaQueryList = window.matchMedia('(max-width: 71.875rem)');

  function _setPricingEstimationRef (pricingEstimationEl) {
    pricingEstimationRef = pricingEstimationEl;
    pricingEstimationRef.isToggleEnabled = window.matchMedia('(max-width: 71.875rem)').matches;
  }

  function switchCartLayout (e) {
    pricingEstimationRef.isToggleEnabled = e.matches;
  }

  mediaQueryList.addEventListener('change', switchCartLayout);

  render(html`
    <cc-pricing-page
      .selectedCurrency=${selectedCurrency}
      .selectedTemporality=${selectedTemporality}
    >
      <div class="header">
        <!-- pricingHeader has no error state -->
        ${state === 'loading' || state === 'error'
          ? createStoryItem(pricingHeaderStory, { zones: { state: 'loading' } })
          : ''
        }
        ${state === 'loaded' ? createStoryItem(pricingHeaderStory) : ''}
      </div>
      <div class="main-content">
        <cc-pricing-estimation
          ${ref(_setPricingEstimationRef)}
          .currencies=${Object.values(currencies)}
          .temporalities=${Object.values(temporalities)}
        ></cc-pricing-estimation>
        <div class="product-list">
          <h2>Compute & Runtime</h2>
          <div class="product">
            <h3>Node</h3>
            ${state === 'loading' ? createStoryItem(nodeStory, { product: { state: 'loading' } }) : ''}
            ${state === 'error' ? createStoryItem(nodeStory, { product: { state: 'error' } }) : ''}
            ${state === 'loaded' ? createStoryItem(nodeStory) : ''}
          </div>
          <h2>Add-ons</h2>
          <div class="product">
            <h3>Redis</h3>
            ${state === 'loading' ? createStoryItem(postgresqlStory, { product: { state: 'loading' } }) : ''}
            ${state === 'error' ? createStoryItem(postgresqlStory, { product: { state: 'error' } }) : ''}
            ${state === 'loaded' ? createStoryItem(postgresqlStory) : ''}
          </div>
          <div class="product">
            <h3>Mongodb</h3>
            ${state === 'loading' ? createStoryItem(mongoStory, { product: { state: 'loading' } }) : ''}
            ${state === 'error' ? createStoryItem(mongoStory, { product: { state: 'error' } }) : ''}
            ${state === 'loaded' ? createStoryItem(mongoStory) : ''}
          </div>
          <h2>Object Storage</h2>
          <div class="product">
            <h3>Cellar</h3>
            ${state === 'loading' ? createStoryItem(cellarStory, { product: { state: 'loading' } }) : ''}
            ${state === 'error' ? createStoryItem(cellarStory, { product: { state: 'error' } }) : ''}
            ${state === 'loaded' ? createStoryItem(cellarStory) : ''}
          </div>
          <div class="product">
            <h3>Heptapod</h3>
            ${state === 'loading' ? createStoryItem(heptapodStory, { product: { state: 'loading' } }) : ''}
            ${state === 'error' ? createStoryItem(heptapodStory, { product: { state: 'error' } }) : ''}
            ${state === 'loaded' ? createStoryItem(heptapodStory) : ''}
          </div>
          <div class="product">
            <h3>Fake product</h3>
            ${state === 'loading' ? createStoryItem(fakeProductStory, { product: { state: 'loading' } }) : ''}
            ${state === 'error' ? createStoryItem(fakeProductStory, { product: { state: 'error' } }) : ''}
            ${state === 'loaded' ? createStoryItem(fakeProductStory) : ''}
          </div>
        </div>
      </div>
    </cc-pricing-page>
  `, container);
}

export const defaultStory = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({}, container);
  },
});

export const loading = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ state: 'loading' }, container);
  },
});

export const error = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ state: 'error' }, container);
  },
});

export const dataLoadedWithDollars = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedCurrency: currencies.dollar }, container);
  },
});

export const dataLoadedWithPounds = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedCurrency: currencies.gbp }, container);
  },
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedTemporality: temporalities.second }, container);
  },
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedTemporality: temporalities.minute }, container);
  },
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedTemporality: temporalities.hour }, container);
  },
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedTemporality: temporalities.day }, container);
  },
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  dom: (container) => {
    renderBaseStory({ selectedTemporality: temporalities.thirtyDays }, container);
  },
});

export const dataLoadedWithWebsiteTheme = makeStory(conf, {
  css: [conf.css, websiteStyles].join(''),
  dom: (container) => {
    renderBaseStory({}, container);
  },
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  dataLoadedWithDollars,
  dataLoadedWithPounds,
  dataLoadedWithTemporalitySecond7Digits,
  dataLoadedWithTemporalityMinute5Digits,
  dataLoadedWithTemporalityHour3Digits,
  dataLoadedWithTemporalityDay2Digits,
  dataLoadedWithTemporality30Days1Digit,
  dataLoadedWithWebsiteTheme,
});
