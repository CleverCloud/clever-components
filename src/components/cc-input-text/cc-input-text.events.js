import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the input value changes.
 * @extends {CcEvent<string>}
 */
export class CcTextChangeEvent extends CcEvent {
  static TYPE = 'cc-text-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcTextChangeEvent.TYPE, detail);
  }
}

/**
 * Fires when the tags value changes.
 * @extends {CcEvent<string[]>}
 */
export class CcTagsChangeEvent extends CcEvent {
  static TYPE = 'cc-tags-change';

  /**
   * @param {string[]} detail
   */
  constructor(detail) {
    super(CcTagsChangeEvent.TYPE, detail);
  }
}
