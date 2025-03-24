import { LogsStreamState } from '../../lib/logs/logs-stream.types.js';

export interface LogsAppAccessState {
  type: 'loaded';
  streamState: LogsStreamState;
}
