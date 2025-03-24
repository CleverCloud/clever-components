import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the option is toggled.
 * @extends {CcEvent<boolean>}
 */
export class CcAddonOptionChangeEvent extends CcEvent {
  static TYPE = 'cc-addon-option-change';

  /**
   * @param {boolean} detail
   */
  constructor(detail) {
    super(CcAddonOptionChangeEvent.TYPE, detail);
  }
}
