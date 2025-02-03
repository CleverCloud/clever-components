import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-number/cc-input-number.js';
import '../cc-toggle/cc-toggle.js';
import './cc-logs.js';

import { CUSTOM_METADATA_RENDERERS, createFakeLogs } from './fake-logs.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs/<cc-logs-beta>',
  component: 'cc-logs-beta',
};

/**
 * @typedef {import('./cc-logs.js').CcLogs} CcLogs
 * @typedef {import('./cc-logs.types.js').Log} Log
 */

const conf = {
  component: 'cc-logs-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
    },
  ],
});

export const dataLoadedWithWrapLines = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5, { longMessage: true }),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithCustomMetadataRenderer = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
    },
  ],
});

const HIDDEN_METADATA_RENDERERS = {
  level: {
    hidden: true,
  },
  ip: {
    hidden: true,
  },
};
export const dataLoadedWithHiddenMetadata = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      metadataRenderers: HIDDEN_METADATA_RENDERERS,
    },
  ],
});

export const dataLoadedWithManyMetadata = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5, { manyMetadata: true }),
    },
  ],
});

export const dataLoadedWithManyMetadataWithWrapLines = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5, { manyMetadata: true }),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithNoTimestamp = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'none',
    },
  ],
});

export const dataLoadedWithTimestampIsoTimeOnly = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'time-iso',
    },
  ],
});

export const dataLoadedWithTimestampShortDateTime = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'datetime-short',
    },
  ],
});

export const dataLoadedWithTimestampShortTimeOnly = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'time-short',
    },
  ],
});

export const dataLoadedWithTimezoneLocal = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5),
      timezone: 'local',
    },
  ],
});

export const dataLoadedWithAnsiMessage = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5, { ansi: true }),
    },
  ],
});

export const dataLoadedWithAnsiMessageAndStripAnsiActivated = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: createFakeLogs(5, { ansi: true }),
      stripAnsi: true,
    },
  ],
});

export const dataLoadedWithAsciiArt = makeStory(conf, {
  /** @type {Array<Partial<CcLogs>>} */
  items: [
    {
      logs: [
        { id: `1`, date: new Date(), message: ` _  _  ____  __    __     __  `, metadata: [] },
        { id: `2`, date: new Date(), message: `/ )( \\(  __)(  )  (  )   /  \\`, metadata: [] },
        { id: `3`, date: new Date(), message: `) __ ( ) _) / (_/\\/ (_/\\(  O )`, metadata: [] },
        { id: `4`, date: new Date(), message: `\\_)(_/(____)\\____/\\____/ \\__/`, metadata: [] },
      ],
      stripAnsi: true,
    },
  ],
});
