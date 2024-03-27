import { OrgaMemberCardState } from '../cc-orga-member-card/cc-orga-member-card.types';

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

export interface InviteMember {
  email: string,
  role: string,
}

interface Authorisations {
  invite: boolean;
  edit: boolean;
  delete: boolean;
}

export interface InviteMemberFormState {
  type: "idle" | "inviting";
}
