import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-orga-member-card.types.d.ts').ToggleEditing} ToggleEditing
 * @typedef {import('./cc-orga-member-card.types.d.ts').OrgaMemberCardState} OrgaMemberCardState
 * @typedef {import('./cc-orga-member-card.types.d.ts').UpdateMember} UpdateMember
 */

/**
 * Fired when the user toggles the edit mode of a member card.
 * This allows the list component to close all other cards in edit mode to leave only one in edit mode at once.
 *
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
 * Fired when the user clicks on a remove member button.
 *
 * @extends {CcEvent<OrgaMemberCardState>}
 */
export class CcOrgaMemberDeleteEvent extends CcEvent {
  static TYPE = 'cc-orga-member-delete';

  /**
   * @param {OrgaMemberCardState} detail
   */
  constructor(detail) {
    super(CcOrgaMemberDeleteEvent.TYPE, detail);
  }
}

/**
 * Fired when the user clicks on a leave button (only possible if `isCurrentUser = true`).
 * We don't fire a delete event so that it can be processed differently by the smart component
 * (leaving the org means the user has to be redirected).
 *
 * @extends {CcEvent<OrgaMemberCardState>}
 */
export class CcOrgaMemberLeaveEvent extends CcEvent {
  static TYPE = 'cc-orga-member-leave';

  /**
   * @param {OrgaMemberCardState} detail
   */
  constructor(detail) {
    super(CcOrgaMemberLeaveEvent.TYPE, detail);
  }
}

/**
 * Fired when the user clicks on a validate button after editing member role.
 *
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
