import { random } from '../../lib/utils.js';

/**
 * @import { CellarBucketState, CellarBucketDetailsState } from '../../components/cc-cellar-bucket-list/cc-cellar-bucket-list.types.js'
 * @import { CellarObjectState, CellarFileState, CellarFileDetailsState } from '../../components/cc-cellar-object-list/cc-cellar-object-list.types.js'
 * @import { CellarBucket, CellarFileDetails } from '../../components/cc-cellar-explorer/cc-cellar-explorer.client.types.js'
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

/**
 * @type {Record<string, string>}
 */
const CONTENT_TYPES_BY_EXTENSION = {
  'txt': 'text/plain',
  'jpg': 'image/jpeg',
  'zip': 'application/zip',
  'pdf': 'application/pdf',
  'mp3': 'audio/mpeg',
  'mp4': 'video/mp4',
}

/**
 * @param {string} extension
 * @param {Array<string>} [path]
 * @returns {CellarFileDetails}
 **/
export function fileDetails(extension, path) {
  const name = `file-1.${extension}`;
  return {
    type: 'file',
    name: name,
    key: path == null || path.length === 0 ? name : path.join('/') + '/' + name,
    updatedAt: new Date().toISOString(),
    contentLength: random(150_000, 2_000_000),
    contentType: CONTENT_TYPES_BY_EXTENSION[extension] ?? 'application/octet-stream',
    tags: [{key: 'tag1', value: 'value1'}, {key: 'tag2', value: 'value2'}],
    acl: [
      { grantee: [{id: 'user', name: 'user', type: 'CanonicalUser'}], permission: 'FULL_CONTROL' },
    ],
    metadata: {metadata1: 'value1', metadata2: 'value2'},
  }
}

/**
 * @param {string} extension
 * @param {Array<string>} [path]
 * @returns {CellarFileState}
 **/
export function fileState(extension, path ) {
  return {
    state: 'idle',
    ...fileDetails(extension, path),
  }
}

/**
 * @param {string} extension
 * @param {Array<string>} [path]
 * @returns {CellarFileDetailsState}
 **/
export function fileDetailsState(extension, path ) {
  return {
    state: 'idle',
    ...fileDetails(extension, path),
  }
}

/**
 * @param {number|Array<string>} directories
 * @param {number|Array<string>} files
 * @returns {Array<CellarObjectState>}
 */
export function objects(directories, files) {
  return [...generateDirectories(directories), ...generateFiles(files) ];
}

/**
 * @param {number|Array<string>} count
 * @returns {Array<CellarObjectState>}
 */
function generateFiles(count) {
  /**
   * @param {string} name
   * @returns {CellarObjectState}
   */
  const toFile = (name) => ({
    type: 'file',
    state: 'idle',
    name,
    key: name,
    updatedAt: new Date().toISOString(),
    contentLength: random(150_000, 2_000_000),
  });
  if (typeof count === 'number') {
    return [...Array(count)].map((_, i) => toFile(`file-${i + 1}.txt`));
  }

  return count.map(toFile);
}

/**
 * @param {number|Array<string>} count
 * @returns {Array<CellarObjectState>}
 */
function generateDirectories(count) {
  /**
   * @param {string} name
   * @returns {CellarObjectState}
   */
  const toDir = (name) => ({
    type: 'directory',
    name,
    key: name,
  });
  if (typeof count === 'number') {
    return [...Array(count)].map((_, i) => toDir(`dir-${i + 1}`));
  }

  return count.map(toDir);
}