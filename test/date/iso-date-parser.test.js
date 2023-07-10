import { expect } from '@bundled-es-modules/chai';
import { IsoDateParser } from '../../src/lib/date/iso-date-parser.js';

const parser = new IsoDateParser();

describe('iso-date-parser', () => {
  it('should parse local date', () => {
    expect(parser.parse('2023-07-31T13:04:25.028+02:00').toISOString())
      .to.equal('2023-07-31T11:04:25.028Z');
  });
  it('should parse UTC date', () => {
    expect(parser.parse('2023-07-31T13:04:25.028Z').toISOString())
      .to.equal('2023-07-31T13:04:25.028Z');
  });
  it('should fail with non ISO', () => {
    expect(() => parser.parse('2023-07-31 13:04:25.028Z'))
      .to.throw();
  });
});
