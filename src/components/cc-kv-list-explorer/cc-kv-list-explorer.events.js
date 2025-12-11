import { CcEvent } from '../../lib/events.js';

/**
 * @import { CcKvListExplorerState, CcKvListElement, CcKvListElementAddDetail } from './cc-kv-list-explorer.types.js'
 */

/**
 * Dispatched when more KV list elements loading is requested.
 * @extends {CcEvent}
 */
export class CcKvListLoadMoreEvent extends CcEvent {
  static TYPE = 'cc-kv-list-load-more';

  constructor() {
    super(CcKvListLoadMoreEvent.TYPE);
  }
}

/**
 * Dispatched when KV list explorer state changes.
 * @extends {CcEvent<CcKvListExplorerState>}
 */
export class CcKvListExplorerStateChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-list-explorer-state-change';

  /**
   * @param {CcKvListExplorerState} detail
   */
  constructor(detail) {
    super(CcKvListExplorerStateChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV list element modification is requested.
 * @extends {CcEvent<CcKvListElement>}
 */
export class CcKvListElementUpdateEvent extends CcEvent {
  static TYPE = 'cc-kv-list-element-update';

  /**
   * @param {CcKvListElement} detail
   */
  constructor(detail) {
    super(CcKvListElementUpdateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when KV list elements filter changes.
 * @extends {CcEvent<number>}
 */
export class CcKvListFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-list-filter-change';

  /**
   * @param {number} detail
   */
  constructor(detail) {
    super(CcKvListFilterChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV list element creation is requested.
 * @extends {CcEvent<CcKvListElementAddDetail>}
 */
export class CcKvListElementAddEvent extends CcEvent {
  static TYPE = 'cc-kv-list-element-add';

  /**
   * @param {CcKvListElementAddDetail} detail
   */
  constructor(detail) {
    super(CcKvListElementAddEvent.TYPE, detail);
  }
}
