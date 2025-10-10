import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a cc-table column sort is requested.
 * @extends {CcEvent<{columnIndex: number, direction: 'asc'|'desc'|null}>}
 */
export class CcTableSortEvent extends CcEvent {
  static TYPE = 'cc-table-sort';

  /**
   * @param {{columnIndex: number, direction: 'asc'|'desc'|null}} detail
   */
  constructor(detail) {
    super(CcTableSortEvent.TYPE, detail);
  }
}
