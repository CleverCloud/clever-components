import { DateDisplay } from "../cc-logs/date-display.types";
import { Timezone } from "../../lib/date/date.types";

export type LogsControlPalette = "default" | "One Light" | "Tokyo Night Light" | "Night Owl" | "Everblush" | "Hyoob";

export interface LogsControlWrapLinesOption {
  name: "wrap-lines";
  value: boolean;
}

export interface LogsControlDateDisplayOption {
  name: "date-display";
  value: DateDisplay;
}

export interface LogsControlTimezoneOption {
  name: "timezone";
  value: Timezone;
}

export interface LogsControlPaletteOption {
  name: "palette";
  value: LogsControlPalette;
}

export interface LogsControlStripAnsiOption {
  name: "strip-ansi";
  value: boolean;
}

export interface LogsControlDisplayedMetadataOption {
  name: "metadata-display";
  value: { [key: string]: boolean };
}

export type LogsControlOption =
  LogsControlWrapLinesOption
  | LogsControlDateDisplayOption
  | LogsControlTimezoneOption
  | LogsControlPaletteOption
  | LogsControlStripAnsiOption
  | LogsControlDisplayedMetadataOption;

export interface LogsMetadataDisplay {
  label: string;
  hidden: boolean;
}
