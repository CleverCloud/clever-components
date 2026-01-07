import { expect } from '@bundled-es-modules/chai';
import {
  clampNumber,
  findLastIndex,
  groupBy,
  isStringBlank,
  isStringEmpty,
  randomString,
  range,
  trimArray,
} from '../src/lib/utils.js';

describe('range function', function () {
  it('should return array', function () {
    expect(range(5, 10)).to.be.an.instanceof(Array);
  });
  it('should return a single item array when start equals end', function () {
    expect(range(10, 10)).to.eql([10]);
  });
  it('should return all items between start and end', function () {
    expect(range(2, 10)).to.eql([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('should return all items when start is after end', function () {
    expect(range(10, 2)).to.eql([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('clampNumber function', () => {
  it('should bind on lower bound', () => {
    expect(clampNumber(10, 12, 15)).to.eql(12);
  });
  it('should bind on upper bound', () => {
    expect(clampNumber(18, 12, 15)).to.eql(15);
  });
  it('should return number when inside bounds', () => {
    expect(clampNumber(14, 12, 15)).to.eql(14);
  });
  it('should work when lower bound is undefined', () => {
    expect(clampNumber(14, undefined, 15)).to.eql(14);
    expect(clampNumber(16, undefined, 15)).to.eql(15);
  });
  it('should work when upper bound is undefined', () => {
    expect(clampNumber(14, 12, undefined)).to.eql(14);
    expect(clampNumber(10, 12, undefined)).to.eql(12);
  });
  it('should return number when bounds is undefined', () => {
    expect(clampNumber(14, undefined, undefined)).to.eql(14);
  });
});

describe('randomString function', () => {
  it('should be empty if length is 0', () => {
    expect(randomString(0)).to.equal('');
  });

  it('should have a size equal to the given length', () => {
    expect(randomString(10).length).to.equal(10);
  });

  it('should use the given alphabet', () => {
    expect(randomString(3, 'a')).to.equal('aaa');
  });
});

describe('isStringEmpty', () => {
  it('should return true with null', () => {
    expect(isStringEmpty(null)).to.eql(true);
  });
  it('should return true with undefined', () => {
    expect(isStringEmpty(undefined)).to.eql(true);
  });
  it('should return true with empty string', () => {
    expect(isStringEmpty('')).to.eql(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringEmpty('non-empty-string')).to.eql(false);
  });
});

describe('isStringBlank', () => {
  it('should return true with null', () => {
    expect(isStringBlank(null)).to.eql(true);
  });
  it('should return true with undefined', () => {
    expect(isStringBlank(undefined)).to.eql(true);
  });
  it('should return true with empty string', () => {
    expect(isStringBlank('')).to.eql(true);
  });
  it('should return true with blank string', () => {
    expect(isStringBlank('   ')).to.eql(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringBlank('non-blank-string')).to.eql(false);
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

    expect(grouped).to.eql({
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

    expect(grouped).to.eql({
      GROUP1: [{ prop: 'group1', value: '1' }],
    });
  });

  it('should return empty object when giving an empty array', () => {
    const grouped = groupBy([], (o) => o.prop?.toUpperCase());

    expect(grouped).to.eql({});
  });
});

describe('trimArray function', () => {
  describe('null and undefined handling', () => {
    it('should return empty array when input is null', () => {
      expect(trimArray(null, (x) => x == null)).to.eql([]);
    });

    it('should return empty array when input is undefined', () => {
      expect(trimArray(undefined, (x) => x == null)).to.eql([]);
    });
  });

  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(trimArray([], (x) => x === 0)).to.eql([]);
    });
  });

  describe('basic trimming functionality', () => {
    it('should trim nullish values from both ends', () => {
      expect(trimArray([null, null, 1, 2, 3, null, null], (x) => x == null)).to.eql([1, 2, 3]);
    });

    it('should trim zeros from both ends', () => {
      expect(trimArray([0, 0, 1, 2, 3, 0, 0], (x) => x === 0)).to.eql([1, 2, 3]);
    });

    it('should trim empty strings from both ends', () => {
      expect(trimArray(['', '', 'a', 'b', 'c', '', ''], (x) => x === '')).to.eql(['a', 'b', 'c']);
    });

    it('should trim falsy values from both ends', () => {
      expect(trimArray([false, 0, null, 1, 'text', true, null, 0, false], (x) => !x)).to.eql([1, 'text', true]);
    });

    it('should preserve middle elements that match condition', () => {
      expect(trimArray([0, 0, 1, 0, 2, 0, 0], (x) => x === 0)).to.eql([1, 0, 2]);
    });
  });

  describe('edge cases with matching elements', () => {
    it('should return empty array when all elements match condition', () => {
      expect(trimArray([0, 0, 0, 0], (x) => x === 0)).to.eql([]);
    });

    it('should return original array when no elements match condition', () => {
      expect(trimArray([1, 2, 3, 4], (x) => x === 0)).to.eql([1, 2, 3, 4]);
    });

    it('should return empty array for single element that matches', () => {
      expect(trimArray([0], (x) => x === 0)).to.eql([]);
    });

    it('should return single element that does not match', () => {
      expect(trimArray([1], (x) => x === 0)).to.eql([1]);
    });
  });

  describe('asymmetric trimming', () => {
    it('should trim only from start when only start elements match', () => {
      expect(trimArray([0, 0, 0, 1, 2, 3], (x) => x === 0)).to.eql([1, 2, 3]);
    });

    it('should trim only from end when only end elements match', () => {
      expect(trimArray([1, 2, 3, 0, 0, 0], (x) => x === 0)).to.eql([1, 2, 3]);
    });

    it('should handle start with one matching element', () => {
      expect(trimArray([0, 1, 2, 3], (x) => x === 0)).to.eql([1, 2, 3]);
    });

    it('should handle end with one matching element', () => {
      expect(trimArray([1, 2, 3, 0], (x) => x === 0)).to.eql([1, 2, 3]);
    });
  });

  describe('complex conditions', () => {
    it('should trim based on numeric comparison (negative numbers)', () => {
      expect(trimArray([-2, -1, 0, 1, 2, -1, -2], (x) => x < 0)).to.eql([0, 1, 2]);
    });

    it('should trim based on numeric comparison (values below threshold)', () => {
      expect(trimArray([1, 2, 5, 10, 15, 3, 1], (x) => x < 5)).to.eql([5, 10, 15]);
    });

    it('should trim objects based on property values', () => {
      const input = [{ value: 0 }, { value: 0 }, { value: 1 }, { value: 2 }, { value: 0 }, { value: 0 }];
      expect(trimArray(input, (x) => x.value === 0)).to.eql([{ value: 1 }, { value: 2 }]);
    });

    it('should trim based on type checking', () => {
      expect(trimArray(['', '', 1, 2, 'text', '', ''], (x) => typeof x === 'string' && x === '')).to.eql([
        1,
        2,
        'text',
      ]);
    });

    it('should handle array of booleans', () => {
      expect(trimArray([false, false, true, false, true, false, false], (x) => x === false)).to.eql([
        true,
        false,
        true,
      ]);
    });
  });

  describe('preserving array structure', () => {
    it('should preserve order of remaining elements', () => {
      expect(trimArray([0, 5, 4, 3, 2, 1, 0], (x) => x === 0)).to.eql([5, 4, 3, 2, 1]);
    });

    it('should not modify original array', () => {
      const original = [0, 1, 2, 0];
      const result = trimArray(original, (x) => x === 0);
      expect(original).to.eql([0, 1, 2, 0]); // Original unchanged
      expect(result).to.eql([1, 2]); // Result is trimmed
    });

    it('should handle consecutive matching elements correctly', () => {
      expect(trimArray([1, 1, 1, 1, 2, 3, 1, 1, 1], (x) => x === 1)).to.eql([2, 3]);
    });
  });

  describe('real-world use cases', () => {
    it('should trim whitespace-only strings from chart data', () => {
      const data = ['  ', '  ', 'Jan', 'Feb', 'Mar', '  ', '  '];
      expect(trimArray(data, (x) => x.trim() === '')).to.eql(['Jan', 'Feb', 'Mar']);
    });

    it('should trim undefined entries from data array', () => {
      const data = [undefined, undefined, 'data1', 'data2', undefined, 'data3', undefined, undefined];
      expect(trimArray(data, (x) => x === undefined)).to.eql(['data1', 'data2', undefined, 'data3']);
    });

    it('should trim placeholder objects from list', () => {
      const data = [
        { placeholder: true },
        { placeholder: true },
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { placeholder: true },
      ];
      expect(trimArray(data, (x) => x.placeholder === true)).to.eql([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
    });
  });
});

describe('findLastIndex function', () => {
  it('should return -1 when array is null', () => {
    expect(findLastIndex(null, (x) => x > 0)).to.equal(-1);
  });

  it('should return -1 when array is undefined', () => {
    expect(findLastIndex(undefined, (x) => x > 0)).to.equal(-1);
  });

  it('should return -1 when array is empty', () => {
    expect(findLastIndex([], (x) => x > 0)).to.equal(-1);
  });

  it('should return -1 when no element matches', () => {
    expect(findLastIndex([1, 2, 3], (x) => x > 10)).to.equal(-1);
  });

  it('should return index of last matching element', () => {
    expect(findLastIndex([1, 2, 3, 4, 5], (x) => x > 2)).to.equal(4);
  });

  it('should return last index when multiple matches exist', () => {
    expect(findLastIndex([1, 5, 2, 8, 3, 9], (x) => x > 4)).to.equal(5);
  });

  it('should return last index when all elements match', () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x > 0)).to.equal(3);
  });
});
