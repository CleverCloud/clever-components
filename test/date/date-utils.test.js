import { expect } from '@bundled-es-modules/chai';
import { bindDate, cloneDate, isDateValid, shiftDateField } from '../../src/lib/date/date-utils.js';

describe('cloneDate function', () => {
  it('should return a new instance of date', () => {
    const date = new Date();
    expect(cloneDate(date)).to.not.equal(date);
  });
  it('should return a date with same time', () => {
    const date = new Date();
    expect(cloneDate(date).getTime()).to.eql(date.getTime());
  });
});

describe('isDateValid function', () => {
  it('should return true with now Date', () => {
    expect(isDateValid(new Date()))
      .to.eql(true);
  });
  it('should return true with a Date created with a valid string', () => {
    expect(isDateValid(new Date('2023-07-28T09:50:02.175Z')))
      .to.eql(true);
  });
  it('should return false with a Date created with an invalid string', () => {
    expect(isDateValid(new Date('invalid-date')))
      .to.eql(false);
  });
  it('should return false with a Date created with an invalid month', () => {
    expect(isDateValid(new Date('2023-99-28T09:50:02.175Z')))
      .to.eql(false);
  });
  it('should return false with a Date created with an invalid day', () => {
    expect(isDateValid(new Date('2023-07-99T09:50:02.175Z')))
      .to.eql(false);
  });
  it('should return false with a Date created with an invalid hour', () => {
    expect(isDateValid(new Date('2023-07-28T99:50:02.175Z')))
      .to.eql(false);
  });
  it('should return false with a Date created with an invalid minute', () => {
    expect(isDateValid(new Date('2023-07-28T09:99:02.175Z')))
      .to.eql(false);
  });
  it('should return false with a Date created with an invalid seconds', () => {
    expect(isDateValid(new Date('2023-07-28T09:50:99.175Z')))
      .to.eql(false);
  });
  it('should return false with a number', () => {
    expect(isDateValid(10))
      .to.eql(false);
  });
  it('should return false with a string', () => {
    expect(isDateValid('string'))
      .to.eql(false);
  });
  it('should return false with a null', () => {
    expect(isDateValid(null))
      .to.eql(false);
  });
  it('should return false with a undefined', () => {
    expect(isDateValid(undefined))
      .to.eql(false);
  });
  it('should return false with an object', () => {
    expect(isDateValid({}))
      .to.eql(false);
  });
});

describe('bindDate function', () => {
  it('should bind on lower bound', () => {
    expect(bindDate(new Date('2022-08-10T00:00:00.000Z'),
      new Date('2022-08-12T00:00:00.000Z'),
      new Date('2022-08-15T00:00:00.000Z')))
      .to.eql(new Date('2022-08-12T00:00:00.000Z'));
  });
  it('should bind on upper bound', () => {
    expect(bindDate(new Date('2022-08-18T00:00:00.000Z'),
      new Date('2022-08-12T00:00:00.000Z'),
      new Date('2022-08-15T00:00:00.000Z')))
      .to.eql(new Date('2022-08-15T00:00:00.000Z'));
  });
  it('should return number when inside bounds', () => {
    expect(bindDate(new Date('2022-08-14T00:00:00.000Z'),
      new Date('2022-08-12T00:00:00.000Z'),
      new Date('2022-08-15T00:00:00.000Z')))
      .to.eql(new Date('2022-08-14T00:00:00.000Z'));
  });
  it('should work when lower bound is undefined', () => {
    expect(bindDate(new Date('2022-08-14T00:00:00.000Z'),
      undefined,
      new Date('2022-08-15T00:00:00.000Z')))
      .to.eql(new Date('2022-08-14T00:00:00.000Z'));
    expect(bindDate(new Date('2022-08-16T00:00:00.000Z'),
      undefined,
      new Date('2022-08-15T00:00:00.000Z')))
      .to.eql(new Date('2022-08-15T00:00:00.000Z'));
  });
  it('should work when upper bound is undefined', () => {
    expect(bindDate(new Date('2022-08-14T00:00:00.000Z'),
      new Date('2022-08-12T00:00:00.000Z'),
      undefined))
      .to.eql(new Date('2022-08-14T00:00:00.000Z'));
    expect(bindDate(new Date('2022-08-10T00:00:00.000Z'),
      new Date('2022-08-12T00:00:00.000Z'),
      undefined))
      .to.eql(new Date('2022-08-12T00:00:00.000Z'));
  });
  it('should return number when bounds is undefined', () => {
    expect(bindDate(new Date('2022-08-14T00:00:00.000Z'),
      undefined,
      undefined))
      .to.eql(new Date('2022-08-14T00:00:00.000Z'));
  });
});

describe('shiftDateField', () => {
  const assertShift = (isoDate, field, offset, isoExpected) => {
    expect(shiftDateField(new Date(isoDate), field, offset).toISOString())
      .to.eql(isoExpected);
  };

  it('should fail when invalid field', () => {
    expect(() => shiftDateField(new Date(), 'unknown-field', 1)).to.throw(Error);
  });
  it('should not mutate given date', () => {
    const date = new Date();
    expect(shiftDateField(date, 'Y', 0))
      .to.not.equal(date);
  });
  it('should shift year up', () => {
    assertShift('2023-07-28T09:50:02.175Z', 'Y', 1, '2024-07-28T09:50:02.175Z');
  });
  it('should shift year down', () => {
    assertShift('2023-07-28T09:50:02.175Z', 'Y', -1, '2022-07-28T09:50:02.175Z');
  });
  it('should shift month up', () => {
    assertShift('2023-12-28T09:50:02.175Z', 'M', 1, '2024-01-28T09:50:02.175Z');
    assertShift('2023-12-31T09:50:02.175Z', 'M', 18, '2025-06-30T09:50:02.175Z');
  });
  it('should shift month down', () => {
    assertShift('2023-01-28T09:50:02.175Z', 'M', -1, '2022-12-28T09:50:02.175Z');
    assertShift('2023-01-31T09:50:02.175Z', 'M', -14, '2021-11-30T09:50:02.175Z');
  });
  it('should shift day up', () => {
    assertShift('2023-12-31T09:50:02.175Z', 'D', 1, '2024-01-01T09:50:02.175Z');
  });
  it('should shift day down', () => {
    assertShift('2023-01-01T09:50:02.175Z', 'D', -1, '2022-12-31T09:50:02.175Z');
  });
  it('should shift hour up', () => {
    assertShift('2023-12-31T23:50:02.175Z', 'H', 1, '2024-01-01T00:50:02.175Z');
  });
  it('should shift hour down', () => {
    assertShift('2023-01-01T00:50:02.175Z', 'H', -1, '2022-12-31T23:50:02.175Z');
  });
  it('should shift minute up', () => {
    assertShift('2023-12-31T23:59:02.175Z', 'm', 1, '2024-01-01T00:00:02.175Z');
  });
  it('should shift minute down', () => {
    assertShift('2023-01-01T00:00:02.175Z', 'm', -1, '2022-12-31T23:59:02.175Z');
  });
  it('should shift second up', () => {
    assertShift('2023-12-31T23:59:59.175Z', 's', 1, '2024-01-01T00:00:00.175Z');
  });
  it('should shift second down', () => {
    assertShift('2023-01-01T00:00:00.175Z', 's', -1, '2022-12-31T23:59:59.175Z');
  });
  it('should shift millisecond up', () => {
    assertShift('2023-12-31T23:59:59.999Z', 'S', 1, '2024-01-01T00:00:00.000Z');
  });
  it('should shift millisecond down', () => {
    assertShift('2023-01-01T00:00:00.000Z', 'S', -1, '2022-12-31T23:59:59.999Z');
  });

  it('should shift year up and fixup the day', () => {
    assertShift('2020-02-29T09:50:02.175Z', 'Y', 1, '2021-02-28T09:50:02.175Z');
  });
  it('should shift year down and fixup the day', () => {
    assertShift('2020-02-29T09:50:02.175Z', 'Y', -1, '2019-02-28T09:50:02.175Z');
  });
  it('should shift month up and fixup the day', () => {
    assertShift('2023-01-31T09:50:02.175Z', 'M', 1, '2023-02-28T09:50:02.175Z');
    assertShift('2023-05-31T09:50:02.175Z', 'M', 1, '2023-06-30T09:50:02.175Z');
  });
  it('should shift month down and fixup the day', () => {
    assertShift('2023-03-31T09:50:02.175Z', 'M', -1, '2023-02-28T09:50:02.175Z');
    assertShift('2023-07-31T09:50:02.175Z', 'M', -1, '2023-06-30T09:50:02.175Z');
  });
});
