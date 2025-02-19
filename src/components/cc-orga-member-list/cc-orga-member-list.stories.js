import longMemberList from '../../stories/fixtures/long-member-list.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-orga-member-list.js';

/** @type {OrgaMemberListStateLoaded['memberList']} */
const baseMemberList = [
  {
    type: 'loaded',
    id: 'member1',
    name: 'John Doe',
    isCurrentUser: true,
    jobTitle: 'Frontend Developer',
    role: 'ADMIN',
    email: 'john.doe@example.com',
    isMfaEnabled: false,
  },
  {
    type: 'loaded',
    id: 'member2',
    avatar: 'http://placekitten.com/202/202',
    name: 'Jane Doe',
    jobTitle: 'Backend Developer',
    role: 'DEVELOPER',
    email: 'jane.doe@example.com',
    isMfaEnabled: true,
    isCurrentUser: false,
  },
  {
    type: 'loaded',
    id: 'member3',
    avatar: 'http://placekitten.com/205/205',
    role: 'ACCOUNTING',
    email: 'june.doe@example.com',
    isMfaEnabled: false,
    isCurrentUser: false,
  },
  {
    type: 'loaded',
    id: 'member4',
    name: 'Veryveryveryveryveryveryveryveryvery long name',
    role: 'MANAGER',
    email: 'very-very-very-long-email-address@very-very-very-very-very-very-very-long.example.com',
    isMfaEnabled: true,
    isCurrentUser: false,
  },
];
/** @type {Authorisations} */
const authorisationsAdmin = {
  invite: true,
  edit: true,
  delete: true,
};
/** @type {Partial<CcOrgaMemberList>} */
const baseItem = {
  authorisations: authorisationsAdmin,
  memberListState: {
    type: 'loaded',
    memberList: baseMemberList,
    identityFilter: '',
    mfaDisabledOnlyFilter: false,
    dangerZoneState: 'idle',
  },
};

export default {
  tags: ['autodocs'],
  title: '🛠 Organisation/<cc-orga-member-list>',
  component: 'cc-orga-member-list',
};

/**
 * @typedef {import('./cc-orga-member-list.js').CcOrgaMemberList} CcOrgaMemberList
 * @typedef {import('./cc-orga-member-list.types.js').OrgaMemberListStateLoaded} OrgaMemberListStateLoaded
 * @typedef {import('./cc-orga-member-list.types.js').Authorisations} Authorisations
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 */

const conf = {
  component: 'cc-orga-member-list',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((member) => {
          return member.isCurrentUser ? { ...member, role: 'DEVELOPER' } : member;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: { type: 'loading' },
    },
  ],
});

export const waitingWithLeavingAsSimpleUser = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((baseMember) => {
          if (baseMember.isCurrentUser) {
            return {
              ...baseMember,
              type: 'deleting',
              role: 'ACCOUNTING',
            };
          }

          if (baseMember.id === 'member2') {
            return {
              ...baseMember,
              role: 'ADMIN',
            };
          }
          return baseMember;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'leaving',
      },
    },
  ],
});

export const waitingWithLeavingAsAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((baseMember) => {
          if (baseMember.isCurrentUser) {
            return {
              ...baseMember,
              type: 'deleting',
            };
          }

          if (baseMember.id === 'member2') {
            return {
              ...baseMember,
              role: 'ADMIN',
            };
          }
          return baseMember;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'leaving',
      },
    },
  ],
});

export const waitingWithInvitingMember = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: [baseMemberList[0]],
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
      inviteMemberFormState: { type: 'inviting' },
    },
  ],
  /** @param {CcOrgaMemberList} component */
  onUpdateComplete: (component) => {
    component._inviteMemberFormRef.value.email.value = 'june.doe@example.com';
  },
});

export const errorWithLoadingMemberList = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: { type: 'error' },
    },
  ],
});

export const errorWithLeavingFromDangerZoneAsLastAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'error',
      },
    },
  ],
});

export const errorWithLeavingFromCardAsLastAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((baseMember) => {
          if (baseMember.role === 'ADMIN') {
            return {
              ...baseMember,
              error: true,
            };
          }
          return baseMember;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const errorWithEditingYourselfAsLastAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((baseMember) => {
          if (baseMember.isCurrentUser) {
            return {
              ...baseMember,
              type: 'editing',
              role: 'DEVELOPER',
              error: true,
            };
          }
          return baseMember;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const errorWithInviteEmptyEmail = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [baseItem],
  /** @param {CcOrgaMemberList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const emailInput = component._inviteMemberFormRef.value.email;
    emailInput.value = '';
    emailInput.validate();
    emailInput.reportInlineValidity();
  },
});

export const errorWithInviteInvalidEmailFormat = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [baseItem],
  /** @param {CcOrgaMemberList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const emailInput = component._inviteMemberFormRef.value.email;
    emailInput.value = 'jane.doe';
    emailInput.validate();
    emailInput.reportInlineValidity();
  },
});

export const errorWithInviteMemberAlreadyInsideOrganisation = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [baseItem],
  /** @param {CcOrgaMemberList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const emailInput = component._inviteMemberFormRef.value.email;
    emailInput.value = 'june.doe@example.com';
    emailInput.validate();
    emailInput.reportInlineValidity();
  },
});

export const dataLoaded = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((member) => {
          if (member.isCurrentUser) {
            return {
              ...member,
              role: 'ACCOUNTING',
            };
          }

          if (member.id === 'member2') {
            return {
              ...member,
              role: 'ADMIN',
            };
          }

          return member;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithCurrentUserAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithInviteFormWithLongEmail = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [baseItem],
  /** @param {CcOrgaMemberList} component */
  onUpdateComplete: (component) => {
    /** @type {CcInputText} */
    const emailInput = component._inviteMemberFormRef.value.email;
    emailInput.value =
      'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long.example.com';
  },
});

export const dataLoadedWithOnlyOneMember = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: [baseMemberList[0]],
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithLongMemberList = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: longMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithLongMemberListAndCurrentUserAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: longMemberList.map((member) => {
          if (member.id === 'member1') {
            return {
              ...member,
              role: 'ADMIN',
            };
          }
          return member;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithNameFilter = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: 'very',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithTwoFactorAuthDisabledFilter = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: true,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithNoResultFilters = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: 'no results',
        mfaDisabledOnlyFilter: true,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const simulationWithLoadingAsSimpleUser = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loading',
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {Array<CcOrgaMemberList>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          type: 'loaded',
          memberList: baseMemberList.map((member) => {
            if (member.isCurrentUser) {
              return {
                ...member,
                role: 'ACCOUNTING',
              };
            }
            return member;
          }),
          identityFilter: '',
          mfaDisabledOnlyFilter: false,
          dangerZoneState: 'idle',
        };
      },
    ),
  ],
});

export const simulationWithLoadingAsAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loading',
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {Array<CcOrgaMemberList>} components */
      ([component]) => {
        component.authorisations = authorisationsAdmin;
        component.memberListState = {
          ...component.memberListState,
          type: 'loaded',
          memberList: baseMemberList,
          identityFilter: '',
          mfaDisabledOnlyFilter: false,
          dangerZoneState: 'idle',
        };
      },
    ),
  ],
});

export const simulationWithInviteMember = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {Array<CcOrgaMemberList>} components */
      ([component]) => {
        /** @type {CcInputText} */
        const emailInput = component._inviteMemberFormRef.value.querySelector('[name="email"]');
        emailInput.value = 'john.doe@example.com';
      },
    ),
    storyWait(
      1000,
      /** @param {Array<CcOrgaMemberList>} components */
      ([component]) => {
        /** @type {CcInputText} */
        const roleInput = component._inviteMemberFormRef.value.querySelector('[name="role"]');
        roleInput.value = 'ADMIN';
      },
    ),
    storyWait(
      500,
      /** @param {Array<CcOrgaMemberList>} components */
      ([component]) => {
        component.inviteMemberFormState = { type: 'inviting' };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList>} components */
      ([component]) => {
        component.resetInviteMemberForm();
        component.inviteMemberFormState = { type: 'idle' };
      },
    ),
  ],
});

export const simulationWithEditMember = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((member) => {
            if (member.id === 'member2') {
              return {
                ...member,
                type: 'editing',
              };
            }
            return member;
          }),
        };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((member) => {
            if (member.id === 'member2') {
              return {
                ...member,
                type: 'editing',
                role: 'ADMIN',
              };
            }
            return member;
          }),
        };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((member) => {
            if (member.id === 'member2') {
              return {
                ...member,
                type: 'updating',
                role: 'ADMIN',
              };
            }
            return member;
          }),
        };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((member) => {
            if (member.id === 'member2') {
              return {
                ...member,
                type: 'loaded',
                role: 'ADMIN',
              };
            }
            return member;
          }),
        };
      },
    ),
  ],
});

export const simulationWithRemovingMember = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((member) => {
            if (member.id === 'member2') {
              return {
                ...member,
                type: 'deleting',
              };
            }
            return member;
          }),
        };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.filter((member) => member.id !== 'member2'),
        };
      },
    ),
  ],
});

export const simulationWithLeavingAsSimpleUser = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((baseMember) => {
          if (baseMember.id === 'member1') {
            return {
              ...baseMember,
              role: 'ACCOUNTING',
            };
          }

          if (baseMember.id === 'member2') {
            return {
              ...baseMember,
              role: 'ADMIN',
            };
          }
          return baseMember;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((baseMember) => {
            if (baseMember.id === 'member1') {
              return {
                ...baseMember,
                type: 'deleting',
                role: 'ACCOUNTING',
              };
            }

            if (baseMember.id === 'member2') {
              return {
                ...baseMember,
                role: 'ADMIN',
              };
            }
            return baseMember;
          }),
          dangerZoneState: 'leaving',
        };
      },
    ),
  ],
});

export const simulationWithLeavingAsAdmin = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberList>[]} */
  items: [
    {
      authorisations: authorisationsAdmin,
      memberListState: {
        type: 'loaded',
        memberList: baseMemberList.map((baseMember) => {
          if (baseMember.id === 'member2') {
            return {
              ...baseMember,
              role: 'ADMIN',
            };
          }
          return baseMember;
        }),
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberList & { members: { state: OrgaMemberListStateLoaded }}>} components */
      ([component]) => {
        component.memberListState = {
          ...component.memberListState,
          memberList: baseMemberList.map((baseMember) => {
            if (baseMember.id === 'member1') {
              return {
                ...baseMember,
                type: 'deleting',
              };
            }

            if (baseMember.id === 'member2') {
              return {
                ...baseMember,
                role: 'ADMIN',
              };
            }
            return baseMember;
          }),
          dangerZoneState: 'leaving',
        };
      },
    ),
  ],
});
