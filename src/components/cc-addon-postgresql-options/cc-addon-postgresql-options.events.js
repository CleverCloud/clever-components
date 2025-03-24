import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonPostgresqlOptionsSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-postgresql-options-submit';

  /**
   * @param {import('../common.types.js').AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonPostgresqlOptionsSubmitEvent.TYPE, detail);
  }
}
