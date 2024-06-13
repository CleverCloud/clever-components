import { expect } from '@bundled-es-modules/chai';
import { parseRegex } from '../src/lib/regex-parse.js';

describe('parseRegex function', () => {
  it('should detect flags', () => {
    const regExp = parseRegex('/abc/dgimsuy');

    expect(regExp.flags).to.eql('dgimsuy');
  });

  it('should extract the right source', () => {
    const regExp = parseRegex('/abc/dgimsuy');

    expect(regExp.source).to.eql('abc');
  });

  it('should set full source when not leading slash', () => {
    const regExp = parseRegex('abc');

    expect(regExp.source).to.eql('abc');
  });

  it('should set no flags not leading slash', () => {
    const regExp = parseRegex('abc');

    expect(regExp.flags).to.eql('');
  });

  it('should ignore unsupported flags', () => {
    const regExp = parseRegex('/abc/dxgritmwsfuky');

    expect(regExp.flags).to.eql('dgimsuy');
  });

  it('should throw exception when regex is invalid', () => {
    expect(() => parseRegex('a(bc')).to.throw(Error);
  });

  it('should throw exception when regex starts with a slash but does not finish with a slash', () => {
    expect(() => parseRegex('/abc')).to.throw(Error);
  });

  it('should be greedy on slash', () => {
    const regExp = parseRegex('//prefix/h.+o/suffix/');

    expect(regExp.source).to.eql('\\/prefix\\/h.+o\\/suffix');
  });

  it('should match URL path', () => {
    const regExp = parseRegex('//prefix/h.+o/suffix/');

    const match = '/prefix/hello/suffix'.match(regExp);
    expect(match).to.not.eql(null);
  });
});
