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
    { code: 'USD', changeRate: 1.1717 },
  ],
  temporalities: [
    {
      type: 'second',
      digits: 7,
    },
    {
      type: 'minute',
      digits: 5,
    },
    {
      type: 'hour',
      digits: 3,
    },
    {
      type: 'day',
      digits: 2,
    },
    {
      type: '30-days',
      digits: 2,
    },
  ],
  zones: {
    state: 'loaded',
    value: ZONES,
  },
  selectedZoneId: 'par',
};

export const defaultStory = makeStory(conf, {
  items: [defaultItem],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedCurrency: { code: 'USD', changeRate: 1.1717 },
    selectedZoneId: 'nyc',
  }],
});

export const dataLoadedWithMinute = makeStory(conf, {
  items: [{
    ...defaultItem,
    selectedTemporality: { type: 'minute', digits: 2 },
    selectedZoneId: 'nyc',
  }],
});

export const simulations = makeStory(conf, {
  items: [{
    currencies: defaultItem.currencies,
    temporalities: defaultItem.temporalities,
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.zones = {
        state: 'loaded',
        value: ZONES,
      };
      component.selectedZoneId = 'par';
    }),
    storyWait(2000, ([component]) => {
      component.selectedTemporality = defaultItem.temporalities[3];
    }),
    storyWait(2000, ([component]) => {
      component.selectedCurrency = defaultItem.currencies[1];
    }),
  ],
});

// Right now, because of how we're using this component, we don't need:
// * empty state
// * error state

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithDollars,
  dataLoadedWithMinute,
  simulations,
});
