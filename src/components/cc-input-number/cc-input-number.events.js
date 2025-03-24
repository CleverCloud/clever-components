import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the input value changes.
 * @extends {CcEvent<number>}
 */
export class CcNumberChangeEvent extends CcEvent {
  static TYPE = 'cc-number-change';

  /**
   * @param {number} detail
   */
  constructor(detail) {
    super(CcNumberChangeEvent.TYPE, detail);
  }
}
