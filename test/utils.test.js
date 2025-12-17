import { expect } from '@bundled-es-modules/chai';
import {
  clampNumber,
  groupBy,
  isStringBlank,
  isStringEmpty,
  randomString,
  range,
  sortByProps,
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

describe('sortByProps function', () => {
  it('should sort by single property ascending', () => {
    const data = [{ age: 30 }, { age: 25 }, { age: 35 }];
    const sorted = data.sort(sortByProps([['age', 'asc']]));
    expect(sorted).to.eql([{ age: 25 }, { age: 30 }, { age: 35 }]);
  });

  it('should sort by single property descending', () => {
    const data = [{ age: 30 }, { age: 25 }, { age: 35 }];
    const sorted = data.sort(sortByProps([['age', 'desc']]));
    expect(sorted).to.eql([{ age: 35 }, { age: 30 }, { age: 25 }]);
  });

  it('should sort by single string property ascending', () => {
    const data = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
    const sorted = data.sort(sortByProps([['name', 'asc']]));
    expect(sorted).to.eql([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
  });

  it('should sort by single string property descending', () => {
    const data = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
    const sorted = data.sort(sortByProps([['name', 'desc']]));
    expect(sorted).to.eql([{ name: 'Charlie' }, { name: 'Bob' }, { name: 'Alice' }]);
  });

  it('should sort by multiple properties with same direction', () => {
    const data = [
      { age: 25, score: 90 },
      { age: 30, score: 85 },
      { age: 25, score: 85 },
    ];
    const sorted = data.sort(
      sortByProps([
        ['age', 'asc'],
        ['score', 'asc'],
      ]),
    );
    expect(sorted).to.eql([
      { age: 25, score: 85 },
      { age: 25, score: 90 },
      { age: 30, score: 85 },
    ]);
  });

  it('should sort by multiple properties with mixed directions', () => {
    const data = [
      { name: 'Alice', age: 30, score: 85 },
      { name: 'Bob', age: 25, score: 90 },
      { name: 'Charlie', age: 25, score: 85 },
    ];
    const sorted = data.sort(
      sortByProps([
        ['age', 'asc'],
        ['score', 'desc'],
      ]),
    );
    expect(sorted).to.eql([
      { name: 'Bob', age: 25, score: 90 },
      { name: 'Charlie', age: 25, score: 85 },
      { name: 'Alice', age: 30, score: 85 },
    ]);
  });

  it('should sort by three properties with different directions', () => {
    const data = [
      { dept: 'Sales', age: 25, score: 90 },
      { dept: 'IT', age: 30, score: 85 },
      { dept: 'Sales', age: 25, score: 85 },
      { dept: 'IT', age: 25, score: 90 },
    ];
    const sorted = data.sort(
      sortByProps([
        ['dept', 'asc'],
        ['age', 'desc'],
        ['score', 'asc'],
      ]),
    );
    expect(sorted).to.eql([
      { dept: 'IT', age: 30, score: 85 },
      { dept: 'IT', age: 25, score: 90 },
      { dept: 'Sales', age: 25, score: 85 },
      { dept: 'Sales', age: 25, score: 90 },
    ]);
  });

  it('should convert mixed types to strings when one is not a number', () => {
    const data = [{ value: 100 }, { value: '20' }, { value: 3 }];
    const sorted = data.sort(sortByProps([['value', 'asc']]));
    // All converted to strings: '100' < '20' < '3'
    expect(sorted).to.eql([{ value: 100 }, { value: '20' }, { value: 3 }]);
  });

  it('should use secondary sort when primary values are equal', () => {
    const data = [
      { category: 'A', priority: 2 },
      { category: 'A', priority: 1 },
      { category: 'A', priority: 3 },
    ];
    const sorted = data.sort(
      sortByProps([
        ['category', 'asc'],
        ['priority', 'asc'],
      ]),
    );
    expect(sorted).to.eql([
      { category: 'A', priority: 1 },
      { category: 'A', priority: 2 },
      { category: 'A', priority: 3 },
    ]);
  });

  it('should handle empty array', () => {
    const data = [];
    const sorted = data.sort(sortByProps([['value', 'asc']]));
    expect(sorted).to.eql([]);
  });

  it('should handle single element array', () => {
    const data = [{ value: 42 }];
    const sorted = data.sort(sortByProps([['value', 'asc']]));
    expect(sorted).to.eql([{ value: 42 }]);
  });
});
