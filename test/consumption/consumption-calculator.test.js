import { expect } from '@bundled-es-modules/chai';
import { ConsumptionCalculator } from '../../src/lib/consumption-calculator.js';

/**
 *  @typedef {import('../../src/components/cc-credit-consumption/cc-credit-consumption.types.js').OneDayOfConsumption[]} Consumptions
 *  @typedef {import('../../src/components/cc-credit-consumption/cc-credit-consumption.types.js').Coupon[]} Coupons
 * */

const FAKE_DATE = new Date();
const BASE_CONSTRUCTOR_ARGS = {
  discount: 0,
  priceFactor: 1,
  /** @type {Consumptions} */
  consumptions: [{
    date: FAKE_DATE,
    value: 20.27,
  }, {
    date: FAKE_DATE,
    value: 29.37,
  }, {
    date: FAKE_DATE,
    value: 27.28,
  }],
  /** @type {Coupons} */
  coupons: [{
    amount: 5.30,
    reason: 'conference',
    activation: FAKE_DATE,
    expiration: FAKE_DATE,
  }, {
    amount: 20.02,
    reason: 'welcome',
    activation: FAKE_DATE,
    expiration: FAKE_DATE,
  }],
  prepaidCredits: {
    enabled: true,
    total: 40.28,
  },
};

describe('Consumption calculator', () => {
  describe('computed consumption', () => {
    it('with no discount', () => {
      const consumptionCalculator = new ConsumptionCalculator(BASE_CONSTRUCTOR_ARGS);
      expect(consumptionCalculator.computedConsumption.toFixed(2)).to.be.equal('76.92');
    });

    it('with 20% discount', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        discount: 20,
      });
      expect(consumptionCalculator.computedConsumption.toFixed(2)).to.be.equal('61.54');
    });

    it('with 100% discount', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        discount: 100,
      });
      expect(consumptionCalculator.computedConsumption.toFixed(2)).to.be.equal('0.00');
    });
  });

  describe('one entry of computed consumptions', () => {
    it('with no discount', () => {
      const consumptionCalculator = new ConsumptionCalculator(BASE_CONSTRUCTOR_ARGS);
      expect(consumptionCalculator.computedConsumptions[2].value.toFixed(2)).to.be.equal('27.28');
    });

    it('with 20% discount', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        discount: 20,
      });
      expect(consumptionCalculator.computedConsumptions[2].value.toFixed(2)).to.be.equal('21.82');
    });

    it('with 100% discount', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        discount: 100,
      });
      expect(consumptionCalculator.computedConsumptions[1].value.toFixed(2)).to.be.equal('0.00');
    });
  });

  describe('total free credits from coupons', () => {
    it('with no coupons', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        coupons: [],
      });
      expect(consumptionCalculator.totalFreeCredits.toFixed(2)).to.be.equal('0.00');
    });

    it('with some coupons', () => {
      const consumptionCalculator = new ConsumptionCalculator(BASE_CONSTRUCTOR_ARGS);
      expect(consumptionCalculator.totalFreeCredits.toFixed(2)).to.be.equal('25.32');
    });
  });

  describe('remaining free credits', () => {
    it('with no consumption', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        consumptions: [],
      });
      expect(consumptionCalculator.remainingFreeCredits.toFixed(2)).to.be.equal('25.32');
    });

    it('with half credits consumed', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        consumptions: [{
          date: FAKE_DATE,
          value: 12.66,
        }],
      });
      expect(consumptionCalculator.remainingFreeCredits.toFixed(2)).to.be.equal('12.66');
    });

    it('with more consumption than credits', () => {
      const consumptionCalculator = new ConsumptionCalculator(BASE_CONSTRUCTOR_ARGS);
      expect(consumptionCalculator.remainingFreeCredits.toFixed(2)).to.be.equal('0.00');
    });
  });

  describe('total prepaid credits', () => {
    it('with prepaid credits disabled', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        // @ts-expect-error - we provide a total on purpose to check if it rightfully ignored by the calculator
        prepaidCredits: { enabled: false, total: 2302 },
      });
      expect(consumptionCalculator.totalPrepaidCredits.toFixed(2)).to.be.equal('0.00');
    });

    it('with prepaid credits disabled', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        prepaidCredits: { enabled: true, total: 2302 },
      });
      expect(consumptionCalculator.totalPrepaidCredits.toFixed(2)).to.be.equal('2302.00');
    });
  });

  describe('remainingPrepaidCredits', () => {
    it('with prepaid credits disabled', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        // @ts-expect-error - we provide a total on purpose to check if it rightfully ignored by the calculator
        prepaidCredits: { enabled: false, total: 2302 },
      });
      expect(consumptionCalculator.remainingPrepaidCredits.toFixed(2)).to.be.equal('0.00');
    });

    it('with no consumption', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        consumptions: [],
      });
      expect(consumptionCalculator.remainingPrepaidCredits.toFixed(2)).to.be.equal('40.28');
    });

    it('with free credits partially consumed', () => {
      // since the consumption < free credits, prepaid credits should remain untouched
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        consumptions: [{
          date: FAKE_DATE,
          value: 20.40,
        }],
      });
      expect(consumptionCalculator.remainingPrepaidCredits.toFixed(2)).to.be.equal('40.28');
    });

    it('with half prepaid credits consumed', () => {
      // since the consumption > free credits, prepaid credits should be partially consumed
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        consumptions: [{
          date: FAKE_DATE,
          value: 45.46,
        }],
      });
      expect(consumptionCalculator.remainingPrepaidCredits.toFixed(2)).to.be.equal('20.14');
    });

    it('with all prepaid credits consumed', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        consumptions: [{
          date: FAKE_DATE,
          value: 70.40,
        }],
      });
      expect(consumptionCalculator.remainingPrepaidCredits.toFixed(2)).to.be.equal('0.00');
    });
  });

  describe('total credits', () => {
    it('with no credits', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        coupons: [],
        prepaidCredits: { enabled: true, total: 0 },
      });
      expect(consumptionCalculator.totalCredits.toFixed(2)).to.be.equal('0.00');
    });

    it('with some free credits and prepaid disabled', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        // @ts-expect-error - we provide a total on purpose to check if it rightfully ignored by the calculator
        prepaidCredits: { enabled: false, total: 2937.28 },
      });
      expect(consumptionCalculator.totalCredits.toFixed(2)).to.be.equal('25.32');
    });

    it('with some prepaid credits and no free credits', () => {
      const consumptionCalculator = new ConsumptionCalculator({
        ...BASE_CONSTRUCTOR_ARGS,
        coupons: [],
      });
      expect(consumptionCalculator.totalCredits.toFixed(2)).to.be.equal('40.28');
    });

    it('with both prepaid credits and free credits', () => {
      const consumptionCalculator = new ConsumptionCalculator(BASE_CONSTRUCTOR_ARGS);
      expect(consumptionCalculator.totalCredits.toFixed(2)).to.be.equal('65.60');
    });
  });
});
