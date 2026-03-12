import { sendToApi } from '../../lib/send-to-api.js';

/**
 * @import { CellarBucket, CellarBucketDetails, CellarBucketsListResponse, CellarObjectsListResponse, CellarFileDetails } from './cc-cellar-explorer.client.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.js'
 */

export class CellarExplorerClient {
  /**
   * @param {object} _
   * @param {ApiConfig} _.apiConfig
   * @param {string} _.ownerId
   * @param {string} _.addonId
   */
  constructor({ apiConfig, ownerId, addonId }) {
    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._abortController = new AbortController();
  }

  close() {
    this._abortController.abort();
  }

  /**
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarBucketsListResponse>}
   */
  listBuckets(signal) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: signal ?? this._abortController.signal }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarBucketDetails>}
   */
  getBucket(bucketName, signal) {
    return Promise.resolve({
      method: 'get',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: signal ?? this._abortController.signal }))
      .catch(catchError);
  }

  /**
   * @param {object} payload
   * @param {string} payload.name
   * @param {boolean} payload.versioningEnabled
   * @returns {Promise<CellarBucket>}
   */
  createBucket(payload) {
    return Promise.resolve({
      method: 'post',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: {
        name: payload.name,
        versioning: payload.versioningEnabled,
      },
    })
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  deleteBucket(bucketName) {
    return Promise.resolve({
      method: 'delete',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @param {Array<string>} path
   * @param {{cursor: string, filter: string}} options
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarObjectsListResponse>}
   */
  listObjects(bucketName, path, options, signal) {
    const prefix = pathToString(path) + (options.filter ?? '');

    return Promise.resolve({
      method: 'get',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}/objects`,
      queryParams: { prefix, cursor: options.cursor, count: 50 },
      headers: { Accept: 'application/json' },
    })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: signal ?? this._abortController.signal }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @param {string} objectKey
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarFileDetails>}
   */
  async getObject(bucketName, objectKey, signal) {
    return await Promise.resolve({
      method: 'get',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}/objects/${encodeURIComponent(objectKey)}`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: signal ?? this._abortController.signal }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @param {string} objectKey
   * @param {number} [expiresIn]
   * @param {AbortSignal} [signal]
   * @returns {Promise<{url: string}>}
   */
  getObjectSignedUrl(bucketName, objectKey, expiresIn, signal) {
    return Promise.resolve({
      method: 'post',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}/objects/download-url`,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: { objectKey, expiresIn },
    })
      .then(sendToApi({ apiConfig: this._apiConfig, signal: signal ?? this._abortController.signal }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @param {string} objectKey
   * @returns {Promise<void>}
   */
  deleteObject(bucketName, objectKey) {
    return Promise.resolve({
      method: 'delete',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}/objects/${encodeURIComponent(objectKey)}`,
      headers: { Accept: 'application/json' },
    })
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .catch(catchError);
  }

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @param {File} file
   */
  uploadObject(bucketName, objectName, file) {
    return Promise.resolve({
      method: 'post',
      url: `/v4/cellar/organisations/${this._ownerId}/cellar/${this._addonId}/buckets/${encodeURIComponent(bucketName)}/objects/upload/${encodeURIComponent(objectName)}`,
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    })
      .then(sendToApi({ apiConfig: this._apiConfig }))
      .catch(catchError);
  }
}

/**
 * @param {any} error
 */
function catchError(error) {
  if (error.responseBody != null) {
    throw new CellarExplorerError(error.responseBody.code, error.responseBody.error, error.responseBody.context);
  }
  throw error;
}

export class CellarExplorerError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {unknown} context
   */
  constructor(code, message, context) {
    super(message);
    this._code = code;
    this._context = context;
  }

  get code() {
    return this._code;
  }

  get context() {
    return this._context;
  }
}

/**
 * @param {unknown} error
 * @returns {error is CellarExplorerError}
 */
export function isCellarExplorerError(error) {
  return error instanceof CellarExplorerError;
}

/**
 * @param {unknown} error
 * @param {string} code
 * @returns {boolean}
 */
export function isCellarExplorerErrorWithCode(error, code) {
  return isCellarExplorerError(error) && error.code === code;
}

/**
 * @param {Array<string>} path
 */
export function pathToString(path) {
  if (path == null || path.length === 0) {
    return '';
  }
  return path.join('/') + '/';
}
