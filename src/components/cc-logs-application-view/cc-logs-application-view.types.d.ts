import { GhostInstance, Instance } from "../cc-logs-instances/cc-logs-instances.types";
import { DateDisplay } from "../cc-logs/date-display.types";
import { LogsControlPalette } from "../cc-logs-control/cc-logs-control.types";
import { Timezone } from "../../lib/date/date.types";

export interface LogsApplicationViewStateLoadingInstances {
  type: 'loadingInstances';
}

export interface LogsApplicationViewStateErrorInstances {
  type: 'errorInstances';
}

export interface LogsApplicationViewStateLogs {
  type: 'connectingLogs' | 'receivingLogs'| 'logStreamPaused' | 'logStreamEnded' | 'errorLogs';
  instances: Array<Instance | GhostInstance>;
  selection: Array<string>;
}


export type LogsApplicationViewState = LogsApplicationViewStateLoadingInstances | LogsApplicationViewStateLogs | LogsApplicationViewStateErrorInstances;

export type DateRange = {
  since: string;
  until?: string;
}

export interface DateRangeSelectionLive {
  type: 'live',
}

export type DateRangeSelectionPredefinedDefinition = 'lastHour' | 'last4Hours' | 'last7Days' | 'today' | 'yesterday';

export interface DateRangeSelectionPredefined {
  type: 'predefined',
  def: DateRangeSelectionPredefinedDefinition,
}

export interface DateRangeSelectionCustom {
  type: 'custom',
  since: string;
  until: string;
}

export type DateRangeSelection = DateRangeSelectionLive | DateRangeSelectionPredefined | DateRangeSelectionCustom;


export type DateRangeSelectionMenuEntry = 'live' | 'custom' | DateRangeSelectionPredefinedDefinition;


export interface Valid {
  valid: true;
}
export interface Invalid {
  valid: false;
  code: string;
}
export type Validity = Valid | Invalid;

export interface LogsApplicationViewOptions {
  'date-display': DateDisplay,
  'metadata-display': {
    instance: boolean
  },
  palette: LogsControlPalette,
  'strip-ansi': boolean,
  timezone: Timezone,
  'wrap-lines': boolean,
}
