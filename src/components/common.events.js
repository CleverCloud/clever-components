import { CcEvent } from '../lib/events.js';

/**
 * Dispatched when an element is toggled.
 * @extends {CcEvent<{isOpen: boolean}>}
 */
export class CcToggleEvent extends CcEvent {
  static TYPE = 'cc-toggle';

  /**
   * @param {{isOpen: boolean}} detail
   */
  constructor(detail) {
    super(CcToggleEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a single selection changes.
 * @extends {CcEvent<T>}
 * @template {string} T
 */
export class CcSelectEvent extends CcEvent {
  static TYPE = 'cc-select';

  /**
   * @param {T} detail
   */
  constructor(detail) {
    super(CcSelectEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a multi selection changes.
 * @extends {CcEvent<Array<T>>}
 * @template {string} T
 */
export class CcMultiSelectEvent extends CcEvent {
  static TYPE = 'cc-multi-select';

  /**
   * @param {Array<T>} detail
   */
  constructor(detail) {
    super(CcMultiSelectEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an input content changed.
 * @extends {CcEvent<T>}
 * @template T
 */
export class CcInputEvent extends CcEvent {
  static TYPE = 'cc-input';

  /**
   * @param {T} detail
   */
  constructor(detail) {
    super(CcInputEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an implicit form submission is requested.
 * @extends {CcEvent<void>}
 */
export class CcRequestSubmitEvent extends CcEvent {
  static TYPE = 'cc-request-submit';

  constructor() {
    super(CcRequestSubmitEvent.TYPE);
  }
}
