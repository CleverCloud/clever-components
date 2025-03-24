import { CcEvent } from './events.js';

/**
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
