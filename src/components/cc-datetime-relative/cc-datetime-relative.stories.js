import { DAY, HOUR, MINUTE, SECOND } from '../../lib/date/date-utils.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-datetime-relative.js';

export function createDateAgo({ seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0, months = 0, years = 0 }) {
  const nowTs = new Date().getTime();
  const targetTs =
    nowTs -
    seconds * SECOND -
    minutes * MINUTE -
    hours * HOUR -
    days * DAY -
    weeks * DAY * 7 -
    months * DAY * (365.25 / 12) -
    years * DAY * 365.25;
  const targetDate = new Date(targetTs);
  return targetDate.toISOString();
}

const STEPS = [1, 5, 10, 20, 30, 45];

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-datetime-relative>',
  component: 'cc-datetime-relative',
  excludeStories: ['createDateAgo'],
};

const conf = {
  component: 'cc-datetime-relative',
  displayMode: 'flex-wrap',
};

export const now = makeStory(conf, {
  items: () => [{ datetime: createDateAgo({}) }],
});

export const secondsAgo = makeStory(conf, {
  items: () => STEPS.map((seconds) => ({ datetime: createDateAgo({ seconds }) })),
});

export const minutesAgo = makeStory(conf, {
  items: () => STEPS.map((minutes) => ({ datetime: createDateAgo({ minutes }) })),
});

export const hoursAgo = makeStory(conf, {
  items: () => STEPS.map((hours) => ({ datetime: createDateAgo({ hours }) })),
});

export const daysAgo = makeStory(conf, {
  items: () => STEPS.map((days) => ({ datetime: createDateAgo({ days }) })),
});

export const weeksAgo = makeStory(conf, {
  items: () => STEPS.map((weeks) => ({ datetime: createDateAgo({ weeks }) })),
});

export const monthsAgo = makeStory(conf, {
  items: () => STEPS.map((months) => ({ datetime: createDateAgo({ months }) })),
});

export const yearsAgo = makeStory(conf, {
  items: () => STEPS.map((years) => ({ datetime: createDateAgo({ years }) })),
});
