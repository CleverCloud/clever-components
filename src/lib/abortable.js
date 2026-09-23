import { isCcRequestErrorWithCode } from '@clevercloud/client/utils/error-utils.js';

/**
 * Whether the given error was raised because the operation was aborted.
 *
 * Two shapes reach us, and both mean the same thing. The platform rejects with a `DOMException`
 * named `AbortError` when a raw `fetch()` (or any API taking an `AbortSignal`) is aborted. The
 * Clever Cloud client catches that one and rethrows a `CcRequestError` carrying the `ABORTED` code.
 *
 * @param {unknown} error The error to test
 * @returns {boolean}
 */
export function isAbortError(error) {
  if (isCcRequestErrorWithCode(error, 'ABORTED')) {
    return true;
  }
  return error instanceof DOMException && error.name === 'AbortError';
}

export class Abortable {
  constructor() {
    /** @type {AbortController} */
    this.abortCtrl = null;
  }

  abort() {
    this.abortCtrl?.abort();
  }

  /**
   * @param {(...args: Array<any>) => Promise<T>} func
   * @returns {Promise<T>}
   * @template T
   */
  run(func) {
    this.abort();
    this.abortCtrl = new AbortController();

    return new Promise((resolve, reject) => {
      func(this.abortCtrl.signal)
        .then(resolve)
        .catch((e) => {
          if (!isAbortError(e)) {
            reject(e);
          }
        });
    });
  }
}
