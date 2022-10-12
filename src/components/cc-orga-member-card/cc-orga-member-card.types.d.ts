type OrgaMemberRole = 'ADMIN' | 'DEVELOPER' | 'ACCOUNTING' | 'MANAGER';

interface OrgaMember {
  id: string;
  email: string;
  role: OrgaMemberRole;
  name?: string;
  avatar?: string;
  jobTitle?: string;
  isMfaEnabled: boolean;
  isCurrentUser: boolean;
}

// TODO: to export or not?
export type OrgaMemberCardState =
  OrgaMemberCardStateLoaded
  | OrgaMemberCardStateLoading
  | OrgaMemberCardStateEditing
  | OrgaMemberCardStateUpdating
  | OrgaMemberCardStateDeleting;

interface OrgaMemberCardStateLoading {
  state: 'loading';
}

interface OrgaMemberCardStateLoaded extends OrgaMember {
  state: 'loaded';
  error?: 'last-admin';
}

interface OrgaMemberCardStateEditing extends OrgaMember {
  state: 'editing',
  error?: 'last-admin',
}

interface OrgaMemberCardStateUpdating extends OrgaMember {
  state: 'updating',
}

interface OrgaMemberCardStateDeleting extends OrgaMember {
  state: 'deleting',
}

// TODO: discuss the Payload suffix
export interface EditMemberPayload {
  id: string,
  role: string,
}
