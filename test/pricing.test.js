import { expect } from '@bundled-es-modules/chai';
import { PricingConsumptionSimulator } from '../src/lib/pricing.js';

const INTERVALS_FOO = [
  { minRange: 0, maxRange: 100 * 1e6, price: 0 },
  { minRange: 100 * 1e6, maxRange: 1e12, price: 1 },
  { minRange: 1e12, maxRange: 25 * 1e12, price: 2 },
  { minRange: 25 * 1e12, price: 3 },
];

const INTERVALS_BAR = [
  { minRange: 0, maxRange: 200 * 1e6, price: 0 },
  { minRange: 200 * 1e6, maxRange: 5 * 1e12, price: 10 },
  { minRange: 5 * 1e12, maxRange: 50 * 1e12, price: 20 },
  { minRange: 50 * 1e12, price: 30 },
];

const INTERVALS = [
  { type: 'foo', intervals: INTERVALS_FOO },
  { type: 'bar', intervals: INTERVALS_BAR },
];

const NULLISH_INTERVALS = [
  { type: 'foo' },
  { type: 'bar' },
];

const ONE_GIGABYTE = 1e9;

describe('PricingConsumptionSimulator', () => {

  describe('getQuantity()', () => {

    it('default', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      expect(ps.getQuantity('foo')).to.equal(0);
      expect(ps.getQuantity('bar')).to.equal(0);
    });

    it('some value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 5 * 1e3 * ONE_GIGABYTE);
      ps.setQuantity('bar', 10 * 1e3 * ONE_GIGABYTE);
      expect(ps.getQuantity('foo')).to.equal(5 * 1e3 * ONE_GIGABYTE);
      expect(ps.getQuantity('bar')).to.equal(10 * 1e3 * ONE_GIGABYTE);
    });
  });

  describe('getCurrentInterval()', () => {

    it('default', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      expect(ps.getCurrentInterval('foo')).to.equal(INTERVALS_FOO[0]);
      expect(ps.getCurrentInterval('bar')).to.equal(INTERVALS_BAR[0]);
    });

    it('inside interval', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 150 * 1e6);
      ps.setQuantity('bar', 250 * 1e6);
      expect(ps.getCurrentInterval('foo')).to.equal(INTERVALS_FOO[1]);
      expect(ps.getCurrentInterval('bar')).to.equal(INTERVALS_BAR[1]);
    });

    it('lower limit of interval', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 1e12);
      ps.setQuantity('bar', 5 * 1e12);
      expect(ps.getCurrentInterval('foo')).to.equal(INTERVALS_FOO[2]);
      expect(ps.getCurrentInterval('bar')).to.equal(INTERVALS_BAR[2]);
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 50 * 1e12);
      ps.setQuantity('bar', 100 * 1e12);
      expect(ps.getCurrentInterval('foo')).to.equal(INTERVALS_FOO[3]);
      expect(ps.getCurrentInterval('bar')).to.equal(INTERVALS_BAR[3]);
    });

    it('nullish intervals', () => {
      const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
      expect(ps.getCurrentInterval('foo')).to.equal(null);
      expect(ps.getCurrentInterval('bar')).to.equal(null);
    });
  });

  describe('getEstimatedPrice()', () => {

    it('small value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 50 * 1e6);
      ps.setQuantity('bar', 150 * 1e6);
      expect(ps.getEstimatedPrice('foo')).to.equal(0);
      expect(ps.getEstimatedPrice('bar')).to.equal(0);
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 5 * 1e3 * ONE_GIGABYTE);
      ps.setQuantity('bar', 10 * 1e3 * ONE_GIGABYTE);
      expect(ps.getEstimatedPrice('foo')).to.equal(5 * 1e3 * 2);
      expect(ps.getEstimatedPrice('bar')).to.equal(10 * 1e3 * 20);
    });

    it('nullish intervals', () => {
      const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
      expect(ps.getEstimatedPrice('foo')).to.equal(0);
      expect(ps.getEstimatedPrice('bar')).to.equal(0);
    });
  });

  describe('getTotalPrice()', () => {

    it('small value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 50 * 1e6);
      ps.setQuantity('bar', 150 * 1e6);
      expect(ps.getTotalPrice()).to.equal((50 * 1e6 * 0) + (150 * 1e6 * 0));
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 5 * 1e3 * ONE_GIGABYTE);
      ps.setQuantity('bar', 10 * 1e3 * ONE_GIGABYTE);
      expect(ps.getTotalPrice()).to.equal((5 * 1e3 * 2) + (10 * 1e3 * 20));
    });

    it('nullish intervals', () => {
      const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
      expect(ps.getTotalPrice('foo')).to.equal(0);
    });
  });
});
