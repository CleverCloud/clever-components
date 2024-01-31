
import { first } from 'rxjs';
import { ConsumptionFaker } from '../../lib/consumption-faker.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import './cc-daily-consumption.js';

const today = new Date(Date.now());
const defaultConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 15), 9545.5);
const zeroConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 15), 0);
const firstDayOfTheMonthConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 1), 0);
const hugeConsumptionData = new ConsumptionFaker(new Date(today.getFullYear(), today.getMonth(), 25), 939932);

export default {
  title: '🛠 Consumption/<cc-daily-consumption>',
  component: 'cc-daily-consumption',
};

const conf = {
  component: 'cc-daily-consumption',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      dailyConsumption: defaultConsumptionData.consumptions,
      startDate: defaultConsumptionData.firstDayOfTheMonth,
      endDate: defaultConsumptionData.lastDayOfTheMonth,
      currency: 'EUR',
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      dailyConsumption: defaultConsumptionData.consumptions,
      startDate: defaultConsumptionData.firstDayOfTheMonth,
      endDate: defaultConsumptionData.lastDayOfTheMonth,
      currency: 'EUR',
      skeleton: true,
    },
  ],
});

export const dataLoadedWithFirstDayOfTheMonth = makeStory(conf, {
  items: [
    {
      dailyConsumption: firstDayOfTheMonthConsumptionData.consumptions,
      startDate: firstDayOfTheMonthConsumptionData.firstDayOfTheMonth,
      endDate: firstDayOfTheMonthConsumptionData.lastDayOfTheMonth,
      currency: 'EUR',
    },
  ],
});

export const dataLoadedWithNoConsumption = makeStory(conf, {
  items: [
    {
      dailyConsumption: zeroConsumptionData.consumptions,
      startDate: zeroConsumptionData.firstDayOfTheMonth,
      endDate: zeroConsumptionData.lastDayOfTheMonth,
      currency: 'EUR',
    },
  ],
});
export const dataLoadedWithHighAmount = makeStory(conf, {
  items: [
    {
      dailyConsumption: hugeConsumptionData.consumptions,
      startDate: hugeConsumptionData.firstDayOfTheMonth,
      endDate: hugeConsumptionData.lastDayOfTheMonth,
      currency: 'EUR',
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  items: [
    {
      dailyConsumption: defaultConsumptionData.consumptions,
      startDate: defaultConsumptionData.firstDayOfTheMonth,
      endDate: defaultConsumptionData.lastDayOfTheMonth,
      currency: 'USD',
    },
  ],
});

export const dataLoadedWithNoDigits = makeStory(conf, {
  items: [
    {
      dailyConsumption: defaultConsumptionData.consumptions,
      startDate: defaultConsumptionData.firstDayOfTheMonth,
      endDate: defaultConsumptionData.lastDayOfTheMonth,
      currency: 'EUR',
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
      component.skeleton = false;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  dataLoadedWithFirstDayOfTheMonth,
  dataLoadedWithHighAmount,
  dataLoadedWithDollars,
  dataLoadedWithNoDigits,
  dataLoadedWithNoConsumption,
  simulation,
});
