import { random } from '../../lib/utils.js';

/**
 * @import { CellarBucketState, CellarBucketDetailsState } from '../../components/cc-cellar-bucket-list/cc-cellar-bucket-list.types.js'
 * @import { CellarBucket } from '../../components/cc-cellar-explorer/cc-cellar-explorer.client.types.js'
 */


/** @type {CellarBucket} */
export const bucket1 = {
  name: `bucket-1`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sizeInBytes: random(150_000, 2_000_000),
  objectsCount: random(1_000, 1_000_000),
  versioning: 'enabled',
};

/** @type {CellarBucketState} */
export const bucket1State = {
  state: 'idle',
  ...bucket1,
};

/** @type {CellarBucketDetailsState} */
export const bucket1Details = {
  state: 'idle',
  ...bucket1,
};

/** @type {CellarBucket} */
export const bucketEmpty = {
  name: `bucket-empty`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sizeInBytes: 0,
  objectsCount: 0,
  versioning: 'enabled',
};

/** @type {CellarBucketState} */
export const bucketEmptyState = {
  state: 'idle',
  ...bucketEmpty,
};

/** @type {CellarBucketDetailsState} */
export const bucketEmptyDetails = {
  state: 'idle',
  ...bucketEmpty,
};

/**
 * @param {number|Array<string>} count
 * @returns {Array<CellarBucketState>}
 */
export function buckets(count) {
  /**
   * @param {string} name
   * @returns {CellarBucketState}
   */
  const toBucket = (name) => ({
    state: 'idle',
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizeInBytes: random(150_000, 2_000_000),
    objectsCount: random(1_000, 1_000_000),
  });
  if (typeof count === 'number') {
    return [...Array(count)].map((_, i) => toBucket(`bucket-${i + 1}`));
  }

  return count.map(toBucket);
}
