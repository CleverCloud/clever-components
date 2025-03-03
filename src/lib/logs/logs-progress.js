import { isLive } from '../date/date-range-utils.js';

/**
 * @typedef {import('./logs-stream.types.js').AbstractLog} AbstractLog
 * @typedef {import('./logs-stream.types.js').LogsProgressValue} LogsProgressValue
 * @typedef {import('../date/date-range.types.js').DateRange} DateRange
 */

/**
 * @template {AbstractLog} Log The type of the transformed Log.
 */
export class LogsProgress {
  /**
   * @param {number} overflowWatermark The progression value after which the progress is considered as overflowing
   */
  constructor(overflowWatermark) {
    this._overflowWatermark = overflowWatermark;

    this.reset();
  }

  reset() {
    this._value = 0;
    this._percent = null;
    this._isLive = false;
    this._lastLogDate = null;
    this._overflowWasNotified = false;
  }

  /**
   * @param {DateRange} dateRange
   */
  start(dateRange) {
    this._isLive = isLive(dateRange);
    this._dateRangeStart = new Date(dateRange.since).getTime();
    this._dateRangeDuration = this._isLive ? 0 : new Date(dateRange.until).getTime() - this._dateRangeStart;
    if (!this._isLive) {
      this._percent = 0;
    }
  }

  /**
   * @param {Array<Log>} logs
   * @return {boolean} Whether the progression reached the overflow watermark
   */
  progress(logs) {
    if (logs.length === 0) {
      return false;
    }

    this._value = this._value + logs.length;
    this._lastLogDate = logs[logs.length - 1].date;

    if (!this._isLive) {
      const timeProgress = this._lastLogDate.getTime() - this._dateRangeStart;
      this._percent = (100 * timeProgress) / this._dateRangeDuration;
    }

    if (!this._overflowWasNotified && this._value >= this._overflowWatermark) {
      this._overflowWasNotified = true;
      return true;
    }
    return false;
  }

  complete() {
    if (!this._isLive) {
      this._percent = 100;
    }
  }

  /**
   * @returns {LogsProgressValue}
   */
  getProgress() {
    if (this._isLive) {
      return {
        value: this._value,
      };
    }

    return {
      value: this._value,
      percent: this._percent,
    };
  }

  isOverflowing() {
    return this._value >= this._overflowWatermark;
  }

  getLastLogDate() {
    return this._lastLogDate;
  }

  isLive() {
    return this._isLive;
  }

  isEmpty() {
    return this._value === 0;
  }
}
