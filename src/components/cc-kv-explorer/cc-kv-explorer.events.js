import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-kv-explorer.types.js').CcKvKeyValue} CcKvKeyValue
 * @typedef {import('./cc-kv-explorer.types.js').CcKvKey} CcKvKey
 * @typedef {import('./cc-kv-explorer.types.js').CcKvKeyFilter} CcKvKeyFilter
 */

/**
 * Fires when a key is added.
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
 * Fires when a key is deleted.
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
 * Fires when the filter changes.
 * @extends {CcEvent<CcKvKeyFilter>}
 */
export class CcKvFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-kv-filter-change';

  /**
   * @param {CcKvKeyFilter} detail
   */
  constructor(detail) {
    super(CcKvFilterChangeEvent.TYPE, detail);
  }
}

/**
 * Fires when more keys need to be loaded.
 * @extends {CcEvent<void>}
 */
export class CcKvLoadMoreKeysEvent extends CcEvent {
  static TYPE = 'cc-kv-explorer-load-more-keys';

  constructor() {
    super(CcKvLoadMoreKeysEvent.TYPE);
  }
}

/**
 * Fires when keys need to be refreshed.
 * @extends {CcEvent<void>}
 */
export class CcKvKeysRefreshEvent extends CcEvent {
  static TYPE = 'cc-kv-keys-refresh';

  constructor() {
    super(CcKvKeysRefreshEvent.TYPE);
  }
}

/**
 * Fires when the selected key changes.
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
