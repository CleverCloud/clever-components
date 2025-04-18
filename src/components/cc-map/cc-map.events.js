import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').Point} Point
 */

/**
 * Dispatched when a map marker has been clicked.
 * @extends {CcEvent<Point>}
 */
export class CcMapMarkerClickEvent extends CcEvent {
  static TYPE = 'cc-map-marker-click';

  /**
   * @param {Point} detail
   */
  constructor(detail) {
    super(CcMapMarkerClickEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a map marker has been entered by the mouse pointer.
 * @extends {CcEvent<Point>}
 */
export class CcMapMarkerEnterEvent extends CcEvent {
  static TYPE = 'cc-map-marker-enter';

  /**
   * @param {Point} detail
   */
  constructor(detail) {
    super(CcMapMarkerEnterEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a map marker has been left by the mouse pointer.
 * @extends {CcEvent<Point>}
 */
export class CcMapMarkerLeaveEvent extends CcEvent {
  static TYPE = 'cc-map-marker-leave';

  /**
   * @param {Point} detail
   */
  constructor(detail) {
    super(CcMapMarkerLeaveEvent.TYPE, detail);
  }
}
