import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-orga-member-list.types.js').InviteMember} InviteMember
 * @typedef {import('../cc-orga-member-card/cc-orga-member-card.types.js').OrgaMember} OrgaMember
 */

/**
 * Dispatched when an organisation member invitation is requested.
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

/**
 * Dispatched when a member has left the organisation.
 * @extends {CcEvent<OrgaMember>}
 */
export class CcOrgaMemberLeftEvent extends CcEvent {
  static TYPE = 'cc-orga-member-left';

  /**
   * @param {OrgaMember} detail
   */
  constructor(detail) {
    super(CcOrgaMemberLeftEvent.TYPE, detail);
  }
}
