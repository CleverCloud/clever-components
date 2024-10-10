export type CcKvConsoleState = CcKvConsoleStateIdle | CcKvConsoleStateRunning;

export interface CcKvConsoleStateIdle {
  type: 'idle';
  history: Array<CcKvCommandHistoryEntry>;
}

export interface CcKvConsoleStateRunning {
  type: 'running';
  commandLine: string;
  history: Array<CcKvCommandHistoryEntry>;
}

export interface CcKvCommandHistoryEntry {
  commandLine: string;
  result: Array<string>;
  success: boolean;
}
