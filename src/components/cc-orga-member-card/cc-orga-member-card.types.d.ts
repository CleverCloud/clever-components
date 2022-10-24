type OrgaMemberRole = 'ADMIN' | 'DEVELOPER' | 'ACCOUNTING' | 'MANAGER';

interface OrgaMember {
  id: string;
  email: string;
  role: OrgaMemberRole;
  name?: string; // Sets the name of the user. Since this info is not mandatory in the account creation, some users may not have a name.
  avatar?: string; // Sets the profil picture of the user. If no avatar is provided, a fallback image is displayed.
  jobTitle?: string; // Displays the job title as a tooltip when hovering the name / email of the user.
  isMfaEnabled: boolean; // Sets the two-factor auth badge to enabled or disabled.
  isCurrentUser: boolean; // If true, displays a "Your account" badge on top of the email, next to the name of the user and displays a "Leave" Button.
}

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

interface UpdateMember {
  memberId: string,
  role: string,
  memberIdentity: string,
}

interface DeleteMember {
  memberId: string,
  memberIdentity: string,
}

interface Authorisations {
  edit: boolean;
  delete: boolean;
}