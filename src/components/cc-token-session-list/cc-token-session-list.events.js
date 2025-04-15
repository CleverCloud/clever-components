import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when all session token revocation is requested.
 * @extends {CcEvent<void>}
 */
export class CcTokensSessionRevokeAllEvent extends CcEvent {
  static TYPE = 'cc-tokens-session-revoke-all';

  constructor() {
    super(CcTokensSessionRevokeAllEvent.TYPE);
  }
}

/**
 * Dispatched when a session token revocation is requested.
 * @extends {CcEvent<string>}
 */
export class CcTokenSessionRevokeEvent extends CcEvent {
  static TYPE = 'cc-token-session-revoke';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcTokenSessionRevokeEvent.TYPE, detail);
  }
}
