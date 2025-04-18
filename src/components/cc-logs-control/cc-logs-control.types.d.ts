import { Timezone } from '../../lib/date/date.types.js';
import { DateDisplay } from '../cc-logs/date-display.types.js';

export type LogsControlPalette = 'default' | 'One Light' | 'Tokyo Night Light' | 'Night Owl' | 'Everblush' | 'Hyoob';

export interface LogsMetadataDisplay {
  label: string;
  hidden: boolean;
}

export interface LogsOptions {
  'date-display': DateDisplay;
  'metadata-display': Record<string, boolean>;
  palette: LogsControlPalette;
  timezone: Timezone;
  'wrap-lines': boolean;
  'strip-ansi': boolean;
}

export interface LogsOptionsChangeEventData {
  /** The name of the option that has changed */
  name: keyof LogsOptions;
  /** The new options */
  options: LogsOptions;
}
