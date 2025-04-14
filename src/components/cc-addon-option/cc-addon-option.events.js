import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when an add-on option is toggled.
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
