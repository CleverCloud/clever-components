import './cc-credit-balance.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Atoms/<cc-credit-balance>',
  component: 'cc-credit-balance',
};

const conf = {
  component: 'cc-credit-balance',
};

export const defaultStory = makeStory(conf, {
  items: [{
    case: 'Extra consumption of 25 €',
    totalFreeCredits: 25,
    totalPrepaidCredits: 50,
    totalConsumption: 100,
  }, {
    case: 'Extra consumption of 0 €',
    totalFreeCredits: 0,
    totalPrepaidCredits: 75,
    totalConsumption: 1000,
  },
  {
    case: 'Extra consumption of 0 €',
    totalFreeCredits: 0,
    totalPrepaidCredits: 75,
    totalConsumption: 50,
  },
  {
    case: 'Extra consumption of 0 €',
    totalFreeCredits: 1,
    totalPrepaidCredits: 1,
    totalConsumption: 1000,
  },
  {
    case: 'Extra consumption of 0 €',
    totalFreeCredits: 25,
    totalPrepaidCredits: 10,
    totalConsumption: 1000,
  },
  {
    case: 'Extra consumption of 0 €',
    totalFreeCredits: 20,
    totalPrepaidCredits: 0,
    totalConsumption: 10000,
  },
  {
    case: 'Extra consumption of 0 €',
    totalFreeCredits: 20,
    totalPrepaidCredits: 10000,
    totalConsumption: 10030,
  }],
});

export const testStory = makeStory(conf, {
  items: [
    {
      case: 'Extra consumption of 0 €',
      totalFreeCredits: 25,
      totalPrepaidCredits: 10,
      totalConsumption: 1000,
    }],
});

enhanceStoriesNames({
  defaultStory,
});
