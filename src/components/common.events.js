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
 * @template [T=string]
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
 * @extends {CcEvent}
 */
export class CcRequestSubmitEvent extends CcEvent {
  static TYPE = 'cc-request-submit';

  constructor() {
    super(CcRequestSubmitEvent.TYPE);
  }
}

/**
 * Dispatched when a clickable element is clicked.
 * @extends {CcEvent}
 */
export class CcClickEvent extends CcEvent {
  static TYPE = 'cc-click';

  constructor() {
    super(CcClickEvent.TYPE);
  }
}

/**
 * Dispatched when revocation of all tokens is requested.
 * @extends {CcEvent}
 */
export class CcTokensRevokeAllEvent extends CcEvent {
  static TYPE = 'cc-tokens-revoke-all';

  constructor() {
    super(CcTokensRevokeAllEvent.TYPE);
  }
}

/**
 * Dispatched when a token revocation is requested.
 * @extends {CcEvent<string>}
 */
export class CcTokenRevokeEvent extends CcEvent {
  static TYPE = 'cc-token-revoke';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcTokenRevokeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a password reset is requested.
 * @extends {CcEvent}
 */
export class CcPasswordResetEvent extends CcEvent {
  static TYPE = 'cc-password-reset';

  constructor() {
    super(CcPasswordResetEvent.TYPE);
  }
}
