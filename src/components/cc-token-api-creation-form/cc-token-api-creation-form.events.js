import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-token-api-creation-form.types.js').NewToken} NewToken
 */

/**
 * Dispatched when a token creation is requested.
 * @extends {CcEvent<NewToken>}
 */
export class CcTokenCreateEvent extends CcEvent {
  static TYPE = 'cc-token-create';

  /** @param {NewToken} detail */
  constructor(detail) {
    super(CcTokenCreateEvent.TYPE, detail);
  }
}
