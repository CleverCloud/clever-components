import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonJenkinsOptionsSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-jenkins-options-submit';

  /**
   * @param {AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonJenkinsOptionsSubmitEvent.TYPE, detail);
  }
}
