import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-token-api-update-form.types.js').CcTokenChangePayload} CcTokenChangePayload
 */

/**
 * Dispatched when the update token form is submitted
 * @extends {CcEvent<CcTokenChangePayload>}
 */
export class CcTokenChangeEvent extends CcEvent {
  static TYPE = 'cc-token-change';

  /** @param {CcTokenChangePayload} detail */
  constructor(detail) {
    super(CcTokenChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when the API token has been updated successfully
 * @extends {CcEvent<string>}
 */
export class CcTokenWasUpdatedEvent extends CcEvent {
  static TYPE = 'cc-token-was-updated';

  /** @param {string} detail */
  constructor(detail) {
    super(CcTokenWasUpdatedEvent.TYPE, detail);
  }
}
