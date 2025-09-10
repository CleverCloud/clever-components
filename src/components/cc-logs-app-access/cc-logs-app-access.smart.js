// @ts-expect-error FIXME: remove when clever-client exports types
import { ApplicationAccessLogStream } from '@clevercloud/client/esm/streams/access-logs.js';
import { LogsStream } from '../../lib/logs/logs-stream.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import { dateRangeSelectionToDateRange } from '../cc-logs-date-range-selector/date-range-selection.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-logs-app-access.js';

/**
 * @typedef {import('./cc-logs-app-access.js').CcLogsAppAccess} CcLogsAppAccess
 * @typedef {import('../cc-logs/cc-logs.types.js').Log} Log
 * @typedef {import('../../lib/date/date-range.types.js').DateRange} DateRange
 * @typedef {import('../../lib/logs/logs-stream.types.js').LogsStreamState} LogsStreamState
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcLogsAppAccess>} OnContextUpdateArgs
 * @typedef {import('../../lib/smart/smart-component.types.js').UpdateComponentCallback<CcLogsAppAccess>} UpdateComponentCallback
 */

defineSmartComponent({
  selector: 'cc-logs-app-access-beta',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
    dateRangeSelection: { type: Object, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId, dateRangeSelection } = context;

    if (dateRangeSelection != null) {
      updateComponent('dateRangeSelection', dateRangeSelection);
    }

    const controller = new SmartController({
      apiConfig,
      ownerId,
      appId,
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
   * @param {string} _.appId
   * @param {CcLogsAppAccess} _.component
   * @param {UpdateComponentCallback} _.updateComponent
   */
  constructor({ apiConfig, ownerId, appId, component, updateComponent }) {
    super(component.limit);

    this._apiConfig = apiConfig;
    this._ownerId = ownerId;
    this._appId = appId;
    this._component = component;
    this._updateComponent = updateComponent;
    this._dateRange = dateRangeSelectionToDateRange(component.dateRangeSelection);
  }

  /**
   * @param {DateRange} dateRange
   * @param {number} maxRetryCount
   * @param {number} throttleElements
   * @param {number} throttlePerInMilliseconds
   * @returns {ApplicationAccessLogStream}
   */
  _createStream(dateRange, maxRetryCount, throttleElements, throttlePerInMilliseconds) {
    return new ApplicationAccessLogStream({
      apiHost: this._apiConfig.API_HOST,
      tokens: this._apiConfig,
      ownerId: this._ownerId,
      appId: this._appId,
      since: dateRange.since,
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

  /**
   * @param {DateRange} dateRange
   */
  setNewDateRange(dateRange) {
    this._dateRange = dateRange;
    this.init();
  }

  init() {
    this.openLogsStream(this._dateRange);
  }
}

/**
 * @param {any} log
 * @return {Log}
 */
function convertLog(log) {
  const { id, date, source, http } = log;

  if (http == null) {
    return null;
  }

  return {
    id: id,
    date: new Date(date),
    message: http.request.path,
    metadata: [
      { name: 'ip', value: source.ip },
      { name: 'country', value: source.countryCode ?? '??' },
      { name: 'city', value: source.city ?? '??' },
      { name: 'method', value: http.request.method },
      { name: 'status', value: http.response.statusCode },
    ],
  };
}
