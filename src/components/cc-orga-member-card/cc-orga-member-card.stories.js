import './cc-orga-member-card.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const baseMember = {
  state: 'loaded',
  id: 'user_c78e5148-a8c2-4c22-b180-2b88ec531f0a',
  email: 'john.doe@domain.com',
  role: 'DEVELOPER',
  name: 'John Doe',
  avatar: 'http://placekitten.com/200/200',
  jobTitle: 'Frontend Developer',
  isMfaEnabled: false,
  isCurrentUser: false,
};

const longEmail = 'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long-domain.eu';
const longName = 'Veryveryveryveryveryveryveryveryvery long name';

export default {
  title: '🛠 Organisation/<cc-orga-member-card>',
  component: 'cc-orga-member-card',
};

const conf = {
  component: 'cc-orga-member-card',
};

export const defaultStory = makeStory(conf, {
  items: [{ member: baseMember }],
});

export const dataLoadedWithAdminRights = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      hasAdminRights: true,
    },
  }],
});

export const dataLoadedWithNoName = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      name: '',
    },
  }],
});

export const dataLoadedWithNoAvatar = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      avatar: null,
    },
  }],
});

export const dataLoadedWithLongEmail = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      email: longEmail,
      name: longName,
    },
  }],
});

export const dataLoadedWith2faEnabled = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      isMfaEnabled: true,
    },
  }],
});

export const dataLoadedWithIsCurrentUser = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      isCurrentUser: true,
    },
  }],
});

export const dataLoadedWithNoNameAndIsCurrentUser = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      name: null,
      isCurrentUser: true,
    },
  }],
});

export const dataLoadedWithRoleAdmin = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      role: 'ADMIN',
    },
  }],
});

export const editing = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      state: 'editing',
      hasAdminRights: true,
    },
  }],
});

// TODO: see if we really need to disable or make sure the smart resets the error
export const errorWithStateLoaded = makeStory(conf, {
  docs: 'When the user tries to delete a member who is the last admin, we display a message.',
  items: [{
    member: {
      ...baseMember,
      state: 'loaded',
      hasAdminRights: true,
      role: 'ADMIN',
      error: 'last-admin',
    },
  }],
});

export const errorWithStateEditing = makeStory(conf, {
  docs: 'When the user tries to edit the last admin to another role, we display a message.',
  items: [{
    member: {
      ...baseMember,
      state: 'editing',
      hasAdminRights: true,
      role: 'ADMIN',
      error: 'last-admin',
    },
  }],
});

export const updatingMemberRole = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      state: 'updating',
      hasAdminRights: true,
    },
  }],
});

export const deletingMember = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      state: 'deleting',
      hasAdminRights: true,
    },
  }, {
    member: {
      ...baseMember,
      state: 'deleting',
      isCurrentUser: true,
    },
  }],
});

/* TODO to test, cannot use html attributes anymore, have to use storybook or js :( */
export const simulations = makeStory(conf, {
  items: [{ member: baseMember }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.member = {
        ...component.member,
        state: 'editing',
      };
    }),
    storyWait(1000, ([component]) => {
      component.member = {
        ...component.member,
        role: 'ACCOUNTING',
      };
    }),
    storyWait(1000, ([component]) => {
      component.member = {
        ...component.member,
        state: 'updating',
      };
    }),
    storyWait(3000, ([component]) => {
      component.member = {
        ...component.member,
        state: 'loaded',
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithAdminRights,
  dataLoadedWithNoName,
  dataLoadedWithNoAvatar,
  dataLoadedWithLongEmail,
  dataLoadedWith2faEnabled,
  dataLoadedWithIsCurrentUser,
  dataLoadedWithNoNameAndIsCurrentUser,
  dataLoadedWithRoleAdmin,
  editing,
  errorWithStateLoaded,
  errorWithStateEditing,
  updatingMemberRole,
  deletingMember,
  simulations,
});
