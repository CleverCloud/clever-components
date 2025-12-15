import CleverCloudSse from '@clevercloud/client/esm/streams/clever-cloud-sse.js';

export interface AbstractLog {
  date: Date;
}

export type LogsSse = CleverCloudSse & { onLog: (fn: (log: any) => void) => LogsSse };

export type LogsStreamState =
  | LogsStreamStateIdle
  | LogsStreamStateConnecting
  | LogsStreamStateWaitingForFirstLog
  | LogsStreamStateError
  | LogsStreamStateRunning
  | LogsStreamStateCompleted
  | LogsStreamStatePaused;

export interface LogsStreamStateIdle {
  type: 'idle';
}

export interface LogsStreamStateConnecting {
  type: 'connecting';
}

export interface LogsStreamStateWaitingForFirstLog {
  type: 'waitingForFirstLog';
}

export interface LogsStreamStateRunning {
  type: 'running';
  progress: LogsProgressValue;
  overflowing: boolean;
}

export type LogsStreamStatePaused = LogsStreamStatePausedByOverflow | LogsStreamStatePausedByUser;

export interface LogsStreamStatePausedByOverflow {
  type: 'paused';
  reason: 'overflow';
  progress: LogsProgressValue;
}

export interface LogsStreamStatePausedByUser {
  type: 'paused';
  reason: 'user';
  progress: LogsProgressValue;
  overflowing: boolean;
}

export interface LogsStreamStateCompleted {
  type: 'completed';
  progress: LogsProgressValue;
  overflowing: boolean;
}

export interface LogsStreamStateError {
  type: 'error';
}

export interface LogsProgressValue {
  value: number;
  percent?: number;
}
