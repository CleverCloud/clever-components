export type CcRedisExplorerState = CcRedisExplorerStateLoading | CcRedisExplorerStateError | CcRedisExplorerStateLoaded;

export interface CcRedisExplorerStateLoading {
  type: 'loading';
}

export interface CcRedisExplorerStateError {
  type: 'error';
}

export interface CcRedisExplorerStateLoaded {
  type: 'loaded';
  keys: Array<CcRedisKeyState>;
}

export type CcRedisKeyState =
  | CcRedisKeyStateIdle
  | CcRedisKeyStateLoading
  | CcRedisKeyStateSelected
  | CcRedisKeyStateUpdating
  | CcRedisKeyStateDeleting;

export interface CcRedisKeyStateLoading {
  type: 'loading';
  key: CcRedisKey;
}

export interface CcRedisKeyStateIdle {
  type: 'idle';
  key: CcRedisKey;
}

export interface CcRedisKeyStateSelected {
  type: 'selected';
  key: CcRedisKey;
}

export interface CcRedisKeyStateUpdating {
  type: 'updating';
  key: CcRedisKey;
}

export interface CcRedisKeyStateDeleting {
  type: 'deleting';
  key: CcRedisKey;
}

export interface CcRedisKey {
  type: CcRedisKeyType;
  name: string;
}

// export type CcRedisKeyType = 'string' | 'list' | 'set' | 'zset' | 'hash' | 'stream';
export type CcRedisKeyType = 'string' | 'list' | 'hash';

export type CcRedisKeyValue = CcRedisKeyValueString | CcRedisKeyValueList | CcRedisKeyValueStringHash;

export interface CcRedisKeyValueString {
  type: 'string';
  name: string;
  value: string;
}
export interface CcRedisKeyValueList {
  type: 'string';
  name: string;
  value: string;
}
export interface CcRedisKeyValueStringHash {
  type: 'string';
  name: string;
  value: string;
}

// export type CcRedisKey = CcRedisKeyString | CcRedisKeyList | CcRedisKeyHash;
// export interface CcRedisKeyString {
//   type: 'string';
//   value: string;
// }
//
// export interface CcRedisKeyList {
//   type: 'list';
//   values: Array<string>;
// }
//
// export interface CcRedisKeyHash {
//   type: 'hash';
//   values: Array<{ field: string; value: string }>;
// }

// export type CcRedisExplorerFormState =
//   | CcRedisExplorerFormStateHidden
//   | CcRedisExplorerFormStateDisplayed
//   | CcRedisExplorerFormStateAdding;
//
// export interface CcRedisExplorerFormStateHidden {
//   type: 'hidden';
// }
//
// export interface CcRedisExplorerFormStateDisplayed {
//   type: 'displayed';
// }
//
// export interface CcRedisExplorerFormStateAdding {
//   type: 'adding';
// }

export type CcRedisExplorerKeyEditorState =
  | CcRedisExplorerKeyEditorStateHidden
  | CcRedisExplorerKeyEditorStateIdle
  | CcRedisExplorerKeyEditorStateSaving;

export interface CcRedisExplorerKeyEditorStateHidden {
  type: 'hidden';
}

export interface CcRedisExplorerKeyEditorStateIdle {
  type: 'idle';
  initialKeyValue: CcRedisKeyValue | null;
}

export interface CcRedisExplorerKeyEditorStateSaving {
  type: 'saving';
  initialKeyValue: CcRedisKeyValue | null;
}
