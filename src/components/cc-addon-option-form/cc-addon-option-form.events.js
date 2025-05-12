import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Dispatched when the add-on options form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonOptionFormSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-option-form-submit';

  /**
   * @param {AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonOptionFormSubmitEvent.TYPE, detail);
  }
}
