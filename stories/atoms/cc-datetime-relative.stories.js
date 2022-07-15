import '../../src/atoms/cc-datetime-relative.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export function createDateAgo ({ seconds = 0, minutes = 0, hours = 0, days = 0, weeks = 0, months = 0, years = 0 }) {
  const nowTs = new Date().getTime();
  const targetTs = nowTs
    - seconds * 1000
    - minutes * 1000 * 60
    - hours * 1000 * 60 * 60
    - days * 1000 * 60 * 60 * 24
    - weeks * 1000 * 60 * 60 * 24 * 7
    - months * 1000 * 60 * 60 * 24 * (365.25 / 12)
    - years * 1000 * 60 * 60 * 24 * 365.25;
  const targetDate = new Date(targetTs);
  return targetDate.toISOString();
}

const STEPS = [1, 5, 10, 20, 30, 45];

export default {
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

enhanceStoriesNames({
  now,
  secondsAgo,
  minutesAgo,
  hoursAgo,
  daysAgo,
  weeksAgo,
  monthsAgo,
  yearsAgo,
});
