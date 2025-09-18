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
  | CellarExplorerItemsListStateBucketsLoaded;

export interface CellarExplorerItemsListStateLoading {
  type: 'loading';
  level: 'buckets'; // or objects
}

export interface CellarExplorerItemsListStateError {
  type: 'error';
  level: 'buckets'; // or objects
}

export interface CellarExplorerItemsListStateBucketsLoaded {
  type: 'loaded';
  level: 'buckets';
  items: Array<CellarItemStateBucket>;
}

export type CellarItemState<S, T> = T & {
  state: S;
};

export type CellarItemStateBucket = CellarItemState<CellarBucketStateType, CellarItemBucket>;
export type CellarBucketStateType = 'idle' | 'showing' | 'shown' | 'deleting';
export interface CellarItemBucket extends CellarBucket {
  type: 'bucket';
}

export interface CellarItemObject {
  type: 'object';
}

export interface CellarItemFolder {
  type: 'folder';
}

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

export interface CellarBucket {
  name: string;
  creationDate: string;
  lastUpdatedDate: string;
  objectsCount: number;
  sizeInBytes: number;
  versioning?: 'disabled' | 'enabled' | 'suspended';
}
