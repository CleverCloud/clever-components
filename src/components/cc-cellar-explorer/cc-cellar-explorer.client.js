import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { CcApiErrorEvent } from '../../lib/send-to-api.events.js';

/**
 * @import { CellarEndpoint, CellarBucket, CellarBucketDetails, CellarBucketsListResponse } from './cc-cellar-explorer.client.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.js'
 */

export class CellarExplorerClient {
  /**
   * @param {ApiConfig} url
   * @param {CellarEndpoint} cellarEndpoint
   */
  constructor(url, cellarEndpoint) {
    this._url = url;
    this._cellarEndpoint = cellarEndpoint;
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
    return this.#send(`/cellar/bucket/_list`, { count: 1000 }, signal ?? this._abortController.signal);
  }

  /**
   * @param {object} payload
   * @param {string} payload.name
   * @param {boolean} payload.versioningEnabled
   * @returns {Promise<CellarBucket>}
   */
  createBucket(payload) {
    return this.#send(`/cellar/bucket/_create`, payload);
  }

  /**
   * @param {string} bucketName
   * @param {AbortSignal} [signal]
   * @returns {Promise<CellarBucketDetails>}
   */
  getBucket(bucketName, signal) {
    return this.#send(`/cellar/bucket/_get`, { name: bucketName }, signal ?? this._abortController.signal);
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  deleteBucket(bucketName) {
    return this.#send(`/cellar/bucket/_delete`, { name: bucketName });
  }

  /**
   * @param {string} path
   * @param {object} body
   * @param {AbortSignal} [signal]
   * @returns {Promise<T>}
   * @template T
   */
  #send(path, body, signal) {
    return /** @type {Promise<T>} */ (
      Promise.resolve({
        method: 'post',
        url: path,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: {
          ...body,
          endpoint: this._cellarEndpoint,
        },
      })
        // @ts-expect-error FIXME: will become irrelevant when we switch to the new client
        .then(prefixUrl(this._url))
        .then(withOptions({ signal }))
        .then(request)
        .catch((error) => {
          window.dispatchEvent(new CcApiErrorEvent(error));
          if (error.responseBody != null) {
            throw new CellarExplorerError(
              error.responseBody.code,
              error.responseBody.message,
              error.responseBody.context,
            );
          }
          throw error;
        })
    );
  }
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
