import { randomPick } from '../../lib/utils.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-app-access.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Logs app/<cc-logs-app-access-beta>',
  component: 'cc-logs-app-access-beta',
};

/**
 * @import { CcLogsAppAccess as CcAccessLogs } from './cc-logs-app-access.js'
 * @import { Log } from '../cc-logs/cc-logs.types.js'
 */

const conf = {
  component: 'cc-logs-app-access-beta',
  beta: true,
  // language=CSS
  css: `
    cc-logs-app-access-beta {
      height: 800px;
    }
  `,
};

const d = new Date();

const IPS = ['192.168.12.1', '192.168.48.157', '192.85.8.63'];
const LOCATIONS = ['|', 'FR|Paris', 'GB|London', 'FR|Nantes', 'FR|Brive-la-Gaillarde'];
const ENDPOINTS = ['GET|/ping', 'GET|/orga/12', 'POST|/orga', 'GET|/profile', 'PUT|/profile'];
const STATUS = ['100', '200', '301', '404', '500', '1512'];

/**
 * @param {number} index
 * @return {Log}
 */
const generateLog = (index) => {
  const [country, city] = randomPick(LOCATIONS).split('|');
  const [method, path] = randomPick(ENDPOINTS).split('|');
  return {
    id: `${index}`,
    date: new Date(d.getTime() + index),
    message: path,
    metadata: [
      { name: 'ip', value: randomPick(IPS) },
      { name: 'country', value: country },
      { name: 'city', value: city },
      { name: 'method', value: method },
      { name: 'status', value: randomPick(STATUS) },
    ],
  };
};

/**
 * @param {CcAccessLogs} component
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
  /** @type {Array<Partial<CcAccessLogs>>} */
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
    /** @param {CcAccessLogs} component */
    (component) => appendLogs(component, 100),
});

export const connecting = makeStory(conf, {
  /** @type {Array<Partial<CcAccessLogs>>} */
  items: [
    {
      state: { type: 'loaded', streamState: { type: 'connecting' } },
      limit: 100,
    },
  ],
});

export const waitingForLogs = makeStory(conf, {
  /** @type {Array<Partial<CcAccessLogs>>} */
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

export const error = makeStory(conf, {
  /** @type {Array<Partial<CcAccessLogs>>} */
  items: [
    {
      state: { type: 'loaded', streamState: { type: 'error' } },
      limit: 100,
    },
  ],
});

export const paused = makeStory(conf, {
  /** @type {Array<Partial<CcAccessLogs>>} */
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
    /** @param {CcAccessLogs} component */
    (component) => appendLogs(component, 150),
});

export const overflowWatermarkReached = makeStory(conf, {
  /** @type {Array<Partial<CcAccessLogs>>} */
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
    /** @param {CcAccessLogs} component */
    (component) => appendLogs(component, 190),
});

export const overflowing = makeStory(conf, {
  /** @type {Array<Partial<CcAccessLogs>>} */
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
    /** @param {CcAccessLogs} component */
    (component) => appendLogs(component, 210),
});
