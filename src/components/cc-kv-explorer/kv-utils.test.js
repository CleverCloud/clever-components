/* eslint-env node, mocha */

import { expect } from '@bundled-es-modules/chai';
import { matchKvPattern } from './kv-utils.js';

describe.only('matchKvPattern', () => {
  it('should match with *', () => {
    expect(matchKvPattern('a*c', 'ac')).to.eql(true);
    expect(matchKvPattern('a*c', 'abc')).to.eql(true);
    expect(matchKvPattern('a*c', 'abbc')).to.eql(true);
    expect(matchKvPattern('a*c', 'bc')).to.eql(false);
    expect(matchKvPattern('a*c', 'ab')).to.eql(false);
  });

  it('should match with ?', () => {
    expect(matchKvPattern('a?c', 'ac')).to.eql(false);
    expect(matchKvPattern('a?c', 'abc')).to.eql(true);
    expect(matchKvPattern('a?c', 'abbc')).to.eql(false);
  });

  it('should match with [...]', () => {
    expect(matchKvPattern('a[A-Z]c', 'ac')).to.eql(false);
    expect(matchKvPattern('a[A-Z]c', 'aBc')).to.eql(true);
    expect(matchKvPattern('a[A-Z]c', 'abc')).to.eql(false);
  });

  it('should match escaped *', () => {
    expect(matchKvPattern('a\\*c', 'a*c')).to.eql(true);
    expect(matchKvPattern('a\\*c', 'ac')).to.eql(false);
    expect(matchKvPattern('a\\*c', 'abc')).to.eql(false);
  });

  it('should match escaped ?', () => {
    expect(matchKvPattern('a\\?c', 'a?c')).to.eql(true);
    expect(matchKvPattern('a\\?c', 'abc')).to.eql(false);
  });

  it('should match escaped [', () => {
    expect(matchKvPattern('a\\[c]', 'a[c]')).to.eql(true);
  });

  it('should match with regex special chars', () => {
    expect(matchKvPattern(':a(.+){2}\\', ':a(.+){2}\\')).to.eql(true);
  });
});
