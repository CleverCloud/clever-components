export type CcKvKeyStringEditorState =
  | CcKvKeyStringEditorStateLoading
  | CcKvKeyStringEditorStateIdle
  | CcKvKeyStringEditorStateSaving;

export interface CcKvKeyStringEditorStateLoading {
  type: 'loading';
}

export interface CcKvKeyStringEditorStateIdle {
  type: 'idle';
  value: string;
}

export interface CcKvKeyStringEditorStateSaving {
  type: 'saving';
  value: string;
}
