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
  //todo: do we need a value prop here ?
}

//todo: do we really need this state ?
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

export type CcRedisKeyValue = CcRedisKeyValueString | CcRedisKeyValueList | CcRedisKeyValueHash;

export interface CcRedisKeyValueString {
  type: 'string';
  name: string;
  value: string;
}
export interface CcRedisKeyValueList {
  type: 'list';
  name: string;
  values: Array<string>;
}
export interface CcRedisKeyValueHash {
  type: 'hash';
  name: string;
  values: Array<CcRedisKeyValueHashEntry>;
}

export interface CcRedisKeyValueHashEntry {
  field: string;
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
  | CcRedisExplorerKeyEditorStateAdd
  | CcRedisExplorerKeyEditorStateEdit;

export interface CcRedisExplorerKeyEditorStateHidden {
  type: 'hidden';
}

export interface CcRedisExplorerKeyEditorStateAdd {
  type: 'add';
  addFormState: CcRedisExplorerKeyAddFormState;
}

export interface CcRedisExplorerKeyAddFormState {
  type: 'idle' | 'adding';
  errors?: {
    name?: 'already-used';
    type?: 'unsupported';
  };
}

export interface CcRedisExplorerKeyEditorStateEdit {
  type: 'edit';
  editFormState: CcRedisExplorerKeyEditFormState;
  keyValue: CcRedisKeyValue;
}

export interface CcRedisExplorerKeyEditFormState {
  type: 'idle' | 'saving';
  errors?: {};
}

//
// export type CcRedisExplorerKeyEditorState =
//   | CcRedisExplorerKeyEditorStateHidden
//   | CcRedisExplorerKeyEditorStateIdle
//   | CcRedisExplorerKeyEditorStateSaving;
//
// export interface CcRedisExplorerKeyEditorStateHidden {
//   type: 'hidden';
// }
//
// export interface CcRedisExplorerKeyEditorStateIdle {
//   type: 'idle';
//   initialKeyValue: CcRedisKeyValue | null;
// }
//
// export interface CcRedisExplorerKeyEditorStateSaving {
//   type: 'saving';
//   initialKeyValue: CcRedisKeyValue | null;
// }
//
// export interface CcRedisExplorerKeyEditorStateAddMode {
//   type: 'add-mode';
// }
//
// export interface CcRedisExplorerKeyEditorStateEditMode {
//   type: 'edit-mode';
//   keyValue: CcRedisKeyValue;
// }
//
// export interface CcRedisExplorerKeyEditorStateUpdating {
//   type: 'updating';
//   initialKeyValue: CcRedisKeyValue | null;
// }
//
// export interface CcRedisExplorerKeyEditorStateAdding {
//   type: 'adding';
// }
