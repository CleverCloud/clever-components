import { describe, expect, it } from 'vitest';
import {
  getRangeToNow,
  isLive,
  lastXDays,
  shiftDateRange,
  today,
  yesterday,
} from '../../src/lib/date/date-range-utils.js';
import { withMockedNow } from '../helpers/mock-now.js';

describe('date-range', () => {
  describe('getRangeToNow', () => {
    it('should generate the right range', () => {
      withMockedNow('2024-10-17T16:00:00.000Z', () => {
        expect(getRangeToNow(1000)).toEqual({
          since: '2024-10-17T15:59:59.000Z',
          until: '2024-10-17T16:00:00.000Z',
        });
      });
    });
  });

  describe('isLive', () => {
    it('should be true when until is null', () => {
      expect(isLive({ since: '2024-10-17T16:19:00.000Z' })).toBe(true);
    });

    it('should be false when until is not null', () => {
      expect(isLive({ since: '2024-10-17T16:00:00.000Z', until: '2024-10-17T17:00:00.000Z' })).toBe(false);
    });
  });

  describe('today', () => {
    it('should generate the right range', () => {
      withMockedNow('2024-10-17T16:00:00.000Z', () => {
        expect(today()).toEqual({
          since: '2024-10-17T00:00:00.000Z',
          until: '2024-10-17T16:00:00.000Z',
        });
      });
    });
  });

  describe('yesterday', () => {
    it('should generate the right range', () => {
      withMockedNow('2024-10-17T16:00:00.000Z', () => {
        expect(yesterday()).toEqual({
          since: '2024-10-16T00:00:00.000Z',
          until: '2024-10-16T23:59:59.999Z',
        });
      });
    });
  });

  describe('lastXDays', () => {
    it('should generate the right range', () => {
      withMockedNow('2024-10-17T16:00:00.000Z', () => {
        expect(lastXDays(4)).toEqual({
          since: '2024-10-13T00:00:00.000Z',
          until: '2024-10-17T16:00:00.000Z',
        });
      });
    });

    it('should generate the right range when number of days is 0', () => {
      withMockedNow('2024-10-17T16:00:00.000Z', () => {
        expect(lastXDays(0)).toEqual({
          since: '2024-10-17T00:00:00.000Z',
          until: '2024-10-17T16:00:00.000Z',
        });
      });
    });
  });

  describe('shiftDateRange', () => {
    it('should shift to the right', () => {
      expect(
        shiftDateRange(
          {
            since: '2024-10-17T15:00:00.000Z',
            until: '2024-10-17T16:00:00.000Z',
          },
          'right',
        ),
      ).toEqual({
        since: '2024-10-17T16:00:00.000Z',
        until: '2024-10-17T17:00:00.000Z',
      });
    });

    it('should shift to the left', () => {
      expect(
        shiftDateRange(
          {
            since: '2024-10-17T15:00:00.000Z',
            until: '2024-10-17T16:00:00.000Z',
          },
          'left',
        ),
      ).toEqual({
        since: '2024-10-17T14:00:00.000Z',
        until: '2024-10-17T15:00:00.000Z',
      });
    });

    it('should throw error when range is unbounded', () => {
      expect(() =>
        shiftDateRange(
          {
            since: '2024-10-17T15:00:00.000Z',
          },
          'left',
        ),
      ).toThrow(Error);
    });
  });
});
