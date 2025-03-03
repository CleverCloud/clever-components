import { randomString } from '../../lib/utils.js';
import { shiftDateField } from '../../lib/date/date-utils.js';

/**
 * @typedef {import('../../components/cc-logs-instances/cc-logs-instances.types.js').Instance} Instance
 * @typedef {import('../../components/cc-logs-instances/cc-logs-instances.types.js').GhostInstance} GhostInstance
 * @typedef {import('../../components/cc-logs-instances/cc-logs-instances.types.js').InstanceKind} InstanceKind
 * @typedef {import('../../components/cc-logs-instances/cc-logs-instances.types.js').InstanceState} InstanceState
 * @typedef {import('../../components/cc-logs-instances/cc-logs-instances.types.js').Deployment} Deployment
 * @typedef {import('../../components/cc-logs-instances/cc-logs-instances.types.js').DeploymentState} DeploymentState
 */

/**
 * @param {Deployment} deployment
 * @param {number} index
 * @param {InstanceKind} kind
 * @param {InstanceState} state
 * @param {string} name
 * @return {Instance}
 */
export function createInstance(deployment, index, kind, state, name) {
  return {
    ghost: false,
    id: randomUUID(),
    deployment,
    creationDate: new Date(),
    index,
    kind,
    state,
    name,
  };
}

/**
 * @return {GhostInstance}
 */
export function createGhostInstance() {
  return {
    ghost: true,
    id: randomUUID(),
  };
}

/**
 * @param {DeploymentState} state
 * @param {number} sinceDay
 * @returns {Deployment}
 */
export function createDeployment(state, sinceDay) {
  return {
    id: `deployment_${randomUUID()}`,
    state,
    creationDate: shiftDateField(new Date(), 'D', -sinceDay),
    commitId: randomCommit(),
  };
}

function randomCommit() {
  return randomString(40, 'abcdef0123456789');
}

function randomUUID() {
  const alphabet = '0123456789abcdef';
  return `${randomString(8, alphabet)}-${randomString(4, alphabet)}-4${randomString(3, alphabet)}-${randomString(4, alphabet)}-${randomString(12, alphabet)}`;
}

