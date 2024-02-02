import './cc-logs.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-number/cc-input-number.js';
import '../cc-toggle/cc-toggle.js';
import { makeStory } from '../../stories/lib/make-story.js';

import { CUSTOM_METADATA_RENDERERS, createFakeLogs } from './fake-logs.js';

export default {
  title: '🚧 Beta/🛠 Logs/<cc-logs-beta>',
  component: 'cc-logs-beta',
};

const conf = {
  component: 'cc-logs-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5),
    },
  ],
});

export const dataLoadedWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5, { longMessage: true }),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithCustomMetadataRenderer = makeStory(conf, {
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
  items: [
    {
      logs: createFakeLogs(5),
      metadataRenderers: HIDDEN_METADATA_RENDERERS,
    },
  ],
});

export const dataLoadedWithManyMetadata = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5, { manyMetadata: true }),
    },
  ],
});

export const dataLoadedWithManyMetadataWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5, { manyMetadata: true }),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithNoTimestamp = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'none',
    },
  ],
});

export const dataLoadedWithTimestampIsoTimeOnly = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'time-iso',
    },
  ],
});

export const dataLoadedWithTimestampShortDateTime = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'datetime-short',
    },
  ],
});

export const dataLoadedWithTimestampShortTimeOnly = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5),
      dateDisplay: 'time-short',
    },
  ],
});

export const dataLoadedWithTimezoneLocal = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5),
      timezone: 'local',
    },
  ],
});

export const dataLoadedWithAnsiMessage = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5, { ansi: true }),
    },
  ],
});

export const dataLoadedWithAnsiMessageAndStripAnsiActivated = makeStory(conf, {
  items: [
    {
      logs: createFakeLogs(5, { ansi: true }),
      stripAnsi: true,
    },
  ],
});
