import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-kv-list-explorer.types.js').CcKvListExplorerState} CcKvListExplorerState
 * @typedef {import('./cc-kv-list-explorer.types.js').CcKvListElement} CcKvListElement
 * @typedef {import('./cc-kv-list-explorer.types.js').CcKvListElementAddDetail} CcKvListElementAddDetail
 */

/**
 * Fires when more elements need to be loaded.
 * @extends {CcEvent<void>}
 */
export class CcKvListLoadMoreEvent extends CcEvent {
  static TYPE = 'cc-kv-list-load-more';

  constructor() {
    super(CcKvListLoadMoreEvent.TYPE);
  }
}

/**
 * Fires when the state changes.
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
 * Fires when an element is updated.
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
 * Fires when the filter changes.
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
 * Fires when an element is added.
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
