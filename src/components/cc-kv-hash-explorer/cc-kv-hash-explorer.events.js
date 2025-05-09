import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-kv-hash-explorer.types.js').CcKvHashExplorerState} CcKvHashExplorerState
 * @typedef {import('./cc-kv-hash-explorer.types.js').CcKvHashElement} CcKvHashElement
 */

/**
 * Dispatched when more KV hash elements loading is requested.
 * @extends {CcEvent}
 */
export class CcKvHashLoadMoreEvent extends CcEvent {
  static TYPE = 'cc-kv-hash-load-more';

  constructor() {
    super(CcKvHashLoadMoreEvent.TYPE);
  }
}

/**
 * Dispatched when KV hash explorer state changes.
 * @extends {CcEvent<CcKvHashExplorerState>}
 */
export class CcKvHashExplorerStateChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-hash-explorer-state-change';

  /**
   * @param {CcKvHashExplorerState} detail
   */
  constructor(detail) {
    super(CcKvHashExplorerStateChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV hash element modification is requested.
 * @extends {CcEvent<CcKvHashElement>}
 */
export class CcKvHashElementUpdateEvent extends CcEvent {
  static TYPE = 'cc-kv-hash-element-update';

  /**
   * @param {CcKvHashElement} detail
   */
  constructor(detail) {
    super(CcKvHashElementUpdateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV hash element deletion is requested.
 * @extends {CcEvent<string>}
 */
export class CcKvHashElementDeleteEvent extends CcEvent {
  static TYPE = 'cc-kv-hash-element-delete';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvHashElementDeleteEvent.TYPE, detail);
  }
}

/**
 * Dispatched when KV hash elements filter changes.
 * @extends {CcEvent<string>}
 */
export class CcKvHashFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-hash-filter-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvHashFilterChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV hash element creation is requested.
 * @extends {CcEvent<CcKvHashElement>}
 */
export class CcKvHashElementAddEvent extends CcEvent {
  static TYPE = 'cc-kv-hash-element-add';

  /**
   * @param {CcKvHashElement} detail
   */
  constructor(detail) {
    super(CcKvHashElementAddEvent.TYPE, detail);
  }
}
