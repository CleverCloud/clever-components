/*region Member info*/
export type OrgaMemberRole = 'ADMIN' | 'DEVELOPER' | 'ACCOUNTING' | 'MANAGER';

export interface OrgaMember {
  id: string;
  email: string;
  role: OrgaMemberRole; // Sets the role of the member displayed in a badge.
  name?: string; // Sets the name of the user. Since this info is not mandatory in the account creation, some users may not have a name.
  avatar?: string; // Sets the profil picture of the user. If no avatar is provided, a fallback image is displayed.
  jobTitle?: string; // Displays the job title as a tooltip when hovering the name / email of the user.
  isMfaEnabled: boolean; // Sets the two-factor auth badge to enabled or disabled.
  isCurrentUser: boolean; // If true, displays a "Your account" badge on top of the email, next to the name of the user and displays a "Leave" Button.
}
/*endregion*/

/*region Member Card State*/
export type OrgaMemberCardState =
  | OrgaMemberCardStateLoaded
  | OrgaMemberCardStateEditing
  | OrgaMemberCardStateUpdating
  | OrgaMemberCardStateDeleting;

export interface OrgaMemberCardStateLoaded extends OrgaMember {
  type: 'loaded';
  error?: boolean;
}

export interface OrgaMemberCardStateEditing extends OrgaMember {
  type: 'editing';
  error?: boolean;
}

export interface OrgaMemberCardStateUpdating extends OrgaMember {
  type: 'updating';
}

export interface OrgaMemberCardStateDeleting extends OrgaMember {
  type: 'deleting';
}
/*endregion*/

/*region Event payloads*/
interface ToggleEditing {
  memberId: string;
  newState: 'editing' | 'loaded';
}

interface CardAuthorisations {
  edit: boolean;
  delete: boolean;
}

interface UpdateMember extends OrgaMemberCardStateEditing {
  newRole: OrgaMemberRole;
}
/*endregion*/
