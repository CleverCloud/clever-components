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
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * Whether an error must be ignored because the work that raised it was aborted.
 *
 * Once the signal is aborted, nobody waits for that work anymore, whatever the error says.
 *
 * @param {AbortSignal} signal
 * @param {unknown} error
 * @returns {boolean}
 */
export function isAborted(signal, error) {
  return signal.aborted || isAbortError(error);
}

/**
 * Handles an error with the given callback, unless the work that raised it was aborted.
 *
 * @param {AbortSignal} signal
 * @param {E} error
 * @param {(error: E) => void} onError
 * @template E
 */
export function unlessAborted(signal, error, onError) {
  if (!isAborted(signal, error)) {
    onError(error);
  }
}
