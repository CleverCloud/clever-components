import { DeploymentState } from '@clevercloud/client/cc-api-commands/deployment/deployment.types.js';
import { InstanceState as RemoteInstanceState } from '@clevercloud/client/cc-api-commands/instance/instance.types.js';

export type LogsInstancesState = LogsInstancesStateLoading | LogsInstancesStateError | LogsInstancesStateLoaded;

export interface LogsInstancesStateLoading {
  state: 'loading';
}

export interface LogsInstancesStateError {
  state: 'error';
}

export interface LogsInstancesStateLoaded {
  state: 'loaded';
  mode: LogsMode;
  instances: Array<Instance | GhostInstance>;
  selection: Array<string>;
}

export type LogsMode = 'live' | 'cold';

export interface Deployment {
  id: string;
  state: DeploymentState;
  creationDate: Date;
  commitId?: string;
  endDate?: Date;
}

/**
 * A ghost instance carries no state at all, so `GHOST` never reaches this component: it is modelled by
 * `GhostInstance` instead.
 */
export type InstanceState = Exclude<RemoteInstanceState, 'GHOST'>;
export type InstanceKind = 'BUILD' | 'RUN';

export interface Instance {
  ghost: false;
  id: string;
  name: string;
  index: number;
  deployment: Deployment;
  state: InstanceState;
  creationDate: Date;
  deletionDate?: Date;
  kind: InstanceKind;
}

export interface GhostInstance {
  ghost: true;
  id: string;
}
