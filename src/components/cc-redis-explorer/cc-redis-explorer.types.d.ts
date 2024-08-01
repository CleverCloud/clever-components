export type CcRedisExplorerState =
  | CcRedisExplorerStateLoading
  | CcRedisExplorerStateError
  | CcRedisExplorerStateFetchingKeys
  | CcRedisExplorerStateLoaded;

export interface CcRedisExplorerStateLoading {
  type: 'loading';
}

export interface CcRedisExplorerStateError {
  type: 'error';
}

export interface CcRedisExplorerStateFetchingKeys {
  type: 'fetching-keys';
  keys: Array<CcRedisKeyState>;
}

export interface CcRedisExplorerStateLoaded {
  type: 'loaded';
  keys: Array<CcRedisKeyState>;
  total: number;
  hasMore: boolean;
}

export type CcRedisKeyState =
  | CcRedisKeyStateIdle
  | CcRedisKeyStateLoading
  | CcRedisKeyStateSelected
  | CcRedisKeyStateDeleting;

export interface CcRedisKeyStateIdle {
  type: 'idle';
  key: CcRedisKey;
}

export interface CcRedisKeyStateLoading {
  type: 'loading';
  key: CcRedisKey;
}

export interface CcRedisKeyStateSelected {
  type: 'selected';
  key: CcRedisKey;
}

export interface CcRedisKeyStateDeleting {
  type: 'deleting';
  key: CcRedisKey;
}

export interface CcRedisKey {
  type: CcRedisKeyType;
  key: string;
}

// export type CcRedisKeyType = 'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream';
export type CcRedisKeyType = 'string' | 'list' | 'hash';

export type CcRedisKeyValue = CcRedisKeyValueString | CcRedisKeyValueList | CcRedisKeyValueHash;

export interface CcRedisKeyValueString {
  type: 'string';
  key: string;
  value: string;
}
export interface CcRedisKeyValueList {
  type: 'list';
  key: string;
  values: Array<string>;
}
export interface CcRedisKeyValueHash {
  type: 'hash';
  key: string;
  values: Array<CcRedisKeyValueHashEntry>;
}

export interface CcRedisKeyValueHashEntry {
  field: string;
  value: string;
}

export type CcRedisExplorerKeyEditorState =
  | CcRedisExplorerKeyEditorStateHidden
  | CcRedisExplorerKeyEditorStateAdd
  | CcRedisExplorerKeyEditorStateLoading
  | CcRedisExplorerKeyEditorStateUpdate;

export interface CcRedisExplorerKeyEditorStateHidden {
  type: 'hidden';
}

export interface CcRedisExplorerKeyEditorStateAdd {
  type: 'add';
  formState: CcRedisExplorerKeyAddFormState;
}

export interface CcRedisExplorerKeyAddFormState {
  type: 'idle' | 'adding';
  errors?: {
    name?: 'already-used';
    type?: 'unsupported';
  };
}

export interface CcRedisExplorerKeyEditorStateLoading {
  type: 'loading';
  key: CcRedisKey;
}

export interface CcRedisExplorerKeyEditorStateUpdate {
  type: 'update';
  formState: CcRedisExplorerKeyUpdateFormState;
  keyValue: CcRedisKeyValue;
}

export interface CcRedisExplorerKeyUpdateFormState {
  type: 'idle' | 'updating';
  errors?: {};
}

export interface CcRedisExplorerShellState {
  history: Array<{ command: string; result: Array<string>; error: boolean }>;
  runningCommand?: string;
}
