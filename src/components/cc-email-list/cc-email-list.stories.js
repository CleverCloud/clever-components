import './cc-email-list.js';
import './cc-email-list.smart.js';
import { makeStory } from '../../stories/lib/make-story.js';

const PRIMARY_ADDRESS = 'john.doe@example.com';
const SECONDARY_ADDRESS_1 = 'john.doe.home@example.com';
const SECONDARY_ADDRESS_2 = 'john.doe.holidays@example.com';
const HUGE_ADDRESS = `john${'.doe'.repeat(30)}@example.com`;

const primaryAddress = { state: 'idle', address: PRIMARY_ADDRESS, verified: true };
const primaryUnverified = { state: 'idle', address: PRIMARY_ADDRESS, verified: false };
const secondaryAddresses = [
  { state: 'idle', address: SECONDARY_ADDRESS_1, verified: true },
  { state: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
];

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-email-list>',
  component: 'cc-email-list',
};

const conf = {
  component: 'cc-email-list',
};
export const defaultStory = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses,
        },
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loading',
      },
    },
  ],
});

export const errorWithLoading = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'error',
      },
    },
  ],
});

export const errorWithEmptyEmail = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses,
        },
      },
      addEmailForm: {
        state: 'idle',
        address: {
          value: '',
          error: 'empty',
        },
      },
    },
  ],
});

export const errorWithInvalidEmail = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses,
        },
      },
      addEmailForm: {
        state: 'idle',
        address: {
          value: 'this is an invalid email address!',
          error: 'invalid',
        },
      },
    },
  ],
});

export const errorWithAlreadyDefinedEmail = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses,
        },
      },
      addEmailForm: {
        state: 'idle',
        address: {
          value: SECONDARY_ADDRESS_1,
          error: 'already-defined',
        },
      },
    },
  ],
});

export const errorWithUsedEmail = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses,
        },
      },
      addEmailForm: {
        state: 'idle',
        address: {
          value: 'already.used.email.address@example.com',
          error: 'used',
        },
      },
    },
  ],
});

export const dataLoadedWithUnverifiedPrimaryEmailAddress = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress: primaryUnverified,
          secondaryAddresses: [],
        },
      },
    },
  ],
});

export const dataLoadedWithHugeEmail = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress: { state: 'idle', address: HUGE_ADDRESS, verified: true },
          secondaryAddresses: [
            { state: 'idle', address: HUGE_ADDRESS, verified: true },
            { state: 'idle', address: HUGE_ADDRESS, verified: true },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithNoSecondaryEmails = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses: [],
        },
      },
    },
  ],
});

export const sendingConfirmationEmail = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress: { ...primaryUnverified, state: 'sending-confirmation-email' },
          secondaryAddresses,
        },
      },
    },
  ],
});

export const addingSecondary = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses,
        },
      },
      addEmailForm: {
        state: 'adding',
        address: {
          value: 'secondary@domain.com',
        },
      },
    },
  ],
});

export const deletingSecondary = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses: [
            { state: 'deleting', address: SECONDARY_ADDRESS_1, verified: true },
            { state: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
          ],
        },
      },
    },
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses: [
            { state: 'deleting', address: SECONDARY_ADDRESS_1, verified: true },
            { state: 'deleting', address: SECONDARY_ADDRESS_2, verified: true },
          ],
        },
      },
    },
  ],
});

export const markingSecondaryAsPrimary = makeStory(conf, {
  items: [
    {
      emails: {
        state: 'loaded',
        value: {
          primaryAddress,
          secondaryAddresses: [
            { state: 'marking-as-primary', address: SECONDARY_ADDRESS_1, verified: true },
            { state: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
          ],
        },
      },
    },
  ],
});
