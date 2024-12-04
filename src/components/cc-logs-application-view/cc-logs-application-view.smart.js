// @ts-expect-error FIXME: remove when clever-client exports types
import { getAllInstances, getDeployment } from '@clevercloud/client/esm/api/v2/application.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { ApplicationLogStream } from '@clevercloud/client/esm/streams/application-logs.js';
import { isLive, lastXDays } from '../../lib/date/date-range-utils.js';
import { LogsStream } from '../../lib/logs/logs-stream.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { unique } from '../../lib/utils.js';
import { dateRangeSelectionToDateRange } from '../cc-logs-date-range-selector/date-range-selection.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-logs-application-view.js';

/**
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').Instance} Instance
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').GhostInstance} GhostInstance
 * @typedef {import('../cc-logs-instances/cc-logs-instances.types.js').Deployment} Deployment
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewState} LogsApplicationViewState
 * @typedef {import('./cc-logs-application-view.types.js').LogsApplicationViewStateLogs} LogsApplicationViewStateLogs
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelectionChangeEventData} LogsDateRangeSelectionChangeEventData
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/date/date-range.types.js').DateRange} DateRange
 * @typedef {import('../../lib/logs/logs-stream.types.js').LogsStreamState} LogsStreamState
 * @typedef {import('./cc-logs-application-view.js').CcLogsApplicationView} CcLogsApplicationView
 * @typedef {import('../../lib/smart/smart-component.types.js').UpdateComponentCallback<CcLogsApplicationView>} UpdateComponentCallback
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcLogsApplicationView>} OnContextUpdateArgs
 */

const INSTANCES_REFRESH_RATE = 2000;

defineSmartComponent({
  selector: 'cc-logs-application-view-beta',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    deploymentId: { type: String, optional: true },
    dateRangeSelection: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId, deploymentId, dateRangeSelection } = context;

    const controller = new LogsApplicationViewSmartController({
      apiConfig,
      ownerId,
      appId,
      component,
      updateComponent,
    });
    signal.onabort = () => {
      controller.clear();
    };

    onEvent(
      'cc-logs-date-range-selector:change',
      /** @param {LogsDateRangeSelectionChangeEventData} eventData */
      (eventData) => {
        controller.setNewDateRange(eventData.range);
      },
    );

    onEvent(
      'cc-logs-application-view:instance-selection-change',
      /** @param {Array<string>} instances */
      (instances) => {
        controller.setNewInstanceSelection(instances);
      },
    );

    onEvent('cc-logs-loading-progress:pause', () => {
      controller.pause();
    });

    onEvent('cc-logs-loading-progress:resume', () => {
      controller.resume();
    });

    onEvent('cc-logs-loading-progress:accept-overflow', () => {
      controller.acceptOverflow();
    });

    onEvent('cc-logs-loading-progress:discard-overflow', () => {
      controller.discardOverflow();
    });

    if (deploymentId != null) {
      controller.initByDeploymentId(deploymentId);
    } else if (dateRangeSelection != null) {
      controller.initByDateRangeSelection(dateRangeSelection);
    } else {
      controller.initByLastDeployment();
    }
  },
});

/**
 * @extends {LogsStream<Log>}
 */
class LogsApplicationViewSmartController extends LogsStream {
  /**
   * @param {object} _
   * @param {ApiConfig} _.apiConfig
   * @param {string} _.ownerId
   * @param {string} _.appId
   * @param {CcLogsApplicationView} _.component
   * @param {UpdateComponentCallback} _.updateComponent
   */
  constructor({ apiConfig, ownerId, appId, component, updateComponent }) {
    super(component.limit);
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._appId = appId;
    /** @type {Array<string>} */
    this._selection = [];
    /** @type {DateRange} */
    this._dateRange = null;

    this._component = component;
    this._updateComponent = updateComponent;
    this._instancesManager = new InstancesManager(
      new Api(apiConfig, ownerId, appId),
      this._onInstancesChanged.bind(this),
    );
  }

  /**
   * @param {DateRange} dateRange
   * @param {number} maxRetryCount
   * @param {number} throttleElements
   * @param {number} throttlePerInMilliseconds
   * @returns {ApplicationLogStream}
   */
  _createStream(dateRange, maxRetryCount, throttleElements, throttlePerInMilliseconds) {
    // This optimization should be done by the API.
    const optimizedRange = this._optimizeDateRange(dateRange);

    return new ApplicationLogStream({
      apiHost: this._apiConfig.API_HOST,
      tokens: this._apiConfig,
      ownerId: this._ownerId,
      appId: this._appId,
      since: optimizedRange.since,
      until: optimizedRange.until,
      instanceId: this._selection,
      retryConfiguration: { enabled: true, maxRetryCount },
      throttleElements,
      throttlePerInMilliseconds,
    });
  }

  /**
   * @param {any} rawLog Raw log coming from API
   * @returns {Promise<Log>}
   */
  async _convertLog(rawLog) {
    const instance = await this._instancesManager.getOrFetchInstance(rawLog.instanceId);

    return {
      id: rawLog.id,
      date: new Date(rawLog.date),
      message: rawLog.message,
      metadata: [
        {
          name: 'instance',
          value: isGhostInstance(instance) ? '?' : instance.name,
        },
        {
          name: 'instanceId',
          value: instance.id,
        },
      ],
    };
  }

  stop() {
    super.stop();

    this._component.clear();
  }

  discardOverflow() {
    super.discardOverflow();
    this._updateComponent('dateRangeSelection', {
      type: 'custom',
      since: dateRangeSelectionToDateRange(this._component.dateRangeSelection).since,
      until: this.getLastLogDate().toISOString(),
    });
  }

  /**
   * @param {LogsStreamState} streamState
   * @protected
   */
  _updateStreamState(streamState) {
    super._updateStreamState(streamState);

    this._updateState({
      type: 'loaded',
      streamState,
      instances: this._instancesManager.getInstances(),
      selection: this._selection,
    });
  }

  /**
   * @param {Array<Log>} logs
   * @protected
   */
  _appendLogs(logs) {
    super._appendLogs(logs);
    this._component.appendLogs(logs);
  }

  clear() {
    this.stop();
    this._instancesManager.clear();
    this._updateState({ type: 'loadingInstances' });
  }

  /**
   * @param {DateRange} dateRange
   * @param {Array<string>} selection
   * @return {void}
   */
  init(dateRange, selection) {
    this._selection = selection;
    this.setNewDateRange(dateRange);
  }

  /**
   * @param {string} deploymentId
   */
  initByDeploymentId(deploymentId) {
    // todo: what should we do if deploymentId doesn't exist?

    this._instancesManager
      .fetchInstancesByDeployment(deploymentId)
      .then((instances) => {
        if (instances.length === 0) {
          this._selection = [];
          this.complete();
          return;
        }

        this._selection = instances.map((instance) => instance.id);

        const deployment = instances[0].deployment;

        // cold
        if (isCurrentDeployment(deployment)) {
          this._dateRange = {
            since: deployment.creationDate.toISOString(),
          };

          this._component.dateRangeSelection = {
            type: 'live',
          };
        } else {
          this._dateRange = {
            since: deployment.creationDate.toISOString(),
            until: deployment.endDate.toISOString(),
          };

          this._component.dateRangeSelection = {
            type: 'custom',
            since: this._dateRange.since,
            until: this._dateRange.until,
          };
        }

        // enable instance auto-refresh only for live mode
        this._instancesManager.enabledAutoRefresh(isLive(this._dateRange));

        // open the logs stream
        this.openLogsStream(this._dateRange);
      })
      .catch((e) => {
        console.error(e);
        this._updateState({ type: 'errorInstances' });
      });
  }

  initByLastDeployment() {
    // get last 7 days (which means, give me all instances and deployments within the whole log retention period)
    const last7DaysRange = lastXDays(7);

    this._instancesManager
      .fetchInstances(last7DaysRange.since, last7DaysRange.until)
      .then((instances) => {
        if (instances.length === 0) {
          this._dateRange = last7DaysRange;
          this._component.dateRangeSelection = {
            type: 'preset',
            preset: 'last7Days',
          };
          this._selection = [];
          this.complete();
          return;
        }

        const lastDeploymentInstances = this._instancesManager.getLastDeploymentInstances();
        const lastDeployment = lastDeploymentInstances[0].deployment;

        // live mode
        if (isCurrentDeployment(lastDeployment)) {
          this._component.dateRangeSelection = {
            type: 'live',
          };

          const liveRange = dateRangeSelectionToDateRange(this._component.dateRangeSelection);

          this.init(liveRange, []);
          return;
        }

        // cold mode with 7 days and last deployment selected.
        this._dateRange = last7DaysRange;
        this._component.dateRangeSelection = {
          type: 'preset',
          preset: 'last7Days',
        };

        // select the last deployment instances
        this._selection = lastDeploymentInstances.map((instance) => instance.id);

        // open the logs stream
        this.openLogsStream(this._dateRange);
      })
      .catch((e) => {
        console.error(e);
        this._updateState({ type: 'errorInstances' });
      });
  }

  /**
   * @param {LogsDateRangeSelection} dateRangeSelection
   */
  initByDateRangeSelection(dateRangeSelection) {
    this._component.dateRangeSelection = dateRangeSelection;
    const dateRange = dateRangeSelectionToDateRange(this._component.dateRangeSelection);
    this.init(dateRange, []);
  }

  /**
   * @param {DateRange} dateRange
   */
  setNewDateRange(dateRange) {
    // clear and close everything
    this.clear();

    const clearSelection =
      this._dateRange == null ||
      (isLive(this._dateRange) && !isLive(dateRange)) ||
      (!isLive(this._dateRange) && isLive(dateRange));

    // store the new date range
    this._dateRange = dateRange;

    this._instancesManager
      .fetchInstances(this._dateRange.since, this._dateRange.until)
      .then((instances) => {
        if (instances.length === 0) {
          this._selection = [];
          this.complete();
          return;
        }

        // enable instance auto-refresh only for live mode
        this._instancesManager.enabledAutoRefresh(isLive(this._dateRange));

        if (clearSelection) {
          this._selection = [];
        } else {
          // adapt the instances selection according to the new set of instances
          this._selection = this._selection.filter((id) => this._instancesManager.hasInstance(id));
        }

        // we don't want to load too many logs, so if no instance is selected, and for a 7-days range,
        // we automatically select the last deployment
        if (
          this._selection.length === 0 &&
          this._component.dateRangeSelection.type === 'preset' &&
          this._component.dateRangeSelection.preset === 'last7Days'
        ) {
          const lastDeploymentInstances = this._instancesManager.getLastDeploymentInstances();
          this._selection = lastDeploymentInstances.map((instance) => instance.id);
        }

        // open the logs stream
        this.openLogsStream(this._dateRange);
      })
      .catch((e) => {
        console.error(e);
        this._updateState({ type: 'errorInstances' });
      });
  }

  /**
   * @param {Array<string>} selection
   */
  setNewInstanceSelection(selection) {
    // store the new selection
    this._selection = selection;

    this.openLogsStream(this._dateRange);
  }

  /**
   * @param {Array<Instance|GhostInstance>} instances
   */
  _onInstancesChanged(instances) {
    this._updateState((state) => {
      state.instances = instances;
    });
  }

  /**
   * @param {DateRange} dateRange
   * @returns {DateRange}
   */
  _optimizeDateRange(dateRange) {
    // no optimization on live range because instance filtering is done on client side.
    if (isLive(dateRange)) {
      return dateRange;
    }

    // no optimization can be done if no selection
    if (this._selection.length === 0) {
      return dateRange;
    }
    const instances = this._selection.map((id) => this._instancesManager.getInstance(id));

    // no optimization can be done as soon as there are some ghost instances in selection
    if (instances.find((i) => isGhostInstance(i)) != null) {
      return dateRange;
    }

    const now = new Date().getTime();

    const minSinceInstance = instances
      .map((i) => i.creationDate.getTime())
      .reduce((previous, current) => Math.min(previous, current), Infinity);
    let maxUntilInstance = instances
      .map((i) => i.deletionDate?.getTime() ?? now)
      .reduce((previous, current) => Math.max(previous, current), -Infinity);

    maxUntilInstance = maxUntilInstance === -Infinity ? Infinity : maxUntilInstance;
    const dateUntilFromDateRange = dateRange.until == null ? Infinity : new Date(dateRange.until).getTime();
    const optimizedUntil = Math.min(maxUntilInstance, dateUntilFromDateRange);

    return {
      since: new Date(Math.max(minSinceInstance, new Date(dateRange.since).getTime())).toISOString(),
      until: optimizedUntil === Infinity ? null : new Date(optimizedUntil).toISOString(),
    };
  }

  /**
   * @param {LogsApplicationViewState|((state: LogsApplicationViewState) => void)} state
   */
  _updateState(state) {
    this._updateComponent('state', state);
  }
}

class InstancesManager {
  /**
   * @param {Api} api
   * @param {(instances: Array<Instance | GhostInstance>) => void} onChange
   */
  constructor(api, onChange) {
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
  async getOrFetchInstance(id) {
    if (this._instancesMap.has(id)) {
      return this._instancesMap.get(id);
    }
    const instance = await this._fetchAndConvert(id);
    this._instancesMap.set(id, instance);
    this._fireChanged();
    return instance;
  }

  getInstance(id) {
    return this._instancesMap.get(id);
  }

  /**
   * @param {string} since
   * @param {string} until
   * @return {Promise<Array<Instance | GhostInstance>>}
   */
  async fetchInstances(since, until) {
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
  async fetchInstancesByDeployment(deploymentId) {
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
  hasInstance(id) {
    return this._instancesMap.has(id);
  }

  /**
   * @return {Array<Instance | GhostInstance>}
   */
  getInstances() {
    return Array.from(this._instancesMap.values());
  }

  clear() {
    this._stopRefresher();
    this._instancesMap.clear();
  }

  enabledAutoRefresh(enable) {
    if (enable && this._refresher == null) {
      this._startRefresher();
    } else if (!enable && this._refresher != null) {
      this._stopRefresher();
    }
  }

  getLastDeploymentInstances() {
    if (this._instancesMap.size === 0) {
      return [];
    }

    const lastDeployment = this._deploymentsManager.getLastDeployment();

    return Array.from(this._instancesMap.values()).filter((instance) => instance.deployment === lastDeployment);
  }

  _startRefresher() {
    this._refresher = setInterval(async () => {
      // Find all instances that needs to be refreshed: instances with non-final state or ghost instances
      const instancesToRefresh = Array.from(this._instancesMap.values()).filter((instance) => {
        return isGhostInstance(instance) || instance.deployment.state !== 'SUCCEEDED' || instance.state !== 'DELETED';
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

  _stopRefresher() {
    clearInterval(this._refresher);
    this._refresher = null;
  }

  /**
   * @param {string} id
   * @return {Promise<Instance | GhostInstance>}
   * @private
   */
  async _fetchAndConvert(id) {
    let rawInstance;
    try {
      rawInstance = await this._api.fetchInstance(id);
    } catch (e) {
      if (e?.response?.status === 404) {
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
  async _convert(raw) {
    let deployment;
    if (raw.deploymentId == null) {
      console.error(`deploymentId is null! Could not get deployment for instance ${raw.id}.`);
      // todo, should we return null, or should we consider this as a ghost instance?
    } else {
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

  _fireChanged() {
    this._onChange(this.getInstances());
  }

  /**
   * @param {Instance | GhostInstance} newInstance
   * @return {boolean}
   */
  _hasChanged(newInstance) {
    const currentInstance = this._instancesMap.get(newInstance.id);

    if (currentInstance == null) {
      return true;
    }

    if (isGhostInstance(currentInstance)) {
      return !isGhostInstance(newInstance);
    }

    return (
      currentInstance.state !== newInstance.state || currentInstance.deployment.state !== newInstance.deployment.state
    );
  }
}

class DeploymentsManager {
  /**
   * @param {Api} api
   */
  constructor(api) {
    this._api = api;
    /** @type {Map<string, Deployment>} */
    this._deploymentsMap = new Map();
  }

  /**
   * @param {string} id
   * @return {Promise<Deployment>}
   */
  async getOrFetchDeployment(id) {
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
  async fetchOrRefreshDeployments(ids) {
    const idsToFetch = ids
      // We don't want to fetch twice the same id
      .flatMap(unique)
      // We want to fetch only deployments that we don't already know, or deployments that have a non-final state.
      .filter((id) => {
        const deployment = this._deploymentsMap.get(id);
        return deployment == null || deployment.state === 'QUEUED' || deployment.state === 'WORK_IN_PROGRESS';
      });

    // We fetch and convert them all in parallel
    const fetchedDeployments = await Promise.all(idsToFetch.map((id) => this._fetchAndConvert(id)));

    // We add them to our deployments map.
    index(fetchedDeployments, 'id', this._deploymentsMap);
  }

  getLastDeployment() {
    if (this._deploymentsMap.size === 0) {
      return null;
    }

    const sortFn = (d1, d2) => {
      if (isCurrentDeployment(d1)) {
        return -1;
      }
      if (isCurrentDeployment(d2)) {
        return 1;
      }
      return d2.creationDate.getTime() - d1.creationDate.getTime();
    };

    const deployments = Array.from(this._deploymentsMap.values()).sort(sortFn);
    return deployments[0];
  }

  /**
   * @param {string} id
   * @return {Promise<Deployment>}
   */
  async _fetchAndConvert(id) {
    try {
      return await this._convertV4(await this._api.fetchDeployment(id), 'v4');
    } catch (e) {
      // fallback to API v2. This is to be removed one day.
      if (e?.response?.status === 404) {
        return await this._convertV2(await this._api.fetchDeploymentV2(id), 'v2');
      }
      throw e;
    }
  }

  /**
   * @param {Object} raw
   * @return {Deployment}
   */
  _convertV4(raw) {
    const result = {
      id: raw.id,
      state: raw.state,
      creationDate: new Date(raw.startDate),
      commitId: raw.version.commitId,
    };

    if (result.state === 'SUCCEEDED' || result.state === 'FAILED' || result.state === 'CANCELLED') {
      result.endDate = new Date(raw.steps.find((s) => s.state === result.state).date);
    }

    return result;
  }

  /**
   * @param {Object} raw
   * @return {Deployment}
   */
  async _convertV2(raw) {
    // V2: WIP | OK | CANCELLED | FAIL
    // V4: QUEUED, WORK_IN_PROGRESS, FAILED, CANCELLED and SUCCEEDED.

    let state;
    if (raw.state === 'QUEUED') {
      state = 'QUEUED';
    } else if (raw.state === 'WIP') {
      state = 'WORK_IN_PROGRESS';
    } else if (raw.state === 'OK') {
      state = 'SUCCEEDED';
    } else if (raw.state === 'CANCELLED') {
      state = 'CANCELLED';
    } else if (raw.state === 'FAIL') {
      state = 'FAILED';
    }

    let endTime = null;
    if (state === 'SUCCEEDED' || state === 'FAILED' || state === 'CANCELLED') {
      const instances = await this._api.fetchInstancesByDeployment(raw.uuid);

      for (const instance of instances) {
        if (instance.deletionDate == null) {
          endTime = null;
          break;
        }
        const deletionTime = new Date(instance.deletionDate).getTime();
        if (endTime == null) {
          endTime = deletionTime;
        } else {
          endTime = Math.max(endTime, deletionTime);
        }
      }
    }

    return {
      id: raw.uuid,
      state: state,
      creationDate: new Date(raw.date),
      endDate: endTime == null ? null : new Date(endTime),
      commitId: raw.commit,
    };
  }
}

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} ownerId
   * @param {string} appId
   */
  constructor(apiConfig, ownerId, appId) {
    this._apiConfig = apiConfig;
    this._commonApiPrams = { id: ownerId, appId };
  }

  fetchDeployment(deploymentId) {
    return v4.getDeployment({ ...this._commonApiPrams, deploymentId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchDeploymentV2(deploymentId) {
    return v2.getDeployment({ ...this._commonApiPrams, deploymentId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchInstances(since, until) {
    return v4
      .getInstances({ ...this._commonApiPrams, limit: 100, since, until })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchInstancesByDeployment(deploymentId) {
    return v4
      .getInstances({ ...this._commonApiPrams, limit: 100, deploymentId })
      .then(sendToApi({ apiConfig: this._apiConfig }));
  }

  fetchInstance(instanceId) {
    return v4.getInstance({ ...this._commonApiPrams, instanceId }).then(sendToApi({ apiConfig: this._apiConfig }));
  }
}

// --- APIs ------

const v4 = {
  getInstances(params) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/orchestration/organisations/${params.id}/applications/${params.appId}/instances`,
      headers: { Accept: 'application/json' },
      queryParams: pickNonNull(params, ['limit', 'since', 'until', 'deploymentId', 'includeState']),
    });
  },
  getInstance(params) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/orchestration/organisations/${params.id}/applications/${params.appId}/instances/${params.instanceId}`,
      headers: { Accept: 'application/json' },
    });
  },
  getDeployment(params) {
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
function index(objects, key, map) {
  objects.forEach((o) => {
    map.set(o[key], o);
  });
}

/**
 *
 * @param {Instance | GhostInstance} instance
 * @return {instance is GhostInstance}
 */
function isGhostInstance(instance) {
  return instance.ghost === true;
}

function isCurrentDeployment(deployment) {
  return deployment.state === 'WORK_IN_PROGRESS' || deployment.state === 'QUEUED' || deployment.endDate == null;
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
