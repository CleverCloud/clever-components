import { OrgaMemberCardState, OrgaMemberRole } from '../cc-orga-member-card/cc-orga-member-card.types.js';

export type OrgaMemberListState = OrgaMemberListStateLoading | OrgaMemberListStateLoaded | OrgaMemberListStateError;

interface OrgaMemberListStateLoading {
  type: 'loading';
}

interface OrgaMemberListStateLoaded {
  type: 'loaded';
  memberList: OrgaMemberCardState[];
  identityFilter: string;
  mfaDisabledOnlyFilter: boolean;
  dangerZoneState: 'idle' | 'leaving' | 'error';
}

interface OrgaMemberListStateError {
  type: 'error';
}

export interface InviteMember {
  email: string;
  role: OrgaMemberRole;
}

interface ListAuthorisations {
  invite: boolean;
  edit: boolean;
  delete: boolean;
}

export interface InviteMemberFormState {
  type: 'idle' | 'inviting';
}
