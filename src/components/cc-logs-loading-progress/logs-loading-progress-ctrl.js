import { isLive } from '../../lib/date/date-range-utils.js';
import { dispatchCustomEvent, EventHandler } from '../../lib/events.js';
import { dateRangeSelectionToDateRange } from '../cc-logs-date-range-selector/date-range-selection.js';

/**
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {import('./cc-logs-loading-progress.types.js').LogsLoadingProgressState} LogsLoadingProgressState
 * @typedef {import('./cc-logs-loading-progress.types.js').ProgressState} ProgressState
 * @typedef {import('../cc-logs-date-range-selector/cc-logs-date-range-selector.types.js').LogsDateRangeSelection} LogsDateRangeSelection
 * @typedef {import('../../lib/date/date-range.types.js').DateRange} DateRange
 */

/**
 * State:
 * * `none`: No progression yet, reset state
 * * 'init': The dateRange has been set and the progress is ready to start
 * * 'started': The progress has been started (but no logs have been received yet)
 * * 'waiting': The progress has been started since a long time and no logs have been received yet (this state is used only on live mode)
 * * 'running': The progress is running: some logs are being received
 * * 'paused': The progress is on pause
 * * 'completed': The progress is completed
 */
export class LogsLoadingProgressController {
  /**
   * @param {LitElement & {limit: null|number, overflowWatermarkOffset: number, dateRangeSelection: LogsDateRangeSelection}} host the custom element
   */
  constructor(host) {
    host.addController(this);
    this._host = host;
    this._debug = false;
    this.reset();

    this.onAcceptOverflowEventHandler = new EventHandler(this._host, 'cc-logs-loading-progress:accept-overflow', () => {
      this._overflowDecision = 'accepted';
      dispatchCustomEvent(this._host, 'cc-logs-loading-progress:resume');
    });
    this.onDiscardOverflowEventHandler = new EventHandler(
      this._host,
      'cc-logs-loading-progress:discard-overflow',
      () => {
        this._overflowDecision = 'discarded';
        this._host.dateRangeSelection = {
          type: 'custom',
          since: dateRangeSelectionToDateRange(this._host.dateRangeSelection).since,
          until: this.lastLogDate.toISOString(),
        };
        this.complete();
      },
    );
  }

  hostConnected() {
    this.onAcceptOverflowEventHandler.connect();
    this.onDiscardOverflowEventHandler.connect();
  }

  hostDisconnected() {
    this.onAcceptOverflowEventHandler.disconnect();
    this.onDiscardOverflowEventHandler.disconnect();
  }

  reset() {
    /** @type {DateRange} */
    this._dateRange = null;
    this._isLive = false;
    this._dateRangeStart = null;
    this._dateRangeDuration = null;
    this._lastLogDate = null;
    /** @type {ProgressState} */
    this._state = 'none';
    this._percent = 0;
    this._value = 0;
    this._overflowDecision = 'none';
    this._clearWaitingTimeout();

    this._host.requestUpdate();
  }

  init() {
    this.reset();

    this._dateRange = dateRangeSelectionToDateRange(this._host.dateRangeSelection);

    this._step('init', {
      none: () => {
        this._isLive = isLive(this._dateRange);
        this._dateRangeStart = new Date(this._dateRange.since).getTime();
        this._dateRangeDuration = this._isLive ? 0 : new Date(this._dateRange.until).getTime() - this._dateRangeStart;

        return 'init';
      },
    });
  }

  start() {
    this._step('start', {
      none: () => {
        // todo: this does not make sens
        return 'none';
      },
      paused: () => {
        return 'running';
      },
      init: () => {
        this._waitingTimeoutId = setTimeout(() => {
          this._step('nothingReceived', {
            started: () => {
              return this._isLive ? 'waiting' : 'completed';
            },
          });
        }, 2000);
        return 'started';
      },
    });
  }

  /**
   *
   * @param {Array<{date: Date}>} logs
   */
  progress(logs) {
    if (logs.length === 0) {
      return;
    }

    const doProgress = () => {
      this._value = this._value + logs.length;
      this._lastLogDate = logs[logs.length - 1].date;

      if (!this._isLive) {
        const timeProgress = this._lastLogDate.getTime() - this._dateRangeStart;
        this._percent = (100 * timeProgress) / this._dateRangeDuration;
      }

      if (this.overflowWatermarkReached && this._overflowDecision === 'none') {
        dispatchCustomEvent(this._host, 'cc-logs-loading-progress:pause');
      }
    };

    this._step('progress', {
      started: () => {
        this._clearWaitingTimeout();
        doProgress();
        return 'running';
      },
      waiting: () => {
        doProgress();
        return 'running';
      },
      running: () => {
        doProgress();
        return 'running';
      },
      completed: () => {
        doProgress();
        return 'running';
      },
    });
  }

  pause() {
    this._step('pause', {
      running: () => {
        return 'paused';
      },
    });
  }

  complete() {
    this._step('complete', {
      none: () => {
        return 'none';
      },
      init: () => {
        return 'init';
      },
      started: () => {
        this._clearWaitingTimeout();
        this._percent = 100;
        return 'completed';
      },
      '*': () => {
        this._percent = 100;
        return 'completed';
      },
    });
  }

  cancel() {
    this._step('cancel', {
      '*': () => {
        this.reset();
        return 'none';
      },
    });
  }

  /**
   * @return {ProgressState}
   */
  get state() {
    return this._state;
  }

  /**
   * @return {number|null}
   */
  get percent() {
    return this._isLive ? null : this._percent;
  }

  /**
   * @return {number}
   */
  get value() {
    return this._value;
  }

  /**
   * @return {boolean}
   */
  get overflowing() {
    return this._value > this._host.limit;
  }

  /**
   * @return {boolean}
   */
  get overflowWatermarkReached() {
    return this._value >= this._host.limit - this._host.overflowWatermarkOffset;
  }

  /**
   * @return {Date}
   */
  get lastLogDate() {
    return this._lastLogDate;
  }

  /**
   * @return {LogsLoadingProgressState}
   */
  getLoadingProgressState() {
    if (this.value === 0) {
      return null;
    }

    if (this.state === 'paused' && this.overflowWatermarkReached && !this.overflowing) {
      return {
        type: 'overflowLimitReached',
        value: this.value,
        percent: this.percent,
      };
    }

    if (this.state === 'paused') {
      return {
        type: 'paused',
        value: this.value,
        percent: this.percent,
        overflowing: this.overflowing,
      };
    }

    if (this.state === 'completed') {
      return {
        type: 'completed',
        value: this.value,
        overflowing: this.overflowing,
      };
    }

    return {
      type: 'running',
      value: this.value,
      percent: this.percent,
      overflowing: this.overflowing,
    };
  }

  _clearWaitingTimeout() {
    if (this._waitingTimeoutId != null) {
      clearTimeout(this._waitingTimeoutId);
      this._waitingTimeoutId = null;
    }
  }

  /**
   * @param {string} actionName
   * @param {Partial<{[state in ProgressState|'*']: () => ProgressState|null}>} machine
   */
  _step(actionName, machine) {
    const state = this._state;

    this._log(`progressCtrl: ACTION<${actionName}> from state ${state}`);

    const step = machine[state] ?? machine['*'];

    if (step == null) {
      console.warn(`progressCtrl: ACTION<${actionName}>: no step walker found from state ${state}`);
      return;
    }

    const newState = step();

    if (newState != null) {
      if (newState !== this._state) {
        this._log(`progressCtrl: ${this._state} -> ${newState}`);
        this._state = newState;
      }
      this._host.requestUpdate();
    }
  }

  _log() {
    if (this._debug) {
      console.log(arguments);
    }
  }
}
