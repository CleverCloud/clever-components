export type StateMemberCard = MemberCardStateLoading | MemberCardStateLoaded | MemberCardStateEditing | MemberCardStateUpdating | MemberCardStateDeleting;

interface MemberCardStateLoading {
    state: 'loading',
}

interface MemberCardStateLoaded {
    state: 'loaded',
    avatar?: string,
    email: string,
    hasError?: boolean,
    id: string,
    isCurrentUser?: boolean,
    jobTitle?: string,
    mfa: boolean,
    name?: string,
    role: string,
}

interface MemberCardStateEditing {
    state: 'editing',
    avatar?: string,
    email: string,
    hasError?: boolean,
    id: string,
    isCurrentUser?: boolean,
    jobTitle?: string,
    mfa: boolean,
    name?: string,
    role: string,
}

interface MemberCardStateUpdating {
    state: 'updating',
    avatar?: string,
    email: string,
    hasError?: false,
    id: string,
    isCurrentUser?: boolean,
    jobTitle?: string,
    mfa: boolean,
    name?: string,
    role: string,
}

interface MemberCardStateDeleting {
    state: 'deleting',
    avatar?: string,
    email: string,
    hasError?: false,
    id: string,
    isCurrentUser?: boolean,
    jobTitle?: string,
    mfa: boolean,
    name?: string,
    role: string,
}

export interface EditMemberPayload {
    id: string,
    role: string,
}