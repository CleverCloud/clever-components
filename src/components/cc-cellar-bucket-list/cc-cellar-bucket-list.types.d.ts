import { CellarBucket, CellarBucketDetails } from '../cc-cellar-explorer/cc-cellar-explorer.client.types.js';

export type CellarBucketListState =
  | CellarBucketListStateLoading
  | CellarBucketListStateError
  | CellarBucketListStateLoaded;

export interface CellarBucketListStateLoading {
  type: 'loading';
}

export interface CellarBucketListStateError {
  type: 'error';
}

export interface CellarBucketListStateLoaded {
  type: 'loaded';
  filter?: string;
  sort: CellarBucketSort;
  total: number;
  buckets: Array<CellarBucketState>;
  details?: CellarBucketDetailsState;
  createForm?: CellarBucketCreateFormState;
}

export interface CellarBucketState extends CellarBucket {
  state: 'idle' | 'fetching';
}

export interface CellarBucketDetailsState extends CellarBucketDetails {
  state: 'idle' | 'deleting';
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
