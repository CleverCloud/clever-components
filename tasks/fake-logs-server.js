/**
 * Fake Clever Cloud API for the `cc-logs-app-runtime-beta` smart component.
 *
 * It serves the endpoints the component calls, and the deployment endpoints around them:
 * - the instances of the application (v4 orchestration API),
 * - the deployments of the application (v4 orchestration API, v2 legacy API),
 * - deploying the application and cancelling a deployment (v2 API),
 * - the runtime logs, streamed as Server Sent Events (v4 logs API).
 *
 * The data is generated, so any owner and application ids are accepted.
 * Each deployment is planned upfront: queue, build on a dedicated instance, start the new instances,
 * then delete the instances it replaces. States are computed from the current time.
 * Each instance emits one log per `--period` while it is alive.
 * Ticks are aligned on the epoch, so a given log always has the same id and content.
 * This lets the stream resume from the `Last-Event-ID` header like the real API.
 *
 * Usage:
 *   node tasks/fake-logs-server.js [--port 8090] [--period 1000] [--drop-every 0] [--app-id app_xxx]
 *   API_HOST=http://localhost:8090 pnpm storybook:dev
 *
 * Control endpoints:
 *   /_fake                          current state (deployments, open streams, pending failures)
 *   /_fake/deploy?result=SUCCEEDED&queue=2000&build=20000&instances=2
 *                                   start a deployment (result can be SUCCEEDED or FAILED)
 *   /_fake/cancel                   cancel the deployment in progress
 *   /_fake/drop                     destroy the sockets of the open streams
 *   /_fake/close                    end the open streams without an END_OF_STREAM event
 *   /_fake/silence?ms=10000         send nothing (logs and heartbeats) during the given duration
 *   /_fake/fail?status=500&count=3  answer the next log stream requests with this status
 *   /_fake/fail?status=hang&count=1 never answer the next log stream requests
 */
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import http from 'node:http';
import { setTimeout as sleep } from 'node:timers/promises';
import { parseArgs } from 'node:util';

const { values: options } = parseArgs({
  options: {
    port: { type: 'string', default: '8090' },
    period: { type: 'string', default: '1000' },
    'drop-every': { type: 'string', default: '0' },
    // Only used by the organisation-wide deployments list, which groups deployments by application.
    'app-id': { type: 'string', default: 'app_d0969d3a-5317-4e62-91e3-7adfe66acfa4' },
  },
});

const PORT = Number(options.port);
const PERIOD = Number(options.period);
const DROP_EVERY = Number(options['drop-every']);
const APP_ID = options['app-id'];

// The client considers the connection as dead after 4s without any message.
const HEARTBEAT_PERIOD = 2000;
const DEFAULT_THROTTLE_ELEMENTS = 1000;
const DEFAULT_THROTTLE_PER_IN_MILLISECONDS = 10;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const STARTED_AT = Date.now();

// Time between the end of the build and the success of the deployment, while the new instances start.
const RUN_START_DURATION = 10 * SECOND;
// Time between the success of a deployment and the deletion of the instances it replaces.
const REPLACEMENT_DELAY = 5 * SECOND;

const FINAL_STATES = ['SUCCEEDED', 'FAILED', 'CANCELLED'];
const V2_STATES = {
  QUEUED: 'WIP',
  WORK_IN_PROGRESS: 'WIP',
  SUCCEEDED: 'OK',
  FAILED: 'FAIL',
  CANCELLED: 'CANCELLED',
};
const AUTHOR = { id: 'user_7c1d2e3f-4a5b-4c6d-8e9f-000000000001', name: 'Jane Doe' };

// -- Fake data ------

/**
 * @typedef {'QUEUED'|'WORK_IN_PROGRESS'|'SUCCEEDED'|'FAILED'|'CANCELLED'} DeploymentState
 */

/**
 * @typedef {object} FakeDeployment
 * @property {string} id
 * @property {number} number Incremental number, exposed as `id` by the v2 API.
 * @property {string} commitId
 * @property {string|null} previousCommitId
 * @property {boolean} legacy Unknown to the v4 API, so the component falls back to the v2 API.
 * @property {Array<{state: DeploymentState, date: number}>} steps Planned upfront, so some dates can be in the future.
 * @property {Array<FakeInstance>} replacedInstances
 */

/**
 * @typedef {object} FakeInstance
 * @property {string} id
 * @property {string} name
 * @property {number} index
 * @property {boolean} isBuildVm
 * @property {FakeDeployment} deployment
 * @property {number} creationDate
 * @property {number|null} deletionDate
 * @property {number|null} buildEndDate Planned end of the build. It does not move when the deployment is cancelled.
 */

/** @type {Array<FakeDeployment>} */
const DEPLOYMENTS = [];
// The position of an instance in this array is part of the log ids: only append new instances.
/** @type {Array<FakeInstance>} */
const INSTANCES = [];

const ADJECTIVES = ['Brave', 'Calm', 'Dizzy', 'Eager', 'Fuzzy', 'Gentle', 'Happy', 'Jolly', 'Lucky', 'Mighty', 'Quiet'];
const ANIMALS = ['Badger', 'Crane', 'Dolphin', 'Eagle', 'Falcon', 'Gecko', 'Heron', 'Ibis', 'Jaguar', 'Koala', 'Lynx'];

const BUILD_MESSAGES = [
  'Cloning repository...',
  'Using Node.js v24.14.0',
  'Restoring build cache',
  'Running npm ci',
  'added 1342 packages, and audited 1343 packages in 21s',
  'Running npm run build',
  '\u001b[36mvite v7.1.3 \u001b[32mbuilding for production...\u001b[0m',
  '\u001b[32m✓\u001b[0m 812 modules transformed.',
  'Uploading build cache',
  'Build succeeded',
];
const BUILD_FAILED_MESSAGE = '\u001b[31merror\u001b[0m Command "build" exited with code 1. Build failed';

const LONG_LINE = `request headers: ${Array.from({ length: 12 }, (_, i) => `x-header-${i}=${'abcdef'.repeat(4)}`).join('; ')}`;

/** @type {Array<(h: number) => string>} */
const RUN_MESSAGES = [
  (h) => `GET /api/products/${h % 1000} 200 ${h % 250}ms`,
  (h) => `GET /api/products/${h % 1000}/reviews 200 ${h % 300}ms`,
  (h) => `GET /health 200 ${h % 5}ms`,
  (h) => `POST /api/orders 201 ${h % 400}ms`,
  (h) => `\u001b[32mINFO\u001b[0m worker-${h % 8} processed job #${h % 100000}`,
  (h) =>
    `\u001b[33mWARN\u001b[0m slow query (${1000 + (h % 4000)}ms): SELECT * FROM orders WHERE customer_id = ${h % 10000}`,
  (h) => `\u001b[31mERROR\u001b[0m upstream timeout after 30000ms (attempt ${(h % 3) + 1}/3)`,
  (h) => JSON.stringify({ level: 'info', msg: 'cache refreshed', keys: h % 5000 }),
  () => `DEBUG ${LONG_LINE}`,
];

/**
 * Plans the whole life of a deployment, like the orchestrator does it.
 * A successful deployment replaces the instances that are still running.
 *
 * @param {object} params
 * @param {number} params.startDate
 * @param {'SUCCEEDED'|'FAILED'} [params.result]
 * @param {number} [params.queueDuration]
 * @param {number} [params.buildDuration]
 * @param {number} [params.instanceCount]
 * @param {string|null} [params.commitId]
 * @param {boolean} [params.legacy]
 * @return {FakeDeployment}
 */
function scheduleDeployment({
  startDate,
  result = 'SUCCEEDED',
  queueDuration = 2 * SECOND,
  buildDuration = 20 * SECOND,
  instanceCount = 2,
  commitId = null,
  legacy = false,
}) {
  const number = DEPLOYMENTS.length + 1;
  const buildStartDate = startDate + queueDuration;
  const buildEndDate = buildStartDate + buildDuration;

  /** @type {FakeDeployment} */
  const deployment = {
    id: `deployment_0f1e2d3c-4b5a-4968-8776-${formatCounter(number)}`,
    number,
    commitId: commitId ?? createHash('sha1').update(String(number)).digest('hex'),
    previousCommitId: DEPLOYMENTS.at(-1)?.commitId ?? null,
    legacy,
    steps: [
      { state: 'QUEUED', date: startDate },
      { state: 'WORK_IN_PROGRESS', date: buildStartDate },
    ],
    replacedInstances: [],
  };
  DEPLOYMENTS.push(deployment);

  addInstance(deployment, { isBuildVm: true, index: 0, creationDate: buildStartDate, deletionDate: buildEndDate });

  if (result === 'FAILED') {
    deployment.steps.push({ state: 'FAILED', date: buildEndDate });
    return deployment;
  }

  const endDate = buildEndDate + RUN_START_DURATION;
  deployment.steps.push({ state: 'SUCCEEDED', date: endDate });

  deployment.replacedInstances = INSTANCES.filter((instance) => !instance.isBuildVm && instance.deletionDate == null);
  deployment.replacedInstances.forEach((instance) => {
    instance.deletionDate = endDate + REPLACEMENT_DELAY;
  });

  for (let index = 0; index < instanceCount; index++) {
    addInstance(deployment, { isBuildVm: false, index, creationDate: buildEndDate, deletionDate: null });
  }

  return deployment;
}

/**
 * @param {FakeDeployment} deployment
 * @param {{isBuildVm: boolean, index: number, creationDate: number, deletionDate: number|null}} params
 */
function addInstance(deployment, { isBuildVm, index, creationDate, deletionDate }) {
  const number = INSTANCES.length + 1;
  INSTANCES.push({
    id: `5d6b8c1e-2f3a-4b4c-9d5e-${formatCounter(number)}`,
    name: `${ADJECTIVES[number % ADJECTIVES.length]} ${ANIMALS[(number * 7) % ANIMALS.length]}`,
    index,
    isBuildVm,
    deployment,
    creationDate,
    deletionDate,
    buildEndDate: isBuildVm ? deletionDate : null,
  });
}

/**
 * Cancels a deployment in progress: its instances are deleted and the instances it was replacing are kept.
 *
 * @param {FakeDeployment} deployment
 * @return {boolean} `false` if the deployment is already over
 */
function cancelDeployment(deployment) {
  const now = Date.now();
  if (!isInProgress(deployment, now)) {
    return false;
  }

  deployment.steps = deployment.steps.filter((step) => step.date <= now);
  deployment.steps.push({ state: 'CANCELLED', date: now });

  INSTANCES.filter((instance) => instance.deployment === deployment).forEach((instance) => {
    if (instance.creationDate > now) {
      // Never created: it becomes invisible.
      instance.creationDate = now;
      instance.deletionDate = now;
    } else if (instance.deletionDate == null || instance.deletionDate > now) {
      instance.deletionDate = now;
    }
  });

  deployment.replacedInstances.forEach((instance) => {
    instance.deletionDate = null;
  });
  deployment.replacedInstances = [];

  return true;
}

/**
 * @param {FakeDeployment} deployment
 * @param {number} [now]
 * @return {DeploymentState}
 */
function getDeploymentState(deployment, now = Date.now()) {
  return deployment.steps.findLast((step) => step.date <= now)?.state ?? 'QUEUED';
}

/**
 * @param {FakeDeployment} deployment
 * @param {number} [now]
 */
function isInProgress(deployment, now = Date.now()) {
  return !FINAL_STATES.includes(getDeploymentState(deployment, now));
}

function getDeploymentInProgress() {
  return DEPLOYMENTS.find((deployment) => isInProgress(deployment));
}

/**
 * @param {FakeInstance} instance
 * @param {number} now
 */
function getInstanceState(instance, now) {
  if (instance.deletionDate != null && instance.deletionDate <= now) {
    return 'DELETED';
  }
  if (instance.isBuildVm) {
    return 'BUILDING';
  }
  return isInProgress(instance.deployment, now) ? 'DEPLOYING' : 'UP';
}

/**
 * @param {FakeInstance} instance
 * @param {number} now
 */
function isVisible(instance, now) {
  return (
    instance.creationDate <= now && (instance.deletionDate == null || instance.creationDate < instance.deletionDate)
  );
}

/**
 * @param {FakeInstance} instance
 * @param {number} date
 */
function isAlive(instance, date) {
  return instance.creationDate <= date && (instance.deletionDate == null || date < instance.deletionDate);
}

// -- Server state ------

/** @type {Set<SseConnection>} */
const connections = new Set();
/** @type {Set<http.ServerResponse>} */
const logsResponses = new Set();
/** @type {Array<{status: number|'hang', count: number}>} */
const pendingFailures = [];
let silencedUntil = 0;
let connectionCounter = 0;

// -- Log stream ------

class SseConnection {
  /**
   * @param {http.ServerResponse} res
   * @param {LogsParams} params
   */
  constructor(res, params) {
    this.id = ++connectionCounter;
    this.res = res;
    this.params = params;
    this.sent = 0;
    this.lastEventId = params.lastEventId;
    this.closed = false;
    /** @type {string|null} */
    this.endReason = null;
    this.abortController = new AbortController();

    res.on('close', () => this._onClose());
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    this.heartbeatInterval = setInterval(() => {
      if (!isSilenced()) {
        res.write('event: HEARTBEAT\ndata: {}\n\n');
      }
    }, HEARTBEAT_PERIOD);

    connections.add(this);
    log(
      `sse#${this.id}`,
      `open instances=${params.instanceIds.length === 0 ? 'all' : params.instanceIds.length}`,
      `since=${formatDate(params.since)} until=${formatDate(params.until)}`,
      `limit=${params.limit ?? '-'} resume=${params.lastEventId ?? '-'}`,
    );
  }

  async run() {
    try {
      await this._streamLogs();
    } catch (error) {
      if (!(error instanceof Error) || error.name !== 'AbortError') {
        throw error;
      }
    }
  }

  /**
   * @param {string} reason
   */
  end(reason) {
    if (this.closed) {
      return;
    }
    this.res.write(`event: END_OF_STREAM\ndata: ${JSON.stringify({ endedBy: reason })}\n\n`);
    this.endReason = reason;
    this.res.end();
  }

  async _streamLogs() {
    const { since, until, limit, filter, throttleElements, throttlePerInMilliseconds, resumeFrom } = this.params;
    const signal = this.abortController.signal;

    const firstCreationDate = getFirstCreationDate(getStreamedInstanceIndexes(this.params));
    let tick = resumeFrom?.tick ?? alignOnTick(Math.max(since, firstCreationDate ?? since));
    // Logs of the resumed tick up to this instance have already been received.
    let skipUpToInstanceIndex = resumeFrom?.instanceIndex ?? -1;
    let batchSize = 0;

    while (!this.closed) {
      await waitWhileSilenced(signal);

      if (until != null && tick >= until) {
        this.end('UNTIL_REACHED');
        return;
      }

      const now = Date.now();
      if (tick > now) {
        await sleep(tick - now, null, { signal });
        continue;
      }

      // Resolved on each tick, so the instances created by a new deployment are streamed too.
      for (const instanceIndex of getStreamedInstanceIndexes(this.params)) {
        if (instanceIndex <= skipUpToInstanceIndex || !isAlive(INSTANCES[instanceIndex], tick)) {
          continue;
        }

        const rawLog = createLog(tick, instanceIndex, this.params.applicationId);
        if (filter != null && !rawLog.message.includes(filter)) {
          continue;
        }

        await this._send('APPLICATION_LOG', JSON.stringify(rawLog), rawLog.id);
        if (this.closed) {
          return;
        }

        if (limit != null && this.sent >= limit) {
          this.end('LIMIT_REACHED');
          return;
        }

        batchSize++;
        if (batchSize >= throttleElements) {
          batchSize = 0;
          await sleep(throttlePerInMilliseconds, null, { signal });
          await waitWhileSilenced(signal);
        }
      }

      skipUpToInstanceIndex = -1;
      tick += PERIOD;
    }
  }

  /**
   * @param {string} event
   * @param {string} data
   * @param {string} id
   */
  async _send(event, data, id) {
    const flushed = this.res.write(`event: ${event}\nid: ${id}\ndata: ${data}\n\n`);
    this.sent++;
    this.lastEventId = id;
    if (!flushed) {
      await once(this.res, 'drain', { signal: this.abortController.signal });
    }
  }

  _onClose() {
    this.closed = true;
    clearInterval(this.heartbeatInterval);
    this.abortController.abort();
    connections.delete(this);
    log(`sse#${this.id}`, `closed reason=${this.endReason ?? 'client/network'} sent=${this.sent}`);
  }
}

/**
 * @typedef {object} LogsParams
 * @property {string} applicationId
 * @property {number} since
 * @property {number|null} until
 * @property {number|null} limit
 * @property {string|null} filter
 * @property {Array<string>} instanceIds
 * @property {string|null} deploymentId
 * @property {number} throttleElements
 * @property {number} throttlePerInMilliseconds
 * @property {string|null} lastEventId
 * @property {{tick: number, instanceIndex: number}|null} resumeFrom
 */

/**
 * @param {string} applicationId
 * @param {URLSearchParams} query
 * @param {string|undefined} lastEventId
 * @return {LogsParams}
 */
function parseLogsParams(applicationId, query, lastEventId) {
  return {
    applicationId,
    since: parseDate(query.get('since')) ?? Date.now(),
    until: parseDate(query.get('until')),
    limit: parseNumber(query.get('limit')),
    filter: query.get('filter'),
    instanceIds: query.getAll('instanceId'),
    deploymentId: query.get('deploymentId'),
    throttleElements: parseNumber(query.get('throttleElements')) ?? DEFAULT_THROTTLE_ELEMENTS,
    throttlePerInMilliseconds:
      parseNumber(query.get('throttlePerInMilliseconds')) ?? DEFAULT_THROTTLE_PER_IN_MILLISECONDS,
    lastEventId: lastEventId ?? null,
    resumeFrom: parseLogId(lastEventId),
  };
}

/**
 * @param {LogsParams} params
 * @return {Array<number>}
 */
function getStreamedInstanceIndexes({ instanceIds, deploymentId }) {
  const indexes = [];
  for (let index = 0; index < INSTANCES.length; index++) {
    const instance = INSTANCES[index];
    if (
      (instanceIds.length === 0 || instanceIds.includes(instance.id)) &&
      (deploymentId == null || instance.deployment.id === deploymentId)
    ) {
      indexes.push(index);
    }
  }
  return indexes;
}

/**
 * @param {number} tick
 * @param {number} instanceIndex
 * @param {string} applicationId
 */
function createLog(tick, instanceIndex, applicationId) {
  const instance = INSTANCES[instanceIndex];
  const h = hash(Math.floor(tick / PERIOD) * 31 + instanceIndex);
  const message = instance.isBuildVm ? getBuildMessage(instance, tick) : RUN_MESSAGES[h % RUN_MESSAGES.length](h >>> 4);

  return {
    id: `log_${tick}_${instanceIndex}`,
    date: new Date(tick).toISOString(),
    message,
    instanceId: instance.id,
    applicationId,
    deploymentId: instance.deployment.id,
    commitId: instance.deployment.commitId,
    zone: 'par',
  };
}

/**
 * The build messages follow the progress of the build, and the last one depends on its result.
 *
 * @param {FakeInstance} instance
 * @param {number} tick
 */
function getBuildMessage(instance, tick) {
  // The last log of the build always gives its result, even for a build shorter than the list of messages.
  if (tick + PERIOD >= instance.buildEndDate) {
    return instance.deployment.steps.some((step) => step.state === 'FAILED')
      ? BUILD_FAILED_MESSAGE
      : BUILD_MESSAGES.at(-1);
  }
  const progress = (tick - instance.creationDate) / (instance.buildEndDate - instance.creationDate);
  return BUILD_MESSAGES[Math.min(Math.floor(progress * (BUILD_MESSAGES.length - 1)), BUILD_MESSAGES.length - 2)];
}

/**
 * @param {string|undefined} id
 * @return {{tick: number, instanceIndex: number}|null}
 */
function parseLogId(id) {
  const match = /^log_(\d+)_(\d+)$/.exec(id ?? '');
  if (match == null) {
    return null;
  }
  return { tick: Number(match[1]), instanceIndex: Number(match[2]) };
}

/**
 * @param {Array<number>} instanceIndexes
 * @return {number|null}
 */
function getFirstCreationDate(instanceIndexes) {
  if (instanceIndexes.length === 0) {
    return null;
  }
  return Math.min(...instanceIndexes.map((index) => INSTANCES[index].creationDate));
}

/**
 * @param {number} date
 */
function alignOnTick(date) {
  return Math.ceil(date / PERIOD) * PERIOD;
}

/**
 * @param {number} n
 */
function hash(n) {
  let x = n | 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  return (x ^ (x >>> 16)) >>> 0;
}

function isSilenced() {
  return Date.now() < silencedUntil;
}

/**
 * @param {AbortSignal} signal
 */
async function waitWhileSilenced(signal) {
  while (isSilenced()) {
    await sleep(silencedUntil - Date.now(), null, { signal });
  }
}

// -- REST API ------

/**
 * @param {FakeInstance} instance
 * @param {string} ownerId
 * @param {string} applicationId
 */
function toRawInstance(instance, ownerId, applicationId) {
  return {
    id: instance.id,
    ownerId,
    applicationId,
    deploymentId: instance.deployment.id,
    name: instance.name,
    index: instance.index,
    isBuildVm: instance.isBuildVm,
    state: getInstanceState(instance, Date.now()),
    creationDate: new Date(instance.creationDate).toISOString(),
    deletionDate: instance.deletionDate == null ? null : new Date(instance.deletionDate).toISOString(),
  };
}

/**
 * @param {FakeDeployment} deployment
 * @param {string} ownerId
 * @param {string} applicationId
 */
function toRawDeployment(deployment, ownerId, applicationId) {
  const now = Date.now();
  const steps = deployment.steps.filter((step) => step.date <= now);
  return {
    id: deployment.id,
    ownerId,
    applicationId,
    startDate: new Date(deployment.steps[0].date).toISOString(),
    state: getDeploymentState(deployment, now),
    steps: steps.map((step) => ({ state: step.state, date: new Date(step.date).toISOString() })),
    version: { commitId: deployment.commitId, previousCommitId: deployment.previousCommitId },
    origin: {
      action: 'DEPLOY',
      cause: 'git push',
      source: 'GIT',
      authorId: AUTHOR.id,
      constraints: /** @type {Array<string>} */ ([]),
      priority: 'DEFAULT',
    },
    hasDedicatedBuild: true,
  };
}

/**
 * @param {FakeDeployment} deployment
 */
function toRawDeploymentV2(deployment) {
  return {
    id: deployment.number,
    uuid: deployment.id,
    date: deployment.steps[0].date,
    state: V2_STATES[getDeploymentState(deployment)],
    action: 'DEPLOY',
    commit: deployment.commitId,
    cause: 'git push',
    instances: INSTANCES.filter((instance) => instance.deployment === deployment && !instance.isBuildVm).length,
    author: AUTHOR,
  };
}

/**
 * @param {URLSearchParams} query
 */
function listDeploymentsV2(query) {
  const action = query.get('action');
  const offset = parseNumber(query.get('offset')) ?? 0;
  // The real API returns at most 10 deployments when no limit is given.
  const limit = parseNumber(query.get('limit')) ?? 10;
  return DEPLOYMENTS.filter(() => action == null || action === 'DEPLOY')
    .toReversed()
    .slice(offset, offset + limit)
    .map(toRawDeploymentV2);
}

/**
 * @param {{result?: 'SUCCEEDED'|'FAILED', queueDuration?: number, buildDuration?: number, instanceCount?: number, commitId?: string|null}} params
 * @return {FakeDeployment|null} `null` if a deployment is already in progress
 */
function deploy(params) {
  if (getDeploymentInProgress() != null) {
    return null;
  }
  const deployment = scheduleDeployment({ startDate: Date.now(), ...params });
  log('deploy', `${deployment.id} planned: ${formatSteps(deployment)}`);
  return deployment;
}

/**
 * @param {FakeDeployment} deployment
 */
function formatSteps(deployment) {
  return deployment.steps.map((step) => `${step.state}@+${Math.round((step.date - Date.now()) / SECOND)}s`).join(' ');
}

/**
 * @typedef {(req: http.IncomingMessage, res: http.ServerResponse, url: URL, ...ids: Array<string|undefined>) => void} RouteHandler
 */

// `(?:organisations\/([^/]+)|self)` matches both flavours of the v2 API, the owner id is `undefined` with `self`.
/** @type {Array<{method: string, pattern: RegExp, handler: RouteHandler}>} */
const ROUTES = [
  {
    method: 'GET',
    pattern: /^\/v4\/orchestration\/organisations\/([^/]+)\/applications\/([^/]+)\/instances$/,
    handler: (_req, res, url, ownerId, applicationId) => {
      const now = Date.now();
      const since = parseDate(url.searchParams.get('since'));
      const until = parseDate(url.searchParams.get('until'));
      const deploymentId = url.searchParams.get('deploymentId');
      const limit = parseNumber(url.searchParams.get('limit')) ?? Infinity;

      const instances = INSTANCES.filter((instance) => {
        return (
          isVisible(instance, now) &&
          (deploymentId == null || instance.deployment.id === deploymentId) &&
          (until == null || instance.creationDate < until) &&
          (since == null || instance.deletionDate == null || instance.deletionDate > since)
        );
      })
        .toSorted((a, b) => b.creationDate - a.creationDate)
        .slice(0, limit)
        .map((instance) => toRawInstance(instance, ownerId, applicationId));

      sendJson(res, 200, instances);
    },
  },
  {
    method: 'GET',
    pattern: /^\/v4\/orchestration\/organisations\/([^/]+)\/applications\/([^/]+)\/instances\/([^/]+)$/,
    handler: (_req, res, _url, ownerId, applicationId, instanceId) => {
      const instance = INSTANCES.find((i) => i.id === instanceId);
      if (instance == null || !isVisible(instance, Date.now())) {
        sendNotFound(res);
        return;
      }
      sendJson(res, 200, toRawInstance(instance, ownerId, applicationId));
    },
  },
  {
    method: 'GET',
    pattern: /^\/v4\/orchestration\/organisations\/([^/]+)\/applications\/([^/]+)\/deployments\/([^/]+)$/,
    handler: (_req, res, _url, ownerId, applicationId, deploymentId) => {
      const deployment = DEPLOYMENTS.find((d) => d.id === deploymentId);
      if (deployment == null || deployment.legacy) {
        sendNotFound(res);
        return;
      }
      sendJson(res, 200, toRawDeployment(deployment, ownerId, applicationId));
    },
  },
  {
    method: 'GET',
    pattern: /^\/v2\/organisations\/([^/]+)\/deployments$/,
    handler: (_req, res, url) => {
      sendJson(res, 200, { [APP_ID]: listDeploymentsV2(url.searchParams) });
    },
  },
  {
    method: 'GET',
    pattern: /^\/v2\/(?:organisations\/([^/]+)|self)\/applications\/([^/]+)\/deployments$/,
    handler: (_req, res, url) => {
      sendJson(res, 200, listDeploymentsV2(url.searchParams));
    },
  },
  {
    method: 'GET',
    pattern: /^\/v2\/(?:organisations\/([^/]+)|self)\/applications\/([^/]+)\/deployments\/([^/]+)$/,
    handler: (_req, res, _url, _ownerId, _applicationId, deploymentId) => {
      const deployment = DEPLOYMENTS.find((d) => d.id === deploymentId);
      if (deployment == null) {
        sendNotFound(res);
        return;
      }
      sendJson(res, 200, toRawDeploymentV2(deployment));
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/v2\/(?:organisations\/([^/]+)|self)\/applications\/([^/]+)\/deployments\/([^/]+)\/instances$/,
    handler: (_req, res, _url, _ownerId, _applicationId, deploymentId) => {
      const deployment = DEPLOYMENTS.find((d) => d.id === deploymentId);
      if (deployment == null) {
        sendNotFound(res);
        return;
      }
      if (!cancelDeployment(deployment)) {
        sendJson(res, 400, { id: 400, message: 'The deployment is already over', type: 'error' });
        return;
      }
      log('deploy', `${deployment.id} cancelled`);
      sendJson(res, 200, { id: 200, message: 'The deployment has been cancelled', type: 'success' });
    },
  },
  {
    method: 'POST',
    pattern: /^\/v2\/(?:organisations\/([^/]+)|self)\/applications\/([^/]+)\/instances$/,
    handler: (_req, res, url) => {
      const deployment = deploy({ commitId: url.searchParams.get('commit') });
      if (deployment == null) {
        sendJson(res, 409, { id: 409, message: 'A deployment is already in progress', type: 'error' });
        return;
      }
      sendJson(res, 200, {
        id: 200,
        message: 'The application has successfully been queued for redeploy.',
        type: 'success',
        deploymentId: deployment.id,
      });
    },
  },
  {
    method: 'GET',
    pattern: /^\/v4\/logs\/organisations\/([^/]+)\/applications\/([^/]+)\/logs$/,
    handler: (req, res, url, _ownerId, applicationId) => {
      logsResponses.add(res);
      res.on('close', () => logsResponses.delete(res));

      const failure = takePendingFailure();
      if (failure === 'hang') {
        log('sse', 'hang (no response)');
        return;
      }
      if (failure != null) {
        log('sse', `fail status=${failure}`);
        // The client parses the body as JSON only with this exact content type.
        sendJson(res, failure, { id: failure, error: `Fake ${failure} error`, type: 'error' });
        return;
      }

      const lastEventId = /** @type {string|undefined} */ (req.headers['last-event-id']);
      new SseConnection(res, parseLogsParams(applicationId, url.searchParams, lastEventId)).run();
    },
  },
  {
    method: '*',
    pattern: /^\/_fake$/,
    handler: (_req, res) => {
      const now = Date.now();
      sendJson(res, 200, {
        period: PERIOD,
        silencedUntil: isSilenced() ? new Date(silencedUntil).toISOString() : null,
        pendingFailures,
        deployments: DEPLOYMENTS.map((d) => ({
          id: d.id,
          state: getDeploymentState(d, now),
          legacy: d.legacy,
          steps: d.steps.map((step) => `${step.state} ${new Date(step.date).toISOString()}`),
          instances: INSTANCES.filter((i) => i.deployment === d && isVisible(i, now)).map(
            (i) => `${i.name} (${i.isBuildVm ? 'build' : 'run'}, ${getInstanceState(i, now)})`,
          ),
        })),
        streams: Array.from(connections).map((c) => ({
          id: c.id,
          instances: getStreamedInstanceIndexes(c.params).map((index) => INSTANCES[index].name),
          since: formatDate(c.params.since),
          until: formatDate(c.params.until),
          sent: c.sent,
          lastEventId: c.lastEventId,
        })),
      });
    },
  },
  {
    method: '*',
    pattern: /^\/_fake\/deploy$/,
    handler: (_req, res, url) => {
      const result = url.searchParams.get('result') === 'FAILED' ? 'FAILED' : 'SUCCEEDED';
      const deployment = deploy({
        result,
        queueDuration: parseNumber(url.searchParams.get('queue')) ?? undefined,
        buildDuration: parseNumber(url.searchParams.get('build')) ?? undefined,
        instanceCount: parseNumber(url.searchParams.get('instances')) ?? undefined,
      });
      if (deployment == null) {
        sendJson(res, 409, { error: 'A deployment is already in progress' });
        return;
      }
      sendJson(res, 200, { deploymentId: deployment.id, steps: formatSteps(deployment) });
    },
  },
  {
    method: '*',
    pattern: /^\/_fake\/cancel$/,
    handler: (_req, res) => {
      const deployment = getDeploymentInProgress();
      if (deployment == null) {
        sendJson(res, 409, { error: 'No deployment in progress' });
        return;
      }
      cancelDeployment(deployment);
      log('deploy', `${deployment.id} cancelled`);
      sendJson(res, 200, { cancelled: deployment.id });
    },
  },
  {
    method: '*',
    pattern: /^\/_fake\/drop$/,
    handler: (_req, res) => {
      const count = dropStreams();
      sendJson(res, 200, { dropped: count });
    },
  },
  {
    method: '*',
    pattern: /^\/_fake\/close$/,
    handler: (_req, res) => {
      const count = connections.size;
      log('control', `close ${count} stream(s) without END_OF_STREAM`);
      connections.forEach((c) => {
        c.endReason = 'closed without END_OF_STREAM';
        c.res.end();
      });
      sendJson(res, 200, { closed: count });
    },
  },
  {
    method: '*',
    pattern: /^\/_fake\/silence$/,
    handler: (_req, res, url) => {
      const ms = parseNumber(url.searchParams.get('ms')) ?? 10000;
      silencedUntil = Date.now() + ms;
      log('control', `silence for ${ms}ms`);
      sendJson(res, 200, { silencedUntil: new Date(silencedUntil).toISOString() });
    },
  },
  {
    method: '*',
    pattern: /^\/_fake\/fail$/,
    handler: (_req, res, url) => {
      const rawStatus = url.searchParams.get('status') ?? '500';
      const status = rawStatus === 'hang' ? 'hang' : Number(rawStatus);
      const count = parseNumber(url.searchParams.get('count')) ?? 1;
      if (count > 0) {
        pendingFailures.push({ status, count });
      }
      log('control', `next ${count} stream request(s) will fail with ${status}`);
      sendJson(res, 200, { pendingFailures });
    },
  },
];

function takePendingFailure() {
  const failure = pendingFailures[0];
  if (failure == null) {
    return null;
  }
  failure.count--;
  if (failure.count <= 0) {
    pendingFailures.shift();
  }
  return failure.status;
}

function dropStreams() {
  const count = logsResponses.size;
  log('control', `drop ${count} stream socket(s)`);
  logsResponses.forEach((res) => res.socket?.destroy());
  return count;
}

// -- HTTP helpers ------

/**
 * @param {http.ServerResponse} res
 * @param {number} status
 * @param {any} body
 */
function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

/**
 * @param {http.ServerResponse} res
 */
function sendNotFound(res) {
  sendJson(res, 404, { id: 4004, message: 'Not Found', type: 'error' });
}

/**
 * @param {string|null} value
 * @return {number|null}
 */
function parseDate(value) {
  if (value == null || value === '') {
    return null;
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

/**
 * @param {string|null} value
 * @return {number|null}
 */
function parseNumber(value) {
  if (value == null || value === '') {
    return null;
  }
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

/**
 * @param {number|null} time
 */
function formatDate(time) {
  return time == null ? '-' : new Date(time).toISOString();
}

/**
 * @param {number} n
 */
function formatCounter(n) {
  return String(n).padStart(12, '0');
}

/**
 * @param {string} scope
 * @param {...string} parts
 */
function log(scope, ...parts) {
  console.log(`${new Date().toISOString()} [${scope}] ${parts.join(' ')}`);
}

// -- Initial data ------

// A legacy deployment makes the component fall back to the v2 API.
scheduleDeployment({ startDate: STARTED_AT - 26 * HOUR, buildDuration: 2 * MINUTE, instanceCount: 1, legacy: true });
scheduleDeployment({ startDate: STARTED_AT - 3 * HOUR, buildDuration: 3 * MINUTE });
scheduleDeployment({ startDate: STARTED_AT - 2 * HOUR, buildDuration: 90 * SECOND, result: 'FAILED' });
scheduleDeployment({ startDate: STARTED_AT - HOUR, buildDuration: 3 * MINUTE });

// -- Server ------

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // The component sends OAuth and Last-Event-ID headers, so every request is preflighted.
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] ?? '*',
      'Access-Control-Max-Age': '600',
    });
    res.end();
    return;
  }

  for (const { method, pattern, handler } of ROUTES) {
    const match = pattern.exec(url.pathname);
    if (match != null && (method === '*' || method === req.method)) {
      handler(req, res, url, ...match.slice(1).map((id) => (id == null ? id : decodeURIComponent(id))));
      return;
    }
  }

  log('http', `404 ${req.method} ${url.pathname}`);
  sendNotFound(res);
});

if (DROP_EVERY > 0) {
  setInterval(dropStreams, DROP_EVERY);
}

server.listen(PORT, () => {
  console.log(`Fake logs API listening on http://localhost:${PORT} (one log per instance every ${PERIOD}ms)`);
  console.log(`Start Storybook with: API_HOST=http://localhost:${PORT} pnpm storybook:dev`);
  console.log(`Then open: http://localhost:6006/sandbox/?component=cc-logs-app-runtime`);
  console.log(`Deployments: http://localhost:${PORT}/_fake[/deploy?result=&queue=&build=&instances=|/cancel]`);
  console.log(`Stream failures: http://localhost:${PORT}/_fake[/drop|/close|/silence?ms=|/fail?status=&count=]`);
});
