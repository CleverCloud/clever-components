import { getAllInstances, getDeployment } from '@clevercloud/client/esm/api/v2/application.js';
import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
import { ApplicationLogStream } from '@clevercloud/client/esm/streams/application-logs.js';
import { HttpError } from '@clevercloud/client/esm/streams/clever-cloud-sse.js';
import { Buffer } from '../../lib/buffer.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-logs-application-view.js';
import { unique } from '../../lib/utils.js';
import { isLive } from './date-range.js';

/**
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').Instance} Instance
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').GhostInstance} GhostInstance
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').Deployment} Deployment
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewState} LogsApplicationViewState
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewStateLogs} LogsApplicationViewStateLogs
 * @typedef {import('./cc-logs-application-view.types.js').DateRange} DateRange
 * @typedef {import('./cc-logs-application-view.js').CcLogsApplicationView} CcLogsApplicationView
 */

/**
 * @typedef {Object} View
 * @property {CcLogsApplicationView} component
 * @property {(propertyName: string, newProperty: any|((property:any) => void)) => void} update
 * @property {(state: LogsApplicationViewState|((state: LogsApplicationViewState) => void)) => void} updateState
 */

/**
 * @typedef {Object} ApplicationRef
 * @property {string} ownerId
 * @property {string} applicationId
 */

/**
 * @typedef {Object} LogsStreamParams
 * @property {ApplicationRef} applicationRef
 * @property {string} since
 * @property {string} until
 * @property {Array<string>} instances
 */

/**
 * @typedef {Object} LogsStreamCallbacks
 * @property {() => void} onOpen
 * @property {(log: Object) => void} onLog
 * @property {(error: Error) => void} onFatalError
 * @property {(error: Error) => void} onError
 * @property {(reason: string) => void} onFinish
 */

const INSTANCES_REFRESH_RATE = 2000;
const LOGS_BUFFER_TIMEOUT = 1000;
const LOGS_BUFFER_LENGTH = 10;
const LOGS_THROTTLE_ELEMENTS = 1000;
const LOGS_THROTTLE_PER_IN_MILLIS = 10;

/**
 * @type {LogsApplicationViewSmartController}
 */
let controller = null;

defineSmartComponent({
  selector: 'cc-logs-application-view-beta',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    deploymentId: { type: String, optional: true },
  },
  /**
   * @param {Object} args
   * @param {CcLogsApplicationView} args.component
   * @param {Object} args.context
   * @param {any} args.onEvent
   * @param {any} args.updateComponent
   * @param {AbortSignal} args.signal
   */
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {
    signal.onabort = () => {
      controller?.stopAndClear();
    };

    controller?.stopAndClear();

    component.overflowWatermarkOffset = LOGS_THROTTLE_PER_IN_MILLIS;

    const { apiConfig, ownerId, appId, deploymentId } = context;

    controller = new LogsApplicationViewSmartController(
      apiConfig,
      { ownerId, applicationId: appId },
      {
        component,
        update: updateComponent,
        updateState: (arg) => updateComponent('state', arg),
      });

    onEvent('cc-logs-application-view:date-range-change',
      /** @param {DateRange} range */
      (range) => {
        controller.setNewDateRange(range);
      });

    onEvent('cc-logs-instances:selection-change',
      /** @param {Array<string>} instances */
      (instances) => {
        controller.setNewInstanceSelection(instances);
      });

    onEvent('cc-logs-application-view:pause',
      () => {
        controller.pause();
      });

    onEvent('cc-logs-application-view:resume',
      () => {
        controller.resume();
      });

    if (deploymentId != null) {
      controller.initByDeploymentId(deploymentId);
    }
    else {
      controller.init(component.getDateRange(), []);
    }
  },
});

class LogsApplicationViewSmartController {
  /**
   *
   * @param {Object} apiConfig
   * @param {ApplicationRef} applicationRef
   * @param {View} view
   */
  constructor (apiConfig, applicationRef, view) {
    this._apiConfig = apiConfig;
    this._applicationRef = applicationRef;
    this._view = view;
    this._logsBuffer = new Buffer(
      this._onLogsBufferFlush.bind(this),
      { timeout: LOGS_BUFFER_TIMEOUT, length: LOGS_BUFFER_LENGTH },
    );
    this._instancesManager = new InstancesManager(
      new Api(apiConfig, applicationRef),
      this._onInstancesChanged.bind(this),
    );

    /** @type {Array<string>} */
    this._selection = [];
    /** @type {DateRange} */
    this._dateRange = null;
  }

  openLogsStream () {
    this._view.updateState({
      type: 'connectingLogs',
      instances: this._instancesManager.getInstances(),
      selection: this._selection,
    });

    this._stopAndClearLogs();

    this._logsStream = new LogsStream(this._apiConfig, {
      applicationRef: this._applicationRef,
      since: this._dateRange.since,
      until: this._dateRange.until,
      instances: this._selection,
    }, {
      onOpen: () => {
        this._view.updateState((state) => {
          state.type = 'receivingLogs';
        });
      },
      onLog: async (log) => {
        this._logsBuffer.add(await this._convertLog(log));
      },
      onFatalError: (e) => {
        console.error(e);

        if (e instanceof HttpError) {
          if (e.status === 404) {
            this._view.updateState({ type: 'logStreamEnded', instances: this._instancesManager.getInstances(), selection: this._selection });

            return;
          }
        }
        this._view.updateState((state) => {
          state.type = 'errorLogs';
        });
      },
      onError: (e) => {
        console.error(e);
        // TODO: tell the component about the instability
      },
      onFinish: async (reason) => {
        await this._logsBuffer.flush();
        this._view.updateState({ type: 'logStreamEnded', instances: this._instancesManager.getInstances(), selection: this._selection });
      },
    });

    this._logsStream.open();
  }

  /**
   * @param {DateRange} dateRange
   * @param {Array<string>} selection
   * @return {void}
   */
  init (dateRange, selection) {
    this._selection = selection;
    this.setNewDateRange(dateRange);
  }

  /**
   *
   * @param {string} deploymentId
   */
  initByDeploymentId (deploymentId) {
    // todo: what should we do if deploymentId doesn't exist?

    // clear and close everything
    this.stopAndClear();

    this._instancesManager.fetchInstancesByDeployment(deploymentId)
      .then((instances) => {
        // todo: when instances is empty
        if (instances.length === 0) {
          this._view.updateState({ type: 'logStreamEnded', instances: [], selection: [] });
          return;
        }

        this._selection = instances.map((instance) => instance.id);

        const deployment = instances[0].deployment;

        // cold
        if (deployment.endDate != null) {
          this._dateRange = {
            since: deployment.creationDate.toISOString(),
            until: deployment.endDate.toISOString(),
          };

          this._view.component.dateRangeSelection = {
            type: 'custom',
            since: this._dateRange.since,
            until: this._dateRange.until,
          };
        }
        else {
          this._dateRange = {
            since: deployment.creationDate.toISOString(),
          };

          this._view.component.dateRangeSelection = {
            type: 'live',
          };
        }

        // enable instance auto-refresh only for live mode
        this._instancesManager.enabledAutoRefresh(isLive(this._dateRange));

        // open the logs stream
        this.openLogsStream();
      })
      .catch((e) => {
        console.error(e);
        this._view.updateState({ type: 'errorInstances' });
      });

  }

  /**
   * @param {DateRange} dateRange
   */
  setNewDateRange (dateRange) {
    // clear and close everything
    this.stopAndClear();

    // store the new date range
    this._dateRange = dateRange;

    this._instancesManager.fetchInstances(this._dateRange.since, this._dateRange.until)
      .then((instances) => {

        if (instances.length === 0) {
          this._view.updateState({ type: 'logStreamEnded', instances: [], selection: [] });
          return;
        }

        // enable instance auto-refresh only for live mode
        this._instancesManager.enabledAutoRefresh(isLive(this._dateRange));

        // adapt the instances selection according to the new set of instances
        this._selection = this._selection.filter((id) => this._instancesManager.hasInstance(id));

        // open the logs stream
        this.openLogsStream();
      })
      .catch((e) => {
        console.error(e);
        this._view.updateState({ type: 'errorInstances' });
      });
  }

  /**
   * @param {Array<string>} selection
   */
  setNewInstanceSelection (selection) {
    // store the new selection
    this._selection = selection;

    // we need to open a new logs stream only for cold mode.
    if (isLive(this._dateRange)) {
      // in live mode, the instance filtering is done in memory with the logs component.
      this._view.updateState(
        /**
         *
         * @param {LogsApplicationViewStateLogs} state
         */
        (state) => {
          state.selection = selection;
        });
    }
    else {
      this.openLogsStream();
    }
  }

  stopAndClear () {
    this._stopAndClearLogs();
    this._stopAndClearInstances();
  }

  pause () {
    this._logsStream?.pause();
    this._view.updateState((state) => {
      state.type = 'logStreamPaused';
    });
  }

  resume () {
    this._logsStream?.resume();
    this._view.updateState((state) => {
      state.type = 'receivingLogs';
    });
  }

  _stopAndClearLogs () {
    this._logsStream?.close();
    this._logsBuffer.clear();
    this._view.component.clear();
  }

  _stopAndClearInstances () {
    this._instancesManager?.close();
    this._instancesManager?.clear();
    this._view.updateState({ type: 'loadingInstances' });
  }

  _onLogsBufferFlush (logs) {
    this._view.component.appendLogs(logs);
  }

  _onInstancesChanged (instances) {
    this._view.updateState((state) => {
      state.instances = instances;
    });
  }

  async _convertLog (log) {
    const instance = await this._instancesManager.getOrFetchInstance(log.instanceId);

    return {
      id: log.id,
      date: new Date(log.date),
      message: log.message,
      metadata: [
        {
          name: 'instance',
          value: instance.ghost ? '?' : instance.name,
        },
        {
          name: 'instanceId',
          value: instance.id,
        },
      ],
    };
  }
}

class InstancesManager {
  /**
   * @param {Api} api
   * @param {(instances: Array<Instance | GhostInstance>) => void} onChange
   */
  constructor (api, onChange) {
    this._api = api;
    /** @type {Map<string, Instance | GhostInstance>} */
    this._instancesMap = new Map();
    this._onChange = onChange;
    this._deploymentsManager = new DeploymentsManager(api);
  }

  /**
   * @param {string} id
   * @return {Promise<Instance | GhostInstance>}
   */
  async getOrFetchInstance (id) {
    if (this._instancesMap.has(id)) {
      return this._instancesMap.get(id);
    }
    const instance = await this._fetchAndConvert(id);
    this._instancesMap.set(id, instance);
    this._fireChanged();
    return instance;
  }

  /**
   * @param {string} since
   * @param {string} until
   * @return {Promise<Array<Instance | GhostInstance>>}
   */
  async fetchInstances (since, until) {
    // Fetch instances that have been alive between the given date range.
    const rawInstances = await this._api.fetchInstances(since, until);

    // Fetch all deployments in advance (in an optimized way) instead of letting the instance converter do it one by one
    await this._deploymentsManager.fetchOrRefreshDeployments(rawInstances.map((instance) => instance.deploymentId));

    // Convert instances
    const instances = await Promise.all(rawInstances.map((rawInstance) => this._convert(rawInstance)));

    // Index them in our map of instances
    index(instances, 'id', this._instancesMap);

    return instances;
  }

  /**
   * @param {string} deploymentId
   * @return {Promise<Array<Instance | GhostInstance>>}
   */
  async fetchInstancesByDeployment (deploymentId) {
    // Fetch instances that have been alive between the given date range.
    const rawInstances = await this._api.fetchInstancesByDeployment(deploymentId);

    // Fetch all deployments in advance (in an optimized way) instead of letting the instance converter do it one by one
    await this._deploymentsManager.fetchOrRefreshDeployments(rawInstances.map((instance) => instance.deploymentId));

    // Convert instances
    const instances = await Promise.all(rawInstances.map((rawInstance) => this._convert(rawInstance)));

    // Index them in our map of instances
    index(instances, 'id', this._instancesMap);

    return instances;
  }

  /**
   * @param {string} id
   * @return {boolean}
   */
  hasInstance (id) {
    return this._instancesMap.has(id);
  }

  /**
   * @return {Array<Instance | GhostInstance>}
   */
  getInstances () {
    return Array.from(this._instancesMap.values());
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
    this._refresher = setInterval(async () => {
      // Find all instances that needs to be refreshed: instances with non-final state or ghost instances
      const instancesToRefresh = Array.from(this._instancesMap.values())
        .filter((instance) => {
          return isGhostInstance(instance)
            || instance.deployment.state !== 'SUCCEEDED'
            || instance.state !== 'DELETED'
          ;
        });

      // Fetch all deployments in advance (in an optimized way) instead of letting the instance converter do it one by one
      await this._deploymentsManager.fetchOrRefreshDeployments(
        instancesToRefresh.map((instance) => instance.deployment.id),
      );

      // Fetch those instance
      const newInstances = await Promise.all(instancesToRefresh.map((instance) => this._fetchAndConvert(instance.id)));

      // If at least one has changed, index them all and notify the change by calling the `onChange` callback.
      if (newInstances.some((instance) => this._hasChanged(instance))) {
        index(newInstances, 'id', this._instancesMap);
        this._fireChanged();
      }
    }, INSTANCES_REFRESH_RATE);
  }

  _stopRefresher () {
    clearInterval(this._refresher);
    this._refresher = null;
  }

  /**
   * @param {string} id
   * @return {Promise<Instance | GhostInstance>}
   * @private
   */
  async _fetchAndConvert (id) {
    let rawInstance;
    try {
      rawInstance = await this._api.fetchInstance(id);
    }
    catch (e) {
      if (e.response.status === 404) {
        return {
          ghost: true,
          id,
        };
      }
    }
    return this._convert(rawInstance);
  }

  /**
   * @param {Object} raw
   * @return {Promise<Instance>}
   */
  async _convert (raw) {
    let deployment;
    if (raw.deploymentId == null) {
      console.error(`deploymentId is null! Could not get deployment for instance ${raw.id}.`);
      // todo, should we return null, or should we consider this as a ghost instance?
    }
    else {
      deployment = await this._deploymentsManager.getOrFetchDeployment(raw.deploymentId);
    }

    return {
      id: raw.id,
      name: raw.name,
      index: raw.index,
      deployment: deployment,
      state: raw.state,
      creationDate: new Date(raw.creationDate),
      deletionDate: raw.deletionDate != null ? new Date(raw.deletionDate) : null,
      kind: raw.isBuildVm ? 'BUILD' : 'RUN',
    };
  }

  _fireChanged () {
    this._onChange(this.getInstances());
  }

  /**
   * @param {Instance | GhostInstance} newInstance
   * @return {boolean}
   */
  _hasChanged (newInstance) {
    const currentInstance = this._instancesMap.get(newInstance.id);

    if (currentInstance == null) {
      return true;
    }

    if (isGhostInstance(currentInstance)) {
      return !isGhostInstance(newInstance);
    }

    return currentInstance.state !== newInstance.state
      || currentInstance.deployment.state !== newInstance.deployment.state
    ;
  }
}

class DeploymentsManager {
  /**
   * @param {Api} api
   */
  constructor (api) {
    this._api = api;
    /** @type {Map<string, Deployment>} */
    this._deploymentsMap = new Map();
  }

  /**
   * @param {string} id
   * @return {Promise<Deployment>}
   */
  async getOrFetchDeployment (id) {
    let deployment = this._deploymentsMap.get(id);
    if (deployment == null) {
      deployment = await this._fetchAndConvert(id);
      this._deploymentsMap.set(id, deployment);
    }
    return deployment;
  }

  /**
   * From the given array of ids, fetches or refreshes all deployments that are not in a final state.
   *
   * @param {Array<string>} ids
   * @return {Promise<void>}
   */
  async fetchOrRefreshDeployments (ids) {
    const idsToFetch = ids
      // We don't want to fetch twice the same id
      .flatMap(unique)
      // We want to fetch only deployments that we don't already know, or deployments that have a non-final state.
      .filter((id) => {
        const deployment = this._deploymentsMap.get(id);
        return (deployment == null || deployment.state === 'QUEUED' || deployment.state === 'WORK_IN_PROGRESS');
      });

    // We fetch and convert them all in parallel
    const fetchedDeployments = await Promise.all(idsToFetch.map((id) => this._fetchAndConvert(id)));

    // We add them to our deployments map.
    index(fetchedDeployments, 'id', this._deploymentsMap);
  }

  /**
   * @param {string} id
   * @return {Promise<Deployment>}
   */
  async _fetchAndConvert (id) {
    try {
      return this._convert(await this._api.fetchDeployment(id), 'v4');
    }
    catch (e) {
      // fallback to API v2. This is to be removed one day.
      if (e.response.status === 404) {
        return this._convert(await this._api.fetchDeploymentV2(id), 'v2');
      }
      throw e;
    }
  }

  /**
   * @param {Object} raw
   * @param {'v2'|'v4'} version
   * @return {Deployment}
   */
  _convert (raw, version) {
    if (version === 'v4') {
      const result = {
        id: raw.id,
        state: raw.state,
        creationDate: new Date(raw.startDate),
        commitId: raw.version.commitId,
      };

      if (result.state === 'SUCCEEDED' || result.state === 'FAILED' || result.state === 'FAILED') {
        result.endDate = new Date(raw.steps.find((s) => s.state === result.state).date);
      }

      return result;
    }
    if (version === 'v2') {
      // V2: WIP | OK | CANCELLED | FAIL
      // V4: QUEUED, WORK_IN_PROGRESS, FAILED, CANCELLED and SUCCEEDED.

      let state;
      if (raw.state === 'QUEUED') {
        state = 'QUEUED';
      }
      else if (raw.state === 'WIP') {
        state = 'WORK_IN_PROGRESS';
      }
      else if (raw.state === 'OK') {
        state = 'SUCCEEDED';
      }
      else if (raw.state === 'CANCELLED') {
        state = 'CANCELLED';
      }
      else if (raw.state === 'FAIL') {
        state = 'FAILED';
      }

      return {
        id: raw.uuid,
        state: state,
        creationDate: new Date(raw.date),
        commitId: raw.commit,
      };
    }

    throw new Error(`version "${version}" is not supported`);
  }
}

class LogsStream {
  /**
   *
   * @param {Object} apiConfig
   * @param {LogsStreamParams} params
   * @param {LogsStreamCallbacks} callbacks
   */
  constructor (apiConfig, params, callbacks) {
    /** @type {ApplicationLogStream} */
    this._logsStream = null;
    this._apiConfig = apiConfig;
    /** @type {LogsStreamParams} */
    this._params = params;
    /** @type {LogsStreamCallbacks} */
    this._callbacks = callbacks;
  }

  open () {
    if (this._logsStream != null) {
      throw new Error('Already opened');
    }

    this._logsStream = new ApplicationLogStream({
      apiHost: this._apiConfig.API_HOST,
      tokens: this._apiConfig,
      ownerId: this._params.applicationRef.ownerId,
      appId: this._params.applicationRef.applicationId,
      since: this._params.since,
      until: this._params.until,
      instanceId: this._params.instances,
      retryConfiguration: {
        enabled: true,
        maxRetryCount: 10,
      },
      throttleElements: LOGS_THROTTLE_ELEMENTS,
      throttlePerInMilliseconds: LOGS_THROTTLE_PER_IN_MILLIS,
    })
      .on('open', this._callbacks.onOpen)
      .onLog(this._callbacks.onLog)
      .on('error', (event) => {
        // This is not a fatal error, the logs stream will retry.
        if (this._logsStream.retryCount >= 3) {
          this._callbacks.onError(event.error);
        }
      })
    ;
    this._logsStream.start()
      .then((reason) => {
        this._callbacks.onFinish(reason);
        this._logsStream = null;
      })
      .catch((error) => {
        this._callbacks.onFatalError(error);
        this._logsStream = null;
      });
  }

  pause () {
    this._logsStream.pause();
  }

  resume () {
    this._logsStream.resume();
  }

  close () {
    if (this._logsStream == null) {
      return;
    }
    // todo: reason
    this._logsStream.close(null);
    this._logsStream = null;
  }
}

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {ApplicationRef} applicationRef
   */
  constructor (apiConfig, applicationRef) {
    this._apiConfig = apiConfig;
    this._commonApiPrams = { id: applicationRef.ownerId, appId: applicationRef.applicationId };
  }

  fetchDeployment (deploymentId) {
    return v4.getDeployment({ ...this._commonApiPrams, deploymentId })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchDeploymentV2 (deploymentId) {
    return v2.getDeployment({ ...this._commonApiPrams, deploymentId })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchInstances (since, until) {
    return v4.getInstances({ ...this._commonApiPrams, limit: 100, since, until })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchInstancesByDeployment (deploymentId) {
    return v4.getInstances({ ...this._commonApiPrams, limit: 100, deploymentId })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchInstance (instanceId) {
    return v4.getInstance({ ...this._commonApiPrams, instanceId })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }
}

// --- APIs ------

const v4 = {
  getInstances (params) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/orchestration/organisations/${params.id}/applications/${params.appId}/instances`,
      headers: { Accept: 'application/json' },
      queryParams: pickNonNull(params, ['limit', 'since', 'until', 'deploymentId', 'includeState']),
    });
  },
  getInstance (params) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/orchestration/organisations/${params.id}/applications/${params.appId}/instances/${params.instanceId}`,
      headers: { Accept: 'application/json' },
    });
  },
  getDeployment (params) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/orchestration/organisations/${params.id}/applications/${params.appId}/deployments/${params.deploymentId}`,
      headers: { Accept: 'application/json' },
    });
  },
};

const v2 = {
  getDeployment: getDeployment,
  getAllInstances: getAllInstances,
};

// --- utils ------

/**
 * @param {Array<Object>} objects
 * @param {string} key
 * @param {Map} map
 */
function index (objects, key, map) {
  objects.forEach((o) => {
    map.set(o[key], o);
  });
}

/**
 *
 * @param {Instance | GhostInstance} instance
 * @return {boolean}
 */
function isGhostInstance (instance) {
  return instance.ghost === true;
}

//
// function getDeployments (params) {
// // "https://api.clever-cloud.com/v4/orchestration/organisations/orga_8b852f0a-1135-4b4f-8eee-a538f538b640/applications/app_4bc68315-c93e-49eb-8086-430314475568/deployments?limit=1"  | jq
//   const urlBase = `/orchestration/organisations/${params.id}/applications/${params.appId}/deployments`;
//   return Promise.resolve({
//     method: 'get',
//     url: `/v4${urlBase}/applications/${params.appId}/deployments`,
//     headers: { Accept: 'application/json' },
//     queryParams: pickNonNull(params, ['limit', 'offset', 'action']),
//     // no body
//   });
//
// }
