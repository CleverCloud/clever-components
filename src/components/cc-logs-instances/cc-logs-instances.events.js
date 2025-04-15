import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when logs instances selection changes.
 * @extends {CcEvent<Array<string>>}
 */
export class CcLogsInstancesSelectionChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-instances-selection-change';

  /**
   * @param {Array<string>} detail
   */
  constructor(detail) {
    super(CcLogsInstancesSelectionChangeEvent.TYPE, detail);
  }
}
