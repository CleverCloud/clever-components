import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import './cc-credit-chart.js';

export default {
  title: '🛠 Consumption/<cc-credit-chart>',
  component: 'cc-credit-chart',
};

const conf = {
  component: 'cc-credit-chart',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      total: 100,
      remaining: 20,
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      skeleton: true,
      total: 100,
      remaining: 20,
    },
  ],
});

export const dataLoadedWithNoCreditsRemaining = makeStory(conf, {
  items: [
    {
      total: 2039,
      remaining: 0,
    },
  ],
});

export const dataLoadedWithFullCreditsRemaining = makeStory(conf, {
  items: [
    {
      total: 2039,
      remaining: 2039,
    },
  ],
});

export const dataLoadedWithHighAmount = makeStory(conf, {
  items: [
    {
      total: 20395459,
      remaining: 15795459,
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      total: 2059,
      remaining: 1459,
      currency: 'USD',
    },
  ],
});

export const dataLoadedWithNoDigits = makeStory(conf, {
  items: [
    {
      total: 100,
      remaining: 20,
      digits: 0,
    },
  ],
});

export const simulation = makeStory(conf, {
  items: [{
    skeleton: true,
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.total = 100;
      component.remaining = 24;
      component.skeleton = false;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithNoCreditsRemaining,
  dataLoadedWithFullCreditsRemaining,
  dataLoadedWithHighAmount,
  dataLoadedWithDollars,
  dataLoadedWithNoDigits,
  simulation,
});
