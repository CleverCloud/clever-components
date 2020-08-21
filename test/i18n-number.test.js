import { prepareNumberUnitFormatter } from '../src/lib/i18n-number.js';
import { expect } from '@bundled-es-modules/chai';

describe('prepareNumberUnitFormatter', () => {

  describe('english', () => {

    const formatNumberUnitEn = prepareNumberUnitFormatter('en');

    it('Small values', () => {
      expect(formatNumberUnitEn(1)).to.equal('1');
      expect(formatNumberUnitEn(10)).to.equal('10');
      expect(formatNumberUnitEn(100)).to.equal('100');
    });

    it('K values', () => {
      expect(formatNumberUnitEn(10e2)).to.equal('1k');
      expect(formatNumberUnitEn(10e3)).to.equal('10k');
      expect(formatNumberUnitEn(10e4)).to.equal('100k');
    });

    it('M values', () => {
      expect(formatNumberUnitEn(10e5)).to.equal('1M');
      expect(formatNumberUnitEn(10e6)).to.equal('10M');
      expect(formatNumberUnitEn(10e7)).to.equal('100M');
    });

    it('G values', () => {
      expect(formatNumberUnitEn(10e8)).to.equal('1G');
      expect(formatNumberUnitEn(10e9)).to.equal('10G');
      expect(formatNumberUnitEn(10e10)).to.equal('100G');
    });

    it('T values', () => {
      expect(formatNumberUnitEn(10e11)).to.equal('1T');
      expect(formatNumberUnitEn(10e12)).to.equal('10T');
      expect(formatNumberUnitEn(10e13)).to.equal('100T');
    });

    it('P values', () => {
      expect(formatNumberUnitEn(10e14)).to.equal('1P');
      expect(formatNumberUnitEn(10e15)).to.equal('10P');
      expect(formatNumberUnitEn(10e16)).to.equal('100P');
    });

    it('decimal values', () => {
      expect(formatNumberUnitEn(999)).to.equal('999');
      expect(formatNumberUnitEn(1049)).to.equal('1k');
      expect(formatNumberUnitEn(1050)).to.equal('1.1k');
      expect(formatNumberUnitEn(2149999)).to.equal('2.1M');
      expect(formatNumberUnitEn(2150000)).to.equal('2.2M');
      expect(formatNumberUnitEn(3249999999)).to.equal('3.2G');
      expect(formatNumberUnitEn(3250000000)).to.equal('3.3G');
    });
  });

  describe('french', () => {

    const formatNumberUnitFr = prepareNumberUnitFormatter('fr');

    it('Small values', () => {
      expect(formatNumberUnitFr(1)).to.equal('1');
      expect(formatNumberUnitFr(10)).to.equal('10');
      expect(formatNumberUnitFr(100)).to.equal('100');
    });

    it('K values', () => {
      expect(formatNumberUnitFr(10e2)).to.equal('1k');
      expect(formatNumberUnitFr(10e3)).to.equal('10k');
      expect(formatNumberUnitFr(10e4)).to.equal('100k');
    });

    it('M values', () => {
      expect(formatNumberUnitFr(10e5)).to.equal('1M');
      expect(formatNumberUnitFr(10e6)).to.equal('10M');
      expect(formatNumberUnitFr(10e7)).to.equal('100M');
    });

    it('G values', () => {
      expect(formatNumberUnitFr(10e8)).to.equal('1G');
      expect(formatNumberUnitFr(10e9)).to.equal('10G');
      expect(formatNumberUnitFr(10e10)).to.equal('100G');
    });

    it('T values', () => {
      expect(formatNumberUnitFr(10e11)).to.equal('1T');
      expect(formatNumberUnitFr(10e12)).to.equal('10T');
      expect(formatNumberUnitFr(10e13)).to.equal('100T');
    });

    it('P values', () => {
      expect(formatNumberUnitFr(10e14)).to.equal('1P');
      expect(formatNumberUnitFr(10e15)).to.equal('10P');
      expect(formatNumberUnitFr(10e16)).to.equal('100P');
    });

    it('decimal values', () => {
      expect(formatNumberUnitFr(999)).to.equal('999');
      expect(formatNumberUnitFr(1049)).to.equal('1k');
      expect(formatNumberUnitFr(1050)).to.equal('1,1k');
      expect(formatNumberUnitFr(2149999)).to.equal('2,1M');
      expect(formatNumberUnitFr(2150000)).to.equal('2,2M');
      expect(formatNumberUnitFr(3249999999)).to.equal('3,2G');
      expect(formatNumberUnitFr(3250000000)).to.equal('3,3G');
    });
  });
});
