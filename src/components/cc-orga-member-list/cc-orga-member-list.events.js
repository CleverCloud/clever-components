import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-orga-member-list.types.d.ts').InviteMember} InviteMember
 */

/**
 * Fired when the user invites a new member to the organization.
 *
 * @extends {CcEvent<InviteMember>}
 */
export class CcOrgaMemberInviteEvent extends CcEvent {
  static TYPE = 'cc-orga-member-invite';

  /**
   * @param {InviteMember} detail
   */
  constructor(detail) {
    super(CcOrgaMemberInviteEvent.TYPE, detail);
  }
}
