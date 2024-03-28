import { expect } from '@bundled-es-modules/chai';
import { DateFormatter } from '../../src/lib/date/date-formatter.js';

const date = new Date('2023-03-23T14:27:33.888Z');

describe('DateFormatter', function () {
  describe('format() method', function () {
    describe('when format is "datetime-iso', () => {
      it('should return the right time when timezone is "UTC" at midnight', function () {
        expect(new DateFormatter('datetime-iso', 'UTC').format(new Date('2023-03-23T00:00:00.000Z')))
          .to.equal('2023-03-23T00:00:00.000Z');
      });
      it('should return the right time when timezone is "UTC"', function () {
        expect(new DateFormatter('datetime-iso', 'UTC').format(date))
          .to.equal('2023-03-23T14:27:33.888Z');
      });
      it('should return the right time when timezone is "local"', function () {
        // note that this test passes because we emulate the Europe/Paris timezone when launching test in browser.
        expect(new DateFormatter('datetime-iso', 'local').format(date))
          .to.equal('2023-03-23T15:27:33.888+01:00');
      });
    });

    describe('when format is "datetime-short', () => {
      it('should return the right time when timezone is "UTC" at midnight', function () {
        expect(new DateFormatter('datetime-short', 'UTC').format(new Date('2023-03-23T00:00:00.000Z')))
          .to.equal('2023-03-23 00:00:00');
      });
      it('should return the right time when timezone is "UTC"', function () {
        expect(new DateFormatter('datetime-short', 'UTC').format(date))
          .to.equal('2023-03-23 14:27:33');
      });
      it('should return the right time when timezone is "local"', function () {
        // note that this test passes because we emulate the Europe/Paris timezone when launching test in browser.
        expect(new DateFormatter('datetime-short', 'local').format(date))
          .to.equal('2023-03-23 15:27:33');
      });
    });
  });
});
