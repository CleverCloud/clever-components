import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when an Network Group member unlink is requested.
 * @extends {CcEvent<string>}
 */
export class CcNetworkGroupMemberUnlinkEvent extends CcEvent {
  static TYPE = 'cc-network-group-member-unlink';

  /** @param {string} detail */
  constructor(detail) {
    super(CcNetworkGroupMemberUnlinkEvent.TYPE, detail);
  }
}
