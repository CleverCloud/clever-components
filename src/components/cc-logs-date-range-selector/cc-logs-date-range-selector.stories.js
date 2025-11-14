import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-date-range-selector.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs/<cc-logs-date-range-selector-beta>',
  component: 'cc-logs-date-range-selector-beta',
};

/**
 * @import { CcLogsDateRangeSelector } from './cc-logs-date-range-selector.js'
 */

const conf = {
  component: 'cc-logs-date-range-selector-beta',
  beta: true,
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-logs-date-range-selector-beta {
      height: 18em;
      margin: 1em;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'live' },
    },
  ],
});

export const disabled = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'live' },
      disabled: true,
    },
  ],
});

export const readonly = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'live' },
      readonly: true,
    },
  ],
});

export const preset = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'preset', preset: 'today' },
    },
  ],
});

export const custom = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'custom', since: '2024-10-15T00:00:00.000Z', until: '2024-10-15T01:00:00.000Z' },
    },
  ],
});

export const customDisabled = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'custom', since: '2024-10-15T00:00:00.000Z', until: '2024-10-15T01:00:00.000Z' },
      disabled: true,
    },
  ],
});

export const customReadonly = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'custom', since: '2024-10-15T00:00:00.000Z', until: '2024-10-15T01:00:00.000Z' },
      readonly: true,
    },
  ],
});

export const customWithLocalTimezone = makeStory(conf, {
  /** @type {Array<Partial<CcLogsDateRangeSelector>>} */
  items: [
    {
      value: { type: 'custom', since: '2024-10-15T00:00:00.000Z', until: '2024-10-15T01:00:00.000Z' },
      timezone: 'local',
    },
  ],
});
