import { describe, expect, it } from 'vitest';
import { matchKvPattern } from './kv-utils.js';

describe.only('matchKvPattern', () => {
  it('should match with *', () => {
    expect(matchKvPattern('a*c', 'ac')).toBe(true);
    expect(matchKvPattern('a*c', 'abc')).toBe(true);
    expect(matchKvPattern('a*c', 'abbc')).toBe(true);
    expect(matchKvPattern('a*c', 'bc')).toBe(false);
    expect(matchKvPattern('a*c', 'ab')).toBe(false);
  });

  it('should match with ?', () => {
    expect(matchKvPattern('a?c', 'ac')).toBe(false);
    expect(matchKvPattern('a?c', 'abc')).toBe(true);
    expect(matchKvPattern('a?c', 'abbc')).toBe(false);
  });

  it('should match with [...]', () => {
    expect(matchKvPattern('a[A-Z]c', 'ac')).toBe(false);
    expect(matchKvPattern('a[A-Z]c', 'aBc')).toBe(true);
    expect(matchKvPattern('a[A-Z]c', 'abc')).toBe(false);
  });

  it('should match escaped *', () => {
    expect(matchKvPattern('a\\*c', 'a*c')).toBe(true);
    expect(matchKvPattern('a\\*c', 'ac')).toBe(false);
    expect(matchKvPattern('a\\*c', 'abc')).toBe(false);
  });

  it('should match escaped ?', () => {
    expect(matchKvPattern('a\\?c', 'a?c')).toBe(true);
    expect(matchKvPattern('a\\?c', 'abc')).toBe(false);
  });

  it('should match escaped [', () => {
    expect(matchKvPattern('a\\[c]', 'a[c]')).toBe(true);
  });

  it('should match with regex special chars', () => {
    expect(matchKvPattern(':a(.+){2}\\', ':a(.+){2}\\')).toBe(true);
  });
});
