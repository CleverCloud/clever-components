import { expect } from '@open-wc/testing';
import { withMockedNow } from '../../../test/helpers/mock-now.js';
import {
  dateRangeSelectionToDateRange,
  isDateRangeSelectionValid,
  sanitizeDateRangeSelection,
} from './date-range-selection.js';

describe('date-range-selection', () => {
  it('should generate a live range', () => {
    withMockedNow('2024-10-17T16:00:00.000Z', () => {
      expect(dateRangeSelectionToDateRange({ type: 'live' })).to.deep.equal({
        since: '2024-10-17T15:50:00.000Z',
      });
    });
  });

  it('should generate a today range', () => {
    withMockedNow('2024-10-17T16:00:00.000Z', () => {
      expect(dateRangeSelectionToDateRange({ type: 'preset', preset: 'today' })).to.deep.equal({
        since: '2024-10-17T00:00:00.000Z',
        until: '2024-10-17T16:00:00.000Z',
      });
    });
  });

  it('should generate a yesterday range', () => {
    withMockedNow('2024-10-17T16:00:00.000Z', () => {
      expect(dateRangeSelectionToDateRange({ type: 'preset', preset: 'yesterday' })).to.deep.equal({
        since: '2024-10-16T00:00:00.000Z',
        until: '2024-10-16T23:59:59.999Z',
      });
    });
  });

  it('should generate a lastHour range', () => {
    withMockedNow('2024-10-17T16:00:00.000Z', () => {
      expect(dateRangeSelectionToDateRange({ type: 'preset', preset: 'lastHour' })).to.deep.equal({
        since: '2024-10-17T15:00:00.000Z',
        until: '2024-10-17T16:00:00.000Z',
      });
    });
  });

  it('should generate a last4Hours range', () => {
    withMockedNow('2024-10-17T16:00:00.000Z', () => {
      expect(dateRangeSelectionToDateRange({ type: 'preset', preset: 'last4Hours' })).to.deep.equal({
        since: '2024-10-17T12:00:00.000Z',
        until: '2024-10-17T16:00:00.000Z',
      });
    });
  });

  it('should generate a last7Days range', () => {
    withMockedNow('2024-10-17T16:00:00.000Z', () => {
      expect(dateRangeSelectionToDateRange({ type: 'preset', preset: 'last7Days' })).to.deep.equal({
        since: '2024-10-10T00:00:00.000Z',
        until: '2024-10-17T16:00:00.000Z',
      });
    });
  });

  it('should generate a custom range', () => {
    expect(
      dateRangeSelectionToDateRange({
        type: 'custom',
        since: '2024-10-10T00:00:00.000Z',
        until: '2024-10-17T16:00:00.000Z',
      }),
    ).to.deep.equal({
      since: '2024-10-10T00:00:00.000Z',
      until: '2024-10-17T16:00:00.000Z',
    });
  });

  describe('isDateRangeSelectionValid()', () => {
    it('should accept well-formed selections', () => {
      expect(isDateRangeSelectionValid({ type: 'live' })).to.equal(true);
      expect(isDateRangeSelectionValid({ type: 'preset', preset: 'last7Days' })).to.equal(true);
      expect(
        isDateRangeSelectionValid({
          type: 'custom',
          since: '2024-10-10T00:00:00.000Z',
          until: '2024-10-17T16:00:00.000Z',
        }),
      ).to.equal(true);
    });

    it('should reject malformed selections', () => {
      expect(isDateRangeSelectionValid(null)).to.equal(false);
      expect(isDateRangeSelectionValid(undefined)).to.equal(false);
      expect(isDateRangeSelectionValid({})).to.equal(false);
      expect(isDateRangeSelectionValid({ type: 'preset' })).to.equal(false);
      expect(isDateRangeSelectionValid({ type: 'preset', preset: 'lastYear' })).to.equal(false);
      expect(isDateRangeSelectionValid({ type: 'predefined', def: 'today' })).to.equal(false);
      expect(isDateRangeSelectionValid({ type: 'custom', since: '2024-10-10T00:00:00.000Z' })).to.equal(false);
      expect(isDateRangeSelectionValid({ type: 'custom', since: '2024-10-10T00:00:00.000Z', until: 'foo' })).to.equal(
        false,
      );
      expect(isDateRangeSelectionValid({ type: 'custom', since: '', until: '2024-10-17T16:00:00.000Z' })).to.equal(
        false,
      );
    });
  });

  describe('sanitizeDateRangeSelection()', () => {
    it('should return a valid selection as is', () => {
      const selection = { type: 'preset', preset: 'today' };
      expect(sanitizeDateRangeSelection(selection)).to.equal(selection);
    });

    it('should fall back to the first preset when the preset is missing or unknown', () => {
      const firstPreset = { type: 'preset', preset: 'lastHour' };
      expect(sanitizeDateRangeSelection({ type: 'preset' })).to.deep.equal(firstPreset);
      expect(sanitizeDateRangeSelection({ type: 'preset', preset: null })).to.deep.equal(firstPreset);
      expect(sanitizeDateRangeSelection({ type: 'preset', preset: 'lastYear' })).to.deep.equal(firstPreset);
    });

    it('should return null for other malformed selections', () => {
      expect(sanitizeDateRangeSelection(null)).to.equal(null);
      expect(sanitizeDateRangeSelection(undefined)).to.equal(null);
      expect(sanitizeDateRangeSelection({})).to.equal(null);
      expect(sanitizeDateRangeSelection({ type: 'predefined', def: 'today' })).to.equal(null);
      expect(sanitizeDateRangeSelection({ type: 'custom', since: 'foo', until: 'bar' })).to.equal(null);
    });
  });
});
