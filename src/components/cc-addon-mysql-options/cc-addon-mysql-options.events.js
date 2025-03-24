import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonMysqlOptionsSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-mysql-options-submit';

  /**
   * @param {AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonMysqlOptionsSubmitEvent.TYPE, detail);
  }
}
