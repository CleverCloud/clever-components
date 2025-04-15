import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when more KV set elements loading is requested.
 * @extends {CcEvent<void>}
 */
export class CcKvSetLoadMoreEvent extends CcEvent {
  static TYPE = 'cc-kv-set-load-more';

  constructor() {
    super(CcKvSetLoadMoreEvent.TYPE);
  }
}

/**
 * Dispatched when a KV set element deletion is requested.
 * @extends {CcEvent<string>}
 */
export class CcKvSetElementDeleteEvent extends CcEvent {
  static TYPE = 'cc-kv-set-element-delete';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvSetElementDeleteEvent.TYPE, detail);
  }
}

/**
 * Dispatched when KV set elements filter changes.
 * @extends {CcEvent<string>}
 */
export class CcKvSetFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-set-filter-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvSetFilterChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV set element creation is requested.
 * @extends {CcEvent<string>}
 */
export class CcKvSetElementAddEvent extends CcEvent {
  static TYPE = 'cc-kv-set-element-add';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvSetElementAddEvent.TYPE, detail);
  }
}
