import './cc-orga-member-card.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

const baseMember = {
  state: 'loaded',
  id: 'user_c78e5148-a8c2-4c22-b180-2b88ec531f0a',
  email: 'john.doe@example.com',
  role: 'DEVELOPER',
  newRole: 'DEVELOPER',
  name: 'John Doe',
  avatar: 'http://placekitten.com/200/200',
  jobTitle: 'Frontend Developer',
  isMfaEnabled: false,
  isCurrentUser: false,
};

const longEmail = 'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long.example.com';
const longName = 'Veryveryveryveryveryveryveryveryvery long name';

export default {
  title: '🛠 Organisation/<cc-orga-member-card>',
  component: 'cc-orga-member-card',
};

const conf = {
  component: 'cc-orga-member-card',
};

export const defaultStory = makeStory(conf, {
  items: [{
    member: baseMember,
  },
  {
    member: {
      ...baseMember,
      role: 'ADMIN',
    },
  },
  {
    member: {
      ...baseMember,
      role: 'MANAGER',
    },
  },
  {
    member: {
      ...baseMember,
      role: 'ACCOUNTING',
    },
  }],
});

export const dataLoadedWithEditAndDelete = makeStory(conf, {
  items: [{
    member: { ...baseMember },
    authorisations: {
      edit: true,
      delete: true,
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

export const dataLoadedWithNoNameAndIsCurrentUser = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      name: null,
      isCurrentUser: true,
    },
  }],
});

export const editing = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      state: 'editing',
    },
    authorisations: {
      edit: true,
      delete: true,
    },
  }],
});

export const errorWithStateLoaded = makeStory(conf, {
  docs: 'When the user tries to leave while they are the last admin, we display a message.',
  items: [{
    member: {
      ...baseMember,
      state: 'loaded',
      role: 'ADMIN',
      error: true,
      isCurrentUser: true,
    },
    authorisations: {
      edit: true,
      delete: true,
    },
  }],
});

export const errorWithStateEditing = makeStory(conf, {
  docs: 'When the user tries to edit themselves while they are the last admin, we display a message.',
  items: [{
    member: {
      ...baseMember,
      state: 'editing',
      role: 'ADMIN',
      error: true,
      isCurrentUser: true,
    },
    authorisations: {
      edit: true,
      delete: true,
    },
  }],
});

export const updatingMemberRole = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      state: 'updating',
    },
    authorisations: {
      edit: true,
      delete: true,
    },
  }],
});

export const deletingMember = makeStory(conf, {
  items: [{
    member: {
      ...baseMember,
      state: 'deleting',
    },
    authorisations: {
      edit: true,
      delete: true,
    },
  }],
});

export const simulations = makeStory(conf, {
  items: [{
    member: baseMember,
    authorisations: {
      edit: true,
      delete: true,
    },
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.member = {
        ...component.member,
        state: 'editing',
      };
    }),
    storyWait(1000, ([component]) => {
      component._newRole = 'ACCOUNTING';
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
        role: 'ACCOUNTING',
      };
    }),
  ],
});
