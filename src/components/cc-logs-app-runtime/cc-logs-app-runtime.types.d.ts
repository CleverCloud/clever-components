import { LogsStreamState } from '../../lib/logs/logs-stream.types.js';
import { GhostInstance, Instance } from '../cc-logs-instances/cc-logs-instances.types.js';

export interface LogsAppRuntimeStateLoadingInstances {
  type: 'loadingInstances';
}

export interface LogsAppRuntimeStateErrorInstances {
  type: 'errorInstances';
}

export interface LogsAppRuntimeStateLoaded {
  type: 'loaded';
  streamState: LogsStreamState;
  instances: Array<Instance | GhostInstance>;
  selection: Array<string>;
}

export type LogsAppRuntimeState =
  | LogsAppRuntimeStateLoadingInstances
  | LogsAppRuntimeStateErrorInstances
  | LogsAppRuntimeStateLoaded;
