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
   * @param {object} [options]
   * @param {boolean} [options.deferStreamCreation] When `true`, `_createStream()` returns a promise that only
   * settles when `completeStreamCreation()` is called. This reproduces the window during which the underlying
   * stream does not exist yet.
   * @param {boolean} [options.openOnStart] When `false`, the sse does not open by itself when started: call `sseFakeApi.open()`.
   * @param {number} [options.convertLogDelay] Makes `_convertLog()` resolve after this delay (in ms), to reproduce
   * logs that are still being converted when something else happens.
   */
  constructor(waitingTimeout, { deferStreamCreation = false, openOnStart = true, convertLogDelay = null } = {}) {
    super(LIMIT, { waitingTimeout: { live: waitingTimeout, cold: waitingTimeout }, bufferTimeout: BUFFER_TIMEOUT });
    this._spies = {
      createStream: hanbi.spy(),
      updateStreamState: hanbi.spy(),
      convertLog: hanbi.spy(),
      appendLogs: hanbi.spy(),
    };
    this._fakeSse = new FakeSse({ openOnStart });
    this._deferStreamCreation = deferStreamCreation;
    this._convertLogDelay = convertLogDelay;
  }

  /**
   * Resolves the pending `_createStream()` promise and waits for the stream to be wired up and started.
   */
  async completeStreamCreation() {
    this._resolveStreamCreation();
    await sleep(0);
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

  /** the fake sse itself, to check its `state` and whether it `isWaitingToRetry` */
  get sse() {
    return this._fakeSse;
  }

  get sseFakeApi() {
    return this._fakeSse.fakeApi;
  }

  _createStream(_dateRange, _maxRetryCount, _throttleElements, _throttlePerInMilliseconds) {
    this._spies.createStream.handler(_dateRange, _maxRetryCount, _throttleElements, _throttlePerInMilliseconds);
    this._fakeSse.maxRetryCount = _maxRetryCount;

    if (this._deferStreamCreation) {
      return new Promise((resolve) => {
        this._resolveStreamCreation = () => resolve(this._fakeSse);
      });
    }

    return this._fakeSse;
  }

  async _convertLog(rawLog) {
    this._spies.convertLog.handler(rawLog);
    if (this._convertLogDelay != null) {
      await sleep(this._convertLogDelay);
    }
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

/**
 * Fakes the shape of a `@clevercloud/client` `LogsStream` (a `CcStream`), and how the real client behaves:
 * * `start()` and `resume()` connect: the stream opens later, by itself on start (unless `openOnStart` is `false`),
 *   or when `fakeApi.open()` is called,
 * * `open` is fired once `state` is `'open'` and `retryCount` reset, so that a listener can pause the stream,
 * * a lost connection (or a failed attempt) schedules a retry: the state is `paused` while waiting for it,
 *   `retryCount` is incremented, then `retry` is fired with it. A paused or closed stream ignores the failure,
 * * `pause()` works while `open`, `connecting` or waiting to retry, cancelling the retry, and throws otherwise,
 * * `resume()` works while `paused` (also while waiting to retry), and starts the retry count over,
 * * `close()`, the server ending the stream and a fatal error close it and remove the listeners.
 */
class FakeSse {
  /**
   * @param {object} [options]
   * @param {boolean} [options.openOnStart]
   */
  constructor({ openOnStart = true } = {}) {
    this.retryCount = 0;
    this.maxRetryCount = Infinity;
    this.state = 'init';
    this.isWaitingToRetry = false;
    this._openOnStart = openOnStart;
    this._spies = {
      start: hanbi.spy(),
      pause: hanbi.spy(),
      resume: hanbi.spy(),
      close: hanbi.spy(),
    };
    this._fakeApi = {
      log: (log) => {
        this._onLog?.(log);
      },
      // the server ends the stream: like the real client, it is closed before `start()` resolves
      end: async () => {
        this._closeAndForgetListeners();
        this._endResolver?.();
        await sleep(0);
      },
      // the connection is (re)established
      open: async () => {
        this._open();
        await sleep(0);
      },
      // the connection is lost (or an attempt failed): the client schedules a retry
      error: () => {
        if (this.state === 'paused' || this.state === 'closed') {
          return;
        }
        this.state = 'paused';
        this.isWaitingToRetry = true;
        this.retryCount++;
        this._onRetryCallback?.({
          error: new Error('connection lost'),
          retryCount: this.retryCount,
          maxRetryCount: this.maxRetryCount,
          retryAt: new Date(),
        });
      },
      // the retry is due: the client starts the next attempt, unless the retry was cancelled
      retry: () => {
        if (this.isWaitingToRetry) {
          this.isWaitingToRetry = false;
          this.state = 'connecting';
        }
      },
      // the retry limit is reached (or a non retryable error occurred)
      fail: async (error = new Error('fatal')) => {
        this._closeAndForgetListeners();
        this._errorRejecter?.(error);
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

  onOpen(callback) {
    this._onOpenCallback = callback;
    return this;
  }

  onLog(fn) {
    this._onLog = async (log) => {
      await fn(log);
    };
    return this;
  }

  onRetry(callback) {
    this._onRetryCallback = callback;
    return this;
  }

  _open() {
    this.state = 'open';
    this.retryCount = 0;
    this._onOpenCallback?.();
  }

  async start() {
    this._spies.start.handler();
    this.state = 'connecting';
    if (this._openOnStart) {
      // like the real client, the stream does not open synchronously: it can still be paused while connecting
      queueMicrotask(() => {
        if (this.state === 'connecting') {
          this._open();
        }
      });
    }
    return new Promise((resolve, reject) => {
      this._endResolver = () => {
        resolve({ type: 'ENDED' });
      };
      this._errorRejecter = reject;
    });
  }

  pause() {
    if (this.state !== 'open' && this.state !== 'connecting' && !this.isWaitingToRetry) {
      throw new Error(`Cannot pause a stream that is not open, connecting or waiting to retry (${this.state})`);
    }
    this.state = 'paused';
    this.isWaitingToRetry = false;
    this._spies.pause.handler();
  }

  resume() {
    if (this.state !== 'paused') {
      throw new Error(`Cannot resume a stream that is not in the "paused" state (${this.state})`);
    }
    // like the real client, resuming opens a new connection, right away when waiting to retry
    this.isWaitingToRetry = false;
    this.retryCount = 0;
    this.state = 'connecting';
    this._spies.resume.handler();
  }

  close(reason = { type: 'UNKNOWN' }) {
    this._closeAndForgetListeners();
    this._spies.close.handler(reason);
  }

  _closeAndForgetListeners() {
    this.state = 'closed';
    this.isWaitingToRetry = false;
    this._onOpenCallback = null;
    this._onLog = null;
    this._onRetryCallback = null;
  }
}

/**
 * Opens the logs stream and waits for the (asynchronous) stream creation and wiring to settle.
 *
 * @param {FakeLogsStream} logsStream
 * @param {object} dateRange
 */
async function openLogsStream(logsStream, dateRange) {
  logsStream.openLogsStream(dateRange);
  // let the async `_createStream()` resolve and the stream be wired up (onOpen/onLog/onRetry + start()).
  await sleep(0);
}

/**
 * @param {FakeLogsStream} logsStream
 */
function lastState(logsStream) {
  return logsStream.spies.updateStreamState.lastCall?.args[0];
}

/**
 * @param {FakeLogsStream} logsStream
 */
function allStates(logsStream) {
  return Array.from(logsStream.spies.updateStreamState.calls, (call) => call.args[0]);
}

describe('logs-stream', () => {
  describe('stop() method', () => {
    it('should set the idle state', () => {
      const logsStream = new FakeLogsStream();

      logsStream.stop();
      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({ type: 'idle' });
    });

    it('should close the Sse', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });

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
      await openLogsStream(logsStream, { since: new Date().toISOString() });
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
      await openLogsStream(logsStream, { since: new Date().toISOString() });

      const [log] = await fakeLogsReceived(logsStream);

      expect(logsStream.spies.convertLog.callCount).to.eql(1);
      expect(logsStream.spies.convertLog.getCall(0).args[0]).to.eql(log);
    });

    it('should flush the first log received immediately', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });

      const [log] = await fakeLogsReceived(logsStream);

      expect(logsStream.spies.appendLogs.callCount).to.eql(1);
      expect(logsStream.spies.appendLogs.getCall(0).args[0]).to.eql([log]);
    });

    it('should not flush the second log received immediately', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream);

      expect(logsStream.spies.appendLogs.callCount).to.eql(0);
    });

    it('should flush the logs when buffer flushes', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await fakeLogsReceived(logsStream); // should not flush buffer
      expect(logsStream.spies.appendLogs.callCount).to.eql(0);

      await waitForFlush(); // should flush buffer
      expect(logsStream.spies.appendLogs.callCount).to.eql(1);
    });

    it('should set the running state at the right moment', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
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
        await openLogsStream(logsStream, { since: new Date().toISOString() });
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
      await openLogsStream(logsStream, { since: new Date().toISOString(), until: new Date().toISOString() });
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

    it('should set completed state when the logs it flushes reach the limit', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString(), until: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      // these ones stay in the buffer
      await fakeLogsReceived(logsStream, LIMIT - 1);
      logsStream.resetSpies();

      await logsStream.sseFakeApi.end();

      // the ended stream cannot be paused for the overflow
      expect(logsStream.sseSpies.pause.callCount).to.eql(0);
      expect(allStates(logsStream).map((state) => state.type)).not.to.include('error');
      expect(lastState(logsStream)).to.eql({
        type: 'completed',
        progress: { value: LIMIT, percent: 100 },
        overflowing: true,
      });
    });
  });

  describe('pause() method', () => {
    it('should set paused state', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
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
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.callCount).to.eql(1);
    });

    it('should do nothing if already paused', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.pause();
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.callCount).to.eql(0);
    });

    it('should pause for the overflow, once, when the logs it flushes reach the limit', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      // these ones stay in the buffer
      await fakeLogsReceived(logsStream, LIMIT - 1);
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.callCount).to.eql(1);
      expect(lastState(logsStream)).to.eql({ type: 'paused', reason: 'overflow', progress: { value: LIMIT } });
    });

    it('should stop the waiting timer', async () => {
      const logsStream = new FakeLogsStream(50);
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      logsStream.pause();
      logsStream.resetSpies();

      await sleep(55);

      expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
    });

    it('should do nothing if not started paused', async () => {
      const logsStream = new FakeLogsStream();
      logsStream.resetSpies();

      logsStream.pause();

      expect(logsStream.sseSpies.pause.callCount).to.eql(0);
    });

    describe('while the stream connects for the first time', () => {
      it('should pause the sse right away, which aborts the attempt', async () => {
        const logsStream = new FakeLogsStream(50, { openOnStart: false });
        await openLogsStream(logsStream, { since: new Date().toISOString() });
        logsStream.resetSpies();

        logsStream.pause();

        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.state).to.eql('paused');
        expect(allStates(logsStream)).to.eql([
          { type: 'paused', reason: 'user', progress: { value: 0, percent: null }, overflowing: false },
        ]);
      });

      it('should start the progression and the waiting timer once resumed and opened', async () => {
        const logsStream = new FakeLogsStream(50, { openOnStart: false });
        await openLogsStream(logsStream, { since: new Date().toISOString() });
        logsStream.pause();
        await sleep(55);

        logsStream.resume();
        await logsStream.sseFakeApi.open();
        logsStream.resetSpies();
        await sleep(55);

        expect(allStates(logsStream)).to.eql([{ type: 'waitingForFirstLog' }]);
      });
    });

    describe('while the stream is being created', () => {
      it('should pause the sse as soon as it is started, before it opens', async () => {
        const logsStream = new FakeLogsStream(undefined, { deferStreamCreation: true });
        logsStream.openLogsStream({ since: new Date().toISOString() });

        logsStream.pause();
        expect(logsStream.sseSpies.pause.callCount).to.eql(0);

        await logsStream.completeStreamCreation();
        expect(logsStream.sseSpies.start.callCount).to.eql(1);
        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.state).to.eql('paused');
      });

      it('should set paused state', async () => {
        const logsStream = new FakeLogsStream(undefined, { deferStreamCreation: true });
        logsStream.openLogsStream({ since: new Date().toISOString() });
        logsStream.resetSpies();

        logsStream.pause();

        expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
        expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
          type: 'paused',
          reason: 'user',
          // the progression is only started when the stream opens, so it is not live yet
          progress: { value: 0, percent: null },
          overflowing: false,
        });
      });

      it('should be cancelled by a resume() occurring before the stream opens', async () => {
        const logsStream = new FakeLogsStream(undefined, { deferStreamCreation: true });
        logsStream.openLogsStream({ since: new Date().toISOString() });

        logsStream.pause();
        logsStream.resume();
        await logsStream.completeStreamCreation();

        expect(logsStream.sseSpies.pause.callCount).to.eql(0);
        expect(logsStream.sseSpies.resume.callCount).to.eql(0);
      });

      it('should still start the progression when the stream opens', async () => {
        const logsStream = new FakeLogsStream(1000, { deferStreamCreation: true });
        logsStream.openLogsStream({ since: new Date().toISOString() });
        logsStream.pause();
        await logsStream.completeStreamCreation();
        logsStream.resume();
        await logsStream.sseFakeApi.open();
        logsStream.resetSpies();

        await fakeLogsReceived(logsStream);

        // a progression that was never started reports a live date range as a closed one
        expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
        expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
          type: 'running',
          progress: { value: 1 },
          overflowing: false,
        });
      });

      it('should not start the waiting timer while the stream is paused', async () => {
        const logsStream = new FakeLogsStream(50, { deferStreamCreation: true });
        logsStream.openLogsStream({ since: new Date().toISOString(), until: new Date().toISOString() });
        logsStream.pause();
        await logsStream.completeStreamCreation();
        logsStream.resetSpies();

        await sleep(55);

        // with a closed date range, the waiting timer completes the stream: it must not run while paused
        expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
      });
    });
  });

  describe('resume() method', () => {
    it('should set running state', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
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
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.pause();
      logsStream.resetSpies();

      logsStream.resume();

      expect(logsStream.sseSpies.resume.callCount).to.eql(1);
    });

    it('should start the waiting timer back when no log has been received yet', async () => {
      const logsStream = new FakeLogsStream(50);
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      logsStream.pause();

      logsStream.resume();
      logsStream.resetSpies();

      await sleep(55);
      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({ type: 'waitingForFirstLog' });
    });

    it('should start the waiting timer once the stream opens when it was paused before it ever opened', async () => {
      const logsStream = new FakeLogsStream(50, { deferStreamCreation: true });
      logsStream.openLogsStream({ since: new Date().toISOString() });
      logsStream.pause();
      await logsStream.completeStreamCreation();

      logsStream.resume();
      await logsStream.sseFakeApi.open();
      logsStream.resetSpies();

      await sleep(55);
      expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({ type: 'waitingForFirstLog' });
    });

    it('should do nothing if not paused', async () => {
      const logsStream = new FakeLogsStream();
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      logsStream.resume();

      expect(logsStream.sseSpies.resume.callCount).to.eql(0);
    });
  });

  describe('when no logs is received since a long time', () => {
    it('should set waiting state if no logs was received at all', async () => {
      const logsStream = new FakeLogsStream(50);
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      logsStream.resetSpies();

      await sleep(55);

      await expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      expect(logsStream.spies.updateStreamState.firstCall.args[0]).to.eql({
        type: 'waitingForFirstLog',
      });
    });

    it('should not set waiting state if one log has already been received', async () => {
      const logsStream = new FakeLogsStream(50);
      await openLogsStream(logsStream, { since: new Date().toISOString() });
      await fakeLogsReceived(logsStream);
      logsStream.resetSpies();

      await sleep(55);

      await expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
    });
  });

  describe('on connection loss', () => {
    /**
     * Sends logs without waiting for their conversion.
     *
     * @param {FakeLogsStream} logsStream
     * @param {number} count
     */
    function sendLogsWithoutWaiting(logsStream, count) {
      for (let i = 0; i < count; i++) {
        logsStream.sseFakeApi.log(generateLog());
      }
    }

    function liveDateRange() {
      return { since: new Date().toISOString() };
    }

    describe('retry counter', () => {
      it('should set the retrying state with the first attempt as soon as the connection is lost', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        logsStream.resetSpies();

        logsStream.sseFakeApi.error();

        expect(allStates(logsStream)).to.eql([
          { type: 'retrying', retryCount: 1, maxRetryCount: 10, progress: { value: 1 }, overflowing: false },
        ]);
      });

      it('should display every attempt up to the max retry count', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        const maxRetryCount = logsStream.spies.createStream.firstCall.args[1];
        logsStream.resetSpies();

        for (let i = 0; i < maxRetryCount; i++) {
          logsStream.sseFakeApi.error();
          logsStream.sseFakeApi.retry();
        }

        expect(allStates(logsStream).map((state) => state.retryCount)).to.eql(
          Array.from({ length: maxRetryCount }, (_, i) => i + 1),
        );
      });

      it('should set the error state once the retries are exhausted', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();

        await logsStream.sseFakeApi.fail();

        expect(lastState(logsStream)).to.eql({ type: 'error' });
      });

      it('should start the counter over after a reconnection', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();
        logsStream.resetSpies();

        logsStream.sseFakeApi.error();

        expect(lastState(logsStream).retryCount).to.eql(1);
      });
    });

    describe('when reconnected', () => {
      it('should set the running state without waiting for a new log', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        logsStream.resetSpies();

        await logsStream.sseFakeApi.open();

        expect(allStates(logsStream)).to.eql([{ type: 'running', progress: { value: 1 }, overflowing: false }]);
      });

      it('should set the waiting for first log state back when it was displayed before the connection loss', async () => {
        const logsStream = new FakeLogsStream(50);
        await openLogsStream(logsStream, liveDateRange());
        await sleep(55);
        expect(lastState(logsStream)).to.eql({ type: 'waitingForFirstLog' });
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        logsStream.resetSpies();

        await logsStream.sseFakeApi.open();

        expect(allStates(logsStream)).to.eql([{ type: 'waitingForFirstLog' }]);
      });

      it('should not run the waiting timer while retrying', async () => {
        const logsStream = new FakeLogsStream(50);
        await openLogsStream(logsStream, liveDateRange());
        logsStream.resetSpies();

        logsStream.sseFakeApi.error();
        await sleep(55);

        expect(allStates(logsStream).map((state) => state.type)).to.eql(['retrying']);
      });

      it('should start the waiting timer back when the connection was lost before it fired', async () => {
        const logsStream = new FakeLogsStream(50);
        await openLogsStream(logsStream, liveDateRange());
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();
        logsStream.resetSpies();

        await sleep(55);

        expect(allStates(logsStream)).to.eql([{ type: 'waitingForFirstLog' }]);
      });

      it('should run a single waiting timer when the very first attempt fails before opening', async () => {
        const logsStream = new FakeLogsStream(50, { openOnStart: false });
        // with a closed date range, the waiting timer completes the stream
        const since = new Date(Date.now() - 60_000);
        await openLogsStream(logsStream, { since: since.toISOString(), until: new Date().toISOString() });
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();
        await sleep(20);
        logsStream.sseFakeApi.log({ date: new Date(since.getTime() + 1000) });
        await sleep(0);
        logsStream.resetSpies();

        await sleep(50);

        // a log was received before the timeout: the stream must not be completed
        expect(allStates(logsStream).map((state) => state.type)).not.to.include('completed');
        expect(logsStream.sseSpies.close.callCount).to.eql(0);
      });
    });

    describe('pause', () => {
      it('should pause the sse while retrying, which cancels the retry', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        logsStream.sseFakeApi.error();
        logsStream.resetSpies();

        logsStream.pause();

        expect(allStates(logsStream)).to.eql([
          { type: 'paused', reason: 'user', progress: { value: 1 }, overflowing: false },
        ]);
        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.isWaitingToRetry).to.eql(false);

        // the retry is due, but it was cancelled
        logsStream.sseFakeApi.retry();

        expect(logsStream.sse.state).to.eql('paused');
      });

      it('should reconnect right away and start the counter over when resumed after a pause while retrying', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        logsStream.sseFakeApi.error();
        expect(lastState(logsStream).retryCount).to.eql(2);
        logsStream.pause();
        logsStream.resetSpies();

        logsStream.resume();

        expect(logsStream.sseSpies.resume.callCount).to.eql(1);
        expect(logsStream.sse.state).to.eql('connecting');
        expect(allStates(logsStream)).to.eql([{ type: 'running', progress: { value: 1 }, overflowing: false }]);

        logsStream.sseFakeApi.error();

        expect(lastState(logsStream).retryCount).to.eql(1);
      });

      it('should not run the waiting timer while paused after a connection loss, and start it back on resume', async () => {
        const logsStream = new FakeLogsStream(50);
        await openLogsStream(logsStream, liveDateRange());
        logsStream.sseFakeApi.error();
        logsStream.pause();
        logsStream.resetSpies();

        await sleep(55);

        expect(logsStream.spies.updateStreamState.callCount).to.eql(0);

        logsStream.resume();
        await logsStream.sseFakeApi.open();
        logsStream.resetSpies();
        await sleep(55);

        expect(allStates(logsStream)).to.eql([{ type: 'waitingForFirstLog' }]);
      });

      it('should pause the sse while it reconnects after a resume, and ignore the failure of the aborted attempt', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        logsStream.pause();
        // the sse is now connecting
        logsStream.resume();
        logsStream.resetSpies();

        logsStream.pause();

        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.state).to.eql('paused');
        expect(allStates(logsStream)).to.eql([
          { type: 'paused', reason: 'user', progress: { value: 1 }, overflowing: false },
        ]);

        logsStream.sseFakeApi.error();

        // still paused: no "Reconnecting" over the play button
        expect(logsStream.spies.updateStreamState.callCount).to.eql(1);

        logsStream.resume();

        expect(logsStream.sseSpies.resume.callCount).to.eql(1);
        expect(lastState(logsStream)).to.eql({ type: 'running', progress: { value: 1 }, overflowing: false });
      });
    });

    describe('overflow', () => {
      /**
       * @param {FakeLogsStream} logsStream
       */
      async function loseConnectionWithBufferedLogsReachingTheLimit(logsStream) {
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        // these ones stay in the buffer
        await fakeLogsReceived(logsStream, LIMIT - 1);
        await sleep(0);
        logsStream.resetSpies();

        // the buffer is flushed on connection loss
        logsStream.sseFakeApi.error();
      }

      it('should ask for the overflow decision right away when the flushed logs reach the limit', async () => {
        const logsStream = new FakeLogsStream();

        await loseConnectionWithBufferedLogsReachingTheLimit(logsStream);

        expect(allStates(logsStream)).to.eql([
          { type: 'retrying', retryCount: 1, maxRetryCount: 10, progress: { value: 1 }, overflowing: false },
          { type: 'paused', reason: 'overflow', progress: { value: LIMIT } },
        ]);
        // paused from the retry listener, which cancels the retry
        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.isWaitingToRetry).to.eql(false);
      });

      it('should reconnect right away when the overflow is accepted', async () => {
        const logsStream = new FakeLogsStream();
        await loseConnectionWithBufferedLogsReachingTheLimit(logsStream);
        logsStream.resetSpies();

        logsStream.acceptOverflow();

        expect(logsStream.sseSpies.resume.callCount).to.eql(1);
        expect(logsStream.sse.state).to.eql('connecting');
        expect(allStates(logsStream)).to.eql([{ type: 'running', progress: { value: LIMIT }, overflowing: true }]);

        await logsStream.sseFakeApi.open();

        expect(logsStream.spies.updateStreamState.callCount).to.eql(1);
      });

      it('should close the sse when the overflow is discarded', async () => {
        const logsStream = new FakeLogsStream();
        await loseConnectionWithBufferedLogsReachingTheLimit(logsStream);

        logsStream.discardOverflow();

        expect(logsStream.sseSpies.close.callCount).to.eql(1);
      });
    });

    describe('stop()', () => {
      it('should close the sse while retrying, and ignore it afterwards', async () => {
        const logsStream = new FakeLogsStream();
        await openLogsStream(logsStream, liveDateRange());
        await fakeLogsReceived(logsStream);
        logsStream.sseFakeApi.error();

        logsStream.stop();

        expect(logsStream.sseSpies.close.callCount).to.eql(1);
        expect(lastState(logsStream)).to.eql({ type: 'idle' });

        logsStream.resetSpies();
        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();
        logsStream.sseFakeApi.error();

        expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
      });
    });

    // `_convertLog()` is async: a log received just before the connection loss can be added to the buffer (or
    // appended directly when it is the first one) after the buffer was flushed by the connection loss.
    describe('logs still being converted when the connection is lost', () => {
      const CONVERT_DELAY = 20;

      it('should keep the retrying state when they are flushed', async () => {
        const logsStream = new FakeLogsStream(undefined, { convertLogDelay: CONVERT_DELAY });
        await openLogsStream(logsStream, liveDateRange());
        sendLogsWithoutWaiting(logsStream, 1);
        await sleep(CONVERT_DELAY + 5);
        sendLogsWithoutWaiting(logsStream, 2);
        logsStream.sseFakeApi.error();
        logsStream.resetSpies();

        await sleep(CONVERT_DELAY + BUFFER_TIMEOUT + 10);

        expect(allStates(logsStream).map((state) => state.type)).to.eql(['retrying']);
        expect(lastState(logsStream)).to.eql({
          type: 'retrying',
          retryCount: 1,
          maxRetryCount: 10,
          progress: { value: 3 },
          overflowing: false,
        });

        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();

        expect(lastState(logsStream)).to.eql({ type: 'running', progress: { value: 3 }, overflowing: false });
      });

      it('should count a first log appended while retrying', async () => {
        const logsStream = new FakeLogsStream(50, { convertLogDelay: CONVERT_DELAY });
        await openLogsStream(logsStream, liveDateRange());
        sendLogsWithoutWaiting(logsStream, 1);
        logsStream.sseFakeApi.error();
        await sleep(CONVERT_DELAY + 5);

        expect(lastState(logsStream)).to.eql({
          type: 'retrying',
          retryCount: 1,
          maxRetryCount: 10,
          progress: { value: 1 },
          overflowing: false,
        });

        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();

        // a log was received: neither "connecting" nor "waiting for logs"
        expect(lastState(logsStream)).to.eql({ type: 'running', progress: { value: 1 }, overflowing: false });

        logsStream.resetSpies();
        await sleep(55);

        expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
      });

      it('should ask for the overflow decision right away when they reach the limit while retrying', async () => {
        const logsStream = new FakeLogsStream(undefined, { convertLogDelay: CONVERT_DELAY });
        await openLogsStream(logsStream, liveDateRange());
        sendLogsWithoutWaiting(logsStream, 1);
        await sleep(CONVERT_DELAY + 5);
        sendLogsWithoutWaiting(logsStream, LIMIT - 1);
        logsStream.sseFakeApi.error();

        await sleep(CONVERT_DELAY + BUFFER_TIMEOUT + 10);

        // paused while waiting to retry, which cancels the retry
        expect(lastState(logsStream)).to.eql({ type: 'paused', reason: 'overflow', progress: { value: LIMIT } });
        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.isWaitingToRetry).to.eql(false);
      });

      it('should ask for the overflow decision right away when they reach the limit during the next attempt', async () => {
        const logsStream = new FakeLogsStream(undefined, { convertLogDelay: CONVERT_DELAY });
        await openLogsStream(logsStream, liveDateRange());
        sendLogsWithoutWaiting(logsStream, 1);
        await sleep(CONVERT_DELAY + 5);
        sendLogsWithoutWaiting(logsStream, LIMIT - 1);
        logsStream.sseFakeApi.error();
        // the retry is due: the sse is connecting again, still retrying
        logsStream.sseFakeApi.retry();

        await sleep(CONVERT_DELAY + BUFFER_TIMEOUT + 10);

        // the attempt is aborted
        expect(lastState(logsStream)).to.eql({ type: 'paused', reason: 'overflow', progress: { value: LIMIT } });
        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
        expect(logsStream.sse.state).to.eql('paused');
      });

      it('should ask for the overflow decision when they reach the limit after the reconnection', async () => {
        const logsStream = new FakeLogsStream(undefined, { convertLogDelay: CONVERT_DELAY });
        await openLogsStream(logsStream, liveDateRange());
        sendLogsWithoutWaiting(logsStream, 1);
        await sleep(CONVERT_DELAY + 5);
        sendLogsWithoutWaiting(logsStream, LIMIT - 1);
        logsStream.sseFakeApi.error();
        logsStream.sseFakeApi.retry();
        await logsStream.sseFakeApi.open();

        await sleep(CONVERT_DELAY + BUFFER_TIMEOUT + 10);

        expect(lastState(logsStream)).to.eql({ type: 'paused', reason: 'overflow', progress: { value: LIMIT } });
        expect(logsStream.sseSpies.pause.callCount).to.eql(1);
      });

      it('should not append them after a stop()', async () => {
        const logsStream = new FakeLogsStream(undefined, { convertLogDelay: CONVERT_DELAY });
        await openLogsStream(logsStream, liveDateRange());
        sendLogsWithoutWaiting(logsStream, 1);
        logsStream.sseFakeApi.error();
        logsStream.stop();
        logsStream.resetSpies();

        await sleep(CONVERT_DELAY + BUFFER_TIMEOUT + 10);

        expect(logsStream.spies.appendLogs.callCount).to.eql(0);
        expect(logsStream.spies.updateStreamState.callCount).to.eql(0);
      });
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
