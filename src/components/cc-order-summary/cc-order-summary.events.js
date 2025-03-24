import { CcEvent } from '../../lib/events.js';

/**
 * Fires when a product is created.
 * @extends {CcEvent<void>}
 */
export class CcProductCreateEvent extends CcEvent {
  static TYPE = 'cc-product-create';

  constructor() {
    super(CcProductCreateEvent.TYPE);
  }
}
