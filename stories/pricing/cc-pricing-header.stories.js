import '../../src/pricing/cc-pricing-header.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-header>',
  component: 'cc-pricing-header',
};

const conf = {
  component: 'cc-pricing-header',
  css: `cc-pricing-header {
    margin-bottom: 1rem;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      currencies: [
        { code: 'EUR', displayValue: '€ EUR', changeRate: 1 },
        { code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603 },
        { code: 'USD', displayValue: '$ USD', changeRate: 1.2091 },
      ],
    },
  ],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  css: `
    cc-pricing-header {
      border-radius: 5px;
      --shadow: 0 0 0.5rem #aaa;
      margin: 1rem;
    }
  `,
  items: [
    {
      currencies: [
        {code: 'EUR', displayValue: '€ EUR', changeRate: 1},
        {code: 'GBP', displayValue: '£ GBP', changeRate: 0.88603},
        {code: 'USD', displayValue: '$ USD', changeRate: 1.2091},
      ],
    },
  ],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithCustomStyles
});
