import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a network group deletion is requested.
 * @extends {CcEvent<string>}
 */
export class CcNetworkGroupDeleteEvent extends CcEvent {
  static TYPE = 'cc-network-group-delete';

  /** @param {string} detail */
  constructor(detail) {
    super(CcNetworkGroupDeleteEvent.TYPE, detail);
  }
}
