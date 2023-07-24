import { expect } from '@bundled-es-modules/chai';
import { TimestampFormatter } from '../src/lib/timestamp-formatter.js';

const timestamp = 1679581653888;

describe('timestamp formatter', function () {
  describe('format() method', function () {
    it('should return an empty string when display is "none"', function () {
      expect(new TimestampFormatter('none', 'UTC').format(timestamp))
        .to.equal('');
    });
    it('should return iso datetime when display is "datetime-iso"', function () {
      expect(new TimestampFormatter('datetime-iso', 'UTC').format(timestamp))
        .to.equal('2023-03-23T16:27:33.888Z');
    });
    it('should return iso time when display is "time-iso"', function () {
      expect(new TimestampFormatter('time-iso', 'UTC').format(timestamp))
        .to.equal('16:27:33.888Z');
    });
    it('should return short datetime when display is "datetime-short"', function () {
      expect(new TimestampFormatter('datetime-short', 'UTC').format(timestamp))
        .to.equal('2023-03-23 16:27:33');
    });
    it('should return short time when display is "time-short"', function () {
      expect(new TimestampFormatter('time-short', 'UTC').format(timestamp))
        .to.equal('16:27:33');
    });
    it('should return the right time when timezone is "local"', function () {
      // note that this test passes because we emulate the Europe/Paris timezone when launching test in browser.
      expect(new TimestampFormatter('datetime-iso', 'local').format(timestamp))
        .to.equal('2023-03-23T17:27:33.888+01:00');
    });
  });
  describe('formatToParts() method', function () {
    it('should return an empty object when display is "none"', function () {
      expect(new TimestampFormatter('none', 'UTC').formatToParts(timestamp))
        .to.eql({});
    });
    it('should return iso datetime when display is "datetime-iso"', function () {
      expect(new TimestampFormatter('datetime-iso', 'UTC').formatToParts(timestamp))
        .to.eql({
          date: '2023-03-23',
          separator: 'T',
          time: '16:27:33',
          milliseconds: '.888',
          timezone: 'Z',
        });
    });
    it('should return iso time when display is "time-iso"', function () {
      expect(new TimestampFormatter('time-iso', 'UTC').formatToParts(timestamp))
        .to.eql({
          time: '16:27:33',
          milliseconds: '.888',
          timezone: 'Z',
        });
    });
    it('should return short datetime when display is "datetime-short"', function () {
      expect(new TimestampFormatter('datetime-short', 'UTC').formatToParts(timestamp))
        .to.eql({
          date: '2023-03-23',
          separator: ' ',
          time: '16:27:33',
        });
    });
    it('should return short time when display is "time-short"', function () {
      expect(new TimestampFormatter('time-short', 'UTC').formatToParts(timestamp))
        .to.eql({
          time: '16:27:33',
        });
    });
    it('should return the right time when timezone is "local"', function () {
      // note that this test passes because we emulate the Europe/Paris timezone when launching test in browser.
      expect(new TimestampFormatter('datetime-iso', 'local').formatToParts(timestamp))
        .to.eql({
          date: '2023-03-23',
          separator: 'T',
          time: '17:27:33',
          milliseconds: '.888',
          timezone: '+01:00',
        });
    });
  });

});
