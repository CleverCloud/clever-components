
export type LogsInstancesState = LogsInstancesStateLoading | LogsInstancesStateError | LogsInstancesStateLoaded;

export interface LogsInstancesStateLoading {
  state: "loading";
}

export interface LogsInstancesStateError {
  state: "error";
}

export interface LogsInstancesStateLoaded {
  state: "loaded";
  mode: LogsMode;
  instances: Array<Instance | GhostInstance>;
  selection: Array<string>;
}

export type LogsMode = "live" | "cold";

export type DeploymentState = "QUEUED" | "WORK_IN_PROGRESS" | "SUCCEEDED" | "CANCELLED" | "FAILED";

export interface Deployment {
  id: string;
  state: DeploymentState;
  creationDate: Date;
  commitId: string;
}


export type InstanceState = "BOOTING" | "STARTING" | "DEPLOYING" | "BUILDING" | "READY" | "UP" | "STOPPING" | "DELETED" | "MIGRATION_IN_PROGRESS" | "TASK_IN_PROGRESS";
export type InstanceKind = "BUILD" | "RUN";

export interface Instance {
  id: string;
  name: string;
  index: number;
  deployment: Deployment;
  state: InstanceState;
  creationDate: Date;
  kind: InstanceKind;
}

export interface GhostInstance {
  ghost: true,
  id: string;
}
