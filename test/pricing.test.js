import { expect } from '@bundled-es-modules/chai';
import { PricingConsumptionSimulator } from '../src/lib/pricing.js';

const INTERVALS_FOO = [
  { minRange: 0, maxRange: 100, price: 0 },
  { minRange: 100, maxRange: 200, price: 1 },
  { minRange: 200, maxRange: 300, price: 2 },
  { minRange: 300, price: 3 },
];

const INTERVALS_BAR = [
  { minRange: 0, maxRange: 1000, price: 0 },
  { minRange: 100, maxRange: 2000, price: 10 },
  { minRange: 200, maxRange: 3000, price: 20 },
  { minRange: 3000, price: 30 },
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
      ps.setQuantity('foo', 50);
      ps.setQuantity('bar', 500);
      expect(ps.getQuantity('foo')).to.equal(50);
      expect(ps.getQuantity('bar')).to.equal(500);
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
      ps.setQuantity('foo', 150);
      ps.setQuantity('bar', 1500);
      expect(ps.getCurrentInterval('foo')).to.equal(INTERVALS_FOO[1]);
      expect(ps.getCurrentInterval('bar')).to.equal(INTERVALS_BAR[1]);
    });

    it('lower limit of interval', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 200);
      ps.setQuantity('bar', 2000);
      expect(ps.getCurrentInterval('foo')).to.equal(INTERVALS_FOO[2]);
      expect(ps.getCurrentInterval('bar')).to.equal(INTERVALS_BAR[2]);
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 1000);
      ps.setQuantity('bar', 10000);
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
      ps.setQuantity('foo', 50);
      ps.setQuantity('bar', 500);
      expect(ps.getEstimatedPrice('foo')).to.equal(0);
      expect(ps.getEstimatedPrice('bar')).to.equal(0);
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 250);
      ps.setQuantity('bar', 5000);
      expect(ps.getEstimatedPrice('foo')).to.equal(250 * 2);
      expect(ps.getEstimatedPrice('bar')).to.equal(5000 * 30);
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
      ps.setQuantity('foo', 50);
      ps.setQuantity('bar', 500);
      expect(ps.getTotalPrice()).to.equal((50 * 0) + (500 * 0));
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 250);
      ps.setQuantity('bar', 5000);
      expect(ps.getTotalPrice()).to.equal((250 * 2) + (5000 * 30));
    });

    it('nullish intervals', () => {
      const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
      expect(ps.getTotalPrice('foo')).to.equal(0);
    });
  });
});
