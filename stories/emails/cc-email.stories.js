import '../../src/emails/cc-email.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const SAMPLE_EMAIL_ADDRESS = 'sample.email@clever-cloud.com';
const ANOTHER_SAMPLE_EMAIL_ADDRESS = 'another.sample.email@clever-cloud.com';
const YET_ANOTHER_SAMPLE_EMAIL_ADDRESS = 'yet.another.sample.email@clever-cloud.com';
const HUGE_EMAIL_ADDRESS = `hugeemaila${'d'.repeat(500)}ress@clever-cloud.com`;

const primaryModel = { address: { value: SAMPLE_EMAIL_ADDRESS, verified: true } };
const primaryModelUnverified = { address: { value: SAMPLE_EMAIL_ADDRESS, verified: false } };
const secondaryModel = {
  addresses: [
    {
      address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
    },
    {
      address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
    },
  ],
};
const model = { primaryModel, secondaryModel };

export default {
  title: '🛠 Emails/<cc-email>',
  component: 'cc-email',
};

const conf = {
  component: 'cc-email',
  // language=CSS
  css: `cc-email {
    margin-bottom: 1rem;
  }`,
};
export const defaultStory = makeStory(conf, {
  items: [
    {
      model,
    },
    {
      model: { primaryModel: primaryModelUnverified, secondaryModel: [] },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {},
    { model: {} },
    { model: { primaryModel } },
    { model: { secondaryModel } },
  ],
});

export const errorWithLoadingPrimaryEmail = makeStory(conf, {
  items: [{ model: { primaryModel: 'loadingError', secondaryModel } }],
});

export const errorWithLoadingSecondaryEmail = makeStory(conf, {
  items: [{ model: { primaryModel, secondaryModel: 'loadingError' } }],
});

export const errorWithSendingConfirmationEmail = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel: { ...primaryModelUnverified, error: 'sendingConfirmationEmail' },
        secondaryModel,
      },
    },
  ],
});

export const errorWithAddingSecondaryEmailAddress = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel: { ...secondaryModel, error: 'adding' },
      },
    },
  ],
});

export const errorWithDeletingSecondaryEmailAddress = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              error: 'deleting',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
  ],
});

export const errorWithMarkingAsPrimary = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              error: 'markingAsPrimary',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
  ],
});

export const errorWithEmptyEmail = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel,
      },
      _addAddressInputValue: '',
      _addAddressInputError: 'empty',
    },
  ],
});

export const errorWithInvalidEmail = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel,
      },
      _addAddressInputValue: 'invalid e-mail !!',
      _addAddressInputError: 'invalid',
    },
  ],
});

export const dataLoadedWithHugeEmail = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel: { address: { value: HUGE_EMAIL_ADDRESS, verified: true } },
        secondaryModel: {
          addresses: [
            {
              address: { value: HUGE_EMAIL_ADDRESS, verified: true },
            },
            {
              address: { value: HUGE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
  ],
});

export const dataLoadedWithNoSecondaryEmails = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel: { address: { value: HUGE_EMAIL_ADDRESS, verified: true } },
        secondaryModel: {
          addresses: [],
        },
      },
    },
  ],
});

export const sendingConfirmationEmail = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel: { ...primaryModelUnverified, state: 'sendingConfirmationEmail' },
        secondaryModel,
      },
    },
  ],
});

export const addingSecondary = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel: { ...secondaryModel, state: 'adding' },
      },
    },
  ],
});

export const deletingSecondary = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
    {
      model: {
        primaryModel,
        secondaryModel: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'deleting',
            },
          ],
        },
      },
    },
  ],
});

export const markingSecondaryAsPrimary = makeStory(conf, {
  items: [
    {
      model: {
        primaryModel,
        secondaryModel: {
          addresses: [
            {
              address: { value: ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
              state: 'markingAsPrimary',
            },
            {
              address: { value: YET_ANOTHER_SAMPLE_EMAIL_ADDRESS, verified: true },
            },
          ],
        },
      },
    },
  ],
});

// export const simulations = makeStory(conf, {
//   items: [
//     {}, {},
//   ],
//   simulations: [
//     storyWait(1000, ([primary, secondary]) => {
//       primary.model = {
//
//       };
//       secondary.model = {};
//     }),
//     storyWait(2000, ([componentVerified, componentUnverified]) => {
//       componentUnverified.resendingConfirmationEmail = true;
//     }),
//     storyWait(2000, ([componentVerified, componentUnverified]) => {
//       componentUnverified.resendingConfirmationEmail = false;
//       componentUnverified.error = 'resendingConfirmationEmail';
//     }),
//     storyWait(2000, ([componentVerified, componentUnverified]) => {
//       componentUnverified.resendingConfirmationEmail = true;
//       componentUnverified.error = null;
//     }),
//     storyWait(2000, ([componentVerified, componentUnverified]) => {
//       componentUnverified.address = { value: SAMPLE_EMAIL_ADDRESS, verified: true };
//     }),
//   ],
// });

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorWithLoadingPrimaryEmail,
  errorWithLoadingSecondaryEmail,
  errorWithSendingConfirmationEmail,
  errorWithAddingSecondaryEmailAddress,
  errorWithDeletingSecondaryEmailAddress,
  errorWithMarkingAsPrimary,
  errorWithEmptyEmail,
  errorWithInvalidEmail,
  sendingConfirmationEmail,
  addingSecondary,
  deletingSecondary,
  markingSecondaryAsPrimary,
  dataLoadedWithHugeEmail,
  dataLoadedWithNoSecondaryEmails,
  // simulations,
});
