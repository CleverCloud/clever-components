import './cc-email.js';
import './cc-email.smart.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

/**
 * @typedef {import('./cc-email.types.js').EmailsState} EmailsState
 * @typedef {import('./cc-email.types.js').PrimaryEmailAddressState} PrimaryEmailAddressState
 * @typedef {import('./cc-email.types.js').NewEmailFormState} NewEmailFormState
 */

const SAMPLE_EMAIL_ADDRESS = 'sample.email@clever-cloud.com';
const ANOTHER_SAMPLE_EMAIL_ADDRESS = 'another.sample.email@clever-cloud.com';
const YET_ANOTHER_SAMPLE_EMAIL_ADDRESS = 'yet.another.sample.email@clever-cloud.com';
const HUGE_EMAIL_ADDRESS = `hugeemaila${'d'.repeat(500)}ress@clever-cloud.com`;

const primaryEmail = {
  state: 'idle',
  address: 'sample.email@clever-cloud.com',
  verified: true,
};

const secondaryEmails = [
  { state: 'idle', address: 'another.sample.email@clever-cloud.com', verified: true },
  { state: 'idle', address: 'yet.another.sample.email@clever-cloud.com', verified: false },
];

const defaultLoadedEmailsNoSecondary = {
  state: 'loaded',
  primary: primaryEmail,
  secondary: [],
};

const defaultNewEmailForm = {
  state: 'idle',
  address: {
    value: '',
  },
};

export default {
  title: '🛠 Emails/<cc-email>',
  component: 'cc-email',
};

const conf = {
  component: 'cc-email',
};
export const defaultStory = makeStory(conf, {
  items: [{
    emails: defaultLoadedEmailsNoSecondary,
    newEmailForm: defaultNewEmailForm,
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    emails: {
      state: 'loading',
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{
    emails: {
      state: 'error-loading',
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const errorWithEmptyEmail = makeStory(conf, {
  items: [{
    emails: defaultLoadedEmailsNoSecondary,
    newEmailForm: {
      state: 'idle',
      address: {
        value: '',
        error: 'empty',
      },
    },
  }],
});

export const errorWithInvalidEmail = makeStory(conf, {
  items: [{
    emails: defaultLoadedEmailsNoSecondary,
    newEmailForm: {
      state: 'idle',
      address: {
        value: 'this is not an email',
        error: 'invalid',
      },
    },
  }],
});

export const errorWithAlreadyDefinedEmail = makeStory(conf, {
  items: [{
    emails: defaultLoadedEmailsNoSecondary,
    newEmailForm: {
      state: 'idle',
      address: {
        value: 'already@example.com',
        error: 'already-defined',
      },
    },
  }],
});

export const errorWithUsedEmail = makeStory(conf, {
  items: [{
    emails: defaultLoadedEmailsNoSecondary,
    newEmailForm: {
      state: 'idle',
      address: {
        value: 'used@example.com',
        error: 'used',
      },
    },
  }],
});

export const dataLoadedWithUnverifiedPrimaryEmailAddress = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: { ...primaryEmail, verified: false },
      secondary: [],
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const dataLoadedWithSecondaryEmails = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: primaryEmail,
      secondary: secondaryEmails,
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

// Do we have this in the API ?
// export const dataLoadedWithUnverifiedSecondaryEmails = makeStory(conf, {
//   items: [{
//     emails: {
//       state: 'loaded',
//       primary: primaryEmail,
//       secondary: secondaryEmails.map((email) => ({ ...email, verified: false })),
//     },
//     newEmailForm: defaultNewEmailForm,
//   }],
// });

export const dataLoadedWithHugePrimaryEmail = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: { ...primaryEmail, address: HUGE_EMAIL_ADDRESS },
      secondary: [],
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const dataLoadedWithHugeSecondaryEmail = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: primaryEmail,
      secondary: [
        { state: 'idle', address: HUGE_EMAIL_ADDRESS, verified: true },
      ],
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const sendingConfirmation = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: { ...primaryEmail, verified: false, state: 'sending-confirmation' },
      secondary: [],
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const markingSecondaryAsPrimary = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: primaryEmail,
      secondary: [
        { state: 'marking-as-primary', address: 'another.sample.email@clever-cloud.com', verified: true },
        { state: 'idle', address: 'yet.another.sample.email@clever-cloud.com', verified: false },
      ],
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const deletingSecondary = makeStory(conf, {
  items: [{
    emails: {
      state: 'loaded',
      primary: primaryEmail,
      secondary: [
        { state: 'idle', address: 'another.sample.email@clever-cloud.com', verified: true },
        { state: 'deleting', address: 'yet.another.sample.email@clever-cloud.com', verified: false },
      ],
    },
    newEmailForm: defaultNewEmailForm,
  }],
});

export const addingSecondary = makeStory(conf, {
  items: [{
    emails: defaultLoadedEmailsNoSecondary,
    newEmailForm: {
      state: 'adding',
      address: {
        value: 'secondary-email@example.com',
      },
    },
  }],
});

// export const simulationsWithPrimary = makeStory(conf, {
//   items: [
//     {},
//   ],
//   simulations: [
//     storyWait(1000, ([component]) => {
//       createStateMutator(component).data(
//         {
//           primary: primaryUnverified,
//           secondaryAddresses: secondaryEmpty,
//         },
//       );
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data(
//         {
//           ...component.state.data,
//           primary: { ...primaryUnverified, state: 'sending-confirmation-email' },
//         },
//       );
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         ...component.state.data,
//         primary,
//       });
//     }),
//   ],
// });

// export const simulationsWithSecondary = makeStory(conf, {
//   items: [
//     {},
//   ],
//   simulations: [
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         primary: primary,
//         secondaryAddresses: secondaryEmpty,
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       component.formInput('invalid email');
//     }),
//     storyWait(2000, ([component]) => {
//       component.formAdding();
//     }),
//     storyWait(2000, ([component]) => {
//       component.formError('invalid');
//     }),
//     storyWait(2000, ([component]) => {
//       component.formInput(ANOTHER_SAMPLE_EMAIL_ADDRESS);
//     }),
//     storyWait(2000, ([component]) => {
//       component.formAdding();
//     }),
//     storyWait(2000, ([component]) => {
//       component.resetForm();
//       createStateMutator(component).data({
//         ...component.state.data,
//         secondaryAddresses: [
//           {
//             data: { address: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       component.formInput(YET_ANOTHER_SAMPLE_EMAIL_ADDRESS);
//     }),
//     storyWait(2000, ([component]) => {
//       component.formAdding();
//     }),
//     storyWait(2000, ([component]) => {
//       component.resetForm();
//
//       createStateMutator(component).data({
//         ...component.state.data,
//         secondaryAddresses: [
//           {
//             data: { address: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
//             state: 'idle',
//           },
//           {
//             data: { address: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: false },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         ...component.state.data,
//         secondaryAddresses: [
//           {
//             data: { address: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//           {
//             data: { address: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         ...component.state.data,
//         secondaryAddresses: [
//           {
//             data: { address: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'marking-as-primary',
//           },
//           {
//             data: { address: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         primary: { data: { address: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true }, state: 'idle' },
//         secondaryAddresses: [
//           {
//             data: { address: SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//           {
//             data: { address: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         ...component.state.data,
//         secondaryAddresses: [
//           {
//             data: { address: SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'deleting',
//           },
//           {
//             data: { address: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//     storyWait(2000, ([component]) => {
//       createStateMutator(component).data({
//         ...component.state.data,
//         secondaryAddresses: [
//           {
//             data: { address: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
//             state: 'idle',
//           },
//         ],
//       });
//     }),
//   ],
// });

enhanceStoriesNames({});
