import { expect } from '@bundled-es-modules/chai';
import { SimpleDateParser } from '../../src/lib/date/simple-date-parser.js';

const localParser = new SimpleDateParser('local');
const utcParser = new SimpleDateParser('UTC');

describe('simple-date-parser', () => {
  // this test suite expect the browser launching the tests to be on the French timezone.
  describe('with local timezone', () => {
    it('should parse well formed date', () => {
      expect(localParser.parse('2023-07-31 13:04:25').toISOString())
        .to.equal('2023-07-31T11:04:25.000Z');
    });
    it('should fail with malformed date', () => {
      expect(() => localParser.parse('malformed'))
        .to.throw();
    });
  });
  describe('with UTC timezone', () => {
    it('should parse well formed date', () => {
      expect(utcParser.parse('2023-07-31 13:04:25').toISOString())
        .to.equal('2023-07-31T13:04:25.000Z');
    });
    it('should fail with malformed date', () => {
      expect(() => utcParser.parse('malformed'))
        .to.throw();
    });
  });
});
