import CleverCloudSse from '@clevercloud/client/esm/streams/clever-cloud-sse.js';
import { expect } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { LogsStream } from '../../src/lib/logs/logs-stream.js';
import { sleep } from '../../src/lib/utils.js';

/**
 * @typedef {import('./logs-stream.types.js').AbstractLog} AbstractLog
 */

const LIMIT = 100;
const BUFFER_TIMEOUT = 10;

class FakeLogsStream extends LogsStream {
  /**
   * @param {number} [waitingTimeout]
   */
  constructor(waitingTimeout) {
    super(LIMIT, { waitingTimeout: { live: waitingTimeout, cold: waitingTimeout }, bufferTimeout: BUFFER_TIMEOUT });
    this._spies = {
      createStream: hanbi.spy(),
      updateStreamState: hanbi.spy(),
      convertLog: hanbi.spy(),
      appendLogs: hanbi.spy(),
    };
    this._fakeSse = new FakeSse();
  }

  resetSpies() {
    [...Object.values(this.spies), ...Object.values(this.sseSpies)].forEach((spy) => {
      spy.reset();
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
    this._spies.createStream.handler(_dateRange, _maxRetryCount, _throttleElements, _throttlePerInMilliseconds);

    return this._fakeSse;
  }

  async _convertLog(rawLog) {
    this._spies.convertLog.handler(rawLog);
    return rawLog;
  }

  _updateStreamState(streamState) {
    super._updateStreamState(streamState);
    this._spies.updateStreamState.handler(streamState);
  }

  _appendLogs(logs) {
    super._appendLogs(logs);
    this._spies.appendLogs.handler(logs);
  }
}

class FakeSse extends CleverCloudSse {
  constructor() {
    super();
    this._spies = {
      start: hanbi.spy(),
      pause: hanbi.spy(),
      resume: hanbi.spy(),
      close: hanbi.spy(),
      end: hanbi.spy(),
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
    this._spies.start.handler();
    this.emit('open', {});
    return new Promise((resolve) => {
      this._endResolver = () => {
        resolve({ type: 'ENDED' });
      };
    });
  }

  pause() {
    this._spies.pause.handler();
  }

  resume() {
    this._spies.resume.handler();
  }

  close(reason = { type: 'UNKNOW' }) {
    this._spies.close.handler(reason);
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
      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({ type: 'idle' });
    });

    it('should close the Sse', () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });

      logsStream.stop();
      expect(logsStream.sseSpies.close.callCount).to.eql(1);
    });

    it('should not close the Sse if it was not started', () => {
      const logsStream = new FakeLogsStream();

      logsStream.stop();
      expect(logsStream.sseSpies.close.callCount).to.eql(0);
    });

    it('should not flush logs even if some logs remains in the buffer', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream); // this one is flushed immediately
      logsStream.resetSpies();
      await fakeLogsReceived(logsStream); // this one goes in the buffer

      logsStream.stop();
      expect(logsStream.spies.appendLogs.callCount).to.eql(0);
    });
  });

  describe('on log received', () => {
    async function waitForFlush() {
      await sleep(BUFFER_TIMEOUT);
    }

    it('should convert the received log', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });

      const [log] = await fakeLogsReceived(logsStream);

      expect(logsStream.spies.convertLog.callCount).to.eql(1);
      expect(logsStream.spies.convertLog.getCall(0).args[0]).to.eql(log);
    });

    it('should flush the first log received immediately', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });

      const [log] = await fakeLogsReceived(logsStream);

      expect(logsStream.spies.appendLogs.callCount).to.eql(1);
      expect(logsStream.spies.appendLogs.getCall(0).args[0]).to.eql([log]);
    });

    it('should not flush the second log received immediately', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream);

      expect(logsStream.spies.appendLogs.callCount).to.eql(0);
    });

    it('should flush the logs when buffer flushes', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream); // should not flush buffer
      expect(logsStream.spies.appendLogs.callCount).to.eql(0);

      await waitForFlush(); // should flush buffer
      expect(logsStream.spies.appendLogs.callCount).to.eql(1);
    });

    it('should set the running state at the right moment', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream); // should update state
      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
        type: 'running',
        progress: { value: 1 },
        overflowing: false,
      });
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream); // should not update state
      expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
      logsStream.resetSpies();

      await sleep(10); // should update state
      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
        type: 'running',
        progress: { value: 2 },
        overflowing: false,
      });
    });

    describe('when overflow watermark is reached', () => {
      async function reachWatermark(logsStream) {
        logsStream.openLogsStream({ since: new Date().toISOString() });
        await fakeLogsReceived(logsStream); // first is flushed immediately
        await fakeLogsReceived(logsStream, LIMIT - 1);
        logsStream.resetSpies();

        await fakeLogsReceived(logsStream);
        await waitForFlush();
      }

      it('should set paused state', async () => {
        const logsStream = new FakeLogsStream();

        await reachWatermark(logsStream);

        expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
        expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
          type: 'paused',
          reason: 'overflow',
          progress: { value: LIMIT + 1 },
        });
      });

      it('should pause the sse', async () => {
        const logsStream = new FakeLogsStream();

        await reachWatermark(logsStream);

        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
      });

      describe('acceptOverflow()', () => {
        it('should set running state', async () => {
          const logsStream = new FakeLogsStream();
          await reachWatermark(logsStream);
          logsStream.resetSpies();

          logsStream.acceptOverflow();

          expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
          expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
            type: 'running',
            progress: { value: LIMIT + 1 },
            overflowing: true,
          });
        });

        it('should resume sse', async () => {
          const logsStream = new FakeLogsStream();
          await reachWatermark(logsStream);
          logsStream.resetSpies();

          logsStream.acceptOverflow();

          expect(logsStream.sseSpies.resume.callCount).to.eql(1);
        });
      });

      describe('discardOverflow()', () => {
        it('should close sse', async () => {
          const logsStream = new FakeLogsStream();
          await reachWatermark(logsStream);
          logsStream.resetSpies();

          logsStream.discardOverflow();

          expect(logsStream.sseSpies.close.callCount).to.eql(1);
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

      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
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

      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
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

      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
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

      expect(logsStream.sseSpies.pause.callCount).to.eql(1);
    });

    it('should do nothing if already paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.pause();
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.callCount).to.eql(0);
    });

    it('should do nothing if not started paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.callCount).to.eql(0);
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

      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
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

      expect(logsStream.sseSpies.resume.callCount).to.eql(1);
    });

    it('should do nothing if not paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      logsStream.resume();

      expect(logsStream.sseSpies.resume.callCount).to.eql(0);
    });
  });

  describe('when no logs is received since a long time', () => {
    it('should set waiting state if no logs was received at all', async () => {
      const logsStream = new FakeLogsStream(50);
      logsStream.openLogsStream({ since: new Date().toISOString() });
      logsStream.resetSpies();

      await sleep(55);

      await expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
        type: 'waitingForFirstLog',
      });
    });

    it('should not set waiting state if one log has already been received', async () => {
      const logsStream = new FakeLogsStream(50);
      logsStream.openLogsStream({ since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await sleep(55);

      await expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
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
