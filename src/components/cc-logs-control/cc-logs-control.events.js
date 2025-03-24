import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-logs-control.types.js').LogsControlOption} LogsControlOption
 * @typedef {import('./cc-logs-control.types.js').LogsOptions} LogsOptions
 */

/**
 * Fires when a logs control option changes.
 * @extends {CcEvent<LogsControlOption>}
 */
export class CcLogsOptionChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-option-change';

  /**
   * @param {LogsControlOption} detail
   */
  constructor(detail) {
    super(CcLogsOptionChangeEvent.TYPE, detail);
  }
}

/**
 * Fires when the logs options change.
 * @extends {CcEvent<LogsOptions>}
 */
export class CcLogsOptionsChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-options-change';

  /**
   * @param {LogsOptions} detail
   */
  constructor(detail) {
    super(CcLogsOptionsChangeEvent.TYPE, detail);
  }
}
