export type LogsLoadingProgressState =
  | LogsLoadingProgressStateIdle
  | LogsLoadingProgressStateRunning
  | LogsLoadingProgressStatePaused
  | LogsLoadingProgressStateOverflowLimitReached
  | LogsLoadingProgressStateCompleted;

export interface LogsLoadingProgressStateIdle {
  type: 'idle';
}

export interface LogsLoadingProgressStateRunning {
  type: 'running';
  value: number;
  percent?: number;
  overflowing: boolean;
}

export interface LogsLoadingProgressStatePaused {
  type: 'paused';
  value: number;
  percent?: number;
  overflowing: boolean;
}

export interface LogsLoadingProgressStateOverflowLimitReached {
  type: 'overflowLimitReached';
  value: number;
  percent?: number;
}

export interface LogsLoadingProgressStateCompleted {
  type: 'completed';
  value: number;
  overflowing: boolean;
}
