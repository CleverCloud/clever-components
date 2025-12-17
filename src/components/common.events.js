import { CcEvent } from '../lib/events.js';

/**
 * Dispatched when a component is closed.
 *
 * @extends {CcEvent}
 */
export class CcCloseEvent extends CcEvent {
  static TYPE = 'cc-close';

  constructor() {
    super(CcCloseEvent.TYPE);
  }
}

/**
 * Dispatched when you need to request a component to close itself.
 * For instance, when the user clicks the cancel button inside a dialog.
 *
 * @extends {CcEvent}
 */
export class CcCloseRequest extends CcEvent {
  static TYPE = 'cc-close-request';

  constructor() {
    super(CcCloseRequest.TYPE);
  }
}

/**
 * Dispatched when the user confirms using the enter key from the input field or by clicking the confirm button.
 *
 * @extends {CcEvent}
 */
export class CcConfirmEvent extends CcEvent {
  static TYPE = 'cc-confirm';

  constructor() {
    super(CcConfirmEvent.TYPE);
  }
}

/**
 * Dispatched when a component is opened.
 *
 * @extends {CcEvent}
 */
export class CcOpenEvent extends CcEvent {
  static TYPE = 'cc-open';

  constructor() {
    super(CcOpenEvent.TYPE);
  }
}

/**
 * Dispatched when the focus is lost.
 *
 * @extends {CcEvent<Element>}
 */
export class CcFocusRestorationFail extends CcEvent {
  static TYPE = 'cc-focus-restoration-fail';

  /** @param {Element} element - the element that it tried to restore focus on */
  constructor(element) {
    super(CcFocusRestorationFail.TYPE, element);
  }
}

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
