import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the update token form is submitted
 * @extends {CcEvent<{ name: string, description: string }>}
 */
export class CcTokenUpdateEvent extends CcEvent {
  static TYPE = 'cc-token-update';

  /** @param {{ name: string, description: string }} detail */
  constructor(detail) {
    super(CcTokenUpdateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when the API token has been updated successfully
 * @extends {CcEvent<string>}
 */
export class CcTokenChangeEvent extends CcEvent {
  static TYPE = 'cc-token-change';

  /** @param {string} detail */
  constructor(detail) {
    super(CcTokenChangeEvent.TYPE, detail);
  }
}
