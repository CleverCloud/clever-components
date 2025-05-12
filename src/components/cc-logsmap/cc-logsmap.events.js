import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').MapModeType} MapModeType
 */

/**
 * Dispatched when the logsmap display mode changes.
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
