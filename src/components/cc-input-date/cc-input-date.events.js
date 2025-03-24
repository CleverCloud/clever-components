import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the input value changes.
 * @extends {CcEvent<string>}
 */
export class CcDateChangeEvent extends CcEvent {
  static TYPE = 'cc-date-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcDateChangeEvent.TYPE, detail);
  }
}
