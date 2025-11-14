import { CcEvent } from '../../lib/events.js';

/**
 * @import { NewToken } from './cc-token-api-creation-form.types.js'
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
