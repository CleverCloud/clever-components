import { CcEvent } from './events.js';

/**
 * Dispatched when an API request failed.
 * @extends {CcEvent<any>}
 */
export class CcApiErrorEvent extends CcEvent {
  static TYPE = 'cc-api-error';

  /**
   * @param {any} detail
   */
  constructor(detail) {
    super(CcApiErrorEvent.TYPE, detail);
  }
}
