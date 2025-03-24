import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonRedisOptionsSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-redis-options-submit';

  /**
   * @param {AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonRedisOptionsSubmitEvent.TYPE, detail);
  }
}
