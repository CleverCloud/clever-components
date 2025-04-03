import { expect } from '@bundled-es-modules/chai';
import { isExpirationClose } from '../../src/lib/tokens.js';

describe('isExpirationClose function', () => {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

  describe('with default thresholds', () => {
    // Test for default threshold: maxApplicableTokenLifetimeInDays: 7, warningThresholdInDays: 2
    it('should return true for short-term tokens within threshold (7 days token, 1 day left)', () => {
      const creationDate = new Date(now.getTime() - 6 * oneDay);
      const expirationDate = new Date(now.getTime() + oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.true;
    });

    it('should return false for short-term tokens outside threshold (7 days token, 3 days left)', () => {
      const creationDate = new Date(now.getTime() - 4 * oneDay);
      const expirationDate = new Date(now.getTime() + 3 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.false;
    });

    // Test for default threshold: maxApplicableTokenLifetimeInDays: 30, warningThresholdInDays: 7
    it('should return true for medium-term tokens within threshold (30 days token, 5 days left)', () => {
      const creationDate = new Date(now.getTime() - 25 * oneDay);
      const expirationDate = new Date(now.getTime() + 5 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.true;
    });

    it('should return false for medium-term tokens outside threshold (30 days token, 10 days left)', () => {
      const creationDate = new Date(now.getTime() - 20 * oneDay);
      const expirationDate = new Date(now.getTime() + 10 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.false;
    });

    // Test for default threshold: maxApplicableTokenLifetimeInDays: 90, warningThresholdInDays: 20
    it('should return true for long-term tokens within threshold (85 days token, 15 days left)', () => {
      const creationDate = new Date(now.getTime() - 70 * oneDay);
      const expirationDate = new Date(now.getTime() + 15 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.true;
    });

    it('should return false for long-term tokens outside threshold (85 days token, 25 days left)', () => {
      const creationDate = new Date(now.getTime() - 60 * oneDay);
      const expirationDate = new Date(now.getTime() + 25 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.false;
    });

    // Test for tokens just under one year
    it('should return true for tokens just under one year within threshold (350 days token, 25 days left)', () => {
      const creationDate = new Date(now.getTime() - 325 * oneDay);
      const expirationDate = new Date(now.getTime() + 25 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.true;
    });

    // Test for tokens over one year
    it('should use 365-day threshold for tokens over one year (400 days token, 27 days left)', () => {
      const creationDate = new Date(now.getTime() - 365 * oneDay);
      const expirationDate = new Date(now.getTime() + 27 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.true;
    });

    it('should return false for tokens over one year outside threshold (400 days token, 31 days left)', () => {
      const creationDate = new Date(now.getTime() - 355 * oneDay);
      const expirationDate = new Date(now.getTime() + 31 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate })).to.be.false;
    });
  });

  describe('with custom thresholds', () => {
    // Custom thresholds for all tests
    const customThresholds = [
      { maxApplicableTokenLifetimeInDays: 7, warningThresholdInDays: 3 },
      { maxApplicableTokenLifetimeInDays: 30, warningThresholdInDays: 8 },
      { maxApplicableTokenLifetimeInDays: 90, warningThresholdInDays: 25 },
      { maxApplicableTokenLifetimeInDays: 365, warningThresholdInDays: 40 },
    ];

    // Custom threshold tests with same scenarios as default threshold tests
    it('should return true for short-term tokens within custom threshold (7 days token, 2 days left)', () => {
      const creationDate = new Date(now.getTime() - 5 * oneDay);
      const expirationDate = new Date(now.getTime() + 2 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.true;
    });

    it('should return false for short-term tokens outside custom threshold (7 days token, 4 days left)', () => {
      const creationDate = new Date(now.getTime() - 3 * oneDay);
      const expirationDate = new Date(now.getTime() + 4 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.false;
    });

    it('should return true for medium-term tokens within custom threshold (30 days token, 7 days left)', () => {
      const creationDate = new Date(now.getTime() - 23 * oneDay);
      const expirationDate = new Date(now.getTime() + 7 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.true;
    });

    it('should return false for medium-term tokens outside custom threshold (30 days token, 9 days left)', () => {
      const creationDate = new Date(now.getTime() - 21 * oneDay);
      const expirationDate = new Date(now.getTime() + 9 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.false;
    });

    it('should return true for long-term tokens within custom threshold (85 days token, 20 days left)', () => {
      const creationDate = new Date(now.getTime() - 65 * oneDay);
      const expirationDate = new Date(now.getTime() + 20 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.true;
    });

    it('should return false for long-term tokens outside custom threshold (85 days token, 30 days left)', () => {
      const creationDate = new Date(now.getTime() - 55 * oneDay);
      const expirationDate = new Date(now.getTime() + 30 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.false;
    });

    // Test token with duration just under 1 year
    it('should use 365-day threshold for tokens just under one year (360 days token, 35 days left)', () => {
      const creationDate = new Date(now.getTime() - 325 * oneDay);
      const expirationDate = new Date(now.getTime() + 35 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.true;
    });

    // Test token with duration over 1 year
    it('should use 365-day threshold for tokens over one year (400 days token, 35 days left)', () => {
      const creationDate = new Date(now.getTime() - 365 * oneDay);
      const expirationDate = new Date(now.getTime() + 35 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.true;
    });

    it('should return false for tokens over one year outside threshold (400 days token, 45 days left)', () => {
      const creationDate = new Date(now.getTime() - 355 * oneDay);
      const expirationDate = new Date(now.getTime() + 45 * oneDay);

      expect(isExpirationClose({ creationDate, expirationDate }, customThresholds)).to.be.false;
    });
  });
});
