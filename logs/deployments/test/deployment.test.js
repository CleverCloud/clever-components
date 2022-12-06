import { expect } from 'chai';
import { getApi } from '../../utils/api.js';
import { getConfUpdater } from '../../utils/configuration.js';
import { Recorder } from '../../utils/recorder.js';

const ownerId = 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7';
const appId = 'app_3af80970-d8bf-47ab-af5c-e56fb6c481f4';
const api = getApi(ownerId, appId, process.env);
const recorder = new Recorder(api);
const confUpdater = getConfUpdater(api);

const findLastDeployment = (deployments) => {
  const d = Object.values(deployments);
  if (d.length === 0) {
    return null;
  }
  return d[d.length - 1];
};
const getStates = (deployment) => {
  return deployment.states.join(' -> ');
};
const getInstancesStates = (d) => {
  return Object.values(d.instances).map((i) => i.states.join(' -> '));
};
const deploymentOK = (deployments) => {
  const dd = Object.values(deployments);

  if (dd.length === 1) {
    return false;
  }
  if (dd.length > 2) {
    throw new Error('test fail');
  }

  return dd[1].state === 'OK';
};

describe('test', function () {
  this.timeout(120000);

  before(async function () {
    console.log('undeploying application');
    await api.undeploy();
    await recorder.start(deploymentOK);
    console.log('  done.');
  });

  afterEach(async function () {
    await api.undeploy();
    recorder.reset();
  });

  it('deploy with default configuration', async () => {
    // arrange
    await confUpdater.reset();

    // act
    await api.redeploy().then();
    const result = await recorder.start(deploymentOK);

    // assert
    expect(result.status).to.equal('match');
    const ld = findLastDeployment(result.data);
    expect(getStates(ld)).to.equal('WIP -> OK');
    const is = getInstancesStates(ld);
    expect(is).to.length(1);
    expect(is[0]).to.equal('BOOTING -> STARTING -> DEPLOYING -> UP');
  });
});
