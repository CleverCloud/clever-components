import { expect } from '@bundled-es-modules/chai';
import { getIntervalQuantity, PricingConsumptionSimulator } from '../src/lib/pricing.js';

const INTERVALS_FOO = [
  { minRange: 0, maxRange: 100, price: 0 },
  { minRange: 100, maxRange: 200, price: 1 },
  { minRange: 200, maxRange: 300, price: 2 },
  { minRange: 300, price: 3 },
];

const INTERVALS_BAR = [
  { minRange: 0, maxRange: 1000, price: 0 },
  { minRange: 1000, maxRange: 2000, price: 10 },
  { minRange: 2000, maxRange: 3000, price: 20 },
  { minRange: 3000, price: 30 },
];

const INTERVALS = [
  { type: 'foo', intervals: INTERVALS_FOO },
  { type: 'bar', intervals: INTERVALS_BAR },
];

const INTERVALS_PROGRESSIVE = [
  { type: 'foo', intervals: INTERVALS_FOO, progressive: true },
  { type: 'bar', intervals: INTERVALS_BAR, progressive: true },
];

const INTERVALS_SECABILITY = [
  { type: 'foo', intervals: INTERVALS_FOO, secability: 10 },
  { type: 'bar', intervals: INTERVALS_BAR, secability: 100 },
];

const INTERVALS_PROGRESSIVE_SECABILITY = [
  { type: 'foo', intervals: INTERVALS_FOO, progressive: true, secability: 10 },
  { type: 'bar', intervals: INTERVALS_BAR, progressive: true, secability: 100 },
];

const NULLISH_INTERVALS = [
  { type: 'foo' },
  { type: 'bar' },
];

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

  describe('getMaxInterval()', () => {

    it('default', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      expect(ps.getMaxInterval('foo')).to.equal(INTERVALS_FOO[0]);
      expect(ps.getMaxInterval('bar')).to.equal(INTERVALS_BAR[0]);
    });

    it('inside interval', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 150);
      ps.setQuantity('bar', 1500);
      expect(ps.getMaxInterval('foo')).to.equal(INTERVALS_FOO[1]);
      expect(ps.getMaxInterval('bar')).to.equal(INTERVALS_BAR[1]);
    });

    it('lower limit of interval', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 200);
      ps.setQuantity('bar', 2000);
      expect(ps.getMaxInterval('foo')).to.equal(INTERVALS_FOO[2]);
      expect(ps.getMaxInterval('bar')).to.equal(INTERVALS_BAR[2]);
    });

    it('big value', () => {
      const ps = new PricingConsumptionSimulator(INTERVALS);
      ps.setQuantity('foo', 1000);
      ps.setQuantity('bar', 10000);
      expect(ps.getMaxInterval('foo')).to.equal(INTERVALS_FOO[3]);
      expect(ps.getMaxInterval('bar')).to.equal(INTERVALS_BAR[3]);
    });

    it('nullish intervals', () => {
      const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
      expect(ps.getMaxInterval('foo')).to.equal(null);
      expect(ps.getMaxInterval('bar')).to.equal(null);
    });
  });

  describe('getIntervalPrice()', () => {

    describe('progressive: false (default) & secability: 1 (default)', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS);
        ps.setQuantity('foo', 250);
        ps.setQuantity('bar', 5000);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(250 * 2);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(5000 * 30);
      });

      it('nullish intervals', () => {
        const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
      });
    });

    describe('progressive: true', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE);
        ps.setQuantity('foo', 250);
        ps.setQuantity('bar', 5000);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(99 * 0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(100 * 1);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(51 * 2);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(999 * 0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(1000 * 10);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(1000 * 20);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(2001 * 30);
      });
    });

    describe('secability: 10 & 100', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_SECABILITY);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_SECABILITY);
        ps.setQuantity('foo', 255);
        ps.setQuantity('bar', 5050);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(260 * 2);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(5100 * 30);
      });
    });

    describe('progressive: true AND secability: 10 & 100', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE_SECABILITY);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(0);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE_SECABILITY);
        ps.setQuantity('foo', 255);
        ps.setQuantity('bar', 5050);
        expect(ps.getIntervalPrice('foo', 0)).to.equal(99 * 0);
        expect(ps.getIntervalPrice('foo', 1)).to.equal(100 * 1);
        expect(ps.getIntervalPrice('foo', 2)).to.equal(61 * 2);
        expect(ps.getIntervalPrice('foo', 3)).to.equal(0);
        expect(ps.getIntervalPrice('bar', 0)).to.equal(999 * 0);
        expect(ps.getIntervalPrice('bar', 1)).to.equal(1000 * 10);
        expect(ps.getIntervalPrice('bar', 2)).to.equal(1000 * 20);
        expect(ps.getIntervalPrice('bar', 3)).to.equal(2101 * 30);
      });
    });
  });

  describe('getSectionPrice()', () => {

    describe('progressive: false (default)', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getSectionPrice('foo')).to.equal(0);
        expect(ps.getSectionPrice('bar')).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS);
        ps.setQuantity('foo', 250);
        ps.setQuantity('bar', 5000);
        expect(ps.getSectionPrice('foo')).to.equal(250 * 2);
        expect(ps.getSectionPrice('bar')).to.equal(5000 * 30);
      });

      it('nullish intervals', () => {
        const ps = new PricingConsumptionSimulator(NULLISH_INTERVALS);
        expect(ps.getSectionPrice('foo')).to.equal(0);
        expect(ps.getSectionPrice('bar')).to.equal(0);
      });
    });

    describe('progressive: true', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getSectionPrice('foo')).to.equal(0);
        expect(ps.getSectionPrice('bar')).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE);
        ps.setQuantity('foo', 250);
        ps.setQuantity('bar', 5000);
        expect(ps.getSectionPrice('foo')).to.equal(99 * 0 + 100 * 1 + 51 * 2);
        expect(ps.getSectionPrice('bar')).to.equal(999 * 0 + 1000 * 10 + 1000 * 20 + 2001 * 30);
      });
    });

    describe('secability: 10 & 100', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_SECABILITY);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getSectionPrice('foo')).to.equal(0);
        expect(ps.getSectionPrice('bar')).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_SECABILITY);
        ps.setQuantity('foo', 255);
        ps.setQuantity('bar', 5050);
        expect(ps.getSectionPrice('foo')).to.equal(260 * 2);
        expect(ps.getSectionPrice('bar')).to.equal(5100 * 30);
      });
    });

    describe('progressive: true AND secability: 10 & 100', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE_SECABILITY);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getSectionPrice('foo')).to.equal(0);
        expect(ps.getSectionPrice('bar')).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE_SECABILITY);
        ps.setQuantity('foo', 255);
        ps.setQuantity('bar', 5050);
        expect(ps.getSectionPrice('foo')).to.equal(
          99 * 0
          + 100 * 1
          + 61 * 2
          + 0 * 3,
        );
        expect(ps.getSectionPrice('bar')).to.equal(
          999 * 0
          + 1000 * 10
          + 1000 * 20
          + 2101 * 30,
        );
      });
    });
  });

  describe('getTotalPrice()', () => {

    describe('progressive: false (default)', () => {

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

    describe('progressive: true', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getTotalPrice()).to.equal(0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE);
        ps.setQuantity('foo', 250);
        ps.setQuantity('bar', 5000);
        expect(ps.getTotalPrice()).to.equal(
          (99 * 0 + 100 * 1 + 51 * 2)
          + (999 * 0 + 1000 * 10 + 1000 * 20 + 2001 * 30),
        );
      });
    });

    describe('secability: 10 & 100', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_SECABILITY);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getTotalPrice()).to.equal(0 + 0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_SECABILITY);
        ps.setQuantity('foo', 255);
        ps.setQuantity('bar', 5050);
        expect(ps.getTotalPrice()).to.equal(
          260 * 2
          + 5100 * 30,
        );
      });
    });

    describe('progressive: true AND secability: 10 & 100', () => {

      it('small value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE_SECABILITY);
        ps.setQuantity('foo', 50);
        ps.setQuantity('bar', 500);
        expect(ps.getTotalPrice()).to.equal(0 + 0);
      });

      it('big value', () => {
        const ps = new PricingConsumptionSimulator(INTERVALS_PROGRESSIVE_SECABILITY);
        ps.setQuantity('foo', 255);
        ps.setQuantity('bar', 5050);
        expect(ps.getTotalPrice()).to.equal(
          999 * 0
          + 100 * 1
          + 61 * 2
          + 0
          + 999 * 0
          + 1000 * 10
          + 1000 * 20
          + 2101 * 30,
        );
      });

      it('values near interval limits', () => {
        const ps = new PricingConsumptionSimulator([
          {
            type: 'foo',
            progressive: true,
            secability: 100,
            intervals: [
              { minRange: 0, maxRange: 101, price: 0 },
              { minRange: 101, price: 0.01 },
            ],
          },
        ]);
        ps.setQuantity('foo', 99);
        expect(ps.getTotalPrice()).to.equal(0);
        ps.setQuantity('foo', 100);
        expect(ps.getTotalPrice()).to.equal(0);
        ps.setQuantity('foo', 101);
        expect(ps.getTotalPrice()).to.equal(1);
        ps.setQuantity('foo', 102);
        expect(ps.getTotalPrice()).to.equal(1);
        ps.setQuantity('foo', 150);
        expect(ps.getTotalPrice()).to.equal(1);
        ps.setQuantity('foo', 200);
        expect(ps.getTotalPrice()).to.equal(1);
        ps.setQuantity('foo', 201);
        expect(ps.getTotalPrice()).to.equal(2);
        ps.setQuantity('foo', 250);
        expect(ps.getTotalPrice()).to.equal(2);
      });
    });
  });
});

describe('getIntervalQuantity', () => {

  it('0 <= value < 100 (below)', () => {
    expect(getIntervalQuantity(0, -5, 100)).to.equal(0);
  });

  it('0 <= value < 100 (inside)', () => {
    expect(getIntervalQuantity(0, 0, 100)).to.equal(0);
    expect(getIntervalQuantity(0, 50, 100)).to.equal(50);
    expect(getIntervalQuantity(0, 99, 100)).to.equal(99);
  });

  it('0 <= value < 100 (above)', () => {
    expect(getIntervalQuantity(0, 100, 100)).to.equal(99);
    expect(getIntervalQuantity(0, 101, 100)).to.equal(99);
  });

  it('100 <= value < 200 (below)', () => {
    expect(getIntervalQuantity(100, 50, 200)).to.equal(0);
    expect(getIntervalQuantity(100, 99, 200)).to.equal(0);
  });

  it('100 <= value < 200 (inside)', () => {
    expect(getIntervalQuantity(100, 100, 200)).to.equal(1);
    expect(getIntervalQuantity(100, 150, 200)).to.equal(51);
    expect(getIntervalQuantity(100, 200, 200)).to.equal(100);
  });

  it('100 <= value < 200 (above)', () => {
    expect(getIntervalQuantity(100, 200, 200)).to.equal(100);
    expect(getIntervalQuantity(100, 201, 200)).to.equal(100);
  });

  it('100 <= value < Infinity (inside)', () => {
    expect(getIntervalQuantity(100, 100, Infinity)).to.equal(1);
    expect(getIntervalQuantity(100, 150, Infinity)).to.equal(51);
    expect(getIntervalQuantity(100, 200, Infinity)).to.equal(101);
    expect(getIntervalQuantity(100, 250, Infinity)).to.equal(151);
  });
});
