import { expect } from '@bundled-es-modules/chai';
import { groupBy, range } from '../src/lib/utils.js';

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
