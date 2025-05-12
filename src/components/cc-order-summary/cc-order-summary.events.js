import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a product creation has be requested.
 * @extends {CcEvent}
 */
export class CcProductCreateEvent extends CcEvent {
  static TYPE = 'cc-product-create';

  constructor() {
    super(CcProductCreateEvent.TYPE);
  }
}
