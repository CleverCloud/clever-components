import { CcEvent } from '../../lib/events.js';

/**
 * @import { MapModeType } from '../common.types.js'
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
