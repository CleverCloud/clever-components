import { CcEvent } from '../lib/events.js';

/**
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
 * @extends {CcEvent<Array<string>>}
 */
export class CcMultiSelectEvent extends CcEvent {
  static TYPE = 'cc-multi-select';

  /**
   * @param {Array<string>} detail
   */
  constructor(detail) {
    super(CcMultiSelectEvent.TYPE, detail);
  }
}

/**
 * @extends {CcEvent<void>}
 */
export class CcClickEvent extends CcEvent {
  static TYPE = 'cc-click';

  constructor() {
    super(CcClickEvent.TYPE);
  }
}

/**
 * Fires when an implicit submit is requested.
 * @extends {CcEvent<void>}
 */
export class CcRequestSubmitEvent extends CcEvent {
  static TYPE = 'cc-request-submit';

  constructor() {
    super(CcRequestSubmitEvent.TYPE, undefined);
  }
}
