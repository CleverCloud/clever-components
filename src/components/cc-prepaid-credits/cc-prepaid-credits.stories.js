import './cc-prepaid-credits.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Consumption/<cc-prepaid-credits>',
  component: 'cc-prepaid-credits',
};

const conf = {
  component: 'cc-prepaid-credits',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      totalCredits: 948.35,
      remainingCredits: 594.4,
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      skeleton: true,
    },
  ],
});

export const dataLoadedWithNocredits = makeStory(conf, {
  items: [
    {
      totalCredits: 0,
      remainingCredits: 0,
    },
  ],
});

export const dataLoadedWithNoCreditsRemaining = makeStory(conf, {
  items: [
    {
      totalCredits: 8473.25,
      remainingCredits: 0,
    },
  ],
});

export const dataLoadedWithFullCreditsRemaining = makeStory(conf, {
  items: [
    {
      totalCredits: 726.35,
      remainingCredits: 726.35,
    },
  ],
});

export const dataLoadedWithHighAmount = makeStory(conf, {
  items: [
    {
      totalCredits: 10541.14,
      remainingCredits: 7947.29,
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      totalCredits: 9545.5,
      remainingCredits: 4837.2,
      currency: 'USD',
    },
  ],
});

export const dataLoadedWithNoDigits = makeStory(conf, {
  items: [
    {
      totalCredits: 9545.5,
      remainingCredits: 4837.3,
      digits: 0,
    },
  ],
});

export const simulation = makeStory(conf, {
  items: [{
    ...skeleton.items[0],
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.totalCredits = defaultStory.items[0].totalCredits;
      component.remainingCredits = defaultStory.items[0].remainingCredits;
      component.skeleton = false;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithNocredits,
  dataLoadedWithNoCreditsRemaining,
  dataLoadedWithFullCreditsRemaining,
  dataLoadedWithHighAmount,
  dataLoadedWithDollars,
  dataLoadedWithNoDigits,
  simulation,
});
