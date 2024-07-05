/**
 * This class allows memory caching with support of maximum cache size.
 *
 * @template K the data type
 * @template V the value type
 */
export class MemoryCache {
  /**
   * @param {(key: K) => V} valueProvider The function that should return the value in case of cache miss.
   * @param {null|number} [size] The max size of the cache with FIFO eviction policy. If `null`, size is unlimited.
   * @param {(key: K) => any} [keySerializer] The function that returns the serialized version of the key.
   *                                          This serialized version will be used internally to store the key and value correspondance.
   */
  constructor(valueProvider, size = null, keySerializer = (key) => key) {
    this._valueProvider = valueProvider;
    this._size = size;
    this._keySerializer = keySerializer;

    /** @type {Map<K, V>} */
    this._map = new Map();
    /** @type {Array} */
    this._keys = [];
  }

  /**
   * @param {K} key - The data of the value to retrieve.
   * @return {V} - The value associated with the key that have been extracted from the given `data`
   */
  get(key) {
    const serializedKey = this._keySerializer(key);
    if (this._map.has(serializedKey)) {
      return this._map.get(serializedKey);
    }
    const value = this._valueProvider(key);
    this._map.set(serializedKey, value);
    this._keys.push(serializedKey);
    if (this._size != null && this._keys.length > this._size) {
      const toDelete = this._keys.shift();
      this._map.delete(toDelete);
    }
    return value;
  }

  /**
   * @param {K} key The key to check.
   * @return {boolean} Whether the cache has a value for the given `key`.
   */
  has(key) {
    return this._map.has(this._keySerializer(key));
  }

  /**
   * Removes the value associated with the given key.
   *
   * @param {K} key - The key to evict from cache.
   */
  evict(key) {
    const serializedKey = this._keySerializer(key);
    if (!this._map.has(serializedKey)) {
      return;
    }
    this._keys.splice(this._keys.indexOf(serializedKey), 1);
    this._map.delete(serializedKey);
  }

  /**
   * Clears the cache.
   */
  clear() {
    this._map.clear();
    this._keys = [];
  }
}
