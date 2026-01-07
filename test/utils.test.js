import { describe, expect, it } from 'vitest';
import { clampNumber, groupBy, isStringBlank, isStringEmpty, randomString, range } from '../src/lib/utils.js';

describe('range function', function () {
  it('should return array', function () {
    expect(range(5, 10)).toBeInstanceOf(Array);
  });
  it('should return a single item array when start equals end', function () {
    expect(range(10, 10)).toEqual([10]);
  });
  it('should return all items between start and end', function () {
    expect(range(2, 10)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('should return all items when start is after end', function () {
    expect(range(10, 2)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('clampNumber function', () => {
  it('should bind on lower bound', () => {
    expect(clampNumber(10, 12, 15)).toBe(12);
  });
  it('should bind on upper bound', () => {
    expect(clampNumber(18, 12, 15)).toBe(15);
  });
  it('should return number when inside bounds', () => {
    expect(clampNumber(14, 12, 15)).toBe(14);
  });
  it('should work when lower bound is undefined', () => {
    expect(clampNumber(14, undefined, 15)).toBe(14);
    expect(clampNumber(16, undefined, 15)).toBe(15);
  });
  it('should work when upper bound is undefined', () => {
    expect(clampNumber(14, 12, undefined)).toBe(14);
    expect(clampNumber(10, 12, undefined)).toBe(12);
  });
  it('should return number when bounds is undefined', () => {
    expect(clampNumber(14, undefined, undefined)).toBe(14);
  });
});

describe('randomString function', () => {
  it('should be empty if length is 0', () => {
    expect(randomString(0)).toBe('');
  });

  it('should have a size equal to the given length', () => {
    expect(randomString(10).length).toBe(10);
  });

  it('should use the given alphabet', () => {
    expect(randomString(3, 'a')).toBe('aaa');
  });
});

describe('isStringEmpty', () => {
  it('should return true with null', () => {
    expect(isStringEmpty(null)).toBe(true);
  });
  it('should return true with undefined', () => {
    expect(isStringEmpty(undefined)).toBe(true);
  });
  it('should return true with empty string', () => {
    expect(isStringEmpty('')).toBe(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringEmpty('non-empty-string')).toBe(false);
  });
});

describe('isStringBlank', () => {
  it('should return true with null', () => {
    expect(isStringBlank(null)).toBe(true);
  });
  it('should return true with undefined', () => {
    expect(isStringBlank(undefined)).toBe(true);
  });
  it('should return true with empty string', () => {
    expect(isStringBlank('')).toBe(true);
  });
  it('should return true with blank string', () => {
    expect(isStringBlank('   ')).toBe(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringBlank('non-blank-string')).toBe(false);
  });
});

describe('groupBy function', () => {
  it('should group by result of the grouping function', () => {
    const grouped = groupBy(
      [
        { prop: 'group1', value: '1' },
        { prop: 'group2', value: '2' },
        { prop: 'group2', value: '3' },
        { prop: 'group1', value: '4' },
        { prop: 'group3', value: '5' },
      ],
      (o) => o.prop?.toUpperCase(),
    );

    expect(grouped).toEqual({
      GROUP1: [
        { prop: 'group1', value: '1' },
        { prop: 'group1', value: '4' },
      ],
      GROUP2: [
        { prop: 'group2', value: '2' },
        { prop: 'group2', value: '3' },
      ],
      GROUP3: [{ prop: 'group3', value: '5' }],
    });
  });

  it('should drop element for which property is not present', () => {
    const grouped = groupBy([{ prop: 'group1', value: '1' }, { value: '2' }], (o) => o.prop?.toUpperCase());

    expect(grouped).toEqual({
      GROUP1: [{ prop: 'group1', value: '1' }],
    });
  });

  it('should return empty object when giving an empty array', () => {
    const grouped = groupBy([], (o) => o.prop?.toUpperCase());

    expect(grouped).toEqual({});
  });
});
