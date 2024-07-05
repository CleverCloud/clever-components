import longMemberList from '../../stories/fixtures/long-member-list.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-orga-member-list.js';

const baseMemberList = [
  {
    state: 'loaded',
    id: 'member1',
    name: 'John Doe',
    isCurrentUser: true,
    jobTitle: 'Frontend Developer',
    role: 'ADMIN',
    email: 'john.doe@example.com',
    isMfaEnabled: false,
  },
  {
    state: 'loaded',
    id: 'member2',
    avatar: 'http://placekitten.com/202/202',
    name: 'Jane Doe',
    jobTitle: 'Backend Developer',
    role: 'DEVELOPER',
    email: 'jane.doe@example.com',
    isMfaEnabled: true,
  },
  {
    state: 'loaded',
    id: 'member3',
    avatar: 'http://placekitten.com/205/205',
    role: 'ACCOUNTING',
    email: 'june.doe@example.com',
    isMfaEnabled: false,
  },
  {
    state: 'loaded',
    id: 'member4',
    name: 'Veryveryveryveryveryveryveryveryvery long name',
    role: 'MANAGER',
    email: 'very-very-very-long-email-address@very-very-very-very-very-very-very-long.example.com',
    isMfaEnabled: true,
  },
];
const authorisationsAdmin = {
  invite: true,
  edit: true,
  delete: true,
};

export default {
  tags: ['autodocs'],
  title: '🛠 Organisation/<cc-orga-member-list>',
  component: 'cc-orga-member-list',
};

const conf = {
  component: 'cc-orga-member-list',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loaded',
        value: baseMemberList.map((member) => {
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
  items: [
    {
      members: { state: 'loading' },
    },
  ],
});

export const waitingWithLeavingAsSimpleUser = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loaded',
        value: baseMemberList.map((baseMember) => {
          if (baseMember.isCurrentUser) {
            return {
              ...baseMember,
              state: 'deleting',
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
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList.map((baseMember) => {
          if (baseMember.isCurrentUser) {
            return {
              ...baseMember,
              state: 'deleting',
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
  items: [
    {
      authorisations: authorisationsAdmin,
      inviteMemberForm: {
        state: 'inviting',
        email: {
          value: 'jane.doe@example.com',
        },
        role: {
          value: 'ADMIN',
        },
      },
      members: {
        state: 'loaded',
        value: [baseMemberList[0]],
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const errorWithLoadingMemberList = makeStory(conf, {
  items: [
    {
      members: { state: 'error' },
    },
  ],
});

export const errorWithLeavingFromDangerZoneAsLastAdmin = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'error',
      },
    },
  ],
});

export const errorWithLeavingFromCardAsLastAdmin = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList.map((baseMember) => {
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
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList.map((baseMember) => {
          if (baseMember.isCurrentUser) {
            return {
              ...baseMember,
              state: 'editing',
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
  items: [
    {
      authorisations: authorisationsAdmin,
      inviteMemberForm: {
        state: 'idle',
        email: {
          value: '',
          error: 'empty',
        },
        role: {
          value: 'ADMIN',
        },
      },
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const errorWithInviteInvalidEmailFormat = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      inviteMemberForm: {
        state: 'idle',
        email: {
          value: 'jane.doe',
          error: 'invalid',
        },
        role: {
          value: 'ADMIN',
        },
      },
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const errorWithInviteMemberAlreadyInsideOrganisation = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      inviteMemberForm: {
        state: 'idle',
        email: {
          value: 'june.doe@example.com',
          error: 'duplicate',
        },
        role: {
          value: 'ACCOUNTING',
        },
      },
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoaded = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loaded',
        value: baseMemberList.map((member) => {
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
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithInviteFormWithLongEmail = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      inviteMemberForm: {
        state: 'idle',
        email: {
          value:
            'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long.example.com',
        },
        role: {
          value: 'ADMIN',
        },
      },
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithOnlyOneMember = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: [baseMemberList[0]],
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithLongMemberList = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loaded',
        value: longMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithLongMemberListAndCurrentUserAdmin = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: longMemberList.map((member) => {
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
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: 'very',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
});

export const dataLoadedWithTwoFactorAuthDisabledFilter = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: true,
      },
    },
  ],
});

export const dataLoadedWithNoResultFilters = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: 'no results',
        mfaDisabledOnlyFilter: true,
      },
    },
  ],
});

export const simulationWithLoadingAsSimpleUser = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loading',
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.members = {
        ...component.members,
        state: 'loaded',
        value: baseMemberList.map((member) => {
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
    }),
  ],
});

export const simulationWithLoadingAsAdmin = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loading',
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.authorisations = authorisationsAdmin;
      component.members = {
        ...component.members,
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      };
    }),
  ],
});

export const simulationWithInviteMember = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(1000, ([component]) => {
      component.inviteMemberForm = {
        ...component.inviteMemberForm,
        email: {
          ...component.inviteMemberForm.email,
          value: 'john.doe@example.com',
        },
      };
    }),
    storyWait(1000, ([component]) => {
      component.inviteMemberForm = {
        ...component.inviteMemberForm,
        role: {
          ...component.inviteMemberForm.role,
          value: 'ADMIN',
        },
      };
    }),
    storyWait(500, ([component]) => {
      component.inviteMemberForm = {
        ...component.inviteMemberForm,
        state: 'inviting',
      };
    }),
    storyWait(2000, ([component]) => {
      component.inviteMemberForm = {
        ...component.inviteMemberForm,
        state: 'idle',
        email: {
          ...component.inviteMemberForm.email,
          value: '',
        },
        role: {
          ...component.inviteMemberForm.role,
          value: 'DEVELOPER',
        },
      };
    }),
  ],
});

export const simulationWithEditMember = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((member) => {
          if (member.id === 'member2') {
            return {
              ...member,
              state: 'editing',
            };
          }
          return member;
        }),
      };
    }),
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((member) => {
          if (member.id === 'member2') {
            return {
              ...member,
              state: 'editing',
              role: 'ADMIN',
            };
          }
          return member;
        }),
      };
    }),
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((member) => {
          if (member.id === 'member2') {
            return {
              ...member,
              state: 'updating',
              role: 'ADMIN',
            };
          }
          return member;
        }),
      };
    }),
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((member) => {
          if (member.id === 'member2') {
            return {
              ...member,
              state: 'loaded',
              role: 'ADMIN',
            };
          }
          return member;
        }),
      };
    }),
  ],
});

export const simulationWithRemovingMember = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList,
        identityFilter: '',
        mfaDisabledOnlyFilter: false,
        dangerZoneState: 'idle',
      },
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((member) => {
          if (member.id === 'member2') {
            return {
              ...member,
              state: 'deleting',
            };
          }
          return member;
        }),
      };
    }),
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.filter((member) => member.id !== 'member2'),
      };
    }),
  ],
});

export const simulationWithLeavingAsSimpleUser = makeStory(conf, {
  items: [
    {
      members: {
        state: 'loaded',
        value: baseMemberList.map((baseMember) => {
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
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((baseMember) => {
          if (baseMember.id === 'member1') {
            return {
              ...baseMember,
              state: 'deleting',
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
    }),
  ],
});

export const simulationWithLeavingAsAdmin = makeStory(conf, {
  items: [
    {
      authorisations: authorisationsAdmin,
      members: {
        state: 'loaded',
        value: baseMemberList.map((baseMember) => {
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
    storyWait(2000, ([component]) => {
      component.members = {
        ...component.members,
        value: baseMemberList.map((baseMember) => {
          if (baseMember.id === 'member1') {
            return {
              ...baseMember,
              state: 'deleting',
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
    }),
  ],
});
