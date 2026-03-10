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
  createForm?: CellarDirectoryCreateFormState;
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
  state: 'idle' | 'deleting';
  signedUrl: string;
}

// region directory

export type CellarDirectoryListState =
  | CellarDirectoryListStateLoading
  | CellarDirectoryListStateError
  | CellarDirectoryListStateLoaded
  | CellarDirectoryListStateFiltering;

export interface CellarDirectoryListStateLoading {
  type: 'loading';
  directoryName: string;
  path: Array<string>;
}

export interface CellarDirectoryListStateError {
  type: 'error';
  directoryName: string;
}

export interface CellarDirectoryListStateLoaded {
  type: 'loaded';
  filter?: string;
  sort: CellarDirectorySort;
  total: number;
  directories: Array<CellarDirectoryState>;
  createForm?: CellarDirectoryCreateFormState;
}

export interface CellarDirectoryListStateFiltering {
  type: 'filtering';
  directoryName: string;
  path: Array<string>;
  filter?: string;
}

export interface CellarDirectoryState extends CellarDirectory {
  state: 'idle' | 'fetching';
}

export interface CellarDirectoryCreateFormState {
  type: 'idle' | 'creating';
  directoryName: string;
  error?: 'directory-already-exists' | 'directory-name-invalid';
}

export interface CellarDirectorySort {
  column: CellarDirectorySortColumn;
  direction: 'asc' | 'desc';
}

export type CellarDirectorySortColumn = 'name' | 'updatedAt';

// end region
