import './cc-logs.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-number/cc-input-number.js';
import '../cc-toggle/cc-toggle.js';
import { random, randomPick, range } from '../../lib/utils.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const LONG_MESSAGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const SHORT_MESSAGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';

const ANSI_EFFECTS = [1, 3, 4, 9];
const ANSI_COLORS = range(31, 36);

export default {
  title: '🚧 Beta/🛠 Logs/<cc-logs-beta>',
  component: 'cc-logs-beta',
};

const conf = {
  component: 'cc-logs-beta',
  beta: true,
};

const log = (index, message = SHORT_MESSAGE) => {
  const date = new Date();
  return {
    id: `${date.getTime()}-${index}`,
    date,
    message: `Message [${index}] - ${message}`,
    metadata: [
      {
        name: 'level',
        value: randomPick(['INFO', 'WARN', 'DEBUG', 'ERROR']),
      },
      {
        name: 'ip',
        value: randomPick(['192.168.12.1', '192.168.48.157']),
      },
    ],
  };
};

const logWithManyMetadata = (index) => {
  return {
    ...log(index),
    metadata: [
      ...range(1, 20).map((index) => ({
        name: `metadata${index}`,
        value: `value${index}`,
      })),
    ],
  };
};

const logWithAnsiMessage = (index) => {
  const message = SHORT_MESSAGE.split(' ').slice(0, random(5, 50))
    .map((w) => {
      const effect = randomPick(ANSI_EFFECTS);
      const color = randomPick(ANSI_COLORS);
      return `\u001B[${effect};${color}m${w}`;
    })
    .join('\u001B[0m ');

  return log(index, message);
};

const logWithLongMessage = (index) => {
  return log(index, LONG_MESSAGE);
};

const logs = (count, logFactory = log) => {
  return Array(count).fill(0).map((_, i) => logFactory(i));
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      logs: logs(5),
    },
  ],
});

export const dataLoadedWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithLongMessage),
      wrapLines: true,
    },
  ],
});

const CUSTOM_METADATA_RENDERERS = {
  level: (metadata) => {
    let intent = 'neutral';
    if (metadata.value === 'ERROR') {
      intent = 'danger';
    }
    else if (metadata.value === 'WARN') {
      intent = 'warning';
    }
    else if (metadata.value === 'INFO') {
      intent = 'info';
    }
    return {
      strong: true,
      intent,
      size: 5,
    };
  },
  ip: {
    strong: true,
    size: 15,
  },
};
export const dataLoadedWithCustomMetadataRenderer = makeStory(conf, {
  items: [
    {
      logs: logs(5),
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
      logs: logs(5),
      metadataRenderers: HIDDEN_METADATA_RENDERERS,
    },
  ],
});

export const dataLoadedWithManyMetadata = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithManyMetadata),
    },
  ],
});

export const dataLoadedWithManyMetadataWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithManyMetadata),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithNoTimestamp = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      dateDisplay: 'none',
    },
  ],
});

export const dataLoadedWithTimestampIsoTimeOnly = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      dateDisplay: 'time-iso',
    },
  ],
});

export const dataLoadedWithTimestampShortDateTime = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      dateDisplay: 'datetime-short',
    },
  ],
});

export const dataLoadedWithTimestampShortTimeOnly = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      dateDisplay: 'time-short',
    },
  ],
});

export const dataLoadedWithTimezoneLocal = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      timezone: 'local',
    },
  ],
});

export const dataLoadedWithAnsiMessage = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithAnsiMessage),
    },
  ],
});

export const dataLoadedWithAnsiMessageAndStripAnsiActivated = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithAnsiMessage),
      stripAnsi: true,
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithWrapLines,
  dataLoadedWithCustomMetadataRenderer,
  dataLoadedWithHiddenMetadata,
  dataLoadedWithManyMetadata,
  dataLoadedWithManyMetadataWithWrapLines,
  dataLoadedWithNoTimestamp,
  dataLoadedWithTimestampIsoTimeOnly,
  dataLoadedWithTimestampShortDateTime,
  dataLoadedWithTimestampShortTimeOnly,
  dataLoadedWithTimezoneLocal,
  dataLoadedWithAnsiMessage,
  dataLoadedWithAnsiMessageAndStripAnsiActivated,
});
