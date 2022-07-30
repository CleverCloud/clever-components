import './cc-pricing-header.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import { ZONES } from '../cc-zone-input/cc-zone-input.stories.js';

export default {
  title: '🛠 pricing/<cc-pricing-header>',
  component: 'cc-pricing-header',
};

const conf = {
  component: 'cc-pricing-header',
};

const defaultItem = {
  currencies: [
    { code: 'EUR', changeRate: 1 },
    { code: 'GBP', changeRate: 0.88603 },
    { code: 'USD', changeRate: 1.2091 },
  ],
  zones: ZONES,
  zoneId: 'par',
  totalPrice: 720,
};

export const defaultStory = makeStory(conf, {
  items: [defaultItem],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const dataLoadedWithCustomStyles = makeStory(conf, {
  // language=CSS
  css: `
    cc-pricing-header {
      border-radius: 5px;
      box-shadow: 0 0 0.5rem #aaa;
      padding: 1em;
    }
  `,
  items: [defaultItem],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...defaultItem,
    currency: { code: 'USD', changeRate: 1.21 },
    zoneId: 'nyc',
  }],
});

export const simulations = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.currencies = defaultItem.currencies;
      component.zones = defaultItem.zones;
      component.zoneId = defaultItem.zones[0].name;
    }),
  ],
});

// Right now, because of how we're using this component, we don't need:
// * empty state
// * error state

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithCustomStyles,
  dataLoadedWithDollars,
  simulations,
});
