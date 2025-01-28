import { pickNonNull } from '@clevercloud/client/esm/pick-non-null.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import './cc-tile-instances.js';

const POLLING_INTERVAL = 2_000;
const RUNNING_STATES = ['UP', 'MIGRATION_IN_PROGRESS', 'TASK_IN_PROGRESS'];
const DEPLOYING_STATES = ['BOOTING', 'STARTING', 'DEPLOYING', 'BUILDING', 'READY'];

/**
 * @typedef {import('./cc-tile-instances.js').CcTileInstances} CcTileInstances
 * @typedef {import('./cc-tile-instances.types.js').InstanceState} InstanceState
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.d.ts').OnContextUpdateArgs<CcTileInstances>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-tile-instances',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ context, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;
    const api = new Api(apiConfig, ownerId, appId);

    updateComponent('state', { type: 'loading' });

    api
      .fetchInstances()
      .then(({ runningInstances, deployingInstances }) => {
        updateComponent('state', {
          type: 'loaded',
          running: runningInstances,
          deploying: deployingInstances,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });

    // start polling / subscribe bus
    // const bus = lesBus.get(apiConfig);
    // bus.subscribeInstances({ownerId,appId}, onData, onError);

    const unsubscribeInstances = globalBus.subscribeInstances(
      { apiConfig, ownerId, appId },
      ({ runningInstances, deployingInstances }) => {
        updateComponent('state', {
          type: 'loaded',
          running: runningInstances,
          deploying: deployingInstances,
        });
      },
      (error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      },
    );

    signal.addEventListener(
      'abort',
      () => {
        unsubscribeInstances();
      },
      { once: true },
    );
  },
});

class EventBus {
  constructor() {
    this._clientsByApiConfig = new Map();
    this._instancesListeners = new Map();
  }

  subscribeInstances({ apiConfig, ownerId, appId }, onData, onError) {

    // si aucun listeners


    // let client = this._clientsByApiConfig.get(apiConfig);
    // if (client == null) {
    //   client = new Api(apiConfig, ownerId, appId);
    //   this._clientsByApiConfig.set(apiConfig, client);
    // }
    //
    // const timeoutId = setTimeout(() => {
    //   client
    //     .fetchInstances()
    //     .then(onData)
    //     .catch(onError)
    //     .finally(() => {
    //       this.subscribeInstances({ apiConfig, ownerId, appId }, onData, onError);
    //     });
    // }, POLLING_INTERVAL);
    //
    // return () => {
    //   clearTimeout(timeoutId);
    // };
  }
}

const globalBus = new EventBus();

class Api {
  /**
   * @param {ApiConfig} apiConfig
   * @param {string} ownerId
   * @param {string} appId
   */
  constructor(apiConfig, ownerId, appId) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._appId = appId;
  }

  /**
   * @return {Promise<{ runningInstances: Array<InstanceState>, deployingInstances: Array<InstanceState> }>}
   */
  fetchInstances() {
    return getInstances({
      id: this._ownerId,
      appId: this._appId,
      since: new Date().toISOString(),
    })
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .then((rawInstances) => {
        const runningInstances = countByFlavor(
          rawInstances.filter((instance) => {
            return RUNNING_STATES.includes(instance.state);
          }),
        );

        const deployingInstances = countByFlavor(
          rawInstances.filter((instance) => {
            return DEPLOYING_STATES.includes(instance.state);
          }),
        );

        return { runningInstances, deployingInstances };
      });
  }
}

/**
 * @param {Array<any>} instances
 * @return {Array<InstanceState>}
 */
function countByFlavor(instances) {
  return (
    Object
      //
      .entries(
        Object.groupBy(instances, (instance) => {
          return instance.flavor;
        }),
      )
      .map(([flavorName, instances]) => {
        return {
          flavorName,
          count: instances.length,
        };
      })
  );
}

// TODO move to clever client (also in logs smart)

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.appId
 * @param {string} params.since
 * @return {*}
 */
function getInstances(params) {
  return Promise.resolve({
    method: 'get',
    url: `/v4/orchestration/organisations/${params.id}/applications/${params.appId}/instances`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['limit', 'since', 'until', 'deploymentId', 'includeState']),
  });
}
