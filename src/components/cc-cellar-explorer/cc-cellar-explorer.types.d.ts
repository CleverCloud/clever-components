import { CellarBucketListState } from '../cc-cellar-bucket-list/cc-cellar-bucket-list.types.js';

export type CellarExplorerState = CellarExplorerStateLoading | CellarExplorerStateError | CellarExplorerStateLoaded;

export interface CellarExplorerStateLoading {
  type: 'loading';
}

export interface CellarExplorerStateError {
  type: 'error';
}

export interface CellarExplorerStateLoaded {
  type: 'loaded';
  level: CellarExplorerLevel;
}

export type CellarExplorerLevel = CellarExplorerLevelBuckets;

export interface CellarExplorerLevelBuckets {
  type: 'buckets';
  state: CellarBucketListState;
}
