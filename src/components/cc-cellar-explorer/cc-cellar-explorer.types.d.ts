export type CellarExplorerState = CellarExplorerStateLoading | CellarExplorerStateError | CellarExplorerStateLoaded;

export interface CellarExplorerStateLoading {
  type: 'loading';
}

export interface CellarExplorerStateError {
  type: 'error';
}

export interface CellarExplorerStateLoaded {
  type: 'loaded';
  list: CellarExplorerItemsListState;
}

export type CellarExplorerItemsListState =
  | CellarExplorerItemsListStateLoading
  | CellarExplorerItemsListStateError
  | CellarExplorerItemsListStateBucketsLoaded
  | CellarExplorerItemsListStateObjectsLoaded;

export interface CellarExplorerItemsListStateLoading {
  type: 'loading';
  bucket?: string;
  path?: Array<string>;
  level: 'buckets' | 'objects';
}

export interface CellarExplorerItemsListStateError {
  type: 'error';
  bucket?: string;
  path?: Array<string>;
  level: 'buckets' | 'objects';
}

export interface CellarExplorerItemsListStateBucketsLoaded {
  type: 'loaded';
  level: 'buckets';
  items: Array<CellarItemStateBucket>;
}

export interface CellarExplorerItemsListStateObjectsLoaded {
  type: 'loaded';
  path: Array<string>;
  bucket: string;
  level: 'objects';
  items: Array<CellarItemStateDirectory | CellarItemStateObject>;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type CellarItemState<S, T> = T & {
  state: S;
};

export type CellarItemStateBucket = CellarItemState<CellarBucketStateType, CellarItemBucket>;
export type CellarItemStateObject = CellarItemState<CellarObjectStateType, CellarItemObject>;
export type CellarItemStateDirectory = CellarItemState<CellarDirectoryStateType, CellarItemDirectory>;
export type CellarBucketStateType = 'idle' | 'showing' | 'shown' | 'deleting';
export interface CellarItemBucket extends CellarBucket {
  type: 'bucket';
}

export type CellarObjectStateType = 'idle' | 'showing' | 'shown' | 'deleting';
export interface CellarItemObject extends CellarObject {}

export type CellarDirectoryStateType = 'idle';
export interface CellarItemDirectory extends CellarDirectory {}

//-- API

export interface CellarEndpoint {
  host: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface CellarBucketsListResponse {
  cursor?: string;
  buckets: Array<CellarBucket>;
  total: number;
}

export interface CellarObjectsListResponse {
  cursor?: string;
  content: Array<CellarObject | CellarDirectory>;
}

export interface CellarBucket {
  name: string;
  creationDate: string;
  lastUpdatedDate: string;
  objectsCount: number;
  sizeInBytes: number;
  versioning?: 'disabled' | 'enabled' | 'suspended';
}

export interface CellarObject {
  type: 'file';
  name: string;
  fullName: string;
  lastUpdatedDate: string;
  contentLength: number;
}

export interface CellarDirectory {
  type: 'directory';
  name: string;
  fullName: string;
}
