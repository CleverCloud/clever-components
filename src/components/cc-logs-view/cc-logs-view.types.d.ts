export interface LogsViewStateLoadingInstances {
  type: 'loadingInstances';
}

export interface LogsViewStateConnectingLogs {
  type: 'connectingLogs';
  instances: Array<Instance>;
}

export interface LogsViewStateLoadingLogs {
  type: 'loadingLogs';
  instances: Array<Instance>;
}


export interface LogsViewStateLoaded {
  type: 'loaded';
  instances: Array<Instance>;
}

export interface LogsViewStateErrorInstances {
  type: 'errorInstances';
}

export interface LogsViewStateErrorLogs {
  type: 'errorLogs';
  instances: Array<Instance>;
}

export type LogsViewState = LogsViewStateLoadingInstances | LogsViewStateConnectingLogs | LogsViewStateLoadingLogs | LogsViewStateLoaded | LogsViewStateErrorInstances | LogsViewStateErrorLogs;

export interface Instance {
  id: string;
  displayName: string;
  commit: string;
  state: InstanceState;
  flavor: string;
  instanceNumber: number;
  creationDate: string;
  deployId: string;
  deployState: DeploymentState;
  deployAction: DeploymentAction;
  deployCause: string;
  deployDate: string;
}

export type InstanceState = 'BOOTING' | 'STARTING' | 'DEPLOYING' | 'READY' | 'UP' | 'STOPPING' | 'DELETED';
export type DeploymentState = 'WIP' | 'OK' | 'FAIL' | 'CANCELLED';
export type DeploymentAction = 'DEPLOY' | 'UPSCALE' | 'DOWNSCALE';

export interface LiveRange {
  type: 'live';
  since: string;
}

export interface ColdRange {
  type: 'cold';
  since: string;
  until: string;
}

export type DateRange = LiveRange | ColdRange;
