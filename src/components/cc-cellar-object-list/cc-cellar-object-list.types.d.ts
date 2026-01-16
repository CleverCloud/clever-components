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
