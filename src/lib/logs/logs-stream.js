import { HttpError } from '@clevercloud/client/esm/streams/clever-cloud-sse.js';
import { Buffer } from '../buffer.js';
import { LogsProgress } from './logs-progress.js';

const USER_STREAM_CLOSE_REASON = 'cc-logs-stream-closed-by-user';
const COMPLETE_STREAM_CLOSE_REASON = 'cc-logs-stream-closed-by-completed';
const DISCARD_OVERFLOW_CLOSE_REASON = 'cc-logs-stream-closed-after-discard-overflow';
const BUFFER_TIMEOUT = 500;
const LOGS_THROTTLE_ELEMENTS = 1000;
const THROTTLE_PER_IN_MILLISECONDS = 10;
const MAX_RETRY_COUNT = 10;
const WAITING_TIMEOUT_LIVE = 2000;
const WAITING_TIMEOUT_COLD = 16000;

// FIXME: We're using `@typedef` instead of `@import` here due to a false positive from TS
// See: https://github.com/microsoft/TypeScript/issues/60908/
/**
 * @typedef {import('./logs-stream.types.js').AbstractLog} AbstractLog
 * @typedef {import('./logs-stream.types.js').LogsStreamState} LogsStreamState
 * @typedef {import('./logs-stream.types.js').LogsStreamStateRunning} LogsStreamStateRunning
 * @typedef {import('./logs-stream.types.js').LogsSse} LogsSse
 * @typedef {import('../date/date-range.types.js').DateRange} DateRange
 */

/**
 * This class controls all the logic of connecting to a Clever Log SSE and maintaining the right state according to the stream state and logs loading progress.
 *
 * It contains two abstract methods that must be implemented:
 * * `createStream()` method is responsible for creating the right Clever Log SSE client.
 * * `convertLog()` method is responsible for converting the raw log received from the API into the right log Object.
 *
 * The converted logs are stored in an in-memory buffer before being sent to the view.
 *
 * @template {AbstractLog} L The type of the transformed Log.
 * @abstract
 */
export class LogsStream {
  /** @type {LogsSse} */
  #logsStream;
  /** @type {Buffer<L>} */
  #logsBuffer;
  /** @type {LogsProgress<L>} */
  #progress;
  /** @type {LogsStreamState} */
  #streamState;
  /** @type {Timer} */
  #waitingTimer;
  /** @type {{live: number, cold: number}} */
  #waitingTimeout;

  /**
   * @param {number} limit
   * @param {object} [config]
   * @param {{live?: number, cold?: number}} [config.waitingTimeout]
   * @param {number} [config.bufferTimeout]
   */
  constructor(limit, { waitingTimeout, bufferTimeout } = {}) {
    // The buffer receives logs so that we can append them by batch instead of one by one
    this.#logsBuffer = new Buffer(this._appendLogs.bind(this), {
      timeout: bufferTimeout ?? BUFFER_TIMEOUT,
    });

    // The current stream state
    this.#streamState = { type: 'idle' };

    // Progress controls the progression (it calculates the percentage of progress and the overflowing)
    this.#progress = new LogsProgress(limit);

    // This timer sets the state to `waitingForFirstLog` when no logs have been received since a certain amount of time.
    // It is started once the connection to the SSE is established
    // It is closed once the first log is received. And also when asked to stop or complete.
    this.#waitingTimer = new Timer(this.#onWaitingForFirstLog.bind(this));

    // waiting timeout
    this.#waitingTimeout = { live: WAITING_TIMEOUT_LIVE, cold: WAITING_TIMEOUT_COLD, ...(waitingTimeout ?? {}) };
  }

  // -- Abstract methods ------

  /**
   * @param {DateRange} _dateRange
   * @param {number} _maxRetryCount
   * @param {number} _throttleElements
   * @param {number} _throttlePerInMilliseconds
   * @return {LogsSse}
   * @protected
   * @abstract
   */
  _createStream(_dateRange, _maxRetryCount, _throttleElements, _throttlePerInMilliseconds) {
    throw new Error('Abstract method. Implement me!');
  }

  /**
   * @param {number} _rawLog The raw log coming from the API
   * @return {L|null|Promise<L|null>} A log that can be appended to the view or `null` if the log could not be converted
   * @protected
   * @abstract
   */
  _convertLog(_rawLog) {
    throw new Error('Abstract method. Implement me!');
  }

  // -- Public methods ------

  /**
   * Opens a new log stream with the given date range.
   * If a stream is already running, it will be stopped before starting the new one.
   *
   * @param {DateRange} dateRange
   */
  openLogsStream(dateRange) {
    this.stop();
    this._updateStreamState({ type: 'connecting' });
    this.#start(dateRange);
  }

  /**
   * Stops the running logs stream
   */
  stop() {
    this.#waitingTimer.stop();
    this.#logsStream?.close({ type: USER_STREAM_CLOSE_REASON });
    this.#logsBuffer.clear();
    this.#progress.reset();
    this._updateStreamState({ type: 'idle' });
  }

  /**
   * Pauses the logs stream
   */
  pause() {
    this.#pause('user');
  }

  /**
   * Resumes the logs stream
   */
  resume() {
    if (this.#streamState.type === 'paused') {
      // todo: add a `resuming` state (which is like a `connecting` state, but after stream has been paused)
      //       without this `resuming` state, the state will be in `running` while the SSE is trying to reconnect
      //        (which can be quite long or even fail due to timeout or whatever error occurs in the network)
      this._updateStreamState(this.#buildRunningState());
      this.#logsStream.resume();
    }
  }

  /**
   * Accepts overflow by resuming the stream.
   * This method has no effect if the current state is not paused with the `overflow` reason.
   */
  acceptOverflow() {
    if (this.#streamState.type === 'paused' && this.#streamState.reason === 'overflow') {
      this.resume();
    }
  }

  /**
   * Discard overflow by stopping the stream.
   * This method has no effect if the current state is not paused with the `overflow` reason.
   */
  discardOverflow() {
    if (this.#streamState.type === 'paused' && this.#streamState.reason === 'overflow') {
      this.#logsStream?.close({ type: DISCARD_OVERFLOW_CLOSE_REASON });
    }
  }

  /**
   * Marks the current progression as `completed`.
   */
  complete() {
    this.#waitingTimer.stop();
    this.#logsStream?.close({ type: COMPLETE_STREAM_CLOSE_REASON });
    this.#logsBuffer.flush();
    this.#progress.complete();
    this._updateStreamState({
      type: 'completed',
      progress: this.#progress.getProgress(),
      overflowing: this.#progress.isOverflowing(),
    });
  }

  /**
   * @return {Date|null} The date of the last received log. Or `null` if no logs have been received.
   */
  getLastLogDate() {
    return this.#progress.getLastLogDate();
  }

  // -- Protected methods ------

  /**
   * Updates the stream state. This method is called every time the stream is to be changed.
   * Override this method if you want to be notified of stream state modification.
   *
   * @param {LogsStreamState} streamState The new stream state
   * @protected
   */
  _updateStreamState(streamState) {
    this.#streamState = streamState;
  }

  /**
   * This method is called every time a batch of logs is flushed by the logs buffer.
   *
   * @param {Array<L>} logs
   * @protected
   */
  _appendLogs(logs) {
    const overflowReached = this.#progress.progress(logs);
    if (overflowReached) {
      this.#pause('overflow');
    } else if (this.#streamState.type !== 'paused') {
      this._updateStreamState(this.#buildRunningState());
    }
  }

  // -- Private methods ------

  /**
   * Creates a new LogsSse. Starts it and bind its lifecycle to the right methods.
   *
   * @param {DateRange} dateRange
   */
  #start(dateRange) {
    this.#logsStream = this._createStream(
      dateRange,
      MAX_RETRY_COUNT,
      LOGS_THROTTLE_ELEMENTS,
      THROTTLE_PER_IN_MILLISECONDS,
    )
      // stream is opened
      .on('open', () => this.#onStreamOpened(dateRange))
      // log received in stream
      .onLog(this.#onStreamLogEvent.bind(this))
      // error event received (not a fatal error: the logs stream will retry)
      .on('error', this.#onStreamErrorEvent.bind(this));

    this.#logsStream
      // start stream
      .start()
      // the stream ended normally
      .then(this.#onStreamEnded.bind(this))
      // the stream ended with error
      .catch(this.#onStreamError.bind(this));
  }

  /**
   * @param {DateRange} dateRange
   */
  #onStreamOpened(dateRange) {
    // stream opening can occur after connecting or after resuming.
    // we start only when after connecting
    if (this.#streamState.type === 'connecting') {
      this.#progress.start(dateRange);
      this.#waitingTimer.start(this.#progress.isLive() ? this.#waitingTimeout.live : this.#waitingTimeout.cold);
    }
  }

  /**
   * @param {any} rawLog raw log coming from the API
   */
  async #onStreamLogEvent(rawLog) {
    this.#waitingTimer.stop();
    const convertedLog = await this._convertLog(rawLog);
    if (convertedLog == null) {
      return;
    }
    if (this.#progress.isEmpty()) {
      this._appendLogs([convertedLog]);
    } else {
      this.#logsBuffer.add(convertedLog);
    }
  }

  /**
   * @param {{type: string}} event
   */
  #onStreamEnded(event) {
    // we flush the remaining logs in the buffer
    this.#logsBuffer.flush();
    // we mark the progression as completed only if the end reason is not because of a volunteer stop by the user
    if (event.type !== USER_STREAM_CLOSE_REASON) {
      this.complete();
    }
  }

  /**
   * @param {any} event
   */
  #onStreamErrorEvent(event) {
    if (this.#logsStream.retryCount >= 3) {
      console.log('received an `error` event from log stream', event);
      // TODO: notify about the instability
    }
  }

  /**
   * @param {Error|HttpError} error
   */
  #onStreamError(error) {
    console.error(error);

    // we consider 404 error as a valid stream end (but still as an error when handling live date range)
    if (error instanceof HttpError && error.status === 404 && !this.#progress.isLive()) {
      this.complete();
    } else {
      this._updateStreamState({
        type: 'error',
      });
    }
  }

  #onWaitingForFirstLog() {
    // this happens when we did not receive any logs since a long time after stream connection has been established
    // in live mode, it can really happen in the case of an application not logging so much
    if (this.#progress.isLive()) {
      this._updateStreamState({ type: 'waitingForFirstLog' });
    }
    // with a closed date range, we consider the stream to be completed with no logs found at all
    else {
      this.complete();
    }
  }

  /**
   * @param {'user'|'overflow'} reason
   */
  #pause(reason) {
    if (
      this.#streamState.type === 'connecting' ||
      this.#streamState.type === 'waitingForFirstLog' ||
      this.#streamState.type === 'running'
    ) {
      this.#logsStream?.pause();
      this.#logsBuffer.flush();
      if (reason === 'user') {
        this._updateStreamState({
          type: 'paused',
          reason: 'user',
          progress: this.#progress.getProgress(),
          overflowing: this.#progress.isOverflowing(),
        });
      } else {
        this._updateStreamState({
          type: 'paused',
          reason: 'overflow',
          progress: this.#progress.getProgress(),
        });
      }
    }
  }

  /**
   * @returns {LogsStreamStateRunning}
   */
  #buildRunningState() {
    return {
      type: 'running',
      progress: this.#progress.getProgress(),
      overflowing: this.#progress.isOverflowing(),
    };
  }
}

/**
 * Class that simplifies the usage of `setTimeout` API when one want to be able to stop the timeout.
 */
class Timer {
  /** @type {any} */
  #id;

  /**
   * @param {() => void} callback
   */
  constructor(callback) {
    this._callback = callback;
  }

  /**
   * @param {number} timeout
   */
  start(timeout) {
    if (this.#id != null) {
      stop();
    }
    this.#id = setTimeout(() => {
      this._callback();
      this.#id = null;
    }, timeout);
  }

  stop() {
    if (this.#id != null) {
      clearTimeout(this.#id);
      this.#id = null;
    }
  }
}
