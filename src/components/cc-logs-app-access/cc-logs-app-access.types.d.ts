import { Timezone } from '../../lib/date/date.types.js';
import { LogsStreamState } from '../../lib/logs/logs-stream.types.js';
import { LogsControlPalette } from '../cc-logs-control/cc-logs-control.types.js';
import { DateDisplay } from '../cc-logs/date-display.types.js';

export interface LogsAppAccessState {
  type: 'loaded';
  streamState: LogsStreamState;
}

export interface LogsAppAccessOptions {
  'date-display': DateDisplay;
  'metadata-display': {
    ip: boolean;
    country: boolean;
    city: boolean;
  };
  palette: LogsControlPalette;
  timezone: Timezone;
  'wrap-lines': boolean;
}
