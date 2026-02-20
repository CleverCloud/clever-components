import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a range selection changes.
 * @extends {CcEvent<string[]>}
 */
export class CcRangeSelectEvent extends CcEvent {
  static TYPE = 'cc-range-select';

  /**
   * @param {string[]} detail
   */
  constructor(detail) {
    super(CcRangeSelectEvent.TYPE, detail);
  }
}

/**
 * Dispatched when the custom option button is clicked.
 * The detail contains the current selection value (string for single mode, string array for range mode).
 * @extends {CcEvent<string|string[]>}
 */
export class CcRangeSelectorSelectCustomEvent extends CcEvent {
  static TYPE = 'cc-range-selector-select-custom';

  /**
   * @param {string|string[]} detail
   */
  constructor(detail) {
    super(CcRangeSelectorSelectCustomEvent.TYPE, detail);
  }
}
