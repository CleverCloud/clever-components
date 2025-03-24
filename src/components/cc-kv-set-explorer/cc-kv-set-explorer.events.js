import { CcEvent } from '../../lib/events.js';

/**
 * Fires when more elements need to be loaded.
 * @extends {CcEvent<void>}
 */
export class CcKvSetLoadMoreEvent extends CcEvent {
  static TYPE = 'cc-kv-set-load-more';

  constructor() {
    super(CcKvSetLoadMoreEvent.TYPE);
  }
}

/**
 * Fires when an element is deleted.
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
 * Fires when the filter changes.
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
 * Fires when an element is added.
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
