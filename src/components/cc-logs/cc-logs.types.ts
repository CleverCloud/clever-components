import {TemplateResult} from "lit-html";

interface LogsStateLoading {
  state: "loading";
}

interface LogsStateError {
  state: "error";
}

interface LogsStateLoaded {
  state: "loaded";
  logs: Array<Log>;

}

type LogsState = LogsStateLoading | LogsStateError | LogsStateLoaded

interface Log {
  timestamp: number;
  message: string;
  metadata: Array<Metadata>
}

interface Metadata {
  name: string;
  value: string | number | boolean;
}

type MetadataRenderer = (metadata: Metadata, { index: number, log: Log }) => TemplateResult;

type MessageRenderer = (message: string, { log: Log }) => TemplateResult;

interface TimestampFormat {
  pattern: 'datetime' | 'time';
  precision: 'milliseconds' | 'seconds';
  utc: boolean;
  showZoneOffset: boolean;
}

type TimestampDisplay = 'hidden' | TimestampFormat;
