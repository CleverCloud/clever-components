import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonMongodbOptionsSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-mongodb-options-submit';

  /**
   * @param {AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonMongodbOptionsSubmitEvent.TYPE, detail);
  }
}
