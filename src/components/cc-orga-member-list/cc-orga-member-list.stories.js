import './cc-orga-member-list.js';
// TODO check, not necessary to import both, only smart ?!
import './cc-orga-member-list.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const baseMemberList = [{
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
  email: 'very-very-very-long-email-address@very-very-very-very-very-very-very-long-example.com',
  isMfaEnabled: true,
}];

export default {
  title: '🛠 Organisation/<cc-orga-member-list>',
  component: 'cc-orga-member-list',
};

const conf = {
  component: 'cc-orga-member-list',
};

export const defaultStory = makeStory(conf, {
  items: [{
    members: {
      state: 'loaded',
      value: baseMemberList.map((member) => {
        return member.isCurrentUser
          ? { ...member, role: 'DEVELOPER' }
          : member;
      }),
      identityFilter: '',
      mfaFilter: false,
    },
  }],
});

export const formWithInviteLongEmail = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    inviteMemberForm: {
      state: 'idle',
      email: {
        value: 'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long-domain.eu',
      },
      role: {
        value: 'ADMIN',
      },
    },
    members: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

export const errorWithInviteEmptyEmail = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
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
    },
  }],
});

export const errorWithInviteBadEmail = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
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
    },
  }],
});

export const errorWithInviteMemberAlreadyInsideOrganisation = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    inviteMemberForm: {
      state: 'idle',
      email: {
        value: 'john.doe@example.com',
        error: 'duplicate',
      },
      role: {
        value: 'ADMIN',
      },
    },
    members: {
      state: 'loaded',
      value: baseMemberList,
    },
  },
  ],
});

export const waitingWithInviteMember = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
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
    },
  }],
});

export const simulationsWithInviteMember = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
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

export const loadingWithMemberList = makeStory(conf, {
  items: [{
    members: { state: 'loading' },
  }],
});

export const errorWithLoadingMemberList = makeStory(conf, {
  items: [{
    members: { state: 'error' },
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    members: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

export const dataLoadedWithOnlyOneMember = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: { state: 'loaded', value: [baseMemberList[0]] },
  }],
});

export const dataLoadedWithNameFilter = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: {
      state: 'loaded',
      value: baseMemberList,
      identityFilter: 'very',
      mfaFilter: false,
    },
  }],
});

export const dataLoadedWith2faDisabledFilter = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: {
      state: 'loaded',
      value: baseMemberList,
      identityFilter: '',
      mfaFilter: true,
    },
  }],
});

export const dataLoadedWithNoResultFilters = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: {
      state: 'loaded',
      value: baseMemberList,
      identityFilter: 'very-very',
      mfaFilter: true,
    },
  }],
});

export const dataLoadedWithTwoFactorAuthenticationEnabledOnly = makeStory(conf, {
  items: [{
    members: {
      state: 'loaded',
      value: baseMemberList.map((baseMember) => ({
        ...baseMember,
        isMfaEnabled: true,
      })),
    },
  }],
});

export const errorWithDeletingLastAdmin = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: {
      state: 'loaded',
      value: baseMemberList.map((baseMember) => {
        if (baseMember.role === 'ADMIN') {
          return {
            ...baseMember,
            error: 'last-admin',
          };
        }
        return baseMember;
      }),
    },
  }],
});

export const errorWithEditingLastAdmin = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
    members: {
      state: 'loaded',
      value: baseMemberList.map((baseMember) => {
        if (baseMember.role === 'ADMIN') {
          return {
            ...baseMember,
            state: 'editing',
            error: 'last-admin',
          };
        }
        return baseMember;
      }),
    },
  }],
});

export const simulationsWithMemberList = makeStory(conf, {
  items: [{
    authorisations: {
      invite: true,
      edit: true,
      delete: true,
    },
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.members = {
        state: 'loaded',
        value: baseMemberList,
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  formWithInviteLongEmail,
  errorWithInviteEmptyEmail,
  errorWithInviteBadEmail,
  errorWithInviteMemberAlreadyInsideOrganisation,
  waitingWithInviteMember,
  simulationsWithInviteMember,
  loadingWithMemberList,
  errorWithLoadingMemberList,
  dataLoaded,
  dataLoadedWithNameFilter,
  dataLoadedWith2faDisabledFilter,
  dataLoadedWithOnlyOneMember,
  dataLoadedWithTwoFactorAuthenticationEnabledOnly,
  dataLoadedWithNoResultFilters,
  errorWithDeletingLastAdmin,
  errorWithEditingLastAdmin,
  simulationsWithMemberList,
});
