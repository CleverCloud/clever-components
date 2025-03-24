import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../common.types.js').Point} Point
 */

/**
 * Fires when a marker is clicked.
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
 * Fires when a marker is entered by the mouse.
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
 * Fires when a marker is left by the mouse.
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
