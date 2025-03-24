import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the value is updated.
 * @extends {CcEvent<string>}
 */
export class CcKvStringValueChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-string-value-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvStringValueChangeEvent.TYPE, detail);
  }
}
