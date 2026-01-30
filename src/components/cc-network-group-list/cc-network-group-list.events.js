import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a network group is requested to be linked with a resource.
 *
 * @extends CcEvent<string>
 */
export class CcNetworkGroupLinkEvent extends CcEvent {
  static TYPE = 'cc-network-group-link';

  /** @param {string} detail */
  constructor(detail) {
    super(CcNetworkGroupLinkEvent.TYPE, detail);
  }
}
