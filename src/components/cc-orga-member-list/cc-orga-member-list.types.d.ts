import {
  OrgaMemberCardState, OrgaMemberCardStateDeleting, OrgaMemberCardStateEditing,
  OrgaMemberCardStateLoaded, OrgaMemberCardStateLoading, OrgaMemberCardStateUpdating,
  OrgaMemberRole
} from '../cc-orga-member-card/cc-orga-member-card.types';


type OrgaMemberManagerState = OrgaMemberManagerStateUser | OrgaMemberManagerStateAdmin;

interface OrgaMemberManagerStateUser {
  context: 'user'; // state or context ?
  members: OrgaMemberListState;
}

interface OrgaMemberManagerStateAdmin {
  context: 'admin'; // state or context ?
  inviteForm: OrgaMemberInviteFormState;
  members: OrgaMemberListState;
}

export interface OrgaMemberInviteFormState {
  state: 'idle' | 'inviting';
  email: EmailFormField;
  role: RoleFormField;
}

interface EmailFormField {
  value: string;
  error?: 'empty' | 'invalid' | 'duplicate' | null;
}

interface RoleFormField {
  value: OrgaMemberRole;
}

export type OrgaMemberListState = OrgaMemberListStateLoading | OrgaMemberListStateLoaded | OrgaMemberListStateError;

interface OrgaMemberListStateLoading {
  state: 'loading';
}

interface OrgaMemberListStateLoaded {
  state: 'loaded';
  value: OrgaMemberCardState[];
  identityFilter: string;
  mfaFilter: string;
}

interface OrgaMemberListStateError {
  state: 'error';
}

export interface InviteMemberPayload {
  email: string,
  role: string,
}
