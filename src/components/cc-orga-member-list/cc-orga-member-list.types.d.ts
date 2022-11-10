import { OrgaMemberCardState, OrgaMemberRole } from '../cc-orga-member-card/cc-orga-member-card.types';

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
  mfaDisabledOnlyFilter: boolean;
  dangerZoneState: 'idle' | 'leaving' | 'error';
}

interface OrgaMemberListStateError {
  state: 'error';
}

interface InviteMember {
  email: string,
  role: string,
}

interface Authorisations {
  invite: boolean;
  edit: boolean;
  delete: boolean;
}