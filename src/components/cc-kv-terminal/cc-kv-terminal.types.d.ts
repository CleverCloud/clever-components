export type CcKvTerminalState = CcKvTerminalStateIdle | CcKvTerminalStateRunning;

export interface CcKvTerminalStateIdle {
  type: 'idle';
  history: Array<CcKvCommandHistoryEntry>;
}

export interface CcKvTerminalStateRunning {
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
  hasResult: boolean;
}

interface CcKvCommandContentItemResultLine {
  id: string;
  type: 'resultLine';
  line: string;
  success: boolean;
  last: boolean;
}
