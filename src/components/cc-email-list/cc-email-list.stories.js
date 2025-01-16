import { makeStory } from '../../stories/lib/make-story.js';
import './cc-email-list.js';
import './cc-email-list.smart.js';

const PRIMARY_ADDRESS = 'john.doe@example.com';
const SECONDARY_ADDRESS_1 = 'john.doe.home@example.com';
const SECONDARY_ADDRESS_2 = 'john.doe.holidays@example.com';
const HUGE_ADDRESS = `john${'.doe'.repeat(30)}@example.com`;

/** @type {PrimaryAddressState} */
const primaryAddress = { type: 'idle', address: PRIMARY_ADDRESS, verified: true };
/** @type {PrimaryAddressState} */
const primaryUnverified = { type: 'idle', address: PRIMARY_ADDRESS, verified: false };
/** @type {Array<SecondaryAddressState>} */
const secondaryAddresses = [
  { type: 'idle', address: SECONDARY_ADDRESS_1, verified: true },
  { type: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
];

/** @type {Partial<CcEmailList>} */
const baseItem = {
  emailListState: {
    type: 'loaded',
    emailList: {
      primaryAddress,
      secondaryAddresses,
    },
  },
};

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-email-list>',
  component: 'cc-email-list',
};

/**
 * @typedef {import('./cc-email-list.js').CcEmailList} CcEmailList
 * @typedef {import('./cc-email-list.types.js').EmailListStateLoaded} EmailsListStateLoaded
 * @typedef {import('./cc-email-list.types.js').PrimaryAddressState} PrimaryAddressState
 * @typedef {import('./cc-email-list.types.js').SecondaryAddressState} SecondaryAddressState
 */

const conf = {
  component: 'cc-email-list',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [baseItem],
});

export const skeleton = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loading',
      },
    },
  ],
});

export const errorWithLoading = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'error',
      },
    },
  ],
});

export const dataLoadedWithUnverifiedPrimaryEmailAddress = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress: primaryUnverified,
          secondaryAddresses: [],
        },
      },
    },
  ],
});

export const dataLoadedWithHugeEmail = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress: { type: 'idle', address: HUGE_ADDRESS, verified: true },
          secondaryAddresses: [
            { type: 'idle', address: HUGE_ADDRESS, verified: true },
            { type: 'idle', address: HUGE_ADDRESS, verified: true },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithNoSecondaryEmails = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress,
          secondaryAddresses: [],
        },
      },
    },
  ],
});

export const loadingWithSendingConfirmationEmail = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress: { ...primaryUnverified, type: 'sending-confirmation-email' },
          secondaryAddresses,
        },
      },
    },
  ],
});

export const loadingWithDeletingSecondary = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress,
          secondaryAddresses: [
            { type: 'deleting', address: SECONDARY_ADDRESS_1, verified: true },
            { type: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
          ],
        },
      },
    },
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress,
          secondaryAddresses: [
            { type: 'deleting', address: SECONDARY_ADDRESS_1, verified: true },
            { type: 'deleting', address: SECONDARY_ADDRESS_2, verified: true },
          ],
        },
      },
    },
  ],
});

export const loadingWithMarkingSecondaryAsPrimary = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      emailListState: {
        type: 'loaded',
        emailList: {
          primaryAddress,
          secondaryAddresses: [
            { type: 'marking-as-primary', address: SECONDARY_ADDRESS_1, verified: true },
            { type: 'idle', address: SECONDARY_ADDRESS_2, verified: true },
          ],
        },
      },
    },
  ],
});

export const loadingWithSecondaryEmailIsBeingAdded = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      ...baseItem,
      addEmailFormState: { type: 'adding' },
    },
  ],
  /** @param {CcEmailList} component */
  onUpdateComplete: (component) => {
    component._formRef.value.address.value = 'john.doe.extra@example.com';
  },
});

export const errorWithWhenSecondaryEmailIsEmpty = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [baseItem],
  /** @param {CcEmailList} component */
  onUpdateComplete: (component) => {
    component._formRef.value.address.value = '';
    component._formRef.value.address.validate();
    component._formRef.value.address.reportInlineValidity();
  },
});

export const errorWithWhenSecondaryEmailIsInvalid = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [baseItem],
  /** @param {CcEmailList} component */
  onUpdateComplete: (component) => {
    component._formRef.value.address.value = 'invalid address email';
    component._formRef.value.address.validate();
    component._formRef.value.address.reportInlineValidity();
  },
});

export const errorWithWhenSecondaryEmailIsAlreadyDefined = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      ...baseItem,
      addEmailFormState: {
        type: 'idle',
        errors: {
          email: 'already-defined',
        },
      },
    },
  ],
  /** @param {CcEmailList} component */
  onUpdateComplete: (component) => {
    component._formRef.value.address.value = SECONDARY_ADDRESS_1;
  },
});

export const errorWithWhenSecondaryEmailIsUsed = makeStory(conf, {
  /** @type {Partial<CcEmailList>[]} */
  items: [
    {
      ...baseItem,
      addEmailFormState: {
        type: 'idle',
        errors: {
          email: 'used',
        },
      },
    },
  ],
  /** @param {CcEmailList} component */
  onUpdateComplete: (component) => {
    component._formRef.value.address.value = 'used-by-another-user@example.com';
  },
});
