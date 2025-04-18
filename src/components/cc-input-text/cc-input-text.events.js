import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when tags have changed.
 * @extends {CcEvent<Array<string>>}
 */
export class CcTagsChangeEvent extends CcEvent {
  static TYPE = 'cc-tags-change';

  /**
   * @param {Array<string>} detail
   */
  constructor(detail) {
    super(CcTagsChangeEvent.TYPE, detail);
  }
}
