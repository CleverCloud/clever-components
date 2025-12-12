export type CellarExplorerState = CellarExplorerStateLoading | CellarExplorerStateError | CellarExplorerStateLoaded;

export interface CellarExplorerStateLoading {
  type: 'loading';
}

export interface CellarExplorerStateError {
  type: 'error';
}

export interface CellarExplorerStateLoaded {
  type: 'loaded';
  list: CellarExplorerBucketsListState;
}

export type CellarExplorerItemsListState = CellarExplorerBucketsListState;

export type CellarExplorerBucketsListState =
  | CellarExplorerBucketsListStateLoading
  | CellarExplorerBucketsListStateError
  | CellarExplorerBucketsListStateLoaded;

export interface CellarExplorerItemsListStateAbstract {
  level: 'buckets';
}

export interface CellarExplorerBucketsListStateLoading extends CellarExplorerItemsListStateAbstract {
  type: 'loading';
}

export interface CellarExplorerBucketsListStateError extends CellarExplorerItemsListStateAbstract {
  type: 'error';
  filter?: string;
}

export interface CellarExplorerBucketsListStateLoaded extends CellarExplorerItemsListStateAbstract {
  type: 'loaded';
  filter?: string;
  sort: CellarBucketSort;
  total: number;
  items: Array<CellarBucketState>;
  details?: CellarBucketDetailsState;
  createForm?: CellarBucketCreateFormState;
}

export type CellarItemState<S, T> = T & {
  state: S;
};

export type CellarBucketState = CellarItemState<CellarBucketStateType, CellarItemBucket>;
export type CellarBucketStateType = 'idle' | 'fetching';

export type CellarBucketDetailsState = CellarItemState<CellarBucketDetailsStateType, CellarBucketDetails>;
export type CellarBucketDetailsStateType = 'idle' | 'deleting';

export interface CellarItemBucket extends CellarBucket {
  type: 'bucket';
}

export interface CellarBucketCreateFormState {
  type: 'idle' | 'creating';
  bucketName: string;
  error?: 'bucket-already-exists' | 'bucket-name-invalid' | 'too-many-buckets';
}

export interface CellarBucketSort {
  column: CellarBucketSortColumn;
  direction: 'asc' | 'desc';
}

export type CellarBucketSortColumn = 'name' | 'updatedAt' | 'objectsCount' | 'sizeInBytes';

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
  createdAt: string;
  updatedAt: string;
  objectsCount: number;
  sizeInBytes: number;
  versioning?: CellarBucketVersioning;
}

export interface CellarBucketDetails extends CellarBucket {}

export type CellarBucketVersioning = 'disabled' | 'enabled' | 'suspended';
