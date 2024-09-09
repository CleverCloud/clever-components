/**
 * Buffer some items and flush on two conditions:
 *
 * * timeout since last flush: the buffer is flushed whenever the time elapsed since the last flush reaches a given amount.
 * * length of the buffer: the buffer is flushed whenever the buffer length reaches a given amount.
 *
 * You can combine both conditions.
 *
 * @template T
 */
export class Buffer {
  /**
   * @param {(items: Array<T>) => void} onFlush The function to call whenever the buffer flushes.
   * @param {{ timeout?: number, length?: number }} flushConditions The condition on which the buffer should flush.
   * @throws {Error} if the given flushConditions doesn't provide any flush condition.
   */
  constructor(onFlush, flushConditions) {
    this._onFlush = onFlush;
    /** @type {Array<T>} */
    this._bucket = [];
    this._timeout = flushConditions.timeout;
    this._length = flushConditions.length;
    this._timeoutId = null;

    if (this._timeout == null && this._length == null) {
      throw new Error('Illegal argument: You must specify at least one flush condition');
    }

    if (this._timeout != null && this._timeout <= 0) {
      throw new Error('Illegal argument: timeout condition must be greater than 0');
    }

    if (this._length != null && this._length <= 0) {
      throw new Error('Illegal argument: length condition must be greater than 0');
    }

    this._flusher = () => {
      this.flush();
    };
  }

  /**
   * Adds an item to the buffer.
   *
   * @param {T} item The item to add.
   */
  add(item) {
    if (this._timeout != null && this._timeoutId == null) {
      this._timeoutId = setTimeout(this._flusher, this._timeout);
    }

    this._bucket.push(item);

    if (this._length != null && this._bucket.length === this._length) {
      this.flush();
    }
  }

  /**
   * Flushes the buffer.
   */
  flush() {
    const toFlush = [...this._bucket];
    if (toFlush.length > 0) {
      this.clear();
      this._onFlush(toFlush);
    }
  }

  /**
   * Clears the buffer.
   */
  clear() {
    clearTimeout(this._timeoutId);
    this._timeoutId = null;
    this._bucket = [];
  }

  /**
   * @return {number} The length of the buffer
   */
  get length() {
    return this._bucket.length;
  }
}
