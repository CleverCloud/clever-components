import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
import { MemoryCache } from '../src/lib/memory-cache.js';

describe('memory cache', function () {
  it('should call provided function when cache miss', function () {
    const spy = hanbi.spy();

    new MemoryCache(spy.handler).get('miss');
    expect(spy.called).to.equal(true);
    expect(spy.calledWith('miss')).to.equal(true);
  });

  it('should not call provided function when cache hit', function () {
    const spy = hanbi.spy();

    const memoryCache = new MemoryCache(spy.handler);
    memoryCache.get('key');
    spy.reset();

    memoryCache.get('key');
    expect(spy.called).to.equal(false);
  });

  it('should call key serializer function', function () {
    const spy = hanbi.spy();

    new MemoryCache(() => null, null, spy.handler).get('key');
    expect(spy.called).to.equal(true);
    expect(spy.calledWith('key')).to.equal(true);
  });

  it('should return the value returned by the provided function', function () {
    const memoryCache = new MemoryCache(() => 'value');
    const value = memoryCache.get('key');
    expect(value).to.equal('value');
  });

  it('should return the right value', function () {
    const memoryCache = new MemoryCache((key) => `${key}->value`);
    expect(memoryCache.get('key1')).to.equal('key1->value');
    expect(memoryCache.get('key2')).to.equal('key2->value');
  });

  it('should return the right value in case of cache hit', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key');
    const value = memoryCache.get('key');
    expect(value).to.equal('value');
  });

  it('should remove the first added item when reaching the max size', function () {
    const memoryCache = new MemoryCache(() => 'value', 1);
    memoryCache.get('key1');
    expect(memoryCache.has('key1')).to.equal(true);
    memoryCache.get('key2');
    expect(memoryCache.has('key2')).to.equal(true);
    expect(memoryCache.has('key1')).to.equal(false);
  });

  it('should evict value', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key');
    memoryCache.evict('key');
    expect(memoryCache.has('key')).to.equal(false);
  });

  it('should return true when calling has() method when cache hit', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key');
    expect(memoryCache.has('key')).to.equal(true);
  });

  it('should return false when calling has() method when cache miss', function () {
    const memoryCache = new MemoryCache(() => 'value');
    expect(memoryCache.has('key')).to.equal(false);
  });

  it('should clear', function () {
    const memoryCache = new MemoryCache(() => 'value');
    memoryCache.get('key1');
    memoryCache.get('key2');
    memoryCache.clear();
    expect(memoryCache.has('key1')).to.equal(false);
    expect(memoryCache.has('key2')).to.equal(false);
  });
});
