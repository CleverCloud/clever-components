/* eslint-disable camelcase */
import './cc-logs-poc.js';
import '../cc-smart-container/cc-smart-container.js';
import {
  getAllDeployments,
  getAllInstances,
  getDeployment,
  getInstance,
} from '@clevercloud/client/esm/api/v2/application.js';
import { getOldLogs } from '@clevercloud/client/esm/api/v2/log.js';
import { LogsStream } from '@clevercloud/client/esm/streams/logs.browser.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { objectEquals } from '../../lib/utils.js';

defineSmartComponent({
  selector: 'cc-logs-poc',
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
      return {
        raw: log,
        id: log.id || Math.random().toString(36).slice(2),
        timestamp: log['@timestamp'],
        level: log.syslog_severity,
        message: log.message,
        instance: await getInstance(log.host),
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
          console.error('Error while subscribing to liv logs', error);
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

function mockApi ({ apiConfig, ownerId, sourceId }) {
  return {
    openLogsStream (deploymentId, instanceId, { onLog, onError }) {
      const evtSource = new EventSource('/logs-sse-mock?rate=100&limit=1000');
      evtSource.onmessage = function (e) {
        const log = {
          message: '[GET]',
          '@version': '1',
          '@timestamp': '2022-10-21T15:45:08.587Z',
          host: 'ed19fdef-fd7f-4da2-8aa5-330c5822c8d2',
          type: 'syslog',
          tags: ['tcp', 'syslog', 'customers'],
          syslog_pri: '30',
          syslog_program: 'deploy-node.sh',
          syslog_severity_code: 6,
          syslog_facility_code: 3,
          syslog_facility: 'daemon',
          syslog_severity: 'informational',
          appId: 'app_3af80970-d8bf-47ab-af5c-e56fb6c481f4',
          deploymentId: 'deployment_e9e065ef-c2f6-4553-a1ef-45dac03d11c1',
          '@source': '185.42.117.43',
          '@source_host': 'ed19fdef-fd7f-4da2-8aa5-330c5822c8d2',
          '@message': '[GET]',
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
        limit: 2000,
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
      // TODO: take care, there is limit of 100!
      return getAllDeployments({ id: ownerId, appId: sourceId, limit: 100 })
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
