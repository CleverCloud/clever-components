import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a breadcrumb item is clicked.
 * @extends {CcEvent<{path: Array<string>}>}
 */
export class CcBreadcrumbClickEvent extends CcEvent {
  static TYPE = 'cc-breadcrumb-click';

  /**
   * @param {{path: Array<string>}} details
   */
  constructor(details) {
    super(CcBreadcrumbClickEvent.TYPE, details);
  }
}
