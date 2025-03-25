import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-addon-runtime.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs addon/<cc-logs-addon-runtime-beta>',
  component: 'cc-logs-addon-runtime-beta',
};

/**
 * @typedef {import('./cc-logs-addon-runtime.js').CcLogsAddonRuntime} CcLogsAddonRuntime
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 */

const conf = {
  component: 'cc-logs-addon-runtime-beta',
  beta: true,
  // language=CSS
  css: `
    cc-logs-addon-runtime-beta {
      height: 800px;
    }
  `,
};

const NOW = new Date();

/**
 * @param {number} index
 * @return {Log}
 */
const generateLog = (index) => {
  return {
    id: `${index}`,
    date: new Date(NOW.getTime() + index),
    message: `This is a message (${index})`,
    metadata: [],
  };
};

/**
 * @param {CcLogsAddonRuntime} component
 * @param {number} count
 */
async function appendLogs(component, count) {
  await component.updateComplete;
  const logs = Array(count)
    .fill(0)
    .map((_, index) => generateLog(index));
  component.appendLogs(logs);
}

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'running', progress: { value: 100 }, overflowing: false },
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAddonRuntime} component */
    (component) => appendLogs(component, 100),
});

export const connecting = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: { type: 'loaded', streamState: { type: 'connecting' } },
      limit: 100,
    },
  ],
});

export const waitingForLogs = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'waitingForFirstLog' },
      },
      limit: 100,
    },
  ],
});

export const errorWhileConnecting = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: { type: 'loaded', streamState: { type: 'error' } },
      limit: 100,
    },
  ],
});

export const paused = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'paused', reason: 'user', progress: { value: 150 }, overflowing: false },
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAddonRuntime} component */
    (component) => appendLogs(component, 150),
});

export const overflowWatermarkReached = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'paused', reason: 'overflow', progress: { value: 190 } },
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAddonRuntime} component */
    (component) => appendLogs(component, 190),
});

export const overflowing = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAddonRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'running', progress: { value: 210 }, overflowing: true },
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAddonRuntime} component */
    (component) => appendLogs(component, 210),
});
