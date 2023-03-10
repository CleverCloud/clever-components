import { TimestampDisplay, Timezone } from "../../lib/timestamp-formatter.types";

export type LogsControllerPalette = "default" | "One Light" | "Tokyo Night Light" | "Night Owl" | "Everblush" | "Hyoob";

export interface LogsControllerWrapLinesOption {
  name: "wrap-lines";
  value: boolean;
}

export interface LogsControllerTimestampDisplayOption {
  name: "timestamp-display";
  value: TimestampDisplay;
}

export interface LogsControllerTimezoneOption {
  name: "timezone";
  value: Timezone;
}

export interface LogsControllerPaletteOption {
  name: "palette";
  value: LogsControllerPalette;
}

export interface LogsControllerDisplayedMetadataOption {
  name: "metadata-display";
  value: { [key: string]: boolean };
}

export type LogsControllerOption =
  LogsControllerWrapLinesOption
  | LogsControllerTimestampDisplayOption
  | LogsControllerTimezoneOption
  | LogsControllerPaletteOption
  | LogsControllerDisplayedMetadataOption;

export interface LogsMetadataDisplay {
  label: string;
  hidden: boolean;
}
