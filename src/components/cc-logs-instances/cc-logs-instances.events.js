import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the selection changes.
 * @extends {CcEvent<string[]>}
 */
export class CcLogsInstancesSelectionChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-instances-selection-change';

  /**
   * @param {string[]} detail
   */
  constructor(detail) {
    super(CcLogsInstancesSelectionChangeEvent.TYPE, detail);
  }
}
