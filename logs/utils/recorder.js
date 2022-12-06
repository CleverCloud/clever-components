import { intervalPromise } from './interval.js';

export class Recorder {
  constructor (api) {
    this._api = api;
    this._running = false;
    this._stopping = false;
    this._status = 'init';
  }

  async start (until, { rate = 1000, timeout = 0 } = {}) {
    if (this._running) {
      throw new Error('Cannot start while running');
    }

    this._running = true;
    this._result = {};
    this._status = 'partial';
    const startupConfiguration = await this._api.getAppConfig();

    return intervalPromise(async () => {
      if (this._stopping) {
        this._done('stopped');
        this?._onStopped();
        return false;
      }

      await this._snapshot(startupConfiguration);

      if (until(this._result) === true) {
        this._done('match');
        return false;
      }
      return true;
    }, rate, timeout)
      .then(() => this.result)
      .catch((e) => {
        if (e?.message === 'timeout') {
          this._done('timeout');
        }
        else {
          console.error(e);
          this._done('error');
        }
        return this.result;
      });
  }

  async stop () {
    return new Promise((resolve) => {
      this._onStopped = resolve;
      this._stopping = true;
    });
  }

  reset () {
    if (this._running) {
      throw new Error('Cannot reset while running');
    }
    this._result = null;
    this._stopping = false;
    this._running = false;
  }

  get result () {
    return {
      status: this._status,
      data: this._result,
    };
  }

  printResult () {
    const statesToString = (states) => states.join(' -> ');

    Object.values(this._result).forEach((deployment) => {
      console.log(deployment.id, deployment.action, statesToString(deployment.states));
      if (deployment.configuration == null) {
        console.log(` ⚙ unknown configuration`);
      }
      else {
        console.log(` ⚙ build VM : ${deployment.configuration.separateBuild} | H scaling : ${deployment.configuration.hScaling} | V scaling : ${deployment.configuration.vScaling}`);
      }
      Object.values(deployment.instances).forEach((instance) => {
        console.log(`  [${instance.number}] (${instance.size}) ${statesToString(instance.states)}`);
      });
    });
  }

  // -- private methods ------

  async _snapshot (startupConfiguration) {
    const rawDeployments = await this._api.getDeployments(1);

    for (const rawDeployment of rawDeployments) {
      let deployment = this._result[rawDeployment.id];

      if (deployment == null) {
        deployment = this._result[rawDeployment.id] = {
          id: rawDeployment.id,
          cause: rawDeployment.cause,
          action: rawDeployment.action,
          states: [rawDeployment.state],
          state: rawDeployment.state,
          instances: {},
        };
      }
      else if (rawDeployment.state !== deployment.state) {
        deployment.states = [...deployment.states, rawDeployment.state];
        deployment.state = rawDeployment.state;
      }

      if (deployment.id < startupConfiguration.deployment) {
        deployment.configuration = null;
      }
      else if (deployment.configuration == null) {
        if (deployment.id === startupConfiguration.deployment) {
          deployment.configuration = startupConfiguration;
        }
        else {
          deployment.configuration = await this._api.getAppConfig();
        }
      }

      const rawInstances = await this._api.getInstances(rawDeployment);
      rawInstances.forEach((rawInstance) => {
        const instance = deployment.instances[rawInstance.id];

        if (instance == null) {
          deployment.instances[rawInstance.id] = {
            id: rawInstance.id,
            number: rawInstance.instanceNumber,
            size: rawInstance.flavor.name,
            states: [rawInstance.state],
            state: rawInstance.state,
          };
        }
        else if (instance.state !== rawInstance.state) {
          instance.states = [...instance.states, rawInstance.state];
          instance.state = rawInstance.state;
        }
      });
    }
  }

  _done (status) {
    this._status = status;
    this._running = false;
  }
}
