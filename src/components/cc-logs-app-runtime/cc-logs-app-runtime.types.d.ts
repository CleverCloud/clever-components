import { Timezone } from '../../lib/date/date.types.js';
import { LogsStreamState } from '../../lib/logs/logs-stream.types.js';
import { LogsControlPalette } from '../cc-logs-control/cc-logs-control.types.js';
import { GhostInstance, Instance } from '../cc-logs-instances/cc-logs-instances.types.js';
import { DateDisplay } from '../cc-logs/date-display.types.js';

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

export interface LogsAppRuntimeOptions {
  'date-display': DateDisplay;
  'metadata-display': {
    instance: boolean;
  };
  palette: LogsControlPalette;
  'strip-ansi': boolean;
  timezone: Timezone;
  'wrap-lines': boolean;
}
