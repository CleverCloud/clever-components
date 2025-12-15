import { ResourceLogStream } from '@clevercloud/client/esm/streams/resource-logs.js';
import { LogsStream } from '../../lib/logs/logs-stream.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { dateRangeSelectionToDateRange } from '../cc-logs-date-range-selector/date-range-selection.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-logs-addon-runtime.js';

/**
 * @import { CcLogsAddonRuntime } from './cc-logs-addon-runtime.js'
 * @import { Log } from '../cc-logs/cc-logs.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { DateRange } from '../../lib/date/date-range.types.js'
 * @import { LogsStreamState } from '../../lib/logs/logs-stream.types.js'
 * @import { UpdateComponentCallback, OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-logs-addon-runtime-beta',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    realAddonId: { type: String },
    dateRangeSelection: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcLogsAddonRuntime>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, realAddonId, dateRangeSelection } = context;

    if (dateRangeSelection != null) {
      updateComponent('dateRangeSelection', dateRangeSelection);
    }

    const controller = new SmartController({
      apiConfig,
      ownerId,
      addonId: realAddonId,
      component,
      updateComponent,
    });
    signal.onabort = () => {
      controller.stop();
    };

    onEvent('cc-logs-date-range-selection-change', ({ range }) => {
      controller.setNewDateRange(range);
    });

    onEvent('cc-logs-loading-pause', () => {
      controller.pause();
    });

    onEvent('cc-logs-loading-resume', () => {
      controller.resume();
    });

    onEvent('cc-logs-loading-overflow-accept', () => {
      controller.acceptOverflow();
    });

    onEvent('cc-logs-loading-overflow-discard', () => {
      controller.discardOverflow();
    });

    onEvent('cc-log-inspect', () => {
      controller.pause();
    });

    controller.init();
  },
});

/**
 * @extends LogsStream<Log>
 */
class SmartController extends LogsStream {
  /**
   * @param {object} _
   * @param {ApiConfig} _.apiConfig
   * @param {string} _.ownerId
   * @param {string} _.addonId
   * @param {CcLogsAddonRuntime} _.component
   * @param {UpdateComponentCallback<CcLogsAddonRuntime>} _.updateComponent
   */
  constructor({ apiConfig, ownerId, addonId, component, updateComponent }) {
    super(component.limit);

    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._addonId = addonId;
    this._component = component;
    this._updateComponent = updateComponent;
    this._dateRange = dateRangeSelectionToDateRange(this._component.dateRangeSelection);
  }

  /**
   *
   * @param {DateRange} dateRange
   */
  setNewDateRange(dateRange) {
    this.stop();
    this._dateRange = dateRange;
    this.init();
  }

  /**
   * @param {DateRange} dateRange
   * @param {number} maxRetryCount
   * @param {number} throttleElements
   * @param {number} throttlePerInMilliseconds
   * @returns {ResourceLogStream}
   */
  _createStream(dateRange, maxRetryCount, throttleElements, throttlePerInMilliseconds) {
    return new ResourceLogStream({
      apiHost: this._apiConfig.API_HOST,
      tokens: this._apiConfig,
      ownerId: this._ownerId,
      addonId: this._addonId,
      // @ts-expect-error: FIXME: client types seem to expect Date but dateRange has string
      since: dateRange.since,
      // @ts-expect-error: FIXME: client types seem to expect Date but dateRange has string
      until: dateRange.until,
      retryConfiguration: { enabled: true, maxRetryCount },
      throttleElements,
      throttlePerInMilliseconds,
    });
  }

  /**
   * @param {any} rawLog
   * @return {Log}
   */
  _convertLog(rawLog) {
    return convertLog(rawLog);
  }

  /**
   * @param {LogsStreamState} streamState
   */
  _updateStreamState(streamState) {
    super._updateStreamState(streamState);
    this._updateComponent('state', {
      type: 'loaded',
      streamState,
    });
  }

  stop() {
    super.stop();
    this._component.clear();
  }

  /**
   * @param {Array<Log>} logs
   */
  _appendLogs(logs) {
    super._appendLogs(logs);
    this._component.appendLogs(logs);
  }

  init() {
    this.openLogsStream(this._dateRange);
  }
}

/**
 * @param {object} log
 * @param {Date}   log.date
 * @param {string} log.hostname
 * @param {string} log.id
 * @param {string} log.instanceId
 * @param {string} log.message
 * @param {string} log.region
 * @param {string} log.resourceId
 * @param {string} log.service
 * @param {string} log.severity
 * @param {string} log.zone
 * @return {Log}
 */
function convertLog(log) {
  const { id, date } = log;

  return {
    id: id,
    date: date,
    message: log.message,
    metadata: [],
  };
}
