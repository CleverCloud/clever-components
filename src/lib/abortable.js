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
          if (!(e instanceof DOMException && e.name === 'AbortError')) {
            reject(e);
          }
        });
    });
  }
}
