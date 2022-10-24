import { OrgaMemberCardState, OrgaMemberRole } from '../cc-orga-member-card/cc-orga-member-card.types';

export interface OrgaMemberInviteForm {
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

export interface InviteMember {
  email: string,
  role: string,
}

interface Authorisations {
  invite: boolean;
  edit: boolean;
  delete: boolean;
}