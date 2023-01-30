/* eslint-disable camelcase */
import './cc-logs-simple.js';
import '../cc-smart-container/cc-smart-container.js';
import {
  getAllDeployments,
  getAllInstances,
  getDeployment,
  getInstance,
} from '@clevercloud/client/esm/api/v2/application.js';
import { getOldLogs } from '@clevercloud/client/esm/api/v2/log.js';
import { LogsStream } from '@clevercloud/client/esm/streams/logs.browser.js';
import { random, randomCommit, randomPick, randomString } from '../../../logs/utils/utils.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { objectEquals } from '../../lib/utils.js';

defineSmartComponent({
  selector: 'cc-logs-simple',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    sourceType: { type: String },
    sourceId: { type: String },
  },
  onContextUpdate ({ container, component, context, onEvent, updateComponent, signal }) {
    console.log(context);
    const { apiConfig, ownerId, sourceId, sourceType } = context;
    const deploymentId = null;
    const instanceId = null;

    const api = getApi({ apiConfig, ownerId, sourceId });

    const deploymentsMap = new Map();
    const instancesMap = new Map();

    const convertDeployment = (rawDeployment) => {
      return {
        raw: rawDeployment,
        unknown: false,
        id: rawDeployment.uuid,
        commit: rawDeployment.commit,
        date: new Date(rawDeployment.date),
        successful: rawDeployment.state === 'OK',
        action: rawDeployment.action,
      };
    };

    const fetchDeployment = async (id) => {
      try {
        return convertDeployment(await api.getDeployment(id));
      }
      catch (e) {
        console.error(`error while fetching deployment ${id}`);
        return {
          unknown: true,
          id: id,
        };
      }
    };

    const getDeployment = async (id) => {
      if (deploymentsMap.has(id)) {
        return deploymentsMap.get(id);
      }

      const deployment = await fetchDeployment(id);

      deploymentsMap.set(id, deployment);
      return deployment;
    };

    const convertInstance = (rawInstance, deployment) => {
      // this is a horrible heuristic to know if the instance is a build instance.
      let build = false;
      if (rawInstance.instanceNumber === 0) {
        if (Array.from(instancesMap.values()).find((i) => {
          return i.id !== rawInstance.id
            && i.raw != null
            && i.raw.instanceNumber === 0
            && i.raw.deployId === rawInstance.deployId
            && i.raw.creationDate > rawInstance.creationDate;
        }) != null) {
          build = true;
        }
      }

      return {
        raw: rawInstance,
        unknown: false,
        id: rawInstance.id,
        deployment: deployment,
        displayName: rawInstance.displayName,
        index: rawInstance.instanceNumber + 1,
        creationDate: new Date(rawInstance.creationDate),
        commit: rawInstance.commit,
        state: rawInstance.state,
        build: build,
      };
    };

    const fetchInstance = async (id) => {
      try {
        const instance = await api.getInstance(id);
        return convertInstance(instance, await getDeployment(instance.deployId));
      }
      catch (e) {
        console.error(`Error while fetching instance ${id}`, e);
        return {
          unknown: true,
          id: id,
          displayName: id,
        };
      }
    };

    const getInstance = async (id) => {
      if (instancesMap.has(id)) {
        return instancesMap.get(id);
      }

      const instance = await fetchInstance(id);

      instancesMap.set(id, instance);
      return instance;
    };

    const convertLog = async (log) => {
      const timestamp = log['@timestamp'];
      const id = log.id || (`${timestamp}${Math.random().toString(36).slice(2)}`);
      const instance = await getInstance(log.host);

      return {
        id,
        timestamp,
        message: log.message,
        metadata: {
          instanceId: instance.id,
          instanceState: instance.state,
          // deploymentId: log.deploymentId,
          level: log.syslog_severity,
        },
      };
    };

    let unsubscribeToLiveLogs;
    const subscribeToLiveLogs = async () => {
      unsubscribeToLiveLogs = api.openLogsStream(deploymentId, instanceId, {
        async onLog (log) {
          console.debug('live log', log);
          component.addLog(await convertLog(log));
        },
        onError (error) {
          console.error('Error while subscribing to live logs', error);
        },
      });
    };

    const fetchLogs = (liveMode = true, coldMode = false) => {
      if (liveMode && !coldMode) {
        subscribeToLiveLogs().then();
      }

      if (coldMode) {
        api.fetchOldLogs()
          .then((logs) => {
            console.debug('cold logs', logs);

            logs.reverse().map((log) => log._source)
              .forEach(async (log) => {
                component.addLog(await convertLog(log));
              });

            if (liveMode) {
              subscribeToLiveLogs().then();
            }
          })
          .catch((error) => {
            console.error('Error while fetching cold logs', error);
          });
      }
    };

    const refreshComponentInstances = (instances) => {
      component.instances = Array.from(instancesMap.values())
        .sort((l1, l2) => l2.creationDate.getTime() - l1.creationDate.getTime());
    };

    // this function refresh all the instances, including new instances!
    // this function may be useful for cold mode
    const refreshInstances = async () => {
      try {
        const deployments = await api.getDeployments();
        console.debug('deployments', deployments);

        deployments
          .filter((deployment) => deployment.action === 'UPSCALE' || deployment.action === 'DEPLOY')
          .forEach((deployment) => {
            deploymentsMap.set(deployment.uuid, convertDeployment(deployment));
          });

        const instances = await api.getInstances(deployments);
        console.debug('instances', instances);

        instances.forEach((instance) => {
          instancesMap.set(instance.id, convertInstance(instance, deploymentsMap.get(instance.deployId)));
        });

        refreshComponentInstances();
      }
      catch (error) {
        console.error('Error while refreshing instances', error);
      }
    };

    // this function refreshed the instances that have been already fetched (it never adds nor remove an instance)
    // it doesn't try to refresh deleted instance (which is a terminal state)
    // this function is useful for live mode
    const refreshCurrentInstances = async () => {
      console.info('refreshing current instances');
      Array.from(instancesMap.keys())
        .filter((instance) => instance.state !== 'DELETED')
        .forEach((id) => {
          fetchInstance(id)
            .then((instance) => {
              if (!objectEquals(instance.raw, instancesMap.get(id).raw)) {
                instancesMap.set(id, instance);
                refreshComponentInstances();
                // setInstances([
                //   ...component.instances.filter((i) => i.id !== id),
                //   instance,
                // ]);
              }
            })
            .catch((e) => {
              console.error(`error while refreshing instance ${id}`, e);
            })
          ;
        });
    };

    refreshInstances().then(() => {
      fetchLogs(true, true);
    });
    // fetchLogs(true, true);

    setInterval(() => {
      refreshCurrentInstances().then();
    }, 5000);

    // // this is a build instance
    // getInstance('6070cf7b-8303-4e11-ae7f-777a52d93156').then((instance) => {
    //   console.log('INSTANCE!!', instance);
    // });

    onEvent('disconnected', () => {
      console.log('close logs stream');
      unsubscribeToLiveLogs?.();
    });
  },
});

// --- API --------
const mock = false;

let _api;

function getApi ({ apiConfig, ownerId, sourceId }) {
  if (_api == null) {
    _api = mock
      ? mockApi({ apiConfig, ownerId, sourceId })
      : realApi({ apiConfig, ownerId, sourceId });
  }
  return _api;
}

const OLD_LOGS_COUNT = 2000;
const DEPLOYMENTS_COUNT = 100;

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
          syslog_pri: '30',
          syslog_program: 'deploy-node.sh',
          syslog_severity_code: 6,
          syslog_facility_code: 3,
          syslog_facility: 'daemon',
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
    getInstances (deployments) {
      return Promise.resolve(deployments.flatMap((d) => d.$instances));
    },
    getInstance (instanceId) {
      return Promise.resolve(instancesMap[instanceId]);
    },
  };
}

function realApi ({ apiConfig, ownerId, sourceId }) {
  return {
    openLogsStream (deploymentId, instanceId, { onLog, onError }) {
      const logsStream = new LogsStream({
        apiHost: apiConfig.API_HOST,
        tokens: apiConfig,
        appId: sourceId,
        deploymentId,
      });
      logsStream.on('log', (e) => onLog(e._source));
      logsStream.on('error', (error) => onError(error));
      logsStream.open({ autoRetry: true });
      return () => logsStream.close();
    },
    fetchOldLogs (deploymentId, instanceId) {
      return getOldLogs({
        appId: sourceId,
        // deployment_id: deploymentId,
        limit: OLD_LOGS_COUNT,
        // since,
        // before,
      })
        .then(sendToApi({ apiConfig }));
    },
    getDeployment (deploymentId) {
      return getDeployment({ id: ownerId, appId: sourceId, deploymentId })
        .then(sendToApi({ apiConfig }));
    },
    getDeployments () {
      return getAllDeployments({ id: ownerId, appId: sourceId, limit: DEPLOYMENTS_COUNT })
        .then(sendToApi({ apiConfig }));
    },
    getInstances (deployments) {
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
