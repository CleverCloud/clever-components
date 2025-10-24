import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the custom option button is clicked.
 * The detail contains the current selection value (string for single mode, string array for range mode).
 * @extends {CcEvent<string|string[]>}
 */
export class CcRangeSelectorSelectCustom extends CcEvent {
  static TYPE = 'cc-range-selector-select-custom';

  /**
   * @param {string|string[]} detail
   */
  constructor(detail) {
    super(CcRangeSelectorSelectCustom.TYPE, detail);
  }
}
