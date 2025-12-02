import { CcEvent } from '../../lib/events.js';

/**
 * @import { CcKvKeyValue, CcKvKey, CcKvKeyFilter } from './cc-kv-explorer.types.js'
 */

/**
 * Dispatched when a KV key creation is requested.
 * @extends {CcEvent<CcKvKeyValue>}
 */
export class CcKvKeyAddEvent extends CcEvent {
  static TYPE = 'cc-kv-key-add';

  /**
   * @param {CcKvKeyValue} detail
   */
  constructor(detail) {
    super(CcKvKeyAddEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a KV key deletion is requested.
 * @extends {CcEvent<string>}
 */
export class CcKvKeyDeleteEvent extends CcEvent {
  static TYPE = 'cc-kv-key-delete';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcKvKeyDeleteEvent.TYPE, detail);
  }
}

/**
 * Dispatched when the KV key filter has changed.
 * @extends {CcEvent<CcKvKeyFilter>}
 */
export class CcKvKeyFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-key-filter-change';

  /**
   * @param {CcKvKeyFilter} detail
   */
  constructor(detail) {
    super(CcKvKeyFilterChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when loading more keys is requested.
 * @extends {CcEvent}
 */
export class CcKvLoadMoreKeysEvent extends CcEvent {
  static TYPE = 'cc-kv-load-more-keys';

  constructor() {
    super(CcKvLoadMoreKeysEvent.TYPE);
  }
}

/**
 * Dispatched when KV keys refresh is requested.
 * @extends {CcEvent}
 */
export class CcKvKeysRefreshEvent extends CcEvent {
  static TYPE = 'cc-kv-keys-refresh';

  constructor() {
    super(CcKvKeysRefreshEvent.TYPE);
  }
}

/**
 * Dispatched when KV key selection changes.
 * @extends {CcEvent<CcKvKey>}
 */
export class CcKvSelectedKeyChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-selected-key-change';

  /**
   * @param {CcKvKey} detail
   */
  constructor(detail) {
    super(CcKvSelectedKeyChangeEvent.TYPE, detail);
  }
}
