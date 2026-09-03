import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-orga-member-card.js';

/** @type {OrgaMemberCardStateLoaded} */
const baseMember = {
  type: 'loaded',
  id: 'user_c78e5148-a8c2-4c22-b180-2b88ec531f0a',
  email: 'john.doe@example.com',
  role: 'DEVELOPER',
  name: 'John Doe',
  avatar: 'http://placekitten.com/200/200',
  jobTitle: 'Frontend Developer',
  isMfaEnabled: false,
  isCurrentUser: false,
};

const longEmail =
  'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long.example.com';
const longName = 'Veryveryveryveryveryveryveryveryvery long name';

export default {
  tags: ['autodocs'],
  title: '🛠 Organisation/<cc-orga-member-card>',
  component: 'cc-orga-member-card',
};

const conf = {
  component: 'cc-orga-member-card',
};

/**
 * @import { CcOrgaMemberCard } from './cc-orga-member-card.js'
 * @import { OrgaMemberCardStateLoaded } from './cc-orga-member-card.types.js'
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: baseMember,
    },
    {
      state: {
        ...baseMember,
        role: 'ADMIN',
      },
    },
    {
      state: {
        ...baseMember,
        role: 'MANAGER',
      },
    },
    {
      state: {
        ...baseMember,
        role: 'ACCOUNTING',
      },
    },
  ],
});

export const dataLoadedWithEditAndDelete = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: { ...baseMember },
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
});

export const dataLoadedWithIsCurrentUser = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        isCurrentUser: true,
      },
    },
  ],
});

export const dataLoadedWithIsCurrentUserAndLeaveDenied = makeStory(conf, {
  docs: 'On the current user\'s card, the delete button is the "leave the organisation" button. Without the `leave` authorisation, the action buttons are gone even for an admin.',
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        role: 'ADMIN',
        isCurrentUser: true,
      },
      authorisations: {
        edit: true,
        delete: true,
        leave: false,
      },
    },
  ],
});

export const dataLoadedWithNoName = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        name: '',
      },
    },
  ],
});

export const dataLoadedWithNoAvatar = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        avatar: null,
      },
    },
  ],
});

export const dataLoadedWithLongEmail = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        email: longEmail,
        name: longName,
      },
    },
  ],
});

export const dataLoadedWith2faEnabled = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        isMfaEnabled: true,
      },
    },
  ],
});

export const dataLoadedWithNoNameAndIsCurrentUser = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        name: null,
        isCurrentUser: true,
      },
    },
  ],
});

export const editing = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        type: 'editing',
      },
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
});

export const errorWithStateLoaded = makeStory(conf, {
  docs: 'When the user tries to leave while they are the last admin, we display a message.',
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        type: 'loaded',
        role: 'ADMIN',
        error: true,
        isCurrentUser: true,
      },
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
});

export const errorWithStateEditing = makeStory(conf, {
  docs: 'When the user tries to edit themselves while they are the last admin, we display a message.',
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        type: 'editing',
        role: 'ADMIN',
        error: true,
        isCurrentUser: true,
      },
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
});

export const updatingMemberRole = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        type: 'updating',
      },
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
});

export const deletingMember = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: {
        ...baseMember,
        type: 'deleting',
      },
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  /** @type {Partial<CcOrgaMemberCard>[]} */
  items: [
    {
      state: baseMember,
      authorisations: {
        edit: true,
        delete: true,
        leave: true,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcOrgaMemberCard>} components */
      ([component]) => {
        component.state = {
          ...component.state,
          type: 'editing',
        };
      },
    ),
    storyWait(
      1000,
      /** @param {Array<CcOrgaMemberCard>} components */
      ([component]) => {
        component._newRole = 'ACCOUNTING';
      },
    ),
    storyWait(
      1000,
      /** @param {Array<CcOrgaMemberCard>} components */
      ([component]) => {
        component.state = {
          ...component.state,
          type: 'updating',
        };
      },
    ),
    storyWait(
      3000,
      /** @param {Array<CcOrgaMemberCard>} components */
      ([component]) => {
        component.state = {
          ...component.state,
          type: 'loaded',
          role: 'ACCOUNTING',
        };
      },
    ),
  ],
});
