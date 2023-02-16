/**
 * This class allows memory caching with support of maximum cache size.
 */
export class MemoryCache {
  /**
   * @param {null|number} size - The max size of the cache with FIFO eviction policy. If `null`, size is unlimited.
   * @param {(key: K) => V} valueProvider - The function that should return the value in case of cache miss.
   * @template K
   * @template V
   */
  constructor (valueProvider, size = null) {
    this.size = size;
    this.valueProvider = valueProvider;
    /** @type {Map<K, V>} */
    this._map = new Map();
    /** @type {Array<K>} */
    this._keys = [];
  }

  /**
   * @param {K} key - the key of the value to retrieve
   * @return {V} - The value associated with the given `key`
   */
  get (key) {
    if (this._map.has(key)) {
      return this._map.get(key);
    }
    const value = this.valueProvider(key);
    this._map.set(key, value);
    this._keys.push(key);
    if (this.size != null && this._keys.length > this.size) {
      const toDelete = this._keys.splice(0, 1);
      this._map.delete(toDelete[0]);
    }
    return value;
  }

  /**
   * @param {K} key
   * @return {boolean} Whether the cache has a value for the given `key`.
   */
  has (key) {
    return this._map.has(key);
  }

  /**
   * Removes the value associated with the given `key`
   * @param {K} key
   */
  evict (key) {
    if (!this._map.has(key)) {
      return;
    }
    this._keys.splice(this._keys.indexOf(key), 1);
    this._map.delete(key);
  }

  /**
   * Clears the cache.
   */
  clear () {
    this._map.clear();
    this._keys = [];
  }
}
