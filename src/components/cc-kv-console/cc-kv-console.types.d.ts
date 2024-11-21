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

export type CcKvCommandContentItem = CcKvCommandContentItemCommandLine | CcKvCommandContentItemResultLine;

interface CcKvCommandContentItemCommandLine {
  id: string;
  type: 'commandLine';
  line: string;
}

interface CcKvCommandContentItemResultLine {
  id: string;
  type: 'resultLine';
  line: string;
  success: boolean;
  last: boolean;
}
