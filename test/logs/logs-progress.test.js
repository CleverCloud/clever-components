import { expect } from '@open-wc/testing';
import { LogsProgress } from '../../src/lib/logs/logs-progress.js';

describe('logs-progress', () => {
  describe('isLive() method', () => {
    it('should return true when given date range is live', () => {
      const logsProgress = new LogsProgress(10);

      logsProgress.start({ since: new Date().toISOString() });

      expect(logsProgress.isLive()).to.eq(true);
    });

    it('should return false when given date range is closed', () => {
      const logsProgress = new LogsProgress(10);

      logsProgress.start({ since: new Date().toISOString(), until: new Date().toISOString() });

      expect(logsProgress.isLive()).to.eq(false);
    });
  });

  describe('isOverflowing() method', () => {
    it('should return false when not started', () => {
      const logsProgress = new LogsProgress(10);

      expect(logsProgress.isOverflowing()).to.eq(false);
    });

    it('should return false when no progress', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      expect(logsProgress.isOverflowing()).to.eq(false);
    });

    it('should return false when progress lower than the overflowWatermark', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      logsProgress.progress(generateLogs(9));

      expect(logsProgress.isOverflowing()).to.eq(false);
    });

    it('should return true when progress equals the overflowWatermark', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      logsProgress.progress(generateLogs(10));

      expect(logsProgress.isOverflowing()).to.eq(true);
    });

    it('should return true when progress greater than overflowWatermark', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      logsProgress.progress(generateLogs(11));

      expect(logsProgress.isOverflowing()).to.eq(true);
    });
  });

  describe('progress() method', () => {
    it('should return false when empty logs', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      const watermarkReached = logsProgress.progress([]);

      expect(watermarkReached).to.eq(false);
    });

    it('should not progress when empty logs', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      logsProgress.progress([]);

      expect(logsProgress.getProgress().value).to.eq(0);
    });

    it('should progress when non empty logs', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      logsProgress.progress(generateLogs(5));

      expect(logsProgress.getProgress().value).to.eq(5);

      logsProgress.progress(generateLogs(4));

      expect(logsProgress.getProgress().value).to.eq(9);
    });

    it('should return false when watermark not reached', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      const watermarkReached = logsProgress.progress(generateLogs(5));

      expect(watermarkReached).to.eq(false);
    });

    it('should return true when watermark is reached', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      const watermarkReached = logsProgress.progress(generateLogs(10));

      expect(watermarkReached).to.eq(true);
    });

    it('should return true when watermark is exceeded', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      const watermarkReached = logsProgress.progress(generateLogs(15));

      expect(watermarkReached).to.eq(true);
    });

    it('should return false when watermark was already reached once', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });
      logsProgress.progress(generateLogs(15));

      const watermarkReached = logsProgress.progress(generateLogs(1));

      expect(watermarkReached).to.eq(false);
    });
  });

  describe('getLastLogDate', () => {
    it('should return null if no progress', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      expect(logsProgress.getLastLogDate()).to.eq(null);
    });

    it('should return the right date after progress', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });
      const logs = generateLogs(2);
      logsProgress.progress(logs);

      expect(logsProgress.getLastLogDate()).to.eq(logs[1].date);
    });
  });

  describe('isEmpty() method', () => {
    it('should return true if no progress', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      expect(logsProgress.isEmpty()).to.eq(true);
    });

    it('should return false if progress', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString() });

      logsProgress.progress(generateLogs(1));

      expect(logsProgress.isEmpty()).to.eq(false);
    });
  });

  describe('complete() method', () => {
    it('should set progress percent à 100% when date range is not live', () => {
      const logsProgress = new LogsProgress(10);
      logsProgress.start({ since: new Date().toISOString(), until: new Date().toISOString() });

      logsProgress.complete();

      expect(logsProgress.getProgress().percent).to.eq(100);
    });
  });

  describe('getProgress() method', () => {
    describe('with live range', () => {
      it('should have undefined percentage', () => {
        const logsProgress = new LogsProgress(10);
        logsProgress.start({ since: new Date().toISOString() });

        expect(logsProgress.getProgress().percent).to.eq(undefined);

        logsProgress.progress(generateLogs(10));

        expect(logsProgress.getProgress().percent).to.eq(undefined);
      });

      it('should have the right value', () => {
        const logsProgress = new LogsProgress(10);
        logsProgress.start({ since: new Date().toISOString() });

        expect(logsProgress.getProgress().value).to.eq(0);

        logsProgress.progress(generateLogs(10));

        expect(logsProgress.getProgress().value).to.eq(10);

        logsProgress.progress(generateLogs(5));

        expect(logsProgress.getProgress().value).to.eq(15);
      });
    });

    describe('with not live range', () => {
      it('should have the right percentage', () => {
        const rangeDuration = 1000;
        const now = new Date();

        const logsProgress = new LogsProgress(10);
        logsProgress.start({ since: now.toISOString(), until: date(now, rangeDuration).toISOString() });

        logsProgress.progress([{ date: date(now, 10) }]);
        expect(logsProgress.getProgress().percent).to.eq(1);
        logsProgress.progress([{ date: date(now, 20) }]);
        expect(logsProgress.getProgress().percent).to.eq(2);
        logsProgress.progress([{ date: date(now, 30) }]);
        expect(logsProgress.getProgress().percent).to.eq(3);
        logsProgress.progress([{ date: date(now, 300) }]);
        expect(logsProgress.getProgress().percent).to.eq(30);
        logsProgress.progress([{ date: date(now, 999) }]);
        expect(logsProgress.getProgress().percent).to.eq(99.9);
      });
    });
  });
});

/**
 * @param {number} count
 */
function generateLogs(count) {
  return Array(count)
    .fill(0)
    .map(() => ({ date: new Date() }));
}

/**
 * @param {Date} date
 * @param {number} offset
 */
function date(date, offset) {
  return new Date(date.getTime() + offset);
}
