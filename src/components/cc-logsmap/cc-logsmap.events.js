import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').MapModeType} MapModeType
 */

/**
 * Fires the selected mode whenever the toggle changes.
 * @extends {CcEvent<MapModeType>}
 */
export class CcLogsmapModeChangeEvent extends CcEvent {
  static TYPE = 'cc-logsmap-mode-change';

  /**
   * @param {MapModeType} detail
   */
  constructor(detail) {
    super(CcLogsmapModeChangeEvent.TYPE, detail);
  }
}
