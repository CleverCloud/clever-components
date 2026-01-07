import { describe, expect, it, vi } from 'vitest';
import { MemoryCache } from '../src/lib/memory-cache.js';

describe('memory cache', function () {
  it('should call provided function when cache miss', function () {
    const spy = vi.fn();

    new MemoryCache(spy).get('miss');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('miss');
  });

  it('should not call provided function when cache hit', function () {
    const spy = vi.fn();

    const memoryCache = new MemoryCache(spy);
    memoryCache.get('key');
    spy.mockClear();

    memoryCache.get('key');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call key serializer function', function () {
    const spy = vi.fn();

    new MemoryCache(() => null, null, spy).get('key');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('key');
  });

  it('should return the value returned by the provided function', function () {
    const memoryCache = new MemoryCache(() => 'value');
    const value = memoryCache.get('key');
    expect(value).toBe('value');
  });

  it('should return the right value', function () {
    const memoryCache = new MemoryCache((key) => `${key}->value`);
    expect(memoryCache.get('key1')).toBe('key1->value');
    expect(memoryCache.get('key2')).toBe('key2->value');
  });

  it('should return the right value in case of cache hit', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key');
    const value = memoryCache.get('key');
    expect(value).toBe('value');
  });

  it('should remove the first added item when reaching the max size', function () {
    const memoryCache = new MemoryCache(() => 'value', 1);
    memoryCache.get('key1');
    expect(memoryCache.has('key1')).toBe(true);
    memoryCache.get('key2');
    expect(memoryCache.has('key2')).toBe(true);
    expect(memoryCache.has('key1')).toBe(false);
  });

  it('should evict value', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key');
    memoryCache.evict('key');
    expect(memoryCache.has('key')).toBe(false);
  });

  it('should return true when calling has() method when cache hit', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key');
    expect(memoryCache.has('key')).toBe(true);
  });

  it('should return false when calling has() method when cache miss', function () {
    const memoryCache = new MemoryCache(() => 'value');
    expect(memoryCache.has('key')).toBe(false);
  });

  it('should clear', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key1');
    memoryCache.get('key2');
    memoryCache.clear();
    expect(memoryCache.has('key1')).toBe(false);
    expect(memoryCache.has('key2')).toBe(false);
  });
});
