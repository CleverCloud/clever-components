import { expect } from '@bundled-es-modules/chai';
import { clampNumber, isStringEmpty } from '../src/lib/utils.js';

describe('clampNumber function', () => {
  it('should bind on lower bound', () => {
    expect(clampNumber(10, 12, 15))
      .to.eql(12);
  });
  it('should bind on upper bound', () => {
    expect(clampNumber(18, 12, 15))
      .to.eql(15);
  });
  it('should return number when inside bounds', () => {
    expect(clampNumber(14, 12, 15))
      .to.eql(14);
  });
  it('should work when lower bound is undefined', () => {
    expect(clampNumber(14, undefined, 15))
      .to.eql(14);
    expect(clampNumber(16, undefined, 15))
      .to.eql(15);
  });
  it('should work when upper bound is undefined', () => {
    expect(clampNumber(14, 12, undefined))
      .to.eql(14);
    expect(clampNumber(10, 12, undefined))
      .to.eql(12);
  });
  it('should return number when bounds is undefined', () => {
    expect(clampNumber(14, undefined, undefined))
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
