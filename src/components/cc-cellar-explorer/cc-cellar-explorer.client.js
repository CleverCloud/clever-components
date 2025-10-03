// @ts-expect-error FIXME: remove when clever-client exports types
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { request } from '@clevercloud/client/esm/request.fetch.js';
// @ts-expect-error FIXME: remove when clever-client exports types
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { CcApiErrorEvent } from '../../lib/send-to-api.events.js';

/**
 * @typedef {import('./cc-cellar-explorer.types.js').CellarEndpoint} CellarEndpoint
 * @typedef {import('./cc-cellar-explorer.types.js').CellarBucket} CellarBucket
 * @typedef {import('./cc-cellar-explorer.types.js').CellarBucketsListResponse} CellarBucketsListResponse
 * @typedef {import('../../lib/send-to-api.js').ApiConfig} ApiConfig
 */

export class CellarExplorerClient {
  /**
   * @param {ApiConfig} url
   * @param {CellarEndpoint} cellarEndpoint
   * @param {AbortSignal} signal
   */
  constructor(url, cellarEndpoint, signal) {
    this._url = url;
    this._cellarEndpoint = cellarEndpoint;
    this._signal = signal;
  }

  /**
   * @returns {Promise<CellarBucketsListResponse>}
   */
  getBuckets() {
    return this.#send(`/cellar/bucket/_list`, {}, true);
  }

  /**
   * @param {object} payload
   * @param {string} payload.name
   * @param {boolean} payload.versioningEnabled
   * @returns {Promise<CellarBucket>}
   */
  createBucket(payload) {
    return this.#send(`/cellar/bucket/_create`, payload, false);
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<CellarBucket>}
   */
  getBucket(bucketName) {
    return this.#send(`/cellar/bucket/_get`, { name: bucketName }, true);
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  deleteBucket(bucketName) {
    return this.#send(`/cellar/bucket/_delete`, { name: bucketName }, false);
  }

  /**
   * @param {string} bucketName
   * @returns {Promise<void>}
   */
  clearBucket(bucketName) {
    return this.#send(`/cellar/bucket/_clear`, { name: bucketName }, false);
  }

  /**
   * @param {string} path
   * @param {object} body
   * @param {boolean} withSignal
   * @returns {Promise<T>}
   * @template T
   */
  #send(path, body, withSignal) {
    // @ts-ignore
    return Promise.resolve({
      method: 'post',
      url: path,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: {
        ...body,
        endpoint: this._cellarEndpoint,
      },
    })
      .then(prefixUrl(this._url))
      .then(withOptions({ signal: withSignal ? this._signal : undefined }))
      .then(request)
      .catch((error) => {
        window.dispatchEvent(new CcApiErrorEvent(error));
        throw new CellarExplorerError(error.responseBody.code, error.responseBody.message, error.responseBody.context);
      });
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
