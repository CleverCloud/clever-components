import CleverCloudSse from '@clevercloud/client/esm/streams/clever-cloud-sse.js';
import { describe, expect, it, vi } from 'vitest';
import { LogsStream } from '../../src/lib/logs/logs-stream.js';
import { sleep } from '../../src/lib/utils.js';
/**
 * @typedef {import('./logs-stream.types.js').AbstractLog} AbstractLog
 */

class FakeLogsStream extends LogsStream {
  /**
   * @param {number} [waitingTimeout]
   */
  constructor(waitingTimeout) {
    super(100, { waitingTimeout: { live: waitingTimeout, cold: waitingTimeout } });
    this._spies = {
      createStream: vi.fn(),
      updateStreamState: vi.fn(),
      convertLog: vi.fn(),
      appendLogs: vi.fn(),
    };
    this._fakeSse = new FakeSse();
  }

  resetSpies() {
    [...Object.values(this.spies), ...Object.values(this.sseSpies)].forEach((spy) => {
      spy.mockClear();
    });
  }

  get spies() {
    return this._spies;
  }

  get sseSpies() {
    return this._fakeSse.spies;
  }

  get sseFakeApi() {
    return this._fakeSse.fakeApi;
  }

  _createStream(_dateRange, _maxRetryCount, _throttleElements, _throttlePerInMilliseconds) {
    this._spies.createStream(_dateRange, _maxRetryCount, _throttleElements, _throttlePerInMilliseconds);

    return this._fakeSse;
  }

  async _convertLog(rawLog) {
    this._spies.convertLog(rawLog);
    return rawLog;
  }

  _updateStreamState(streamState) {
    super._updateStreamState(streamState);
    this._spies.updateStreamState(streamState);
  }

  _appendLogs(logs) {
    super._appendLogs(logs);
    this._spies.appendLogs(logs);
  }
}

class FakeSse extends CleverCloudSse {
  constructor() {
    super();
    this._spies = {
      start: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      close: vi.fn(),
      end: vi.fn(),
    };
    this._fakeApi = {
      log: (log) => {
        this._onLog?.(log);
      },
      end: async () => {
        this._endResolver?.();
        await sleep(0);
      },
    };
  }

  get fakeApi() {
    return this._fakeApi;
  }

  get spies() {
    return this._spies;
  }

  async start() {
    this._spies.start();
    this.emit('open', {});
    return new Promise((resolve) => {
      this._endResolver = () => {
        resolve({ type: 'ENDED' });
      };
    });
  }

  pause() {
    this._spies.pause();
  }

  resume() {
    this._spies.resume();
  }

  close(reason = { type: 'UNKNOW' }) {
    this._spies.close(reason);
  }

  onLog(fn) {
    this._onLog = async (log) => {
      await fn(log);
    };
    return this;
  }
}

describe('logs-stream', () => {
  describe('stop() method', () => {
    it('should set the idle state', () => {
      const logsStream = new FakeLogsStream();

      logsStream.stop();
      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({ type: 'idle' });
    });

    it('should close the Sse', () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });

      logsStream.stop();
      expect(logsStream.sseSpies.close.mock.calls.length).toBe(1);
    });

    it('should not close the Sse if it was not started', () => {
      const logsStream = new FakeLogsStream();

      logsStream.stop();
      expect(logsStream.sseSpies.close.mock.calls.length).toBe(0);
    });

    it('should not flush logs even if some logs remains in the buffer', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream); // this one is flushed immediatellogsStreamy
      logsStream.resetSpies();
      await fakeLogsReceived(logsStream); // this one goes in the buffelogsStreamr

      logsStream.stop();
      expect(logsStream.spies.appendLogs.mock.calls.length).toBe(0);
    });
  });

  describe('on log received', () => {
    it('should convert the received log', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });

      const [log] = await fakeLogsReceived(logsStream);

      expect(logsStream.spies.convertLog.mock.calls.length).toBe(1);
      expect(logsStream.spies.convertLog.mock.calls[0][0]).toEqual(log);
    });

    it('should flush the first log received immediately', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });

      const [log] = await fakeLogsReceived(logsStream);

      expect(logsStream.spies.appendLogs.mock.calls.length).toBe(1);
      expect(logsStream.spies.appendLogs.mock.calls[0][0]).toEqual([log]);
    });

    it('should not flush the second log received immediately', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream);

      expect(logsStream.spies.appendLogs.mock.calls.length).toBe(0);
    });

    it('should flush the logs when buffer is full', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream, 9); // should not flush buffer
      expect(logsStream.spies.appendLogs.mock.calls.length).toBe(0);

      await fakeLogsReceived(logsStream); // should flush buffer
      expect(logsStream.spies.appendLogs.mock.calls.length).toBe(1);
    });

    it('should set the running state at the right moment', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream); // should update state
      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'running',
        progress: { value: 1 },
        overflowing: false,
      });
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream, 9); // should not update state
      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(0);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream); // should update state
      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'running',
        progress: { value: 11 },
        overflowing: false,
      });
    });

    describe('when overflow watermark is reached', () => {
      async function reachWatermark(logsStream) {
        logsStream.openLogsStream({ since: new Date().toISOString() });
        await fakeLogsReceived(logsStream);
        await fakeLogsReceived(logsStream, 89);
        logsStream.resetSpies();

        await fakeLogsReceived(logsStream);
      }

      it('should set paused state', async () => {
        const logsStream = new FakeLogsStream();

        await reachWatermark(logsStream);

        expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
        expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
          type: 'paused',
          reason: 'overflow',
          progress: { value: 91 },
        });
      });

      it('should pause the sse', async () => {
        const logsStream = new FakeLogsStream();

        await reachWatermark(logsStream);

        expect(logsStream.sseSpies.pause.mock.calls.length).toBe(1);
      });

      describe('acceptOverflow()', () => {
        it('should set running state', async () => {
          const logsStream = new FakeLogsStream();
          await reachWatermark(logsStream);
          logsStream.resetSpies();

          logsStream.acceptOverflow();

          expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
          expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
            type: 'running',
            progress: { value: 91 },
            overflowing: true,
          });
        });

        it('should resume sse', async () => {
          const logsStream = new FakeLogsStream();
          await reachWatermark(logsStream);
          logsStream.resetSpies();

          logsStream.acceptOverflow();

          expect(logsStream.sseSpies.resume.mock.calls.length).toBe(1);
        });
      });

      describe('discardOverflow()', () => {
        it('should close sse', async () => {
          const logsStream = new FakeLogsStream();
          await reachWatermark(logsStream);
          logsStream.resetSpies();

          logsStream.discardOverflow();

          expect(logsStream.sseSpies.close.mock.calls.length).toBe(1);
        });
      });
    });
  });

  describe('on stream ended', () => {
    it('should set completed state', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString(), until: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await logsStream.sseFakeApi.end();

      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'completed',
        progress: { value: 1, percent: 100 },
        overflowing: false,
      });
    });

    it('should set completed state', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString(), until: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await logsStream.sseFakeApi.end();

      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'completed',
        progress: { value: 1, percent: 100 },
        overflowing: false,
      });
    });
  });

  describe('pause() method', () => {
    it('should set paused state', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'paused',
        reason: 'user',
        progress: { value: 1 },
        overflowing: false,
      });
    });

    it('should pause the sse', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.mock.calls.length).toBe(1);
    });

    it('should do nothing if already paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.pause();
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.mock.calls.length).toBe(0);
    });

    it('should do nothing if not started paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.mock.calls.length).toBe(0);
    });
  });

  describe('resume() method', () => {
    it('should set running state', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.pause();
      logsStream.resetSpies();

      logsStream.resume();

      expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'running',
        progress: { value: 1 },
        overflowing: false,
      });
    });

    it('should resume the sse', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.pause();
      logsStream.resetSpies();

      logsStream.resume();

      expect(logsStream.sseSpies.resume.mock.calls.length).toBe(1);
    });

    it('should do nothing if not paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      logsStream.resume();

      expect(logsStream.sseSpies.resume.mock.calls.length).toBe(0);
    });
  });

  describe('when no logs is received since a long time', () => {
    it('should set waiting state if no logs was received at all', async () => {
      const logsStream = new FakeLogsStream(50);
      logsStream.openLogsStream({ since: new Date().toISOString() });
      logsStream.resetSpies();

      await sleep(55);

      await expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(1);
      expect(logsStream.spies.updateStreamState.mock.calls[0][0]).toEqual({
        type: 'waitingForFirstLog',
      });
    });

    it('should not set waiting state if one log has already been received', async () => {
      const logsStream = new FakeLogsStream(50);
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await sleep(55);

      await expect(logsStream.spies.updateStreamState.mock.calls.length).toBe(0);
    });
  });
});

/**
 *
 * @param {FakeLogsStream} logsStream
 * @param {number} [count]
 * @returns {Promise<Array<AbstractLog>>}
 */
async function fakeLogsReceived(logsStream, count = 1) {
  const logs = [];
  for (let i = 0; i < count; i++) {
    let log = generateLog();
    await logsStream.sseFakeApi.log(log);
    logs.push(log);
  }
  return logs;
}

/**
 * @return {AbstractLog} log
 */
function generateLog() {
  return { date: new Date() };
}
