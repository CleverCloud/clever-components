import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a KV string key modification is requested.
 * @extends {CcEvent<string>}
 */
export class CcKvStringValueUpdateEvent extends CcEvent {
  static TYPE = 'cc-kv-string-value-update';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvStringValueUpdateEvent.TYPE, detail);
  }
}
