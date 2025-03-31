import { randomPick } from '../../lib/utils.js';
import { createDeployment, createInstance } from '../../stories/fixtures/logs-instance.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-app-runtime.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs app/<cc-logs-app-runtime-beta>',
  component: 'cc-logs-app-runtime-beta',
};

/**
 * @typedef {import('./cc-logs-app-runtime.js').CcLogsAppRuntime} CcLogsAppRuntime
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').Deployment} Deployment
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').Instance} Instance
 */

const conf = {
  component: 'cc-logs-app-runtime-beta',
  beta: true,
  // language=CSS
  css: `
    cc-logs-app-runtime-beta {
      height: 800px;
    }
  `,
};

const NOW = new Date();

/** @type {Deployment} */
const DEPLOYMENT = createDeployment('SUCCEEDED', 2);

/** @type {Array<Instance>} */
const INSTANCES = [
  createInstance(DEPLOYMENT, 0, 'RUN', 'UP', 'Curly honchkrow'),
  createInstance(DEPLOYMENT, 1, 'RUN', 'UP', 'Rapid combee'),
  createInstance(DEPLOYMENT, 2, 'RUN', 'UP', 'Crispy slowking'),
];

/**
 * @param {number} index
 * @return {Log}
 */
const generateLog = (index) => {
  const instance = randomPick(INSTANCES);
  return {
    id: `${index}`,
    date: new Date(NOW.getTime() + index),
    message: `This is a message from ${instance.name} (${index})`,
    metadata: [
      { name: 'instance', value: instance.name },
      { name: 'instanceId', value: instance.id },
    ],
  };
};

/**
 * @param {CcLogsAppRuntime} component
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
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'running', progress: { value: 100 }, overflowing: false },
        instances: INSTANCES,
        selection: [],
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAppRuntime} component */
    (component) => appendLogs(component, 100),
});

export const loadingInstance = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: { type: 'loadingInstances' },
      limit: 100,
    },
  ],
});

export const errorWhileLoadingInstance = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: { type: 'errorInstances' },
      limit: 100,
    },
  ],
});

export const connecting = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: { type: 'loaded', streamState: { type: 'connecting' }, instances: INSTANCES, selection: [] },
      limit: 100,
    },
  ],
});

export const waitingForLogs = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'waitingForFirstLog' },
        instances: INSTANCES,
        selection: [],
      },
      limit: 100,
    },
  ],
});

export const errorWhileConnecting = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: { type: 'loaded', streamState: { type: 'error' }, instances: INSTANCES, selection: [] },
      limit: 100,
    },
  ],
});

export const paused = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'paused', reason: 'user', progress: { value: 150 }, overflowing: false },
        instances: INSTANCES,
        selection: [],
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAppRuntime} component */
    (component) => appendLogs(component, 150),
});

export const overflowWatermarkReached = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'paused', reason: 'overflow', progress: { value: 190 } },
        instances: INSTANCES,
        selection: [],
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAppRuntime} component */
    (component) => appendLogs(component, 190),
});

export const overflowing = makeStory(conf, {
  /** @type {Array<Partial<CcLogsAppRuntime>>} */
  items: [
    {
      state: {
        type: 'loaded',
        streamState: { type: 'running', progress: { value: 210 }, overflowing: true },
        instances: INSTANCES,
        selection: [],
      },
      limit: 100,
    },
  ],
  onUpdateComplete:
    /** @param {CcLogsAppRuntime} component */
    (component) => appendLogs(component, 210),
});
