import { CcEvent } from '../../lib/events.js';

/**
 * @extends {CcEvent<Array<string>>}
 */
export class CcToggleChangeEvent extends CcEvent {
  static TYPE = 'cc-toggle-change';

  /**
   * @param {Array<string>} detail
   */
  constructor(detail) {
    super(CcToggleChangeEvent.TYPE, detail);
  }

  /**
   * @returns {string}
   */
  getSingleSelection() {
    if (this.detail.length > 1) {
      throw new Error('Not a single selection');
    }
    return this.detail[0];
  }
}
