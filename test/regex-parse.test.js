import { describe, expect, it } from 'vitest';
import { parseRegex } from '../src/lib/regex-parse.js';

describe('parseRegex function', () => {
  it('should detect flags', () => {
    const regExp = parseRegex('/abc/dgimsuy');

    expect(regExp.flags).toBe('dgimsuy');
  });

  it('should extract the right source', () => {
    const regExp = parseRegex('/abc/dgimsuy');

    expect(regExp.source).toBe('abc');
  });

  it('should set full source when not leading slash', () => {
    const regExp = parseRegex('abc');

    expect(regExp.source).toBe('abc');
  });

  it('should set no flags not leading slash', () => {
    const regExp = parseRegex('abc');

    expect(regExp.flags).toBe('');
  });

  it('should ignore unsupported flags', () => {
    const regExp = parseRegex('/abc/dxgritmwsfuky');

    expect(regExp.flags).toBe('dgimsuy');
  });

  it('should throw exception when regex is invalid', () => {
    expect(() => parseRegex('a(bc')).toThrow(Error);
  });

  it('should throw exception when regex starts with a slash but does not finish with a slash', () => {
    expect(() => parseRegex('/abc')).toThrow(Error);
  });

  it('should be greedy on slash', () => {
    const regExp = parseRegex('//prefix/h.+o/suffix/');

    expect(regExp.source).toBe('\\/prefix\\/h.+o\\/suffix');
  });

  it('should match URL path', () => {
    const regExp = parseRegex('//prefix/h.+o/suffix/');

    const match = '/prefix/hello/suffix'.match(regExp);
    expect(match).not.toBeNull();
  });
});
