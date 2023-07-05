import {
  getAllDeployments,
  getAllInstances,
  getDeployment,
  getInstance,
} from '@clevercloud/client/esm/api/v2/application.js';
// import { getOldLogs } from '@clevercloud/client/esm/api/v2/log.js';
import { LogsStream } from '@clevercloud/client/esm/streams/logs.browser.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { objectEquals } from '../../lib/utils.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-logs-view.js';

const OLD_LOGS_COUNT = 2000;
const DEPLOYMENTS_COUNT = 100;
const INSTANCES_REFRESH_RATE = 2000;
let _api;
const mock = false;

let instancesManager;
let api;

defineSmartComponent({
  selector: 'cc-logs-view',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    sourceId: { type: String },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {
    updateComponent('state', { type: 'loadingInstances' });
    const { apiConfig, ownerId, sourceId } = context;

    api = getApi({ apiConfig, ownerId, sourceId });
    instancesManager = new InstancesManager(api, (instances) => {
      updateComponent('state', { type: component.state.type, instances });
    });

    const appendLogs = (logs) => {
      return Promise.all(logs.map((l) => convertLog(l, api, instancesManager)))
        .then((logs) => {
          component.appendLogs(logs);
        });
    };

    const buffer = new Buffer({
      onFlush: (logs) => {
        appendLogs(logs).then();
      },
    });

    const streamLogs = (since, until, instances) => {
      return api.openLogsStream({ since, until, instances }, {
        onLog: (log) => {
          buffer.add(log);
        },
        onError: (e) => {
          console.error(e);
        },
        onFinish: (e) => {
          updateComponent('state', { type: 'loaded', instances: component.state.instances });
        },
      });
    };

    const refresh = (dateRange, selectedInstances) => {
      buffer.clear();
      instancesManager.enabledAutoRefresh(false);
      instancesManager.clear();

      const isLive = dateRange.type === 'live';

      return instancesManager.fetchInitialInstances(dateRange.since, dateRange.until)
        .then((instances) => {
          updateComponent('state', { type: 'connectingLogs', instances });

          instancesManager.enabledAutoRefresh(isLive);

          streamLogs(dateRange.since, dateRange.until, isLive ? null : selectedInstances);
        })
        .then(() => {
          updateComponent('state', { type: isLive ? 'loaded' : 'loadingLogs', instances: component.state.instances });
        })
      ;
    };

    refresh(component.dateRange, component.selectedInstances);

    onEvent('cc-logs-view:dateRangeChanged', (range) => {
      updateComponent('state', { type: 'loadingInstances' });

      buffer.clear();
      api.closeLogsStream();

      refresh(range, component.selectedInstances);
    });

    onEvent('cc-logs-view:instancesSelectionChanged', (selectedInstances) => {
      const dateRange = component.dateRange;

      if (dateRange.type === 'cold') {
        updateComponent('state', { type: 'connectingLogs', instances: component.state.instances });

        buffer.clear();
        api.closeLogsStream();

        streamLogs(dateRange.since, dateRange.until, selectedInstances)
          .then(() => updateComponent('state', { type: 'loadingLogs', instances: component.state.instances }));
      }
    });
  },
  onDisconnect () {
    api.closeLogsStream();
    instancesManager?.close();
  },
});

async function convertLog (l, api, instanceManager) {
  const log = l._source;

  const instance = await instanceManager.getInstance(log.host);
  const timestamp = log['@timestamp'];
  const id = `${timestamp}${randomString(12)}`;
  const severity = log.syslog_severity;

  let logLevel = 'INFO';
  if (severity === 'informational') {
    logLevel = 'INFO';
  }
  else if (severity === 'debug') {
    logLevel = 'DEBUG';
  }
  else if (severity === 'warning') {
    logLevel = 'WARN';
  }
  else {
    logLevel = 'ERROR';
  }

  return {
    id,
    timestamp: new Date(timestamp).getTime(),
    message: log.message,
    metadata: [
      {
        name: 'instance',
        value: instance.displayName,
      },
      {
        name: 'instanceId',
        value: instance.id,
      },
      {
        name: 'instanceNumber',
        value: instance.instanceNumber,
      },
      {
        name: 'level',
        value: logLevel,
      },
    ],
  };
}

class InstancesManager {
  constructor (api, onChange) {
    this._api = api;
    this._instancesMap = new Map();
    this._onChange = onChange;
    this._deploymentsManager = new DeploymentsManager(api);
  }

  async fetchInitialInstances (since, until) {
    const rawInstances = await this._api.getInstances(since, until);
    const instances = [];
    for (const rawInstance of rawInstances) {
      const instance = await this._convert(rawInstance);
      instances.push(instance);
      this._instancesMap.set(instance.id, instance);
    }
    return instances;
  }

  async getInstance (id) {
    if (this._instancesMap.has(id)) {
      return this._instancesMap.get(id);
    }
    const instance = await this._fetch(id);
    this._instancesMap.set(id, instance);
    this._fireChanged();
    return instance;
  }

  close () {
    this._stopRefresher();
  }

  clear () {
    this._instancesMap.clear();
  }

  enabledAutoRefresh (enable) {
    if (enable && this._refresher == null) {
      this._startRefresher();
    }
    else if (!enable && this._refresher != null) {
      this._stopRefresher();
    }
  }

  _startRefresher () {
    this._refresher = setInterval(() => {
      const instancesToRefresh = Array.from(this._instancesMap.values())
        .filter((instance) => instance.deployState !== 'OK' || instance.state !== 'DELETED');

      Promise.all(instancesToRefresh.map((instance) => this._fetch(instance.id)))
        .then((newInstances) => {
          if (newInstances.some((instance) => !objectEquals(instance, this._instancesMap.get(instance.id)))) {
            this._index(newInstances, this._instancesMap);
            this._fireChanged();
          }
        });
    }, INSTANCES_REFRESH_RATE);
  }

  _stopRefresher () {
    clearInterval(this._refresher);
    this._refresher = null;
  }

  async _fetch (id) {
    return this._convert(await this._api.getInstance(id));
  }

  async _convert (raw) {
    let deployment;
    if (raw.deployId == null) {
      console.error(`deployId is null! Could not get deployment for instance ${raw.id}.`);
    }
    else {
      deployment = await this._deploymentsManager.getDeployment(raw.deployId);
    }
    return {
      id: raw.id,
      displayName: raw.displayName,
      commit: raw.commit.substring(0, 7),
      state: raw.state,
      flavor: raw.flavor.name,
      instanceNumber: raw.instanceNumber,
      creationDate: raw.creationDate,
      deployId: raw.deployId,
      deployState: deployment != null ? deployment.state : '?',
      deployAction: deployment != null ? deployment.action : '?',
      deployCause: deployment != null ? deployment.cause : '?',
      deployDate: deployment != null ? deployment.date : 0,
    };
  }

  _index (instances, map) {
    instances.forEach((instance) => {
      map.set(instance.id, instance);
    });
    return map;
  }

  _fireChanged () {
    this._onChange(Array.from(this._instancesMap.values()));
  }
}

class DeploymentsManager {
  constructor (api) {
    this._api = api;
    this._deploymentsMap = new Map();
  }

  async getDeployment (id) {
    let deployment = this._deploymentsMap.get(id);
    if (deployment == null || deployment.state === 'WIP') {
      deployment = await this._fetchDeployment(id);
      this._deploymentsMap.set(id, deployment);
    }
    return deployment;
  }

  async _fetchDeployment (id) {
    return this._convert(await this._api.getDeployment(id));
  }

  _convert (raw) {
    return {
      id: raw.uuid,
      date: raw.date,
      state: raw.state,
      action: raw.action,
      cause: raw.cause,
    };
  }
}

// -- API calls
// --- API --------

function getApi ({ apiConfig, ownerId, sourceId }) {
  if (_api == null) {
    _api = mock
      ? mockApi({ apiConfig, ownerId, sourceId })
      : realApi({ apiConfig, ownerId, sourceId });
  }
  return _api;
}

function realApi ({ apiConfig, ownerId, sourceId }) {
  let logsStream;

  return {
    openLogsStream ({ since, until, instanceIds }, { onLog, onError, onFinish }) {
      if (logsStream != null) {
        console.warn('Logs stream already open');
        return;
      }

      const u = until != null ? new Date(until).getTime() : null;

      logsStream = new LogsStream({
        apiHost: apiConfig.API_HOST,
        tokens: apiConfig,
        appId: sourceId,
        since: since != null ? new Date(since).toISOString() : null,
        // until: until != null ? new Date(until).toISOString() : null,
      });

      logsStream.on('log', (e) => {
        // todo : implement on finish with v4 API impl
        if (u == null) {
          onLog(e);
        }
        else {
          const timestamp = new Date(e._source['@timestamp']).getTime();
          if (u > timestamp) {
            logsStream.close();
            logsStream = null;
            onFinish();
          }
        }
      });
      logsStream.on('error', (error) => onError(error));
      logsStream.open({ autoRetry: true });
    },
    closeLogsStream () {
      if (logsStream == null) {
        return;
      }
      logsStream.close();
      logsStream = null;
    },
    getDeployment (deploymentId) {
      return getDeployment({ id: ownerId, appId: sourceId, deploymentId })
        .then(sendToApi({ apiConfig }));
    },
    getDeployments () {
      return getAllDeployments({ id: ownerId, appId: sourceId, limit: DEPLOYMENTS_COUNT })
        .then(sendToApi({ apiConfig }));
    },
    getInstances (since, until) {
      // TODO: write the real impl
      return getAllDeployments({ id: ownerId, appId: sourceId, limit: 3 })
        .then(sendToApi({ apiConfig }))
        .then((deployments) => {
          return Promise.all(
            deployments.map((deployment) =>
              getAllInstances({ id: ownerId, appId: sourceId, deploymentId: deployment.uuid, withDeleted: true })
                .then(sendToApi({ apiConfig }))),
          );
        })
        .then((arraysOfInstances) => {
          return arraysOfInstances.flat();
        });
    },
    getInstancesForDeployments (deployments) {
      return Promise.all(
        deployments.map((deployment) =>
          getAllInstances({ id: ownerId, appId: sourceId, deploymentId: deployment.uuid, withDeleted: true })
            .then(sendToApi({ apiConfig }))),
      )
        .then((arraysOfInstances) => {
          return arraysOfInstances.flat();
        });
    },
    getInstance (instanceId) {
      return getInstance({ id: ownerId, appId: sourceId, instanceId })
        .then(sendToApi({ apiConfig }));
    },
  };
}

function mockApi ({ apiConfig, ownerId, sourceId }) {
  let deployNumber = 0;

  const instancesMap = {};
  const runningInstances = [];
  const now = new Date().getTime();
  const deploymentsMap = Object.fromEntries(Array(DEPLOYMENTS_COUNT).fill(0).map((_, i) => {
    const state = i < DEPLOYMENTS_COUNT - 1 ? 'DELETED' : 'UP';
    const date = now - (DEPLOYMENTS_COUNT - i) * 3600000;

    const deployId = `deployment_${randomString()}`;
    const commit = randomCommit();
    deployNumber++;

    const instances = Array(random(1, 3)).fill(0).map((_, i) => {
      const instance = {
        id: randomString(),
        appId: sourceId,
        ip: `46.252.181.${random(0, 254)}`,
        appPort: random(11000, 12000),
        state: state,
        flavor: {
          name: 'nano',
          mem: 512,
          cpus: 1,
          price: 0.1431844215,
        },
        commit: commit,
        deployNumber: deployNumber,
        deployId: deployId,
        instanceNumber: i,
        displayName: `${randomString(5)} ${randomString(5)}`,
        creationDate: date,
      };
      instancesMap[instance.id] = instance;

      if (state === 'UP') {
        runningInstances.push(instance);
      }

      return instance;
    });

    return [deployNumber, {
      uuid: deployId,
      id: deployNumber,
      date: date,
      state: 'OK',
      action: 'DEPLOY',
      commit: commit,
      cause: 'Console',
      instances: instances.length,
      $instances: instances,

    }];
  }));

  return {
    openLogsStream (deploymentId, instanceId, { onLog, onError }) {
      const evtSource = new EventSource('/logs-sse-mock?rate=100&limit=1000');
      const instance = randomPick(runningInstances);

      evtSource.onmessage = function (e) {
        const log = {
          message: randomString(random(15, 100)),
          '@timestamp': new Date().toISOString(),
          host: instance.id,
          type: 'syslog',
          tags: ['tcp', 'syslog', 'customers'],
          // eslint-disable-next-line camelcase
          syslog_pri: '30',
          // eslint-disable-next-line camelcase
          syslog_program: 'deploy-node.sh',
          // eslint-disable-next-line camelcase
          syslog_severity_code: 6,
          // eslint-disable-next-line camelcase
          syslog_facility_code: 3,
          // eslint-disable-next-line camelcase
          syslog_facility: 'daemon',
          // eslint-disable-next-line camelcase
          syslog_severity: 'informational',
          appId: sourceId,
          deploymentId: instance.deployId,
          zone: 'par',
        };
        onLog(log);
      };
      evtSource.onerror = function (e) {
        onError('error', e);
        evtSource.close();
      };

      return () => evtSource.close();
    },
    fetchOldLogs (deploymentId, instanceId) {
      return Promise.resolve(Array(OLD_LOGS_COUNT).fill(0).map(() => {
        const instance = randomPick(runningInstances);

        return {
          message: randomString(random(15, 100)),
          '@timestamp': new Date().toISOString(),
          host: instance.id,
          // eslint-disable-next-line camelcase
          syslog_severity: 'informational',
          deploymentId: instance.deployId,
          appId: sourceId,
          zone: 'par',
        };
      }));
    },
    getDeployment (deploymentId) {
      return Promise.resolve(deploymentsMap[deploymentId]);
    },
    getDeployments () {
      return Promise.resolve(Object.values(deploymentsMap));
    },
    getInstancesForDeployments (deployments) {
      return Promise.resolve(deployments.flatMap((d) => d.$instances));
    },
    getInstance (instanceId) {
      return Promise.resolve(instancesMap[instanceId]);
    },
  };
}

// --- UTILS --------

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomCommit () {
  return randomString(8, 'abcdef0123456789');
}

function randomString (length = 8, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = '';
  const charactersLength = alphabet.length;
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomPick (array) {
  if (array.length === 0) {
    return null;
  }
  return array[random(0, array.length - 1)];
}

class Buffer {
  constructor ({ onFlush, timeout, length }) {
    this.onFlush = onFlush;
    this.bucket = [];
    this.timeout = timeout ?? 1000;
    this.length = length ?? 30;
    this.timeoutId = null;

    this._flusher = () => {
      this.flush();
    };
  }

  add (item) {
    if (this.timeoutId == null) {
      this.timeoutId = setTimeout(this._flusher, this.timeout);
    }
    this.bucket.push(item);
    if (this.bucket.length === this.length) {
      this.flush();
    }
  }

  flush () {
    const toFlush = [...this.bucket];
    this.clear();
    this.onFlush(toFlush);
  }

  clear () {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.bucket = [];
  }
}
