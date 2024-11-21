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

export type CcKvCommandContentItem =
  | CcKvCommandContentItemCommandLine
  | CcKvCommandContentItemResultLine
  | CcKvCommandContentItemPrompt
  | CcKvCommandContentItemCaret;

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

interface CcKvCommandContentItemPrompt {
  id: string;
  type: 'prompt';
  command: string;
  running: boolean;
}

interface CcKvCommandContentItemCaret {
  id: string;
  type: 'caret';
}
