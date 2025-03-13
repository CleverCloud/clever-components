import { expect } from '@bundled-es-modules/chai';
import {
  clampNumber,
  groupBy,
  isExpirationClose,
  isStringBlank,
  isStringEmpty,
  randomString,
  range,
} from '../src/lib/utils.js';

describe('range function', function () {
  it('should return array', function () {
    expect(range(5, 10)).to.be.an.instanceof(Array);
  });
  it('should return a single item array when start equals end', function () {
    expect(range(10, 10)).to.eql([10]);
  });
  it('should return all items between start and end', function () {
    expect(range(2, 10)).to.eql([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it('should return all items when start is after end', function () {
    expect(range(10, 2)).to.eql([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});

describe('clampNumber function', () => {
  it('should bind on lower bound', () => {
    expect(clampNumber(10, 12, 15)).to.eql(12);
  });
  it('should bind on upper bound', () => {
    expect(clampNumber(18, 12, 15)).to.eql(15);
  });
  it('should return number when inside bounds', () => {
    expect(clampNumber(14, 12, 15)).to.eql(14);
  });
  it('should work when lower bound is undefined', () => {
    expect(clampNumber(14, undefined, 15)).to.eql(14);
    expect(clampNumber(16, undefined, 15)).to.eql(15);
  });
  it('should work when upper bound is undefined', () => {
    expect(clampNumber(14, 12, undefined)).to.eql(14);
    expect(clampNumber(10, 12, undefined)).to.eql(12);
  });
  it('should return number when bounds is undefined', () => {
    expect(clampNumber(14, undefined, undefined)).to.eql(14);
  });
});

describe('randomString function', () => {
  it('should be empty if length is 0', () => {
    expect(randomString(0)).to.equal('');
  });

  it('should have a size equal to the given length', () => {
    expect(randomString(10).length).to.equal(10);
  });

  it('should use the given alphabet', () => {
    expect(randomString(3, 'a')).to.equal('aaa');
  });
});

describe('isStringEmpty', () => {
  it('should return true with null', () => {
    expect(isStringEmpty(null)).to.eql(true);
  });
  it('should return true with undefined', () => {
    expect(isStringEmpty(undefined)).to.eql(true);
  });
  it('should return true with empty string', () => {
    expect(isStringEmpty('')).to.eql(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringEmpty('non-empty-string')).to.eql(false);
  });
});

describe('isStringBlank', () => {
  it('should return true with null', () => {
    expect(isStringBlank(null)).to.eql(true);
  });
  it('should return true with undefined', () => {
    expect(isStringBlank(undefined)).to.eql(true);
  });
  it('should return true with empty string', () => {
    expect(isStringBlank('')).to.eql(true);
  });
  it('should return true with blank string', () => {
    expect(isStringBlank('   ')).to.eql(true);
  });
  it('should return false with non empty string', () => {
    expect(isStringBlank('non-blank-string')).to.eql(false);
  });
});

describe('groupBy function', () => {
  it('should group by result of the grouping function', () => {
    const grouped = groupBy(
      [
        { prop: 'group1', value: '1' },
        { prop: 'group2', value: '2' },
        { prop: 'group2', value: '3' },
        { prop: 'group1', value: '4' },
        { prop: 'group3', value: '5' },
      ],
      (o) => o.prop?.toUpperCase(),
    );

    expect(grouped).to.eql({
      GROUP1: [
        { prop: 'group1', value: '1' },
        { prop: 'group1', value: '4' },
      ],
      GROUP2: [
        { prop: 'group2', value: '2' },
        { prop: 'group2', value: '3' },
      ],
      GROUP3: [{ prop: 'group3', value: '5' }],
    });
  });

  it('should drop element for which property is not present', () => {
    const grouped = groupBy([{ prop: 'group1', value: '1' }, { value: '2' }], (o) => o.prop?.toUpperCase());

    expect(grouped).to.eql({
      GROUP1: [{ prop: 'group1', value: '1' }],
    });
  });

  it('should return empty object when giving an empty array', () => {
    const grouped = groupBy([], (o) => o.prop?.toUpperCase());

    expect(grouped).to.eql({});
  });
});

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

    it('should handle different date formats', () => {
      const now = new Date();
      const oneWeekAgo = new Date(now);
      const creationDate = new Date(oneWeekAgo.setDate(now.getDate() - 7));

      const inTwoDays = new Date(now);
      const expirationDate = new Date(inTwoDays.setDate(now.getDate() + 2));

      // Using ISO string format
      expect(
        isExpirationClose({
          creationDate: creationDate.toISOString(),
          expirationDate: expirationDate.toISOString(),
        }),
      ).to.be.true;

      // Using timestamp
      expect(
        isExpirationClose({
          creationDate: creationDate.getTime(),
          expirationDate: expirationDate.getTime(),
        }),
      ).to.be.true;
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
