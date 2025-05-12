import { LogsStreamState } from '../../lib/logs/logs-stream.types.js';

export interface LogsAddonRuntimeState {
  type: 'loaded';
  streamState: LogsStreamState;
}
