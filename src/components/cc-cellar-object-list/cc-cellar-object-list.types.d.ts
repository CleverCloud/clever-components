import {
  CellarDirectory,
  CellarFile,
  CellarFileDetails,
} from '../cc-cellar-explorer/cc-cellar-explorer.client.types.js';

export type CellarObjectListState =
  | CellarObjectListStateLoading
  | CellarObjectListStateError
  | CellarObjectListStateLoaded
  | CellarObjectListStateFiltering;

export interface CellarObjectListStateLoading {
  type: 'loading';
  bucketName: string;
  path: Array<string>;
}

export interface CellarObjectListStateError {
  type: 'error';
  bucketName: string;
}

export interface CellarObjectListStateLoaded {
  type: 'loaded';
  bucketName: string;
  path: Array<string>;
  filter?: string;
  objects: Array<CellarObjectState>;
  details?: CellarFileDetailsState;
  hasPrevious: boolean;
  hasNext: boolean;
  createDirectoryForm?: CellarDirectoryCreateFormState;
  uploadState?: CellarObjectUploadState;
}

export interface CellarObjectUploadState {
  type: 'idle' | 'uploading';
}

export interface CellarObjectListStateFiltering {
  type: 'filtering';
  bucketName: string;
  path: Array<string>;
  filter?: string;
}

export type CellarObjectState = CellarFileState | CellarDirectory;

export interface CellarFileState extends CellarFile {
  state: 'idle' | 'fetching';
}

export interface CellarFileDetailsState extends CellarFileDetails {
  state: 'idle' | 'deleting' | 'downloading';
  signedUrl: string;
}

export interface CellarDirectoryCreateFormState {
  type: 'idle' | 'creating';
  directoryName: string;
  error?: 'directory-already-exists' | 'directory-name-invalid';
}

export type CreationFormError = 'directory-already-exists' | 'directory-name-invalid';
