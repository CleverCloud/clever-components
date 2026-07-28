import { CreateCellarBucketCommand } from '@clevercloud/client/cc-api-commands/cellar/create-cellar-bucket-command.js';
import { DeleteCellarBucketCommand } from '@clevercloud/client/cc-api-commands/cellar/delete-cellar-bucket-command.js';
import { DeleteCellarObjectCommand } from '@clevercloud/client/cc-api-commands/cellar/delete-cellar-object-command.js';
import { GetCellarBucketCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-bucket-command.js';
import { GetCellarObjectCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-object-command.js';
import { GetCellarObjectDownloadUrlCommand } from '@clevercloud/client/cc-api-commands/cellar/get-cellar-object-download-url-command.js';
import { ListCellarBucketCommand } from '@clevercloud/client/cc-api-commands/cellar/list-cellar-bucket-command.js';
import { ListCellarObjectCommand } from '@clevercloud/client/cc-api-commands/cellar/list-cellar-object-command.js';
import { UploadCellarObjectCommand } from '@clevercloud/client/cc-api-commands/cellar/upload-cellar-object-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';

/**
 * @import { CellarBucket, CellarBucketDetails, CellarBucketsListResponse, CellarObjectsListResponse, CellarFileDetails } from './cc-cellar-explorer.client.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
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
    this._ccApiClient = getCcApiClientWithOAuth(apiConfig);
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
    return this._ccApiClient.send(new ListCellarBucketCommand({ ownerId: this._ownerId, addonId: this._addonId }), {
      signal: signal ?? this._abortController.signal,
    });
  }

  /**
   * @param {string} bucketName
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarBucketDetails>}
   */
  getBucket(bucketName, signal) {
    return this._ccApiClient.send(
      new GetCellarBucketCommand({ ownerId: this._ownerId, addonId: this._addonId, bucketName }),
      { signal: signal ?? this._abortController.signal },
    );
  }

  /**
   * @param {object} payload
   * @param {string} payload.name
   * @param {boolean} payload.versioningEnabled
   * @returns {Promise<CellarBucket>}
   */
  createBucket(payload) {
    return this._ccApiClient.send(
      new CreateCellarBucketCommand({
        ownerId: this._ownerId,
        addonId: this._addonId,
        name: payload.name,
        versioning: payload.versioningEnabled,
      }),
    );
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  deleteBucket(bucketName) {
    return this._ccApiClient.send(
      new DeleteCellarBucketCommand({ ownerId: this._ownerId, addonId: this._addonId, bucketName }),
    );
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

    return this._ccApiClient.send(
      new ListCellarObjectCommand({
        ownerId: this._ownerId,
        addonId: this._addonId,
        bucketName,
        prefix,
        cursor: options.cursor,
        count: 50,
      }),
      { signal: signal ?? this._abortController.signal },
    );
  }

  /**
   * @param {string} bucketName
   * @param {string} objectKey
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarFileDetails | null>}
   */
  getObject(bucketName, objectKey, signal) {
    return this._ccApiClient.send(
      new GetCellarObjectCommand({ ownerId: this._ownerId, addonId: this._addonId, bucketName, objectKey }),
      { signal: signal ?? this._abortController.signal },
    );
  }

  /**
   * @param {string} bucketName
   * @param {string} objectKey
   * @param {number} [expiresIn]
   * @param {AbortSignal} [signal]
   * @returns {Promise<{url: string}>}
   */
  getObjectSignedUrl(bucketName, objectKey, expiresIn, signal) {
    return this._ccApiClient.send(
      new GetCellarObjectDownloadUrlCommand({
        ownerId: this._ownerId,
        addonId: this._addonId,
        bucketName,
        objectKey,
        expiresIn,
      }),
      { signal: signal ?? this._abortController.signal },
    );
  }

  /**
   * @param {string} bucketName
   * @param {string} objectKey
   * @returns {Promise<void>}
   */
  deleteObject(bucketName, objectKey) {
    return this._ccApiClient.send(
      new DeleteCellarObjectCommand({ ownerId: this._ownerId, addonId: this._addonId, bucketName, objectKey }),
    );
  }

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @param {File} file
   * @returns {Promise<void>}
   */
  uploadObject(bucketName, objectName, file) {
    return this._ccApiClient.send(
      new UploadCellarObjectCommand({
        ownerId: this._ownerId,
        addonId: this._addonId,
        bucketName,
        objectKey: objectName,
        content: file,
      }),
    );
  }
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
