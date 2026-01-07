import { describe, it, expect, vi } from 'vitest';
import { Buffer } from '../src/lib/buffer.js';
import { sleep } from '../src/lib/utils.js';

describe('Buffer', () => {
  it('should throw error when constructing without any flush condition', () => {
    expect(() => new Buffer(() => {}, {})).toThrow();
  });

  describe('flush() method', () => {
    it('should not call flush callback when nothing in buffer', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });

      buffer.flush();

      expect(spy.mock.calls.length).toBe(0);
    });

    it('should call flush callback even if flush condition is not met', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });
      buffer.add(1);

      buffer.flush();

      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toEqual([1]);
    });
  });

  describe('clear() method', () => {
    it('should clear the buffer', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });
      buffer.add(1);

      buffer.clear();

      expect(buffer.length).toBe(0);
    });
  });

  describe('length getter', () => {
    it('should return 0 after creating buffer', () => {
      const spy = vi.fn();

      const buffer = new Buffer(spy, { length: 2 });

      expect(buffer.length).toBe(0);
    });

    it('should return 1 after adding an item to buffer', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });

      buffer.add(1);

      expect(buffer.length).toBe(1);
    });

    it('should return 0 after calling the clear() method', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });
      buffer.add(1);

      buffer.clear();

      expect(buffer.length).toBe(0);
    });
  });

  describe('with length condition', () => {
    it('should throw error when constructing without length 0', () => {
      expect(() => new Buffer(() => {}, { length: 0 })).toThrow();
    });

    it('should throw error when constructing without length lower than 0', () => {
      expect(() => new Buffer(() => {}, { length: -1 })).toThrow();
    });

    it('should not flush when max length is not reached', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });

      buffer.add(1);

      expect(spy.mock.calls.length).toBe(0);
    });

    it('should flush when max length is reached', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { length: 2 });

      buffer.add(1);
      buffer.add(2);

      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toEqual([1, 2]);
    });
  });

  describe('with timeout condition', () => {
    it('should throw error when constructing without timeout 0', () => {
      expect(() => new Buffer(() => {}, { timeout: 0 })).toThrow();
    });

    it('should throw error when constructing without timeout lower than 0', () => {
      expect(() => new Buffer(() => {}, { timeout: -1 })).toThrow();
    });

    it('should not flush when timeout is not reached', () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { timeout: 100 });

      buffer.add(1);
      buffer.add(2);
      buffer.add(3);

      expect(spy.mock.calls.length).toBe(0);
    });

    it('should flush when timeout is reached', async () => {
      const spy = vi.fn();
      const buffer = new Buffer(spy, { timeout: 100 });

      buffer.add(1);
      buffer.add(2);
      buffer.add(3);
      await sleep(100);

      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toEqual([1, 2, 3]);
    });
  });
});
