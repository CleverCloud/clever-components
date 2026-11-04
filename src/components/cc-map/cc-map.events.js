import { CcEvent } from '../../lib/events.js';

/**
 * @import { MapPoint } from './cc-map.types.js'
 */

/**
 * Dispatched when a map marker has been clicked.
 * @extends {CcEvent<MapPoint>}
 */
export class CcMapMarkerClickEvent extends CcEvent {
  static TYPE = 'cc-map-marker-click';

  /**
   * @param {MapPoint} detail
   */
  constructor(detail) {
    super(CcMapMarkerClickEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a map marker has been entered by the mouse pointer.
 * @extends {CcEvent<MapPoint>}
 */
export class CcMapMarkerEnterEvent extends CcEvent {
  static TYPE = 'cc-map-marker-enter';

  /**
   * @param {MapPoint} detail
   */
  constructor(detail) {
    super(CcMapMarkerEnterEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a map marker has been left by the mouse pointer.
 * @extends {CcEvent<MapPoint>}
 */
export class CcMapMarkerLeaveEvent extends CcEvent {
  static TYPE = 'cc-map-marker-leave';

  /**
   * @param {MapPoint} detail
   */
  constructor(detail) {
    super(CcMapMarkerLeaveEvent.TYPE, detail);
  }
}
