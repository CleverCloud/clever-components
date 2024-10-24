import { CcPricingPageSandbox } from '../../stories/cc-pricing-page-sandbox.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 pricing/<cc-pricing-page>',
  component: 'cc-pricing-page',
};

const conf = {
  component: 'cc-pricing-page-sandbox',
  css: `
    :host {
      max-width: min(100%, 1450px) !important;
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

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{}],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ stateType: 'loading' }],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ stateType: 'error' }],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ selectedCurrency: 'USD' }],
});

export const dataLoadedWithTemporalitySecond7Digits = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ selectedTemporality: CcPricingPageSandbox.TEMPORALITIES.second }],
});

export const dataLoadedWithTemporalityMinute5Digits = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ selectedTemporality: CcPricingPageSandbox.TEMPORALITIES.minute }],
});

export const dataLoadedWithTemporalityHour3Digits = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ selectedTemporality: CcPricingPageSandbox.TEMPORALITIES.hour }],
});

export const dataLoadedWithTemporalityDay2Digits = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ selectedTemporality: CcPricingPageSandbox.TEMPORALITIES.day }],
});

export const dataLoadedWithTemporality30Days1Digit = makeStory(conf, {
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{ selectedTemporality: CcPricingPageSandbox.TEMPORALITIES.thirtyDays }],
});

export const dataLoadedWithWebsiteTheme = makeStory(conf, {
  css: [conf.css, websiteStyles].join(''),
  /** @type {Partial<CcPricingPageSandbox>[]} */
  items: [{}],
});
