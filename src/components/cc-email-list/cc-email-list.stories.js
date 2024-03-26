import './cc-email-list.js';
import './cc-email-list.smart.js';
import { makeStory } from '../../stories/lib/make-story.js';

const PRIMARY_ADDRESS = 'john.doe@example.com';
const SECONDARY_ADDRESS_1 = 'john.doe.home@example.com';
const SECONDARY_ADDRESS_2 = 'john.doe.holidays@example.com';
const HUGE_ADDRESS = `john${'.doe'.repeat(30)}@example.com`;

/** @type {PrimaryAddressState} */
const primaryAddress = { state: 'idle', address: PRIMARY_ADDRESS, verified: true };
/** @type {PrimaryAddressState} */
const primaryUnverified = { state: 'idle', address: PRIMARY_ADDRESS, verified: false };
/** @type {Array<SecondaryAddressState>} */
const secondaryAddresses = [
  { state: 'idle', address: SECONDARY_ADDRESS_1, verified: true },
  { state: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
];

const baseItem = {
  emails: {
    state: 'loaded',
    value: {
      primaryAddress,
      secondaryAddresses,
    },
  },
};

/**
 * @typedef {import('./cc-email-list.js').CcEmailList} CcEmailList
 * @typedef {import('./cc-email-list.types.js').PrimaryAddressState} PrimaryAddressState
 * @typedef {import('./cc-email-list.types.js').SecondaryAddressState} SecondaryAddressState
 */

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-email-list>',
  component: 'cc-email-list',
};

const conf = {
  component: 'cc-email-list',
};
export const defaultStory = makeStory(conf, {
  items: [baseItem],
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

export const loadingWithSendingConfirmationEmail = makeStory(conf, {
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

export const loadingWithDeletingSecondary = makeStory(conf, {
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

export const loadingWithMarkingSecondaryAsPrimary = makeStory(conf, {
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

export const loadingWithSecondaryEmailIsBeingAdded = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component.addEmailForm.setState('adding');
  },
});

export const errorWithWhenSecondaryEmailIsEmpty = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._addressInputRef.value.value = '';
    component._addressInputRef.value.validate(true);
  },
});

export const errorWithWhenSecondaryEmailIsInvalid = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._addressInputRef.value.value = 'invalid address email';
    component._addressInputRef.value.validate(true);
  },
});

export const errorWithWhenSecondaryEmailIsAlreadyDefined = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._addressInputRef.value.value = SECONDARY_ADDRESS_1;
    component.addEmailForm.onSubmitFailure('already-defined');
  },
});

export const errorWithWhenSecondaryEmailIsUsed = makeStory(conf, {
  items: [baseItem],
  onUpdateComplete: (component) => {
    component._addressInputRef.value.value = 'used-by-another-user@example.com';
    component.addEmailForm.onSubmitFailure('used');
  },
});
