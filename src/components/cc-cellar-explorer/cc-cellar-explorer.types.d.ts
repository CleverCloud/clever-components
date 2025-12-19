import { CellarBucketListState } from '../cc-cellar-bucket-list/cc-cellar-bucket-list.types.js';
import { CellarObjectListState } from '../cc-cellar-object-list/cc-cellar-object-list.types.js';

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

export type CellarExplorerLevel = CellarExplorerLevelBuckets | CellarExplorerLevelObjects;

export interface CellarExplorerLevelBuckets {
  type: 'buckets';
  state: CellarBucketListState;
}

export interface CellarExplorerLevelObjects {
  type: 'objects';
  state: CellarObjectListState;
}
