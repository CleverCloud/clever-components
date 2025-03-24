import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').AddonOptionStates} AddonOptionStates
 */

/**
 * Fires when the form is submitted.
 * @extends {CcEvent<AddonOptionStates>}
 */
export class CcAddonElasticsearchOptionsSubmitEvent extends CcEvent {
  static TYPE = 'cc-addon-elasticsearch-options-submit';

  /**
   * @param {AddonOptionStates} detail
   */
  constructor(detail) {
    super(CcAddonElasticsearchOptionsSubmitEvent.TYPE, detail);
  }
}
