import { expect } from '@bundled-es-modules/chai';
import { bindNumber, groupBy, isStringEmpty, range } from '../src/lib/utils.js';

describe('groupBy function', function () {
  it('should group by given key', function () {
    expect(groupBy([{ key: 'a', value: 1 }, { key: 'a', value: 2 }, { key: 'b', value: 3 }], 'key'))
      .to.eql({ a: [{ key: 'a', value: 1 }, { key: 'a', value: 2 }], b: [{ key: 'b', value: 3 }] });
  });
  it('should ignore unknown keys', function () {
    expect(groupBy([{ key: 'a', value: 1 }, { key: 'a', value: 2 }, { key: 'b', value: 3 }], 'unknown'))
      .to.eql({ });
  });
});

describe('range function', function () {
  it('should return array', function () {
    expect(range(5, 10)).to.be.an.instanceof(Array);
  });
  it('should return a single item array when start equals end', function () {
    expect(range(10, 10))
      .to.eql([10]);
  });
  it('should return all items between start and end', function () {
    expect(range(2, 10))
      .to.eql([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('should return all items when start is after end', function () {
    expect(range(10, 2))
      .to.eql([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('bindNumber function', () => {
  it('should bind on lower bound', () => {
    expect(bindNumber(10, 12, 15))
      .to.eql(12);
  });
  it('should bind on upper bound', () => {
    expect(bindNumber(18, 12, 15))
      .to.eql(15);
  });
  it('should return number when inside bounds', () => {
    expect(bindNumber(14, 12, 15))
      .to.eql(14);
  });
  it('should work when lower bound is undefined', () => {
    expect(bindNumber(14, undefined, 15))
      .to.eql(14);
    expect(bindNumber(16, undefined, 15))
      .to.eql(15);
  });
  it('should work when upper bound is undefined', () => {
    expect(bindNumber(14, 12, undefined))
      .to.eql(14);
    expect(bindNumber(10, 12, undefined))
      .to.eql(12);
  });
  it('should return number when bounds is undefined', () => {
    expect(bindNumber(14, undefined, undefined))
      .to.eql(14);
  });
});

describe('isStringEmpty', () => {
  it('should return true with null', () => {
    expect(isStringEmpty(null))
      .to.eql(true);
  });
  it('should return true with undefined', () => {
    expect(isStringEmpty(undefined))
      .to.eql(true);
  });
  it('should return true with empty string', () => {
    expect(isStringEmpty(''))
      .to.eql(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringEmpty('non-empty-string'))
      .to.eql(false);
  });
});
