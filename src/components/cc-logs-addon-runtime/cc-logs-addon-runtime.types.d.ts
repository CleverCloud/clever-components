import { Timezone } from '../../lib/date/date.types.js';
import { LogsStreamState } from '../../lib/logs/logs-stream.types.js';
import { LogsControlPalette } from '../cc-logs-control/cc-logs-control.types.js';
import { DateDisplay } from '../cc-logs/date-display.types.js';

export interface LogsAddonRuntimeState {
  type: 'loaded';
  streamState: LogsStreamState;
}

export interface LogsAddonRuntimeOptions {
  'date-display': DateDisplay;
  'metadata-display': {
    instance: boolean;
  };
  palette: LogsControlPalette;
  'strip-ansi': boolean;
  timezone: Timezone;
  'wrap-lines': boolean;
}
