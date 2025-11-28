import { CcEvent } from '../../lib/events.js';

/**
 * @import { ToggleEditing, OrgaMember, UpdateMember } from './cc-orga-member-card.types.js'
 */

/**
 * Dispatched when the user toggles the edit mode of a member card.
 *
 * This allows the `cc-orga-member-list` component to close all other cards in edit mode to leave only one in edit mode at once.
 *
 * @extends {CcEvent<ToggleEditing>}
 */
export class CcOrgaMemberEditToggleEvent extends CcEvent {
  static TYPE = 'cc-orga-member-edit-toggle';

  /**
   * @param {ToggleEditing} detail
   */
  constructor(detail) {
    super(CcOrgaMemberEditToggleEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an organisation member deletion is requested.
 * @extends {CcEvent<OrgaMember>}
 */
export class CcOrgaMemberDeleteEvent extends CcEvent {
  static TYPE = 'cc-orga-member-delete';

  /**
   * @param {OrgaMember} detail
   */
  constructor(detail) {
    super(CcOrgaMemberDeleteEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an organisation member request to leave the organisation.
 *
 * This is only possible if `isCurrentUser = true`.
 * We don't fire a `cc-orga-member-delete` event so that it can be processed differently by the smart component
 * (leaving the orga means the user has to be redirected).
 *
 * @extends {CcEvent<OrgaMember>}
 */
export class CcOrgaMemberLeaveEvent extends CcEvent {
  static TYPE = 'cc-orga-member-leave';

  /**
   * @param {OrgaMember} detail
   */
  constructor(detail) {
    super(CcOrgaMemberLeaveEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an organisation member modification is requested.
 * @extends {CcEvent<UpdateMember>}
 */
export class CcOrgaMemberUpdateEvent extends CcEvent {
  static TYPE = 'cc-orga-member-update';

  /**
   * @param {UpdateMember} detail
   */
  constructor(detail) {
    super(CcOrgaMemberUpdateEvent.TYPE, detail);
  }
}
