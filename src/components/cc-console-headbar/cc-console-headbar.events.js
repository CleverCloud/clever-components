import { CcEvent } from '../../lib/events.js';

/**
 * @import { Tab } from './cc-console-headbar.types.js'
 */

/**
 * Dispatched when a tab is clicked.
 * @extends {CcEvent<{ path: string; name: string }>}
 */
export class CcTabClickEvent extends CcEvent {
  static TYPE = 'cc-tab-click';

  /**
   * @param {{ path: string; name: string }} detail
   */
  constructor(detail) {
    super(CcTabClickEvent.TYPE, detail);
  }
}
