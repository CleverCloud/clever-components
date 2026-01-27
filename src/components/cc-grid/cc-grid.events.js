import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a cc-grid column sort is requested.
 * @extends {CcEvent<{columnIndex: number, direction: 'asc'|'desc'}>}
 */
export class CcGridSortEvent extends CcEvent {
  static TYPE = 'cc-grid-sort';

  /**
   * @param {{columnIndex: number, direction: 'asc'|'desc'}} detail
   */
  constructor(detail) {
    super(CcGridSortEvent.TYPE, detail);
  }
}
