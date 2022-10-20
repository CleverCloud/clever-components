type OrgaMemberRole = 'ADMIN' | 'DEVELOPER' | 'ACCOUNTING' | 'MANAGER';

interface OrgaMember {
  id: string;
  email: string;
  role: OrgaMemberRole;
  name?: string; // Sets the name of the user. Since this info is not mandatory in the account creation, some users may not have a name.
  avatar?: string; // Sets the profil picture of the user. If no avatar is provided, a fallback image is displayed.
  jobTitle?: string; // Displays the job title as a tooltip when hovering the name / email of the user.
  isMfaEnabled: boolean; // Sets the two-factor auth badge to enabled or disabled.
  isCurrentUser: boolean; // If true, displays a "Your account" badge on top of the email, next to the name of the user.
}

/*
* Admin = edit + remove / leave (if isCurrentUser)
*   - can be loaded
*   - can be editing
*   - can be updating
*   - can be deleting
* isCurrentUser Not Admin = leave
*   - can be loaded
*   - can be "deleting" (or should it "leaving" ?)
* Simple user = no btns
*   - can be loaded
* */

type OrgaMemberCardState = OrgaMemberCardStateLoading
    | OrgaMemberLoaded
    | OrgaMemberCardStateEditing
    | OrgaMemberCardStateUpdating
    | OrgaMemberCardStateDeleting;

interface OrgaMemberCardStateLoadedContextUser extends OrgaMember {
  context: 'user';
}

interface OrgaMemberCardStateLoadedContextAdmin extends OrgaMember {
  context: 'admin';
}

interface OrgaMemberCardStateLoading {
  state: 'loading';
}

interface OrgaMemberCardStateEditing extends OrgaMember {
  context: 'admin';
  state: 'editing';
  error?: 'last-admin';
}

interface OrgaMemberCardStateUpdating extends OrgaMember {
  context: 'admin';
  state: 'updating';
}

interface OrgaMemberCardStateDeleting extends OrgaMember {
  context: 'admin' | 'user'; // not great, should we go for "leaving" with a type that enforces isCurrentUser to be true ?
  state: 'deleting';
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