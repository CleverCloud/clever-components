/* eslint-env node, mocha */

import { expect } from '@bundled-es-modules/chai';
import { DateDisplayer } from './date-displayer.js';

const date = new Date(1679581653888);

describe('date displayer', function () {
  describe('format() method', function () {
    it('should return an empty string when display is "none"', function () {
      expect(new DateDisplayer('none', 'UTC').format(date))
        .to.equal('');
    });
    it('should return iso datetime when display is "datetime-iso"', function () {
      expect(new DateDisplayer('datetime-iso', 'UTC').format(date))
        .to.equal('2023-03-23T14:27:33.888Z');
    });
    it('should return iso time when display is "time-iso"', function () {
      expect(new DateDisplayer('time-iso', 'UTC').format(date))
        .to.equal('14:27:33.888Z');
    });
    it('should return short datetime when display is "datetime-short"', function () {
      expect(new DateDisplayer('datetime-short', 'UTC').format(date))
        .to.equal('2023-03-23 14:27:33');
    });
    it('should return short time when display is "time-short"', function () {
      expect(new DateDisplayer('time-short', 'UTC').format(date))
        .to.equal('14:27:33');
    });
    it('should return the right time when timezone is "local"', function () {
      // note that this test passes because we emulate the Europe/Paris timezone when launching test in browser.
      expect(new DateDisplayer('datetime-iso', 'local').format(date))
        .to.equal('2023-03-23T15:27:33.888+01:00');
    });
  });
  describe('formatToParts() method', function () {
    it('should return an empty object when display is "none"', function () {
      expect(new DateDisplayer('none', 'UTC').formatToParts(date))
        .to.eql({});
    });
    it('should return iso datetime when display is "datetime-iso"', function () {
      expect(new DateDisplayer('datetime-iso', 'UTC').formatToParts(date))
        .to.eql({
          date: '2023-03-23',
          separator: 'T',
          time: '14:27:33',
          millisecond: '.888',
          timezone: 'Z',
        });
    });
    it('should return iso time when display is "time-iso"', function () {
      expect(new DateDisplayer('time-iso', 'UTC').formatToParts(date))
        .to.eql({
          time: '14:27:33',
          millisecond: '.888',
          timezone: 'Z',
        });
    });
    it('should return short datetime when display is "datetime-short"', function () {
      expect(new DateDisplayer('datetime-short', 'UTC').formatToParts(date))
        .to.eql({
          date: '2023-03-23',
          separator: ' ',
          time: '14:27:33',
        });
    });
    it('should return short time when display is "time-short"', function () {
      expect(new DateDisplayer('time-short', 'UTC').formatToParts(date))
        .to.eql({
          time: '14:27:33',
        });
    });
    it('should return the right time when timezone is "local"', function () {
      // note that this test passes because we emulate the Europe/Paris timezone when launching test in browser.
      expect(new DateDisplayer('datetime-iso', 'local').formatToParts(date))
        .to.eql({
          date: '2023-03-23',
          separator: 'T',
          time: '15:27:33',
          millisecond: '.888',
          timezone: '+01:00',
        });
    });
  });
});
