import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the user requests to unlink a member.
 * The parent component should handle the confirmation dialog.
 * @extends {CcEvent<string>}
 */
export class CcNetworkGroupMemberUnlinkRequestEvent extends CcEvent {
  static TYPE = 'cc-network-group-member-unlink-request';

  /** @param {string} detail - The member ID to unlink */
  constructor(detail) {
    super(CcNetworkGroupMemberUnlinkRequestEvent.TYPE, detail);
  }
}
