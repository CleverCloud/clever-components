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

/**
 * Dispatched when an Network Group member link is requested.
 * @extends {CcEvent<string>}
 */
export class CcNetworkGroupMemberLinkEvent extends CcEvent {
  static TYPE = 'cc-network-group-member-link';

  /** @param {string} detail */
  constructor(detail) {
    super(CcNetworkGroupMemberLinkEvent.TYPE, detail);
  }
}
