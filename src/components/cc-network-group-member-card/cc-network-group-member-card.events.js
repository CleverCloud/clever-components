import { CcEvent } from '../../lib/events.js';

/** @import { NetworkGroupMember } from './cc-network-group-member-card.types.js'; */

/**
 * Dispatched when the user requests to unlink a member.
 * The parent component should handle the confirmation dialog.
 * @extends {CcEvent<{ id: string, kind: NetworkGroupMember['kind'] }>}
 */
export class CcNetworkGroupMemberUnlinkRequestEvent extends CcEvent {
  static TYPE = 'cc-network-group-member-unlink-request';

  /** @param {{ id: string, kind: NetworkGroupMember['kind'] }} detail - The member ID to unlink and its kind */
  constructor(detail) {
    super(CcNetworkGroupMemberUnlinkRequestEvent.TYPE, detail);
  }
}
